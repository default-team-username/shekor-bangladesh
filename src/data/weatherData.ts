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

// --- Mock Data (Alerts kept) ---
export const mockAlerts: WeatherAlert[] = [
  {
    id: 1,
    type: 'rain',
    titleEn: 'URGENT: Heavy Rain Today',
    titleBn: '⚠️ জরুরি: আজ ভারী বৃষ্টি',
    detailEn: 'Rain expected within 3 hours (85%). Cover harvested paddy immediately.',
    detailBn: 'আগামী ৩ ঘণ্টার মধ্যে বৃষ্টি শুরু হবে (৮৫%)। আজই ধান ঢেকে রাখুন।',
    actionEn: 'Take action now',
    actionBn: '✓ এখনই ব্যবস্থা নিন',
  },
  {
    id: 2,
    type: 'heat',
    titleEn: 'Very Hot Tomorrow',
    titleBn: '🌡️ কাল খুব গরম পড়বে',
    detailEn: 'Temperature will rise to 36°C. Avoid irrigation during noon. Irrigate in the afternoon.',
    detailBn: 'তাপমাত্রা ৩৬°C উঠবে। দুপুরে সেচ দেবেন না। বিকেলের দিকে সেচ দিন।',
    actionEn: 'Irrigate in the afternoon',
    actionBn: '✓ বিকেলে সেচ দিন',
  },
  {
    id: 3,
    type: 'general',
    titleEn: 'Rain Coming in 3 Days',
    titleBn: '☔ আগামী ৩ দিনে বৃষ্টি আসছে',
    detailEn: 'Heavy rain expected for 2 days (70%+). Harvest paddy before the rain starts.',
    detailBn: '২ দিন বৃষ্টি হবে (৭০%+)। বৃষ্টি শুরুর আগেই ধান কেটে ফেলুন।',
    actionEn: 'Harvest quickly',
    actionBn: '✓ তাড়াতাড়ি কাটুন',
  },
];

export const generalNote = {
    en: "Rain 70%+ means heavy rain expected. Temperature 35°C+ means heat stress.",
    bn: "বৃষ্টি ৭০%+ মানে নিশ্চিত বৃষ্টি হবে। তাপমাত্রা ৩৫°C+ মানে তাপের চাপ।",
};