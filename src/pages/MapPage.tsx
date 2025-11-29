import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Map, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different risk levels using standard Leaflet icons
const getUserIcon = () => {
  return L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const getRiskIcon = (riskLevel: 'low' | 'moderate' | 'high') => {
  const iconColors = {
    low: 'green',
    moderate: 'yellow',
    high: 'red'
  };
  
  const color = iconColors[riskLevel];
  
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useSession();
  
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);
  
  const userDistrict = user?.user_metadata?.district || 'Dhaka';
  
  // Mock coordinates for different districts in Bangladesh
  const districtCoordinates: Record<string, [number, number]> = {
    'Dhaka': [23.8103, 90.4125],
    'Chittagong': [22.3569, 91.7832],
    'Rajshahi': [24.3740, 88.6011],
    'Khulna': [22.8456, 89.5403],
    'Barisal': [22.7010, 90.3535],
    'Sylhet': [24.8949, 91.8687],
    'Rangpur': [25.7439, 89.2752],
    'Mymensingh': [24.7471, 90.4203],
    'Comilla': [23.4643, 91.1670],
    'Narayanganj': [23.6337, 90.5033],
  };
  
  // Get user coordinates or default to Dhaka
  const userCoordinates = districtCoordinates[userDistrict] || districtCoordinates['Dhaka'];
  
  // Mock neighbor data with coordinates near user location
  const [neighborData, setNeighborData] = useState<Array<{
    id: number;
    coordinates: [number, number];
    riskLevel: 'low' | 'moderate' | 'high';
    cropType: string;
  }>>([]);
  
  useEffect(() => {
    // Generate mock neighbor data near user location
    const generateNeighbors = () => {
      const neighbors = [];
      const [userLat, userLng] = userCoordinates;
      
      // Generate 12 neighbors with different risk levels
      for (let i = 0; i < 12; i++) {
        // Generate coordinates near user location (within ~5km)
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        
        neighbors.push({
          id: i + 1,
          coordinates: [userLat + latOffset, userLng + lngOffset] as [number, number],
          riskLevel: i < 4 ? 'low' : i < 9 ? 'moderate' : 'high',
          cropType: i % 3 === 0 ? 'Paddy' : i % 3 === 1 ? 'Wheat' : 'Maize',
        });
      }
      
      setNeighborData(neighbors);
    };
    
    generateNeighbors();
  }, [userCoordinates]);

  // Risk indicator data
  const riskIndicators = [
    { emoji: '🟢', count: neighborData.filter(n => n.riskLevel === 'low').length, labelEn: 'Low Risk', labelBn: 'নিম্ন ঝুঁকি', color: 'text-primary' },
    { emoji: '🟡', count: neighborData.filter(n => n.riskLevel === 'moderate').length, labelEn: 'Moderate', labelBn: 'মাঝারি', color: 'text-harvest-yellow' },
    { emoji: '🔴', count: neighborData.filter(n => n.riskLevel === 'high').length, labelEn: 'High Risk', labelBn: 'উচ্চ ঝুঁকি', color: 'text-destructive' },
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

        {/* Leaflet Map Visualization */}
        <Card className="w-full border-border shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="h-96 w-full">
              <MapContainer 
                center={userCoordinates} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-2xl overflow-hidden"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* User Location Marker */}
                <Marker position={userCoordinates} icon={getUserIcon()}>
                  <Popup>
                    <div className="font-semibold">
                      {getTranslation("Your Location", "আপনার অবস্থান")}
                    </div>
                    <div className="text-sm">
                      {userDistrict}
                    </div>
                  </Popup>
                </Marker>
                
                {/* Neighbor Risk Markers */}
                {neighborData.map((neighbor) => (
                  <Marker 
                    key={neighbor.id}
                    position={neighbor.coordinates}
                    icon={getRiskIcon(neighbor.riskLevel)}
                  >
                    <Popup>
                      <div className="font-semibold">
                        {getTranslation("Neighbor Farmer", "প্রতিবেশী কৃষক")}
                      </div>
                      <div className="text-sm">
                        {getTranslation(`Risk Level: ${neighbor.riskLevel}`, `ঝুঁকি স্তর: ${neighbor.riskLevel}`)}
                      </div>
                      <div className="text-sm">
                        {getTranslation(`Crop: ${neighbor.cropType}`, `ফসল: ${neighbor.cropType}`)}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
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