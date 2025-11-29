import { DailyForecast, WeatherAlert } from "@/data/weatherData";
import { format } from "date-fns";

// Define the structure for the API response (simplified)
interface WeatherApiResponse {
  current: {
    temp_c: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        avghumidity: number;
        daily_chance_of_rain: number;
        condition: {
          text: string;
        };
      };
    }>;
  };
}

// Define the return type for the fetch function
interface WeatherFetchResult {
    data: DailyForecast[];
    alerts: WeatherAlert[];
    isCached: boolean;
    isStale: boolean;
}

// NOTE: VITE exposes environment variables prefixed with VITE_ to the client.
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CACHE_DURATION_MS = 3600000; // 1 hour

// Helper to determine rain intensity
const getRainIntensity = (rainChance: number): DailyForecast['rainIntensity'] => {
  if (rainChance >= 70) return 'heavy';
  if (rainChance >= 40) return 'moderate';
  return 'light';
};

// Helper to determine guidance based on forecast data
const getGuidance = (forecast: DailyForecast, lang: 'en' | 'bn'): { guidanceEn: string, guidanceBn: string } => {
  const rainChance = forecast.rainChance;
  const tempMax = forecast.tempMax;

  let guidanceEn = '';
  let guidanceBn = '';

  // 1. Rain ≥70%
  if (rainChance >= 70) {
    guidanceEn = "Cover crops today.";
    guidanceBn = "আজই ফসল ঢেকে রাখুন।";
  } 
  // 2. Temp ≥35°C
  else if (tempMax >= 35) {
    guidanceEn = "Heat stress, irrigate.";
    guidanceBn = "তাপের চাপ আছে, সেচ দিন।";
  } 
  // 3. Rain <40% (and not covered by 1 or 2)
  else if (rainChance < 40) {
    guidanceEn = "Irrigate tomorrow afternoon.";
    guidanceBn = "কাল বিকেলে সেচ দিন।";
  }

  return { guidanceEn, guidanceBn };
};

// NEW FUNCTION: Generate custom alerts based on forecast data
const generateCustomAlerts = (forecast: DailyForecast[], lang: 'en' | 'bn'): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  let alertId = 1;

  // --- 1. URGENT: Heavy Rain Today (Rain >= 70% Today) ---
  if (forecast.length > 0 && forecast[0].rainChance >= 70) {
    alerts.push({
      id: alertId++,
      type: 'rain',
      titleEn: 'URGENT: Heavy Rain Today',
      titleBn: '⚠️ জরুরি: আজ ভারী বৃষ্টি',
      detailEn: `Rain expected within 3 hours (${forecast[0].rainChance}%). Cover harvested paddy immediately.`,
      detailBn: `আগামী ৩ ঘণ্টার মধ্যে বৃষ্টি শুরু হবে (${forecast[0].rainChance}%)। আজই ধান ঢেকে রাখুন।`,
      actionEn: 'Take action now',
      actionBn: '✓ এখনই ব্যবস্থা নিন',
    });
  }

  // --- 2. Very Hot Today/Tomorrow (Temp >= 35°C) ---
  let heatDayIndex = -1;
  if (forecast.length > 0 && forecast[0].tempMax >= 35) {
      heatDayIndex = 0;
  } else if (forecast.length > 1 && forecast[1].tempMax >= 35) {
      heatDayIndex = 1;
  }

  if (heatDayIndex !== -1) {
    const dayLabelEn = heatDayIndex === 0 ? 'Today' : 'Tomorrow';
    const dayLabelBn = heatDayIndex === 0 ? 'আজ' : 'কাল';
    const tempMax = forecast[heatDayIndex].tempMax;

    alerts.push({
      id: alertId++,
      type: 'heat',
      titleEn: `Very Hot ${dayLabelEn}`,
      titleBn: `🌡️ ${dayLabelBn} খুব গরম পড়বে`,
      detailEn: `Temperature will rise to ${tempMax}°C. Avoid irrigation during noon. Irrigate in the afternoon.`,
      detailBn: `তাপমাত্রা ${tempMax}°C উঠবে। দুপুরে সেচ দেবেন না। বিকেলের দিকে সেচ দিন।`,
      actionEn: 'Irrigate in the afternoon',
      actionBn: '✓ বিকেলে সেচ দিন',
    });
  }
  
  // --- 3. General Alert (3-Day Summary for Rain) ---
  if (forecast.length >= 3) {
    const rainyDays = forecast.slice(0, 3).filter(day => day.rainChance >= 70);
    const rainyDaysCount = rainyDays.length;

    if (rainyDaysCount >= 2) {
      alerts.push({
        id: alertId++,
        type: 'general',
        titleEn: 'Rain Coming in 3 Days',
        titleBn: '☔ আগামী ৩ দিনে বৃষ্টি আসছে',
        detailEn: `Heavy rain expected for ${rainyDaysCount} days (70%+). Harvest paddy before the rain starts.`,
        detailBn: `${rainyDaysCount} দিন বৃষ্টি হবে (৭০%+)। বৃষ্টি শুরুর আগেই ধান কেটে ফেলুন।`,
        actionEn: 'Harvest quickly',
        actionBn: '✓ তাড়াতাড়ি কাটুন',
      });
    }
  }

  return alerts;
};


// Helper to map WeatherAPI response to DailyForecast structure
const mapForecastToDailyForecast = (
  forecastDay: WeatherApiResponse['forecast']['forecastday'][0],
  currentTempC: number,
  lang: 'en' | 'bn',
  index: number,
): DailyForecast => {
  const date = new Date(forecastDay.date);
  const rainChance = forecastDay.day.daily_chance_of_rain;
  const rainIntensity = getRainIntensity(rainChance);
  
  const conditionText = forecastDay.day.condition.text;

  const baseForecast: DailyForecast = {
    date,
    dayEn: '', 
    dayBn: '', 
    conditionEn: lang === 'en' ? conditionText : '',
    conditionBn: lang === 'bn' ? conditionText : '',
    icon: rainChance >= 70 ? 'storm' : (forecastDay.day.maxtemp_c >= 35 ? 'sun' : 'cloud'), // Simplified icon mapping
    tempMin: forecastDay.day.mintemp_c,
    tempMax: forecastDay.day.maxtemp_c,
    humidity: forecastDay.day.avghumidity,
    rainChance: rainChance,
    rainIntensity: rainIntensity,
    guidanceEn: '',
    guidanceBn: '',
  };
  
  // Replicating the hardcoded day labels from mock data for consistency
  const dayLabels = [
    { en: 'Today', bn: 'আজ' },
    { en: 'Tomorrow', bn: 'কাল' },
    { en: 'Day 3', bn: 'পরশু' },
    { en: 'Day 4', bn: '৪ দিন পর' },
    { en: 'Day 5', bn: '৫ দিন পর' },
  ];
  
  if (index >= 0 && index < dayLabels.length) {
      baseForecast.dayEn = dayLabels[index].en;
      baseForecast.dayBn = dayLabels[index].bn;
  } else {
      // Fallback for days beyond 5
      baseForecast.dayEn = format(date, 'EEEE');
      baseForecast.dayBn = format(date, 'EEEE'); 
  }

  // Apply guidance logic
  const { guidanceEn, guidanceBn } = getGuidance(baseForecast, lang);
  baseForecast.guidanceEn = guidanceEn;
  baseForecast.guidanceBn = guidanceBn;

  return baseForecast;
};

// Function to transform raw API data
const transformApiData = (apiData: WeatherApiResponse, lang: 'en' | 'bn'): DailyForecast[] => {
    const currentTemp = apiData.current.temp_c;
    return apiData.forecast.forecastday.map((dayData, index) => {
        return mapForecastToDailyForecast(dayData, currentTemp, lang, index);
    });
}


export const fetchWeather = async (location: string, lang: 'en' | 'bn'): Promise<WeatherFetchResult> => {
  if (!WEATHER_API_KEY) {
    console.error("VITE_WEATHER_API_KEY is not set.");
    // Throw a specific error if the key is missing
    throw new Error("Weather API key is missing. Please set VITE_WEATHER_API_KEY.");
  }

  const cacheKey = `weather:${location}:${lang}`;
  const cachedDataString = localStorage.getItem(cacheKey);
  const now = Date.now();
  
  let cachedResult: { timestamp: number, data: DailyForecast[] } | null = null;
  let isStale = false;

  if (cachedDataString) {
    try {
      cachedResult = JSON.parse(cachedDataString);
      isStale = now - cachedResult.timestamp >= CACHE_DURATION_MS;
      
      // Ensure dates are Date objects
      cachedResult.data = cachedResult.data.map(d => ({
          ...d,
          date: new Date(d.date)
      }));
      
      if (!isStale) {
        // Fresh cache hit: regenerate alerts from cached forecast data
        const cachedAlerts = generateCustomAlerts(cachedResult.data, lang);
        return { data: cachedResult.data, alerts: cachedAlerts, isCached: true, isStale: false };
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
      localStorage.removeItem(cacheKey);
      cachedResult = null;
    }
  }

  // --- Attempt Network Fetch ---
  // Updated apiUrl to include alerts=yes and aqi=no
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=5&lang=${lang}&alerts=yes&aqi=no`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // Attempt to parse error message from API if available
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.error?.message || `Weather API returned status ${response.status}`;
      throw new Error(errorMessage);
    }

    const apiData: WeatherApiResponse = await response.json();
    const transformedData = transformApiData(apiData, lang);
    const generatedAlerts = generateCustomAlerts(transformedData, lang);

    // Cache successful response
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: now,
      data: transformedData,
    }));

    return { data: transformedData, alerts: generatedAlerts, isCached: false, isStale: false };

  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    // If network fails, return stale cache if available
    if (cachedResult) {
        const cachedAlerts = generateCustomAlerts(cachedResult.data, lang);
        // Return stale cache data
        return { data: cachedResult.data, alerts: cachedAlerts, isCached: true, isStale: true };
    }
    
    // If no cache available, throw the required error message
    throw new Error(lang === 'bn' 
        ? 'আবহাওয়ার তথ্য লোড করা যাচ্ছে না। A network error occurred and no cached data is available.' 
        : 'Failed to load weather data. A network error occurred and no cached data is available.');
  }
};