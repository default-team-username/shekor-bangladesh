"use client";

import React, { useEffect } from 'react';

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
      // If weather is "bad", show a browser alert: "মৌসম খারাপ"
      alert("মৌসম খারাপ");
    } else if (weather.weatherStatus === "good") {
      // If weather is "good", show a browser alert: "আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।"
      alert("আগামীকাল বৃষ্টি হবে এবং আপনার আলু গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।");
    }

    // 3. Critical Risk Notification
    if (risk.riskLevel === "Critical") {
      // When the farm risk level is "Critical", simulate an SMS notification by printing to the console:
      console.log("SMS Notification: আপনার ফার্মে ক্রিটিক্যাল ঝুঁকি শনাক্ত হয়েছে!");
    }
  }, [weather.weatherStatus, risk.riskLevel]);

  // The component itself renders nothing visible, it only handles side effects (alerts/console logs)
  return null;
};

export default Alerts;