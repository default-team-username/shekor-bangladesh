"use client";

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useBatch } from '@/contexts/BatchContext';
import { useWeather } from '@/hooks/useWeather';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateSmartAlert } from '@/utils/gemini';
import { useNotification } from '@/contexts/NotificationContext';

const Alerts: React.FC = () => {
  const { batches } = useBatch();
  const { forecast, isLoading: isWeatherLoading } = useWeather();
  const { language } = useLanguage();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Conditions to generate an alert:
    // 1. Batches and weather data have loaded.
    // 2. The user has at least one batch registered.
    // 3. There is a forecast available for tomorrow.
    if (!isWeatherLoading && batches.length > 0 && forecast.length > 1) {
      const tomorrowWeather = forecast[1]; // Index 1 is tomorrow's forecast

      // A self-invoking async function to call the Gemini utility
      (async () => {
        try {
          const alert = await generateSmartAlert(batches, tomorrowWeather, language);

          if (alert) {
            // Add to notification center
            addNotification(alert);

            // Display the toast based on the alert type from Gemini
            switch (alert.type) {
              case 'warning':
                toast.warning(alert.message, {
                  description: alert.description,
                  duration: 8000, // Longer duration for important alerts
                });
                break;
              case 'info':
                toast.info(alert.message, {
                  description: alert.description,
                  duration: 6000,
                });
                break;
              case 'success':
                 toast.success(alert.message, {
                  description: alert.description,
                  duration: 6000,
                });
                break;
              case 'error':
                toast.error(alert.message, {
                  description: alert.description,
                  duration: 8000,
                });
                break;
            }
          }
        } catch (error) {
          console.error("Failed to generate smart alert:", error);
          // Optionally, show a generic error toast to the user
          // toast.error("Could not fetch smart alert.");
        }
      })();
    }
    // The dependency array ensures this effect runs only when the necessary data changes.
  }, [batches, forecast, isWeatherLoading, language, addNotification]);

  // The component itself renders nothing visible, it only handles the toast side effect.
  return null;
};

export default Alerts;