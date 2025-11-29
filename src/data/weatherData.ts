import { format, addDays } from 'date-fns';

// --- Types ---
export interface DailyForecast {
  date: Date;
  dayEn: string;
  dayBn: string;
  conditionEn: string;
  conditionBn: string;
  icon: 'rain' | 'sun' | 'cloud' | 'storm';
  tempMin: number;
  tempMax: number;
  humidity: number;
  rainChance: number; // %
  rainIntensity: 'light' | 'moderate' | 'heavy';
  guidanceEn?: string;
  guidanceBn?: string;
}

export interface WeatherAlert {
  id: number;
  type: 'rain' | 'heat' | 'general';
  titleEn: string;
  titleBn: string;
  detailEn: string;
  detailBn: string;
  actionEn: string;
  actionBn: string;
}

// --- Static Note ---
export const generalNote = {
    en: "Rain 70%+ means heavy rain expected. Temperature 35°C+ means heat stress.",
    bn: "বৃষ্টি ৭০%+ মানে নিশ্চিত বৃষ্টি হবে। তাপমাত্রা ৩৫°C+ মানে তাপের চাপ।",
};