import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/contexts/SessionContext";
import { DailyForecast, WeatherAlert } from "@/data/weatherData";
import { fetchWeather } from "@/utils/weather";

interface WeatherHookResult {
    forecast: DailyForecast[];
    alerts: WeatherAlert[];
    isLoading: boolean;
    error: Error | null;
    isStaleCache: boolean;
}

export const useWeather = (): WeatherHookResult => {
  const { language } = useLanguage();
  const { user } = useSession();
  // Default to Dhaka if district is missing, as per mock data
  const location = user?.user_metadata?.district || 'Dhaka'; 
  
  const queryKey = ['weatherForecast', location, language];

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchWeather(location, language),
    refetchOnWindowFocus: false,
    // We let fetchWeather handle caching and staleness detection internally
    staleTime: Infinity, 
    gcTime: 86400000, // 24 hours
  });
  
  const result = data || { data: [], alerts: [], isCached: false, isStale: false };

  return {
    forecast: result.data,
    alerts: result.alerts,
    isLoading: isLoading || isFetching,
    error: error as Error | null,
    isStaleCache: result.isStale,
  };
};