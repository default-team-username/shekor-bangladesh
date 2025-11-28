import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, Wheat, Scale, Calendar as CalendarIcon, MapPin, Warehouse, Thermometer, Droplet } from 'lucide-react';

// --- Schema Definition ---
const batchSchema = z.object({
  cropType: z.string().min(1, { message: "Crop type is required." }),
  estimatedWeight: z.number().min(1, { message: "Weight must be greater than 0 kg." }),
  harvestDate: z.date({ required_error: "Harvest date is required." }),
  storageLocation: z.string().min(1, { message: "Storage location is required." }),
  storageMethod: z.string().min(1, { message: "Storage method is required." }),
  storageTemperature: z.number().min(0, { message: "Temperature must be non-negative." }),
  moistureLevel: z.number().min(0).max(100, { message: "Moisture must be between 0 and 100." }),
});

type BatchFormValues = z.infer<typeof batchSchema>;

// --- Data Definitions ---
const cropTypes = [
  { key: 'paddy', en: 'Paddy/Rice', bn: 'ধান/চাল' },
  { key: 'wheat', en: 'Wheat', bn: 'গম' },
  { key: 'maize', en: 'Maize', bn: 'ভুট্টা' },
];

const storageMethods = [
  { key: 'jute_bag_stack', en: 'Jute Bag Stack', bn: 'পাটের বস্তার স্তূপ' },
  { key: 'silo', en: 'Silo', bn: 'সাইলো' },
  { key: 'open_area', en: 'Open Area', bn: 'খোলা জায়গা' },
];

const districts = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
];

const BatchRegistrationPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      cropType: '',
      estimatedWeight: 0,
      harvestDate: undefined,
      storageLocation: '',
      storageMethod: '',
      storageTemperature: 25,
      moistureLevel: 60,
    },
    mode: 'onChange',
  });

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  const onSubmit = async (data: BatchFormValues) => {
    const loadingToastId = toast.loading(getTranslation('Calculating risk prediction...', 'ঝুঁকি পূর্বাভাস গণনা করা হচ্ছে...'));

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Batch Data:", data);
    
    toast.success(getTranslation('Batch registered successfully! Prediction available.', 'ব্যাচ সফলভাবে নিবন্ধিত হয়েছে! পূর্বাভাস উপলব্ধ।'), { id: loadingToastId });
    navigate('/dashboard');
  };

  const { errors } = form.formState;

  // --- Component Structure ---
  return (
    <div 
      className="min-h-screen flex flex-col items-center"
      style={{ 
        background: 'linear-gradient(180deg, hsl(130 40% 98%) 0%, hsl(130 40% 90%) 100%)',
      }}
    >
      {/* Header (Green Background) */}
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
              {getTranslation("New Batch Registration", "নতুন ব্যাচ নিবন্ধন")}
            </h1>
            <p className="text-sm font-normal text-green-200">
              {getTranslation("Enter batch details", "ব্যাচের বিবরণ লিখুন")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Card Container */}
      <div className="container mx-auto flex justify-center py-8 w-full max-w-md">
        <div className="w-full space-y-4">
          
          {/* Info Card */}
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

          {/* Registration Form */}
          <Card className="w-full p-6 shadow-lg border-border/50">
            <CardContent className="p-0">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* 1. Crop Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Wheat className="h-4 w-4 text-primary" />
                    {getTranslation("Crop Type", "ফসলের ধরন")}
                  </Label>
                  <Select onValueChange={(value) => form.setValue('cropType', value, { shouldValidate: true })} value={form.watch('cropType')}>
                    <SelectTrigger className="w-full bg-muted/50 h-12 rounded-xl">
                      <SelectValue placeholder={getTranslation("Select Crop", "ফসল নির্বাচন করুন")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.key} value={crop.key}>
                          {getTranslation(crop.en, crop.bn)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cropType && <p className="text-xs text-destructive">{errors.cropType.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("Select the type of crop in this batch.", "এই ব্যাচের ফসলের ধরন নির্বাচন করুন।")}</p>
                </div>

                {/* 2. Estimated Weight */}
                <div className="space-y-2">
                  <Label htmlFor="estimatedWeight" className="flex items-center gap-2 text-sm font-medium">
                    <Scale className="h-4 w-4 text-primary" />
                    {getTranslation("Estimated Weight (kg)", "আনুমানিক ওজন (কেজি)")}
                  </Label>
                  <Input
                    id="estimatedWeight"
                    type="number"
                    step="1"
                    placeholder={getTranslation("100", "১০০")}
                    {...form.register('estimatedWeight', { valueAsNumber: true })}
                    className="bg-muted/50 h-12 rounded-xl"
                  />
                  {errors.estimatedWeight && <p className="text-xs text-destructive">{errors.estimatedWeight.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("Enter the approximate weight of the harvest.", "ফসলের আনুমানিক ওজন লিখুন।")}</p>
                </div>

                {/* 3. Harvest Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    {getTranslation("Harvest Date", "ফসল কাটার তারিখ")}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 rounded-xl bg-muted/50",
                          !form.watch('harvestDate') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch('harvestDate') ? (
                          format(form.watch('harvestDate')!, "PPP")
                        ) : (
                          <span>{getTranslation("Pick a date", "একটি তারিখ নির্বাচন করুন")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.watch('harvestDate')}
                        onSelect={(date) => form.setValue('harvestDate', date!, { shouldValidate: true })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.harvestDate && <p className="text-xs text-destructive">{errors.harvestDate.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("The date the crop was harvested.", "ফসল কাটার তারিখ।")}</p>
                </div>

                {/* 4. Storage Location (District) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    {getTranslation("Storage Location (District)", "সংরক্ষণ স্থান (জেলা)")}
                  </Label>
                  <Select onValueChange={(value) => form.setValue('storageLocation', value, { shouldValidate: true })} value={form.watch('storageLocation')}>
                    <SelectTrigger className="w-full bg-muted/50 h-12 rounded-xl">
                      <SelectValue placeholder={getTranslation("Select District", "জেলা নির্বাচন করুন")} />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.storageLocation && <p className="text-xs text-destructive">{errors.storageLocation.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("The district where the crop is stored.", "যে জেলায় ফসল সংরক্ষণ করা হয়েছে।")}</p>
                </div>

                {/* 5. Storage Method */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Warehouse className="h-4 w-4 text-primary" />
                    {getTranslation("Storage Method", "সংরক্ষণ পদ্ধতি")}
                  </Label>
                  <Select onValueChange={(value) => form.setValue('storageMethod', value, { shouldValidate: true })} value={form.watch('storageMethod')}>
                    <SelectTrigger className="w-full bg-muted/50 h-12 rounded-xl">
                      <SelectValue placeholder={getTranslation("Select Storage Method", "সংরক্ষণ পদ্ধতি নির্বাচন করুন")} />
                    </SelectTrigger>
                    <SelectContent>
                      {storageMethods.map((method) => (
                        <SelectItem key={method.key} value={method.key}>
                          {getTranslation(method.en, method.bn)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.storageMethod && <p className="text-xs text-destructive">{errors.storageMethod.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("How the crop is currently stored.", "ফসল বর্তমানে কিভাবে সংরক্ষণ করা হয়েছে।")}</p>
                </div>

                {/* 6. Storage Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="storageTemperature" className="flex items-center gap-2 text-sm font-medium">
                    <Thermometer className="h-4 w-4 text-primary" />
                    {getTranslation("Storage Temperature (°C)", "সংরক্ষণ তাপমাত্রা (°C)")}
                  </Label>
                  <Input
                    id="storageTemperature"
                    type="number"
                    step="1"
                    placeholder={getTranslation("25", "২৫")}
                    {...form.register('storageTemperature', { valueAsNumber: true })}
                    className="bg-muted/50 h-12 rounded-xl"
                  />
                  {errors.storageTemperature && <p className="text-xs text-destructive">{errors.storageTemperature.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("Current temperature of the storage area.", "সংরক্ষণ এলাকার বর্তমান তাপমাত্রা।")}</p>
                </div>

                {/* 7. Moisture Level */}
                <div className="space-y-2">
                  <Label htmlFor="moistureLevel" className="flex items-center gap-2 text-sm font-medium">
                    <Droplet className="h-4 w-4 text-primary" />
                    {getTranslation("Moisture Level (%)", "আর্দ্রতার মাত্রা (%)")}
                  </Label>
                  <Input
                    id="moistureLevel"
                    type="number"
                    step="1"
                    placeholder={getTranslation("60", "৬০")}
                    {...form.register('moistureLevel', { valueAsNumber: true })}
                    className="bg-muted/50 h-12 rounded-xl"
                  />
                  {errors.moistureLevel && <p className="text-xs text-destructive">{errors.moistureLevel.message}</p>}
                  <p className="text-xs text-muted-foreground">{getTranslation("Current moisture level of the crop/storage.", "ফসল/সংরক্ষণের বর্তমান আর্দ্রতার মাত্রা।")}</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full text-lg font-semibold h-12 mt-6 rounded-xl" disabled={!form.formState.isValid}>
                  {getTranslation("Get Prediction", "পূর্বাভাস দেখুন")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchRegistrationPage;