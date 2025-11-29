import { DailyForecast } from "@/data/weatherData";
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
        // Fresh cache hit
        return { data: cachedResult.data, isCached: true, isStale: false };
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
      localStorage.removeItem(cacheKey);
      cachedResult = null;
    }
  }

  // --- Attempt Network Fetch ---
  // Simulating the serverless route logic here in the client
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=5&lang=${lang}`;

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

    // Cache successful response
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: now,
      data: transformedData,
    }));

    return { data: transformedData, isCached: false, isStale: false };

  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    // If network fails, return stale cache if available
    if (cachedResult) {
        // Return stale cache data
        return { data: cachedResult.data, isCached: true, isStale: true };
    }
    
    // If no cache available, throw the required error message
    throw new Error(lang === 'bn' 
        ? 'আবহাওয়ার তথ্য লোড করা যাচ্ছে না। A network error occurred and no cached data is available.' 
        : 'Failed to load weather data. A network error occurred and no cached data is available.');
  }
};