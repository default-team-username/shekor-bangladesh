import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, AlertTriangle, XCircle, Camera, Wheat, Scale, Calendar as CalendarIcon, MapPin, Warehouse, Thermometer, Droplet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { PredictionResult, BatchFormValues, cropTypes, storageMethods } from '@/data/batchData.ts';

interface PredictionResultCardProps {
  result: PredictionResult;
  data: BatchFormValues;
}

const DetailRow = ({ labelEn, labelBn, value, icon: Icon }: { labelEn: string, labelBn: string, value: string, icon: React.ElementType }) => {
  const { language } = useLanguage();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {getTranslation(labelEn, labelBn)}
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
};

const PredictionResultCard: React.FC<PredictionResultCardProps> = ({ result, data }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  let riskColorClass = '';
  let RiskIcon: React.ElementType = CheckCircle;
  let riskTextEn = 'Safe';
  let riskTextBn = 'নিরাপদ';
  let cardBgClass = 'bg-green-50 border-green-400';
  let iconColorClass = 'text-green-700';
  let etclBgClass = 'bg-primary';

  if (result.riskLevel === 'Medium') {
    riskColorClass = 'text-harvest-yellow';
    RiskIcon = AlertTriangle;
    riskTextEn = 'Moderate';
    riskTextBn = 'মাঝারি';
    cardBgClass = 'bg-yellow-50 border-yellow-400';
    iconColorClass = 'text-harvest-yellow';
    etclBgClass = 'bg-yellow-500';
  } else if (result.riskLevel === 'High') {
    riskColorClass = 'text-destructive';
    RiskIcon = XCircle;
    riskTextEn = 'Critical';
    riskTextBn = 'গুরুত্বপূর্ণ';
    cardBgClass = 'bg-red-50 border-red-400';
    iconColorClass = 'text-destructive';
    etclBgClass = 'bg-red-600';
  } else {
    // Low/Safe
    riskColorClass = 'text-primary';
    RiskIcon = CheckCircle;
    riskTextEn = 'Safe';
    riskTextBn = 'নিরাপদ';
    cardBgClass = 'bg-green-50 border-green-400';
    iconColorClass = 'text-primary';
    etclBgClass = 'bg-primary';
  }

  // Custom style for the green card background based on the provided CSS
  const safeCardStyle = {
    background: '#F0FDF4',
    border: '1.6px solid #7BF1A8',
  };

  // Helper to find display value
  const getDisplayValue = (key: string, list: { key: string, en: string, bn: string }[]) => {
    const item = list.find(i => i.key === key);
    return item ? getTranslation(item.en, item.bn) : key;
  };

  return (
    <div className="w-full space-y-4">
      {/* --- 1. Prediction Result Card --- */}
      <Card className={cn("w-full p-6 shadow-xl", cardBgClass)} style={safeCardStyle}>
        <CardContent className="p-0 flex flex-col items-center text-center">
          
          {/* Icon */}
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <RiskIcon className={cn("h-10 w-10", iconColorClass)} />
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mt-2">
            {getTranslation("Estimated Time to Crop Loss (ETCL)", "নষ্ট হতে বাকি সময়")}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {getTranslation("Estimated Time to Crop Loss (ETCL)", "Estimated Time to Crop Loss (ETCL)")}
          </p>

          {/* ETCL Value */}
          <div className={cn("px-6 py-3 rounded-full shadow-md flex items-baseline gap-1", etclBgClass)}>
            <span className="text-4xl font-bold text-white">{result.etclDays}</span>
            <span className="text-xl font-medium text-white">{getTranslation("days", "দিন")}</span>
          </div>

          {/* Risk Badge */}
          <div className={cn("mt-6 px-4 py-2 rounded-full flex items-center gap-2 border", cardBgClass, riskColorClass)}>
            <RiskIcon className="h-5 w-5" />
            <span className="text-base font-semibold">
              {getTranslation(riskTextEn, riskTextBn)}
            </span>
            <span className="text-sm text-muted-foreground/80">
              ({result.riskLevel})
            </span>
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

      {/* --- 2. Batch Details Card --- */}
      <Card className="w-full p-6 shadow-lg border-border/50">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {getTranslation("Batch Details", "ব্যাচের বিস্তারিত")}
          </h3>
          
          <DetailRow 
            labelEn="Crop Type" 
            labelBn="ফসলের ধরন" 
            value={getDisplayValue(data.cropType, cropTypes)} 
            icon={Wheat} 
          />
          <DetailRow 
            labelEn="Weight (kg)" 
            labelBn="ওজন (কেজি)" 
            value={`${data.estimatedWeight} kg`} 
            icon={Scale} 
          />
          <DetailRow 
            labelEn="Harvest Date" 
            labelBn="ফসল কাটার তারিখ" 
            value={format(data.harvestDate, 'PPP')} 
            icon={CalendarIcon} 
          />
          <DetailRow 
            labelEn="Storage Location" 
            labelBn="সংরক্ষণ স্থান" 
            value={data.storageLocation} 
            icon={MapPin} 
          />
          <DetailRow 
            labelEn="Storage Method" 
            labelBn="সংরক্ষণ পদ্ধতি" 
            value={getDisplayValue(data.storageMethod, storageMethods)} 
            icon={Warehouse} 
          />
          <DetailRow 
            labelEn="Temperature (°C)" 
            labelBn="তাপমাত্রা (°C)" 
            value={`${data.storageTemperature}°C`} 
            icon={Thermometer} 
          />
          <DetailRow 
            labelEn="Moisture (%)" 
            labelBn="আর্দ্রতা (%)" 
            value={`${data.moistureLevel}%`} 
            icon={Droplet} 
          />
        </CardContent>
      </Card>

      {/* --- 3. Quality Check Card (Mock) --- */}
      <Card className="w-full p-6 shadow-lg border-border/50" style={{ background: 'linear-gradient(90deg, hsl(270 100% 97%) 0%, hsl(330 100% 97%) 100%)', border: '0.8px solid hsl(270 100% 90%)' }}>
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Camera className="h-6 w-6 text-purple-700" />
            </div>
            <div className="flex flex-col">
              <p className="text-base font-semibold text-gray-800">
                {getTranslation("Check Quality with AI", "মান পরীক্ষা করুন")}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTranslation("Upload image for visual inspection", "ভিজ্যুয়াল পরিদর্শনের জন্য ছবি আপলোড করুন")}
              </p>
            </div>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold h-10 rounded-xl">
            {getTranslation("Upload Image", "ছবি আপলোড করুন")}
          </Button>
        </CardContent>
      </Card>

      {/* Back to Dashboard Button */}
      <Button 
        onClick={() => navigate('/dashboard')}
        variant="outline" 
        className="w-full h-12 mt-6 rounded-xl border-primary text-primary hover:bg-primary/10"
      >
        {getTranslation("Back to Dashboard", "ড্যাশবোর্ডে ফিরে যান")}
      </Button>
    </div>
  );
};

export default PredictionResultCard;