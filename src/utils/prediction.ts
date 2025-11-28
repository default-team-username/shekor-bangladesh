import { PredictionResult, BatchFormValues } from "@/data/batchData.ts";

// Mock AI Prediction Logic
export const generateMockPrediction = (data: BatchFormValues): PredictionResult => {
  let etclDays = 90;
  let riskLevel: PredictionResult['riskLevel'] = 'Low';
  let guidanceEn = "In good condition, continue proper storage.";
  let guidanceBn = "ভাল অবস্থায় আছে, সঠিক সংরক্ষণ চালিয়ে যান।";

  // Simple mock logic based on moisture and temperature
  if (data.moistureLevel > 75 || data.storageTemperature > 35) {
    etclDays = 15;
    riskLevel = 'High';
    guidanceEn = "Critical risk! Immediate action required to reduce moisture and temperature.";
    guidanceBn = "গুরুত্বপূর্ণ ঝুঁকি! আর্দ্রতা ও তাপমাত্রা কমাতে অবিলম্বে ব্যবস্থা নিন।";
  } else if (data.moistureLevel > 65 || data.storageTemperature > 30) {
    etclDays = 45;
    riskLevel = 'Medium';
    guidanceEn = "Moderate risk. Monitor closely and improve ventilation.";
    guidanceBn = "মাঝারি ঝুঁকি। নিবিড়ভাবে পর্যবেক্ষণ করুন এবং বায়ুচলাচল উন্নত করুন।";
  }

  return { etclDays, riskLevel, guidanceEn, guidanceBn };
};