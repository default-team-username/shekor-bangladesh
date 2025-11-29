import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Sparkles, Smartphone, Volume2, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useBatch } from '@/contexts/BatchContext';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { toast } from 'sonner';
import { elevenLabsStt, geminiAsk, elevenLabsTts } from '@/utils/voiceApi';
import { cn } from '@/lib/utils';

interface ConversationItem {
  id: number;
  question: string;
  answer: string;
  audioUrl?: string;
}

const VoicePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useSession();
  const { batches } = useBatch();
  const { forecast: weatherForecast } = useWeather();
  
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const userDistrict = user?.user_metadata?.district || 'Dhaka';

  // Mock common questions data (used for UI only)
  const commonQuestions = [
    { bn: 'আজকের আবহাওয়া কেমন?', en: 'How is today\'s weather?' },
    { bn: 'আমার ধানের অবস্থা কী?', en: 'What is my crop status?' },
    { bn: 'গুদামে কী করব?', en: 'What to do in storage?' },
    { bn: 'কবে ধান কাটব?', en: 'When to harvest?' },
    { bn: 'কবে বিক্রি করব?', en: 'When to sell?' },
  ];

  // --- 1. Auto Microphone Permission on Load ---
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Microphone permission denied:", error);
        toast.error(getTranslation(
          "Please allow microphone access to use the voice assistant.", 
          "শেকড়ে আপনার কথা শোনার জন্য মাইক্রোফোন ব্যবহারের অনুমতি দিন।"
        ), { duration: 5000 });
      }
    };

    // Request permission on component mount
    requestMicrophonePermission();
  }, [getTranslation]);

  // --- 3. & 7. Handle Voice Question Workflow ---
  const handleVoiceQuestion = async (audioBlob: Blob, questionText: string) => {
    setIsProcessing(true);
    const loadingToastId = toast.loading(getTranslation('Analyzing question...', 'প্রশ্ন বিশ্লেষণ করা হচ্ছে...'));
    
    let transcribedText = questionText;
    let aiAnswer = '';
    let audioUrl: string | undefined = undefined;

    try {
      // 4. ElevenLabs STT (if not using a pre-selected question)
      if (!questionText) {
        transcribedText = await elevenLabsStt(audioBlob);
      }

      // 5. Gemini AI
      aiAnswer = await geminiAsk(transcribedText, userDistrict, batches, weatherForecast);

      // 6. ElevenLabs TTS
      try {
        // elevenLabsTts now returns a Blob
        const audioDataBlob = await elevenLabsTts(aiAnswer);
        
        // Create URL from Blob
        audioUrl = URL.createObjectURL(audioDataBlob);
        
        if (audioRef.current) {
          // Revoke previous URL if it exists to prevent memory leaks
          if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioRef.current.src);
          }
          
          audioRef.current.src = audioUrl;
          
          // Attempt to play audio (requires user gesture, which is satisfied by the button click initiating this flow)
          await audioRef.current.play(); 
        }
        toast.success(getTranslation('Answer spoken!', 'উত্তর বলা হয়েছে!'), { id: loadingToastId });
      } catch (ttsError) {
        console.error("TTS playback failed:", ttsError);
        // 3. Error Handling: TTS failure
        toast.warning(getTranslation(
          'TTS failed, showing text only.', 
          'দুঃখিত, এখন আমি আপনার জন্য কথা বলতে পারছি না। আবার চেষ্টা করুন।'
        ), { id: loadingToastId });
        // Ensure audioUrl is undefined if playback failed, so we don't try to replay a broken source
        audioUrl = undefined; 
      }

      // Update conversation history
      setConversation(prev => [{ 
        id: Date.now(), 
        question: transcribedText, 
        answer: aiAnswer, 
        audioUrl 
      }, ...prev]);

    } catch (error) {
      console.error("Voice workflow failed:", error);
      
      let errorMessage = getTranslation("An unknown error occurred.", "একটি অজানা ত্রুটি ঘটেছে।");
      if (error instanceof Error) {
        if (error.message.includes("ElevenLabs")) {
          errorMessage = getTranslation("STT failure: Could not hear you. Try again.", "দুঃখিত, আপনার কথা শোনা যায়নি। আবার চেষ্টা করুন।");
        } else if (error.message.includes("Gemini")) {
          errorMessage = getTranslation("Gemini failure: Cannot answer right now.", "দুঃখিত, আমি এখন উত্তর দিতে পারছি না।");
        }
      }

      toast.error(errorMessage, { id: loadingToastId });
      
      // Add failed attempt to conversation history
      setConversation(prev => [{ 
        id: Date.now(), 
        question: transcribedText || getTranslation("Recording failed.", "রেকর্ডিং ব্যর্থ।"), 
        answer: errorMessage, 
      }, ...prev]);

    } finally {
      setIsProcessing(false);
    }
  };

  // --- Recording Handlers ---
  const startRecording = async () => {
    if (isProcessing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Proceed with the AI workflow
        handleVoiceQuestion(audioBlob, '');
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      toast.info(getTranslation('Listening... Speak now', 'শোনা হচ্ছে... এখন কথা বলুন'));

    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error(getTranslation(
        "Microphone access denied or failed to start recording.", 
        "মাইক্রোফোন অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে বা রেকর্ডিং শুরু করতে ব্যর্থ হয়েছে।"
      ));
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle common question selection
  const handleQuestionSelect = (question: string) => {
    // Mock audio blob for the API call, as we skip STT
    const mockBlob = new Blob(['mock'], { type: 'audio/webm' });
    handleVoiceQuestion(mockBlob, question);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      // Revoke the last created Blob URL on unmount
      if (audioRef.current && audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const handleMicButtonClick = () => {
    if (isProcessing) return;
    
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center pb-20 md:pb-0"
      style={{ 
        background: 'linear-gradient(180deg, #FAF5FF 0%, #FDF2F8 50%, #FFFFFF 100%)',
      }}
    >
      {/* Hidden Audio Player for TTS playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Header Section (Purple Gradient Background) */}
      <header className="sticky top-0 z-10 w-full shadow-md rounded-b-3xl p-4 pb-6"
        style={{
          background: 'linear-gradient(90deg, #9810FA 0%, #E60076 100%)',
        }}
      >
        <div className="container mx-auto flex flex-col gap-2 px-0 max-w-md">
          {/* Top Bar */}
          <div className="flex items-center gap-3 h-10">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Title Container */}
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-white">
                {getTranslation("Voice Assistant", "ভয়েস সহায়ক")}
              </h1>
              <p className="text-sm font-normal text-purple-100">
                {getTranslation("Ask in Bangla", "বাংলায় প্রশ্ন করুন")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 w-full max-w-md space-y-6 py-6">
        
        {/* Instructions Card */}
        <Card className="w-full bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-blue-800">
                {getTranslation("How to use", "কীভাবে ব্যবহার করবেন")}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {getTranslation(
                  "• Press the mic button and ask questions in Bangla.",
                  "• মাইক বাটনে চাপ দিন এবং বাংলায় প্রশ্ন করুন।"
                )}
              </p>
              <p className="text-xs text-blue-500 mt-1 font-medium">
                {getTranslation(
                  "Instantly identify the threat, assess the risk, and generate a hyper-local, grounded, and specific treatment plan entirely in Bangla.",
                  "তাৎক্ষণিকভাবে হুমকি শনাক্ত করুন, ঝুঁকি মূল্যায়ন করুন এবং সম্পূর্ণ বাংলায় একটি হাইপার-লোকাল, বাস্তবসম্মত ও নির্দিষ্ট প্রতিকার পরিকল্পনা তৈরি করুন।"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Voice Input Button */}
        <div className="flex justify-center py-8">
          <Button
            onClick={handleMicButtonClick}
            className={cn(
              "w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 shadow-lg transform transition-all duration-200",
              isListening || isProcessing
                ? 'scale-110 bg-gradient-to-br from-purple-600 to-pink-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            )}
            disabled={isProcessing}
          >
            <Mic className={cn("h-12 w-12", isListening && 'animate-pulse')} color="white" />
            <span className="text-white font-bold text-sm">
              {isProcessing
                ? getTranslation("Processing...", "প্রক্রিয়াকরণ হচ্ছে...")
                : isListening 
                ? getTranslation("Listening...", "শোনা হচ্ছে...") 
                : getTranslation("Ask Question", "প্রশ্ন করুন")}
            </span>
            <span className="text-white text-xs opacity-80">
              {isProcessing
                ? getTranslation("Please wait", "দয়া করে অপেক্ষা করুন")
                : isListening 
                ? getTranslation("Release to stop", "থামাতে ছাড়ুন") 
                : getTranslation("Tap & Speak", "চাপ দিন ও কথা বলুন")}
            </span>
          </Button>
        </div>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">
              {getTranslation("Conversation History", "কথোপকথনের ইতিহাস")}
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {conversation.map((item) => (
                <Card key={item.id} className="w-full shadow-md border-border/50 rounded-xl">
                  <CardContent className="p-4 space-y-3">
                    {/* Question */}
                    <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-primary">
                          {getTranslation("You asked:", "আপনি জিজ্ঞাসা করেছেন:")}
                        </p>
                        <p className="text-sm text-foreground mt-1">
                          {item.question}
                        </p>
                      </div>
                    </div>
                    
                    {/* Answer */}
                    <div className="flex items-start gap-3 p-3 bg-white border border-border/50 rounded-lg">
                      <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-purple-800">
                          {getTranslation("Shekor AI Answer:", "শেকড় এআই উত্তর:")}
                        </p>
                        <p className="text-sm text-foreground mt-1">
                          {item.answer}
                        </p>
                        {item.audioUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 w-fit text-purple-600 hover:bg-purple-50/50"
                            onClick={() => audioRef.current?.play()}
                          >
                            <Volume2 className="h-4 w-4 mr-1" />
                            {getTranslation("Replay Audio", "অডিও আবার চালান")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Common Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-foreground">
              {getTranslation("Common Questions", "সাধারণ প্রশ্ন")}
            </h2>
          </div>
          
          <div className="space-y-3">
            {commonQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 text-left border-purple-200 hover:bg-purple-50/50 justify-start"
                onClick={() => handleQuestionSelect(language === 'en' ? question.en : question.bn)}
                disabled={isProcessing || isListening}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-purple-800">
                    {language === 'en' ? question.en : question.bn}
                  </span>
                  <span className="text-xs text-purple-500 mt-1">
                    {language === 'en' ? question.bn : question.en}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Compatibility Notice Card */}
        <Card className="w-full bg-gray-50 border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">
                {getTranslation("📱 Compatibility:", "📱 সামঞ্জস্যতা:")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {getTranslation(
                  "This feature works best on Chrome, Edge, and Safari browsers. For best results, use in a quiet environment.",
                  "এই ফিচারটি Chrome, Edge, এবং Safari ব্রাউজারে ভালো কাজ করে। ভালো ফলের জন্য নীরব পরিবেশে ব্যবহার করুন।"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default VoicePage;