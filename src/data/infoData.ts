import { Warehouse, Cloud, Shield } from 'lucide-react';
import React from 'react';

export interface InfoArticle {
  key: 'storage' | 'weather' | 'protection';
  icon: React.ElementType; // Lucide icon
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  articleEn: string;
  articleBn: string;
}

export const infoArticles: InfoArticle[] = [
  {
    key: 'storage',
    icon: Warehouse,
    titleEn: 'Best Storage Practices',
    titleBn: 'সেরা সংরক্ষণ পদ্ধতি',
    summaryEn: 'Tips for keeping your harvest safe and fresh.',
    summaryBn: 'আপনার ফসল নিরাপদ ও তাজা রাখার টিপস।',
    articleEn: `
      **1. Clean and Prepare Storage:** Ensure the storage area is completely dry and free of pests before storing crops. Use lime wash or approved insecticides.
      
      **2. Control Moisture:** Moisture is the enemy. Keep grain moisture content below 14%. Use plastic sheets or raised platforms to prevent ground moisture absorption.
      
      **3. Monitor Temperature:** High temperatures accelerate spoilage. Ensure good ventilation. If possible, store crops in the coolest part of your home or warehouse.
      
      **4. Regular Inspection:** Check the stored crops weekly for signs of pests, mold, or heating. Early detection saves the entire batch.
    `,
    articleBn: `
      **১. সংরক্ষণ স্থান পরিষ্কার করুন:** ফসল সংরক্ষণের আগে স্থানটি সম্পূর্ণ শুকনো এবং কীটপতঙ্গ মুক্ত নিশ্চিত করুন। চুন বা অনুমোদিত কীটনাশক ব্যবহার করুন।
      
      **২. আর্দ্রতা নিয়ন্ত্রণ:** আর্দ্রতা ফসলের শত্রু। শস্যের আর্দ্রতা ১৪% এর নিচে রাখুন। মাটির আর্দ্রতা শোষণ রোধ করতে প্লাস্টিকের চাদর বা উঁচু প্ল্যাটফর্ম ব্যবহার করুন।
      
      **৩. তাপমাত্রা পর্যবেক্ষণ:** উচ্চ তাপমাত্রা পচন দ্রুত করে। ভালো বায়ুচলাচল নিশ্চিত করুন। সম্ভব হলে আপনার বাড়ি বা গুদামের শীতলতম অংশে ফসল সংরক্ষণ করুন।
      
      **৪. নিয়মিত পরিদর্শন:** কীটপতঙ্গ, ছাঁচ বা গরম হওয়ার লক্ষণগুলির জন্য সাপ্তাহিক ভিত্তিতে সংরক্ষিত ফসল পরীক্ষা করুন। দ্রুত সনাক্তকরণ পুরো ব্যাচকে বাঁচায়।
    `,
  },
  {
    key: 'weather',
    icon: Cloud,
    titleEn: 'Weather Monitoring Tips',
    titleBn: 'আবহাওয়া পর্যবেক্ষণের টিপস',
    summaryEn: 'How to use weather data to protect your crops.',
    summaryBn: 'আপনার ফসল রক্ষা করতে আবহাওয়ার তথ্য কীভাবে ব্যবহার করবেন।',
    articleEn: `
      **1. Rain Alerts:** If heavy rain (70%+ chance) is predicted within 48 hours, ensure all harvested crops are covered or moved indoors immediately.
      
      **2. Heat Stress:** Temperatures above 35°C can cause heat stress. Avoid irrigating during the hottest part of the day (11 AM - 3 PM). Irrigate in the late afternoon or evening.
      
      **3. Wind Speed:** High winds can damage standing crops. If strong winds are forecasted, consider temporary supports or early harvesting if the crop is mature.
      
      **4. Use Shekor App:** Always check the Shekor Weather page for hyper-local, 5-day forecasts and immediate alerts tailored to your district.
    `,
    articleBn: `
      **১. বৃষ্টির সতর্কতা:** যদি ৪৮ ঘণ্টার মধ্যে ভারী বৃষ্টি (৭০%+ সম্ভাবনা) পূর্বাভাস দেওয়া হয়, তবে নিশ্চিত করুন যে সমস্ত কাটা ফসল অবিলম্বে ঢেকে রাখা হয়েছে বা বাড়ির ভিতরে সরানো হয়েছে।
      
      **২. তাপের চাপ:** ৩৫°C এর উপরে তাপমাত্রা তাপের চাপ সৃষ্টি করতে পারে। দিনের উষ্ণতম সময়ে (সকাল ১১টা - বিকেল ৩টা) সেচ দেওয়া এড়িয়ে চলুন। বিকেল বা সন্ধ্যায় সেচ দিন।
      
      **৩. বাতাসের গতি:** উচ্চ বাতাস দাঁড়ানো ফসলের ক্ষতি করতে পারে। যদি প্রবল বাতাসের পূর্বাভাস থাকে, তবে ফসল পরিপক্ক হলে অস্থায়ী সমর্থন বা তাড়াতাড়ি কাটার কথা বিবেচনা করুন।
      
      **৪. শেকড় অ্যাপ ব্যবহার করুন:** আপনার জেলার জন্য তৈরি হাইপার-লোকাল, ৫ দিনের পূর্বাভাস এবং তাৎক্ষণিক সতর্কতার জন্য সর্বদা শেকড় আবহাওয়া পৃষ্ঠাটি পরীক্ষা করুন।
    `,
  },
  {
    key: 'protection',
    icon: Shield,
    titleEn: 'Crop Protection Guide',
    titleBn: 'ফসল সুরক্ষা গাইড',
    summaryEn: 'Essential steps to prevent pests and diseases.',
    summaryBn: 'কীটপতঙ্গ ও রোগ প্রতিরোধের জন্য প্রয়োজনীয় পদক্ষেপ।',
    articleEn: `
      **1. Integrated Pest Management (IPM):** Use a combination of methods: biological controls, resistant varieties, and chemical treatments only when necessary.
      
      **2. Fungicide Application:** Apply preventative fungicides (e.g., Carbendazim 0.1%) during high-risk periods (high humidity, moderate temperature) to prevent mold and fungal diseases.
      
      **3. Crop Rotation:** Rotate crops annually to break the life cycle of pests and diseases that thrive on specific plants.
      
      **4. Field Sanitation:** Remove and destroy infected plant debris immediately to prevent the spread of disease to healthy crops.
    `,
    articleBn: `
      **১. সমন্বিত কীট ব্যবস্থাপনা (IPM):** বিভিন্ন পদ্ধতির সংমিশ্রণ ব্যবহার করুন: জৈবিক নিয়ন্ত্রণ, প্রতিরোধী জাত এবং শুধুমাত্র প্রয়োজন হলে রাসায়নিক চিকিৎসা।
      
      **২. ছত্রাকনাশক প্রয়োগ:** উচ্চ-ঝুঁকির সময়ে (উচ্চ আর্দ্রতা, মাঝারি তাপমাত্রা) ছাঁচ এবং ছত্রাকজনিত রোগ প্রতিরোধের জন্য প্রতিরোধমূলক ছত্রাকনাশক (যেমন, কার্বেন্ডাজিম ০.১%) প্রয়োগ করুন।
      
      **৩. শস্য আবর্তন:** নির্দিষ্ট উদ্ভিদে বেড়ে ওঠা কীটপতঙ্গ ও রোগের জীবনচক্র ভাঙতে বার্ষিকভাবে শস্য আবর্তন করুন।
      
      **৪. মাঠের স্যানিটেশন:** সুস্থ ফসলে রোগ ছড়ানো রোধ করতে অবিলম্বে সংক্রামিত উদ্ভিদের ধ্বংসাবশেষ সরিয়ে ফেলুন এবং ধ্বংস করুন।
    `,
  },
];