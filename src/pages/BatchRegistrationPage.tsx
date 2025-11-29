import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Wheat } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useBatch } from '@/contexts/BatchContext';
import { useSession } from '@/contexts/SessionContext';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import BatchRegistrationForm from '@/components/batch/BatchRegistrationForm.tsx';
import PredictionResultCard from '@/components/batch/PredictionResultCard.tsx';
import FirstBatchSuccessModal from '@/components/batch/FirstBatchSuccessModal';
import { batchSchema, BatchFormValues, PredictionResult } from '@/data/batchData.ts';
import { generateMockPrediction } from '@/utils/prediction.ts';

const BatchRegistrationPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addBatch, batches } = useBatch();
  const { user, updateScore } = useSession();
  const { current: currentWeatherData, isLoading: isWeatherLoading } = useWeather();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [submittedData, setSubmittedData] = useState<BatchFormValues | null>(null);
  const [showFirstBatchModal, setShowFirstBatchModal] = useState(false);

  const formMethods = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      cropType: '',
      estimatedWeight: 0,
      harvestDate: undefined,
      storageLocation: user?.user_metadata?.district || '',
      storageTemperature: 25,
      moistureLevel: 60,
    },
    mode: 'onChange',
  });

  // Effect to autofill weather data
  useEffect(() => {
    if (currentWeatherData && !isWeatherLoading) {
      formMethods.setValue('storageTemperature', currentWeatherData.temp, { shouldValidate: true });
      formMethods.setValue('moistureLevel', currentWeatherData.humidity, { shouldValidate: true });
      
      const toastMessage = language === 'en' 
        ? `Weather data for ${user?.user_metadata?.district} loaded.`
        : `${user?.user_metadata?.district}-এর আবহাওয়ার ডেটা লোড হয়েছে।`;
      toast.info(toastMessage);
    }
  }, [currentWeatherData, isWeatherLoading, user, formMethods, language]);

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  const onSubmit = async (data: BatchFormValues) => {
    const isFirstBatch = batches.length === 0; 
    
    const loadingToastId = toast.loading(getTranslation('Calculating risk prediction...', 'ঝুঁকি পূর্বাভাস গণনা করা হচ্ছে...'));

    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = generateMockPrediction(data);
    
    addBatch(data, result);
    updateScore(100);
    
    setPrediction(result);
    setSubmittedData(data);
    
    toast.success(getTranslation('Prediction available!', 'পূর্বাভাস উপলব্ধ!'), { id: loadingToastId });

    if (isFirstBatch) {
      setShowFirstBatchModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowFirstBatchModal(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center"
      style={{ 
        background: 'linear-gradient(180deg, hsl(130 40% 98%) 0%, hsl(130 40% 90%) 100%)',
      }}
    >
      <header className="sticky top-0 z-10 w-full bg-primary shadow-md">
        <div className="container mx-auto flex h-[68px] items-center gap-3 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-primary-foreground">
              {getTranslation("New Batch Registration", "নতুন ব্যাচ নিবন্ধন")}
            </h1>
            <p className="text-sm font-normal text-green-200">
              {getTranslation("Enter batch details", "ব্যাচের বিবরণ লিখুন")}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex justify-center py-8 w-full max-w-md">
        <div className="w-full space-y-4">
          
          {prediction && submittedData ? (
            <PredictionResultCard result={prediction} data={submittedData} />
          ) : (
            <>
              <Card className="w-full bg-blue-50/50 border-blue-200/80 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/80">
                    <Wheat className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700">
                      {getTranslation("Provide your crop information", "আপনার ফসলের তথ্য দিন")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getTranslation("AI will give you accurate prediction", "AI আপনাকে সঠিক পূর্বাভাস দেবে")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full p-6 shadow-lg border-border/50">
                <CardContent className="p-0">
                  <FormProvider {...formMethods}>
                    <BatchRegistrationForm onSubmit={onSubmit} />
                  </FormProvider>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      
      <FirstBatchSuccessModal 
        isOpen={showFirstBatchModal} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default BatchRegistrationPage;