import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, Plus, Wheat, AlertTriangle, Ruler, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FarmerDashboard = () => {
  const { user, isLoading, mockLogout } = useSession();
  const { language } = useLanguage();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Extract user metadata
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Farmer';
  const userDistrict = user?.user_metadata?.district || 'Dhaka';

  const handleLogout = () => {
    mockLogout();
  };

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  // --- Dashboard Components ---

  const StatCard = ({ titleEn, titleBn, value, icon: Icon, className }: { titleEn: string, titleBn: string, value: string, icon: React.ElementType, className?: string }) => (
    // Applying styles closer to the specification: white/10 background, white/20 border, rounded-2xl
    <Card className={cn("flex flex-col justify-between p-4 bg-white/10 border border-white/20 backdrop-blur-sm", className)}>
      <div className="opacity-90">
        <p className="text-xs font-normal text-white text-center">
          {getTranslation(titleEn, titleBn)}
        </p>
      </div>
      <div className="mt-4">
        <p className="text-xl font-bold text-white text-center">
          {value}
        </p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="flex flex-col items-center">
        
        {/* Top Header Section (Green Background) */}
        <div className="w-full bg-primary shadow-lg rounded-b-3xl p-4 pb-8">
          <div className="container mx-auto px-0">
            
            {/* Top Bar: Welcome & Notification/Profile */}
            <div className="flex justify-between items-center h-12 mb-4">
              {/* Welcome Text */}
              <div className="flex flex-col">
                <h2 className="text-base font-normal text-white">
                  {getTranslation("Welcome,", "স্বাগতম,")} {userName}
                </h2>
                <p className="text-sm font-normal text-green-200">
                  {userDistrict}
                </p>
              </div>

              {/* Notification/Profile Icon */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="icon" 
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard 
                titleEn="Total Batches" 
                titleBn="মোট ব্যাচ" 
                value="0" 
                icon={Wheat} 
                className="rounded-2xl" // Updated radius
              />
              <StatCard 
                titleEn="High Risk" 
                titleBn="উচ্চ ঝুঁকি" 
                value="0" 
                icon={AlertTriangle} 
                className="rounded-2xl" // Updated radius
              />
              <StatCard 
                titleEn="Score" 
                titleBn="স্কোর" 
                value="100" 
                icon={Ruler} 
                className="rounded-2xl" // Updated radius
              />
            </div>
          </div>
        </div>

        {/* Add New Batch Button Container (Pulled up) */}
        <div className="container mx-auto px-4 -mt-6 w-full max-w-md z-10">
          <Button className="w-full h-12 bg-primary text-white shadow-xl hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg font-semibold">
            <Plus className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{getTranslation("Add New Batch", "নতুন ব্যাচ যোগ করুন")}</span>
              <span className="text-xs font-normal opacity-80">{getTranslation("Start monitoring your crops", "আপনার ফসল পর্যবেক্ষণ শুরু করুন")}</span>
            </div>
          </Button>
        </div>

        {/* Main Content Area (Pushed down by button height + margin) */}
        <div className="container mx-auto px-4 mt-6 w-full max-w-md">
          
          {/* Batch List / Empty State Card */}
          <Card className="mt-6 p-8 text-center shadow-lg border-border/50 rounded-2xl">
            <CardContent className="p-0 flex flex-col items-center justify-center h-48">
              <div className="text-4xl mb-4">🌾</div>
              <h3 className="text-lg font-semibold text-muted-foreground">
                {getTranslation("No Batches Found", "কোন ব্যাচ নেই")}
              </h3>
              <p className="text-sm text-muted-foreground/80 mt-1">
                {getTranslation("Start by adding a new batch.", "নতুন ব্যাচ যোগ করে শুরু করুন।")}
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;