import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Wheat, Scale, MapPin, Warehouse, Thermometer, Droplet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { BatchFormValues, cropTypes, districts, storageMethods } from '@/data/batchData.ts';

interface BatchRegistrationFormProps {
  onSubmit: (data: BatchFormValues) => void;
}

const BatchRegistrationForm: React.FC<BatchRegistrationFormProps> = ({ onSubmit }) => {
  const { language } = useLanguage();
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useFormContext<BatchFormValues>();
  
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* 1. Crop Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Wheat className="h-4 w-4 text-primary" />
          {getTranslation("Crop Type", "ফসলের ধরন")}
        </Label>
        <Select onValueChange={(value) => setValue('cropType', value, { shouldValidate: true })} value={watch('cropType')}>
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
          {...register('estimatedWeight', { valueAsNumber: true })}
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
                !watch('harvestDate') && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch('harvestDate') ? (
                format(watch('harvestDate')!, "PPP")
              ) : (
                <span>{getTranslation("Pick a date", "একটি তারিখ নির্বাচন করুন")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watch('harvestDate')}
              onSelect={(date) => setValue('harvestDate', date!, { shouldValidate: true })}
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
        <Select onValueChange={(value) => setValue('storageLocation', value, { shouldValidate: true })} value={watch('storageLocation')}>
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
        <Select onValueChange={(value) => setValue('storageMethod', value, { shouldValidate: true })} value={watch('storageMethod')}>
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
          step="0.1"
          placeholder={getTranslation("25.5", "২৫.৫")}
          {...register('storageTemperature', { valueAsNumber: true })}
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
          {...register('moistureLevel', { valueAsNumber: true })}
          className="bg-muted/50 h-12 rounded-xl"
        />
        {errors.moistureLevel && <p className="text-xs text-destructive">{errors.moistureLevel.message}</p>}
        <p className="text-xs text-muted-foreground">{getTranslation("Current moisture level of the crop/storage.", "ফসল/সংরক্ষণের বর্তমান আর্দ্রতার মাত্রা।")}</p>
      </div>

      <Button type="submit" className="w-full text-lg font-semibold h-12 mt-6 rounded-xl" disabled={!isValid}>
        {getTranslation("Get Prediction", "পূর্বাভাস দেখুন")}
      </Button>
    </form>
  );
};

export default BatchRegistrationForm;