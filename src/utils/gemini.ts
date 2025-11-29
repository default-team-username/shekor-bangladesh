import { StoredBatch } from '@/contexts/BatchContext';
import { DailyForecast } from '@/data/weatherData';
import { cropTypes } from '@/data/batchData';

export interface SmartAlert {
  message: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

// Helper to get crop name
const getCropName = (key: string, lang: 'en' | 'bn'): string => {
    const crop = cropTypes.find(c => c.key === key);
    if (!crop) return key;
    return lang === 'en' ? crop.en : crop.bn;
};

/**
 * Mocks a Gemini API call to generate a smart, actionable alert for a farmer.
 * @param batches The farmer's active crop batches.
 * @param tomorrowWeather The weather forecast for the next day.
 * @param lang The selected language ('en' or 'bn').
 * @returns A SmartAlert object or null if no critical alert is needed.
 */
export const generateSmartAlert = async (
  batches: StoredBatch[],
  tomorrowWeather: DailyForecast,
  lang: 'en' | 'bn'
): Promise<SmartAlert | null> => {
  // Simulate network delay for the API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // If no batches are registered, return null
  if (batches.length === 0) {
      return null;
  }

  // Find the batch with the highest risk level to prioritize the alert
  const highRiskBatch = batches.find(b => b.prediction.riskLevel === 'High');
  const mediumRiskBatch = batches.find(b => b.prediction.riskLevel === 'Medium');
  const priorityBatch = highRiskBatch || mediumRiskBatch;
  
  // --- SCENARIO CHECKS (Prioritized) ---

  if (priorityBatch) {
      const cropName = getCropName(priorityBatch.data.cropType, lang);
      const riskLevel = priorityBatch.prediction.riskLevel;

      // Scenario 1: High rain chance tomorrow
      if (tomorrowWeather.rainChance > 70) {
        return {
          type: 'warning',
          message: lang === 'en' ? 'Heavy Rain Alert' : 'ভারী বৃষ্টির সতর্কতা',
          description: lang === 'en'
            ? `Heavy rain is expected tomorrow. Your ${cropName} batch is at ${riskLevel} risk. Ensure storage is waterproof and check for leaks.`
            : `আগামীকাল ভারী বৃষ্টির সম্ভাবনা। আপনার ${cropName} ব্যাচটি ${riskLevel === 'High' ? 'উচ্চ' : 'মাঝারি'} ঝুঁকিতে রয়েছে। গুদাম জলরোধী কিনা তা নিশ্চিত করুন এবং কোনো ছিদ্র আছে কিনা পরীক্ষা করুন।`
        };
      }

      // Scenario 2: High temperature tomorrow
      if (tomorrowWeather.tempMax >= 35) {
        return {
          type: 'warning',
          message: lang === 'en' ? 'Heat Wave Alert' : 'তাপপ্রবাহের সতর্কতা',
          description: lang === 'en'
            ? `High temperatures (${tomorrowWeather.tempMax}°C) expected tomorrow. Your ${cropName} batch is at ${riskLevel} risk. Ensure proper ventilation to prevent spoilage.`
            : `আগামীকাল উচ্চ তাপমাত্রা (${tomorrowWeather.tempMax}°C) প্রত্যাশিত। আপনার ${cropName} ব্যাচটি ${riskLevel === 'High' ? 'উচ্চ' : 'মাঝারি'} ঝুঁকিতে রয়েছে। পচন রোধ করতে সঠিক বায়ুচলাচল নিশ্চিত করুন।`
        };
      }
      
      // Scenario 3: High humidity tomorrow
      if (tomorrowWeather.humidity > 85) {
          return {
              type: 'warning',
              message: lang === 'en' ? 'High Humidity Alert' : 'উচ্চ আর্দ্রতার সতর্কতা',
              description: lang === 'en'
                  ? `High humidity (${tomorrowWeather.humidity}%) is expected tomorrow, increasing spoilage risk for your ${cropName} batch. Turn on fans or increase airflow.`
                  : `আগামীকাল উচ্চ আর্দ্রতা (${tomorrowWeather.humidity}%) প্রত্যাশিত, যা আপনার ${cropName} ব্যাচের পচনের ঝুঁকি বাড়াবে। ফ্যান চালু করুন বা বায়ুপ্রবাহ বাড়ান।`
          };
      }
      
      // Scenario 4: Status update for medium/high risk batch (if no weather threat)
      return {
          type: 'info',
          message: lang === 'en' ? 'Batch Status' : 'ব্যাচের অবস্থা',
          description: lang === 'en'
              ? `Your ${cropName} batch is currently at ${riskLevel} risk. Continue to monitor it closely.`
              : `আপনার ${cropName} ব্যাচটি বর্তমানে ${riskLevel === 'High' ? 'উচ্চ' : 'মাঝারি'} ঝুঁকিতে রয়েছে। এটি নিবিড়ভাবে পর্যবেক্ষণ করুন।`
      };
  }

  // --- DEFAULT ALERT (If all batches are low risk) ---
  
  // Scenario 5: General rain warning (even if batches are low risk)
  if (tomorrowWeather.rainChance > 70) {
      return {
          type: 'info',
          message: lang === 'en' ? 'Weather Update' : 'আবহাওয়ার আপডেট',
          description: lang === 'en' 
              ? `Heavy rain is expected tomorrow (${tomorrowWeather.rainChance}%). Ensure all storage areas are secure.`
              : `আগামীকাল ভারী বৃষ্টির সম্ভাবনা রয়েছে (${tomorrowWeather.rainChance}%)। আপনার সব সংরক্ষণ স্থান নিরাপদ রাখুন।`
      };
  }
  
  // Scenario 6: All Clear / Welcome Back message (Guaranteed alert if batches exist)
  return {
      type: 'success',
      message: lang === 'en' ? 'All Clear' : 'সবকিছু নিরাপদ',
      description: lang === 'en'
          ? `Welcome back! All ${batches.length} of your batches are currently at low risk. Keep up the good work!`
          : `স্বাগতম! আপনার সব ${batches.length}টি ব্যাচই বর্তমানে কম ঝুঁকিতে রয়েছে। ভালো কাজ চালিয়ে যান!`
  };
};