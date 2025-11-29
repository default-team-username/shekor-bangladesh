import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { QualityResult } from '@/data/qualityData';

interface QualityResultDisplayProps {
  result: QualityResult;
  cropName: string;
}

const QualityResultDisplay: React.FC<QualityResultDisplayProps> = ({ result, cropName }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  let statusTextEn = 'Fresh';
  let statusTextBn = 'তাজা';
  let iconColorClass = 'text-primary';
  let bgColorClass = 'bg-primary';

  if (result.status === 'Medium') {
    statusTextEn = 'Moderate Quality';
    statusTextBn = 'মাঝারি মান';
    iconColorClass = 'text-harvest-yellow';
    bgColorClass = 'bg-harvest-yellow';
  } else if (result.status === 'Spoiled') {
    statusTextEn = 'Spoiled';
    statusTextBn = 'নষ্ট';
    iconColorClass = 'text-destructive';
    bgColorClass = 'bg-destructive';
  } 
  
  const StatusIcon = result.status === 'Fresh' ? CheckCircle : result.status === 'Medium' ? AlertTriangle : XCircle;

  // Custom style for the green card background based on the provided CSS
  const safeCardStyle = {
    background: '#F0FDF4',
    border: '1.6px solid #7BF1A8',
  };
  
  const isFresh = result.status === 'Fresh';

  // New descriptive text
  const aiDescriptionEn = "AI instantly identifies the threat, assesses the risk, and generates a hyper-local, grounded, and specific treatment plan entirely in Bangla.";
  const aiDescriptionBn = "এআই তাৎক্ষণিকভাবে হুমকি শনাক্ত করে, ঝুঁকি মূল্যায়ন করে এবং সম্পূর্ণ বাংলায় একটি হাইপার-লোকাল, বাস্তবসম্মত ও নির্দিষ্ট প্রতিকার পরিকল্পনা তৈরি করে।";

  return (
    <div className="w-full space-y-6">
      {/* --- 1. Quality Result Card --- */}
      <Card className={cn("w-full p-6 shadow-xl", isFresh ? 'bg-green-50 border-green-400' : 'bg-white border-border/50')} style={isFresh ? safeCardStyle : {}}>
        <CardContent className="p-0 flex flex-col items-center text-center">
          
          {/* Icon */}
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <StatusIcon className={cn("h-10 w-10", iconColorClass)} />
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mt-2">
            {getTranslation("AI Quality Evaluation", "এআই মান মূল্যায়ন")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {getTranslation(`Result for ${cropName}`, `${cropName} এর ফলাফল`)}
          </p>

          {/* Status Badge */}
          <div className={cn("px-6 py-3 rounded-full shadow-md flex items-center gap-2", bgColorClass)}>
            <StatusIcon className="h-5 w-5 text-white" />
            <span className="text-xl font-bold text-white">
              {getTranslation(statusTextEn, statusTextBn)}
            </span>
          </div>
          
          {/* Confidence Score */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Gauge className="h-4 w-4" />
            {getTranslation("Confidence:", "আত্মবিশ্বাস:")}
            <span className={cn("font-bold", iconColorClass)}>{result.confidence}%</span>
          </div>

          {/* AI Description Block */}
          <div className="mt-6 w-full p-3 bg-secondary rounded-xl text-center border border-border/50">
            <p className="text-sm font-medium text-foreground">
              {getTranslation(aiDescriptionEn, aiDescriptionBn)}
            </p>
          </div>

          {/* Guidance Box */}
          <div className="mt-8 w-full p-4 bg-white border border-green-200 rounded-xl text-left">
            <p className="text-base font-semibold text-gray-700">
              {getTranslation(result.guidanceEn, result.guidanceBn)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {getTranslation("AI Guidance", "এআই নির্দেশনা")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <Button 
        onClick={() => navigate('/dashboard')}
        variant="outline" 
        className="w-full h-12 rounded-xl border-primary text-primary hover:bg-primary/10"
      >
        {getTranslation("Back to Dashboard", "ড্যাশবোর্ডে ফিরে যান")}
      </Button>
    </div>
  );
};

export default QualityResultDisplay;