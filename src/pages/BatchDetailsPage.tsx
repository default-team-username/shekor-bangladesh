import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBatch } from '@/contexts/BatchContext';
import { Button } from '@/components/ui/button';
import PredictionResultCard from '@/components/batch/PredictionResultCard';

const BatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { batches } = useBatch();

  const batch = batches.find(b => b.id === id);

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  if (!batch) {
    return (
      <div className="min-h-screen flex flex-col items-center pt-20">
        <h1 className="text-2xl font-bold text-destructive">
          {getTranslation("Batch Not Found", "ব্যাচ খুঁজে পাওয়া যায়নি")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {getTranslation("The requested batch ID does not exist.", "অনুরোধ করা ব্যাচ আইডি বিদ্যমান নেই।")}
        </p>
        <Button onClick={() => navigate('/dashboard')} className="mt-6">
          {getTranslation("Back to Dashboard", "ড্যাশবোর্ডে ফিরে যান")}
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center"
      style={{ 
        background: 'linear-gradient(180deg, hsl(130 40% 98%) 0%, hsl(130 40% 90%) 100%)',
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-primary shadow-md">
        <div className="container mx-auto flex h-[68px] items-center gap-3 px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Title Container */}
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-primary-foreground">
              {getTranslation("Batch Details", "ব্যাচের বিস্তারিত")}
            </h1>
            <p className="text-sm font-normal text-green-200">
              {getTranslation("Prediction & Guidance", "পূর্বাভাস ও নির্দেশনা")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Card Container */}
      <div className="container mx-auto flex justify-center py-8 w-full max-w-md">
        <PredictionResultCard result={batch.prediction} data={batch.data} />
      </div>
    </div>
  );
};

export default BatchDetailsPage;