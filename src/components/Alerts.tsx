"use client";

import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface WeatherProps {
  weatherStatus: "good" | "bad";
}

interface RiskProps {
  riskLevel: "Critical" | "Low" | "Medium";
}

interface AlertsProps {
  weather: WeatherProps;
  risk: RiskProps;
}

const Alerts: React.FC<AlertsProps> = ({ weather, risk }) => {
  // This useEffect hook runs once when the component mounts, triggering the notifications.
  useEffect(() => {
    // 2. Weather Alerts
    if (weather.weatherStatus === "bad") {
      // If weather is "bad", show a UI toast: "মৌসম খারাপ"
      toast.warning("মৌসম খারাপ", {
        description: "Weather status is bad. Take precautions.",
        duration: 5000,
      });
    } else if (weather.weatherStatus === "good") {
      // If weather is "good", show a UI toast: "আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।"
      toast.success("আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।", {
        description: "Good weather, but check storage conditions.",
        duration: 7000,
      });
    }

    // 3. Critical Risk Notification
    if (risk.riskLevel === "Critical") {
      // When the farm risk level is "Critical", simulate an SMS notification by printing to the console:
      console.log("SMS Notification: আপনার ফার্মে ক্রিটিক্যাল ঝুঁকি শনাক্ত হয়েছে!");
    }
  }, [weather.weatherStatus, risk.riskLevel]);

  // The component itself renders nothing visible, it only handles side effects (toasts/console logs)
  return null;
};

export default Alerts;