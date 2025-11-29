import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Map, Shield, Info, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { useBatch } from '@/contexts/BatchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BottomNavBar from '@/components/layout/BottomNavBar';
import L from 'leaflet';

// District coordinates for Bangladesh
const districtCoordinates: Record<string, [number, number]> = {
  'ঢাকা': [23.8103, 90.4125],
  'Dhaka': [23.8103, 90.4125],
  'চট্টগ্রাম': [22.3569, 91.7832],
  'Chattogram': [22.3569, 91.7832],
  'রাজশাহী': [24.3745, 88.6042],
  'Rajshahi': [24.3745, 88.6042],
  'খুলনা': [22.8456, 89.5403],
  'Khulna': [22.8456, 89.5403],
  'বরিশাল': [22.7010, 90.3535],
  'Barisal': [22.7010, 90.3535],
  'সিলেট': [24.8949, 91.8687],
  'Sylhet': [24.8949, 91.8687],
  'রংপুর': [25.7439, 89.2752],
  'Rangpur': [25.7439, 89.2752],
  'ময়মনসিংহ': [24.7471, 90.4203],
  'Mymensingh': [24.7471, 90.4203],
};

interface NeighborData {
  id: string;
  lat: number;
  lng: number;
  cropType: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

// Generate mock neighbor data around a location
function generateNeighborData(centerLat: number, centerLng: number): NeighborData[] {
  const neighbors: NeighborData[] = [];
  const cropTypes = ['ধান', 'গম', 'পাট', 'আলু', 'টমেটো', 'বেগুন', 'মরিচ', 'ভুট্টা'];
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'low', 'low', 'medium', 'medium', 'high'];
  
  for (let i = 0; i < 12; i++) {
    const latOffset = (Math.random() - 0.5) * 0.15;
    const lngOffset = (Math.random() - 0.5) * 0.15;
    const hoursAgo = Math.floor(Math.random() * 24) + 1;
    
    neighbors.push({
      id: `neighbor-${i}`,
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
      cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      lastUpdate: hoursAgo <= 1 ? '১ ঘণ্টা আগে' : `${hoursAgo} ঘণ্টা আগে`
    });
  }
  return neighbors;
}

// Get risk level text and color in Bangla
function getRiskInfo(risk: string) {
  switch (risk) {
    case 'high':
      return { text: 'উচ্চ', color: '#DC2626', bgColor: '#FEE2E2' };
    case 'medium':
      return { text: 'মাঝারি', color: '#D97706', bgColor: '#FEF3C7' };
    default:
      return { text: 'নিম্ন', color: '#16A34A', bgColor: '#DCFCE7' };
  }
}

const MapPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useSession();
  const { batches } = useBatch();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  const userDistrict = user?.user_metadata?.district || 'Dhaka';
  
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const farmerCoords = districtCoordinates[userDistrict] || districtCoordinates['Dhaka'];
    
    const map = L.map(mapContainerRef.current, {
      center: farmerCoords,
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Farmer Icon
    const farmerIcon = L.divIcon({
      className: 'custom-farmer-marker',
      html: `<div style="background-color: #2563EB; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="color: white; font-size: 18px; transform: rotate(45deg); margin-bottom: 4px;">📍</div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const farmerMarker = L.marker(farmerCoords, { icon: farmerIcon }).addTo(map);
    farmerMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <div style="font-weight: bold; color: #2563EB; margin-bottom: 4px;">আপনার অবস্থান</div>
        <div style="font-size: 13px; color: #4B5563;">Your Location</div>
        <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">${userDistrict}</div>
        ${batches.length > 0 ? `<div style="font-size: 12px; color: #6B7280;">ব্যাচ: ${batches.length}টি</div>` : ''}
      </div>
    `);

    // Neighbor markers
    const neighbors = generateNeighborData(farmerCoords[0], farmerCoords[1]);
    neighbors.forEach(neighbor => {
      const riskInfo = getRiskInfo(neighbor.riskLevel);
      const neighborIcon = L.divIcon({
        className: 'custom-neighbor-marker',
        html: `<div style="background-color: ${riskInfo.color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;"><div style="color: white; font-size: 12px; font-weight: bold;">🌾</div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([neighbor.lat, neighbor.lng], { icon: neighborIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px; min-width: 180px;">
          <div style="font-weight: bold; color: #1F2937; margin-bottom: 6px; font-size: 14px;">প্রতিবেশী কৃষক</div>
          <div style="font-size: 12px; color: #6B7280; margin-bottom: 8px;">Neighbor Farmer</div>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 11px; color: #9CA3AF;">ফসল / Crop</div>
            <div style="font-size: 13px; color: #1F2937; font-weight: 500;">${neighbor.cropType}</div>
          </div>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 11px; color: #9CA3AF;">ঝুঁকি / Risk Level</div>
            <div style="display: inline-block; padding: 3px 10px; background-color: ${riskInfo.bgColor}; color: ${riskInfo.color}; border-radius: 12px; font-size: 13px; font-weight: 600; margin-top: 2px;">${riskInfo.text}</div>
          </div>
          <div style="border-top: 1px solid #E5E7EB; margin-top: 8px; padding-top: 6px;">
            <div style="font-size: 11px; color: #9CA3AF;">শেষ আপডেট / Last Update</div>
            <div style="font-size: 12px; color: #6B7280;">${neighbor.lastUpdate}</div>
          </div>
        </div>
      `, { maxWidth: 250 });
    });

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userDistrict, batches]);

  // Risk indicator data
  const riskIndicators = [
    { emoji: '🟢', count: 4, labelEn: 'Low Risk', labelBn: 'নিম্ন ঝুঁকি' },
    { emoji: '🟡', count: 5, labelEn: 'Moderate', labelBn: 'মাঝারি' },
    { emoji: '🔴', count: 3, labelEn: 'High Risk', labelBn: 'উচ্চ ঝুঁকি' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 md:pb-0 bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-harvest-green shadow-md rounded-b-3xl p-4 pb-6">
        <div className="container mx-auto flex flex-col gap-2 px-0 max-w-md">
          <div className="flex items-center gap-3 h-10">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-base font-semibold text-white">{getTranslation("Area Map", "এলাকার মানচিত্র")}</h1>
              <p className="text-sm font-normal text-green-200">{getTranslation("Crop Risk Visualization", "ফসল ঝুঁকি দৃশ্যকল্পনা")}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-green-200 mt-2"><MapPin className="inline h-4 w-4 mr-1" />{userDistrict}</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 w-full max-w-md space-y-6 py-6">
        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 text-sm mb-1"><span className="font-semibold">মানচিত্র ব্যবহার করুন</span> • Use the map</p>
              <p className="text-blue-700 text-xs leading-relaxed">🔵 নীল পিন = আপনার অবস্থান। রঙিন পিন = প্রতিবেশী কৃষক (সবুজ=নিম্ন ঝুঁকি, হলুদ=মাঝারি, লাল=উচ্চ ঝুঁকি)। পিনে ট্যাপ করে তথ্য দেখুন।</p>
            </div>
          </div>
        </Card>

        {/* Risk Stats */}
        <div className="grid grid-cols-3 gap-4">
          {riskIndicators.map((indicator, index) => (
            <Card key={index} className="flex flex-col items-center justify-center p-4 bg-secondary/50 border-border/50 shadow-sm">
              <div className="text-2xl mb-2">{indicator.emoji}</div>
              <div className="text-xl font-bold text-foreground">{indicator.count}</div>
              <div className="text-xs text-muted-foreground text-center mt-1">{getTranslation(indicator.labelEn, indicator.labelBn)}</div>
            </Card>
          ))}
        </div>

        {/* Map Container */}
        <Card className="overflow-hidden border-2 border-gray-300 shadow-lg relative z-0">
          <div ref={mapContainerRef} style={{ height: '450px', width: '100%' }} />
          {!isMapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
              <div className="text-center">
                <Navigation className="size-8 text-green-600 animate-pulse mx-auto mb-2" />
                <p className="text-gray-600 font-semibold">মানচিত্র লোড হচ্ছে...</p>
                <p className="text-xs text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
        </Card>

        {/* Privacy Notice */}
        <Card className="w-full bg-gray-50 border-border/50 shadow-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">🔒 {getTranslation("Privacy Protected:", "গোপনীয়তা সুরক্ষিত:")}</p>
              <p className="text-xs text-muted-foreground mt-1">{getTranslation("All neighbor data is completely anonymous. No names or personal details are shared.", "সকল প্রতিবেশীর তথ্য সম্পূর্ণ বেনামী। কোন নাম বা ব্যক্তিগত বিবরণ শেয়ার করা হয় না।")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default MapPage;