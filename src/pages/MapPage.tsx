import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Map, Shield, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNavBar from '@/components/layout/BottomNavBar';

const MapPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useSession();
  
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);
  
  const userDistrict = user?.user_metadata?.district || 'Dhaka';

  // Risk indicator data
  const riskIndicators = [
    { emoji: '🟢', count: 4, labelEn: 'Low Risk', labelBn: 'নিম্ন ঝুঁকি', color: 'text-primary' },
    { emoji: '🟡', count: 5, labelEn: 'Moderate', labelBn: 'মাঝারি', color: 'text-harvest-yellow' },
    { emoji: '🔴', count: 3, labelEn: 'High Risk', labelBn: 'উচ্চ ঝুঁকি', color: 'text-destructive' },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col items-center pb-20 md:pb-0"
      style={{ 
        background: 'linear-gradient(180deg, hsl(130 40% 90%) 0%, hsl(0 0% 100%) 100%)',
      }}
    >
      {/* Header Section (Green Background) */}
      <header className="sticky top-0 z-10 w-full bg-harvest-green shadow-md rounded-b-3xl p-4 pb-6">
        <div className="container mx-auto flex flex-col gap-2 px-0 max-w-md">
          {/* Top Bar */}
          <div className="flex items-center gap-3 h-10">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Title Container */}
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-white">
                {getTranslation("Area Map", "এলাকার মানচিত্র")}
              </h1>
              <p className="text-sm font-normal text-green-200">
                {getTranslation("Crop Risk Visualization", "ফসল ঝুঁকি দৃশ্যকল্পনা")}
              </p>
            </div>
          </div>
          
          {/* Location */}
          <p className="text-sm font-medium text-green-200 mt-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            {userDistrict}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 w-full max-w-md space-y-6 py-6">
        
        {/* Map Instructions Card */}
        <Card className="w-full bg-blue-50 border-blue-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Map className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-blue-800">
                {getTranslation("Use the map", "মানচিত্র ব্যবহার করুন")}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {getTranslation(
                  "• Blue pin = Your location. Colored pins = Neighboring crop risks.",
                  "• নীল পিন = আপনার অবস্থান। রঙিন পিন = প্রতিবেশী কৃষকদের ফসল ঝুঁকি।"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {riskIndicators.map((indicator, index) => (
            <Card 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-secondary/50 border-border/50 shadow-sm"
            >
              <div className="text-2xl mb-2">{indicator.emoji}</div>
              <div className="text-xl font-bold text-foreground">{indicator.count}</div>
              <div className="text-xs text-muted-foreground text-center mt-1">
                {getTranslation(indicator.labelEn, indicator.labelBn)}
              </div>
            </Card>
          ))}
        </div>

        {/* Map Visualization */}
        <Card className="w-full border-border shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0 relative h-96 bg-gray-200">
            {/* Map Placeholder with Grid Pattern */}
            <div className="absolute inset-0 bg-gray-300">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
              
              {/* Farmer locations with different risk levels */}
              {/* Low Risk Farmers (Green) */}
              <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-green-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-1/3 left-2/3 w-6 h-6 bg-green-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-2/3 left-1/3 w-6 h-6 bg-green-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-3/4 left-3/4 w-6 h-6 bg-green-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              
              {/* Moderate Risk Farmers (Yellow) */}
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-1/4 left-3/4 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-2/3 left-2/3 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-1/3 left-1/5 w-6 h-6 bg-yellow-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              
              {/* High Risk Farmers (Red) */}
              <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-2/3 left-1/2 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              <div className="absolute top-1/4 left-1/2 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">🌾</span>
              </div>
              
              {/* User Location (Blue Pin) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center shadow-lg rotate-45">
                  <MapPin className="h-6 w-6 text-white -rotate-45" />
                </div>
              </div>
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded shadow">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded shadow">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Map Attribution */}
            <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
              © {getTranslation("OpenStreetMap contributors", "ওপেনস্ট্রিটম্যাপ অবদানকারী")}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice Card */}
        <Card className="w-full bg-gray-50 border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">
                {getTranslation("🔒 Privacy Protected:", "🔒 গোপনীয়তা সুরক্ষিত:")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {getTranslation(
                  "All neighbor data is completely anonymous. No names or personal details are shared.",
                  "সকল প্রতিবেশীর তথ্য সম্পূর্ণ বেনামী। কোন নাম বা ব্যক্তিগত বিবরণ শেয়ার করা হয় না।"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default MapPage;