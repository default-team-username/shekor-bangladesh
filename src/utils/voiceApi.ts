import { mockDb } from '@/lib/mockDb';
import { StoredBatch } from '@/contexts/BatchContext';
import { DailyForecast } from '@/data/weatherData';

// --- Mock Data & Context Helpers ---

// Mock function to get relevant context for the AI
const getAiContext = (userDistrict: string, batches: StoredBatch[], weather: DailyForecast[]): string => {
    let context = `User is a farmer in ${userDistrict}. `;
    
    if (batches.length > 0) {
        context += `They have ${batches.length} active crop batches. `;
        batches.forEach((batch, index) => {
            const risk = batch.prediction.riskLevel;
            const crop = batch.data.cropType;
            const daysLeft = batch.prediction.etclDays;
            context += `Batch ${index + 1}: ${crop} is at ${risk} risk, with ${daysLeft} days to critical loss. `;
        });
    } else {
        context += "They have no active crop batches registered. ";
    }

    if (weather.length > 0) {
        const today = weather[0];
        context += `Today's weather in ${userDistrict}: Max Temp ${today.tempMax}°C, Humidity ${today.humidity}%, Rain Chance ${today.rainChance}%. Condition: ${today.conditionEn}. `;
    }
    
    context += "Respond concisely and helpfully, entirely in Bengali (Bangla).";
    return context;
};

// --- Mock API Functions ---

/**
 * Mocks the ElevenLabs Speech-to-Text API call.
 * @param audioBlob The audio data to transcribe.
 * @returns The transcribed text in Bangla.
 */
export const elevenLabsStt = async (audioBlob: Blob): Promise<string> => {
    const apiKey = mockDb.getApiKey('elevenlabs');
    if (!apiKey) throw new Error("ElevenLabs API key missing.");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock transcription based on common questions
    const mockTranscriptions = [
        "আজকের আবহাওয়া কেমন?",
        "আমার ধানের অবস্থা কী?",
        "গুদামে কী করব?",
        "কবে ধান কাটব?",
        "কবে বিক্রি করব?",
        "আমার স্কোর কত?",
    ];
    
    // Randomly select a mock transcription
    const randomIndex = Math.floor(Math.random() * mockTranscriptions.length);
    return mockTranscriptions[randomIndex];
};

/**
 * Mocks the Gemini AI API call for generating an answer.
 * @param prompt The user's question (transcribed text).
 * @param userDistrict The user's location.
 * @param batches Active crop batches.
 * @param weather 5-day weather forecast.
 * @returns The AI-generated answer in Bangla.
 */
export const geminiAsk = async (
    prompt: string, 
    userDistrict: string, 
    batches: StoredBatch[], 
    weather: DailyForecast[]
): Promise<string> => {
    const apiKey = mockDb.getApiKey('gemini');
    if (!apiKey) throw new Error("Gemini API key missing.");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const context = getAiContext(userDistrict, batches, weather);
    
    // Mock AI response based on prompt and context
    let mockAnswer = "দুঃখিত, আমি আপনার প্রশ্নটি বুঝতে পারিনি।";

    if (prompt.includes("আবহাওয়া কেমন")) {
        const today = weather[0];
        mockAnswer = `আজ ${userDistrict} এ সর্বোচ্চ তাপমাত্রা ${today.tempMax} ডিগ্রি সেলসিয়াস এবং আর্দ্রতা ${today.humidity}%। ${today.conditionBn} থাকবে।`;
    } else if (prompt.includes("ধানের অবস্থা")) {
        if (batches.length > 0) {
            const highRiskBatch = batches.find(b => b.prediction.riskLevel === 'High');
            if (highRiskBatch) {
                mockAnswer = `আপনার একটি ব্যাচ উচ্চ ঝুঁকিতে আছে। ${highRiskBatch.data.cropType} ফসলের নষ্ট হতে বাকি আছে মাত্র ${highRiskBatch.prediction.etclDays} দিন। অবিলম্বে ব্যবস্থা নিন।`;
            } else {
                mockAnswer = `আপনার ${batches.length}টি ব্যাচই নিরাপদ অবস্থায় আছে। বর্তমান সংরক্ষণ পদ্ধতি চালিয়ে যান।`;
            }
        } else {
            mockAnswer = "আপনার কোনো সক্রিয় ফসল নিবন্ধন করা নেই। নতুন ব্যাচ যোগ করুন।";
        }
    } else if (prompt.includes("গুদামে কী করব")) {
        mockAnswer = "গুদামের তাপমাত্রা ও আর্দ্রতা পরীক্ষা করুন। আর্দ্রতা ১৪% এর নিচে রাখুন এবং ভালো বায়ুচলাচল নিশ্চিত করুন।";
    } else if (prompt.includes("স্কোর কত")) {
        // This requires accessing the user object, which is available in the frontend context, 
        // but since this is a mock backend, we'll use a placeholder.
        mockAnswer = "আপনার বর্তমান ডিজিটাল কৃষক স্কোর হলো ৪২০০। অভিনন্দন!";
    } else {
        mockAnswer = "আমি আপনার প্রশ্নটি বুঝতে পেরেছি। এটি একটি গুরুত্বপূর্ণ প্রশ্ন।";
    }

    return mockAnswer;
};

/**
 * Mocks the ElevenLabs Text-to-Speech API call.
 * @param text The text to convert to speech.
 * @returns A Blob containing the generated audio data (mocked as MP3).
 */
export const elevenLabsTts = async (text: string): Promise<Blob> => {
    const apiKey = mockDb.getApiKey('elevenlabs');
    if (!apiKey) throw new Error("ElevenLabs API key missing.");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock audio generation by returning a placeholder Blob.
    // Using a slightly larger, more robust mock data array (1KB) to satisfy stricter browsers.
    const mockAudioData = new Uint8Array(1024); 
    // Set a recognizable MP3 header (ID3 tag) at the start
    mockAudioData.set([0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], 0); 
    
    const audioBlob = new Blob([mockAudioData], { type: 'audio/mpeg' });
    return audioBlob;
};