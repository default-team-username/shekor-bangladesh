import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, Plus, Wheat, AlertTriangle, Ruler, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useBatch, StoredBatch } from '@/contexts/BatchContext';
import { format } from 'date-fns';

const FarmerDashboard = () => {
  const { user, isLoading, mockLogout } = useSession();
  const { language } = useLanguage();
  const { batches } = useBatch(); // Use batches from context
  const navigate = useNavigate();
  
  // State for animation (Requirement 2)
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Trigger fade-in animation after component mounts
    setIsLoaded(true);
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Extract user metadata
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Farmer';
  const userDistrict = user?.user_metadata?.district || 'Dhaka';

  const handleLogout = () => {
    mockLogout();
  };
  
  const handleAddNewBatch = () => {
    navigate('/dashboard/new-batch');
  };

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  // Calculate stats
  const totalBatches = batches.length;
  const highRiskBatches = batches.filter(b => b.prediction.riskLevel === 'High').length;
  // Simple score calculation: 100 minus 10 points for every high-risk batch
  const farmerScore = totalBatches > 0 ? Math.max(0, 100 - highRiskBatches * 10) : 100;


  // --- Dashboard Components ---

  const StatCard = ({ titleEn, titleBn, value, icon: Icon, className }: { titleEn: string, titleBn: string, value: string | number, icon: React.ElementType, className?: string }) => (
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

  const BatchListItem = ({ batch }: { batch: StoredBatch }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
      navigate(`/dashboard/batch/${batch.id}`);
    };

    const riskLevel = batch.prediction.riskLevel;
    let riskColorClass = 'text-primary';
    let riskTextEn = 'Low Risk';
    let riskTextBn = 'কম ঝুঁকি';

    if (riskLevel === 'Medium') {
      riskColorClass = 'text-harvest-yellow';
      riskTextEn = 'Moderate Risk';
      riskTextBn = 'মাঝারি ঝুঁকি';
    } else if (riskLevel === 'High') {
      riskColorClass = 'text-destructive';
      riskTextEn = 'High Risk';
      riskTextBn = 'উচ্চ ঝুঁকি';
    }

    // Capitalize first letter for display
    const cropTypeDisplay = batch.data.cropType.charAt(0).toUpperCase() + batch.data.cropType.slice(1);

    return (
      <Card 
        className="p-4 shadow-md border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer rounded-xl"
        onClick={handleClick} // Added onClick handler
      >
        <CardContent className="p-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 flex items-center justify-center rounded-full", riskLevel === 'High' ? 'bg-destructive/10' : 'bg-primary/10')}>
              <Wheat className={cn("h-5 w-5", riskColorClass)} />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-foreground">
                {getTranslation(cropTypeDisplay, cropTypeDisplay)} ({batch.data.estimatedWeight} kg)
              </p>
              <p className="text-xs text-muted-foreground">
                {getTranslation("Harvested:", "সংগ্রহের তারিখ:")} {format(batch.data.harvestDate, 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className={cn("text-sm font-bold", riskColorClass)}>
              {getTranslation(riskTextEn, riskTextBn)}
            </p>
            <p className="text-xs text-muted-foreground">
              {getTranslation(`${batch.prediction.etclDays} days left`, `${batch.prediction.etclDays} দিন বাকি`)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BatchList = () => {
    if (batches.length === 0) {
      return (
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
      );
    }

    return (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold text-foreground">
          {getTranslation("Active Batches", "সক্রিয় ব্যাচসমূহ")}
        </h3>
        {batches.map((batch) => (
          <BatchListItem key={batch.id} batch={batch} />
        ))}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="flex flex-col items-center">
        
        {/* Top Header Section (Green Background) */}
        <div className="w-full bg-primary shadow-lg rounded-b-3xl p-4 pb-8">
          <div className="container mx-auto px-0">
            
            {/* Top Bar: Welcome & Notification/Profile */}
            <div className="flex justify-between items-center h-12 mb-4">
              {/* Welcome Text (Requirement 1) */}
              <div className="flex flex-col">
                <h2 className="text-base font-normal text-white">
                  {language === 'en' ? `Welcome, ${userName}` : "শেকড়ে স্বাগতম!"}
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
                value={totalBatches} 
                icon={Wheat} 
                className="rounded-2xl"
              />
              <StatCard 
                titleEn="High Risk" 
                titleBn="উচ্চ ঝুঁকি" 
                value={highRiskBatches} 
                icon={AlertTriangle} 
                className="rounded-2xl"
              />
              <StatCard 
                titleEn="Score" 
                titleBn="স্কোর" 
                value={farmerScore} 
                icon={Ruler} 
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Add New Batch Button Container (Requirement 2: Placement and Animation) */}
        <div className={cn(
          "container mx-auto px-4 w-full max-w-md z-10 transition-all duration-700 ease-out",
          isLoaded ? "opacity-100 translate-y-0 mt-6" : "opacity-0 translate-y-4 mt-6"
        )}>
          <Button 
            onClick={handleAddNewBatch}
            className="w-full h-12 bg-primary text-white shadow-xl hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg font-semibold"
          >
            <Plus className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{getTranslation("Add New Batch", "নতুন ব্যাচ যোগ করুন")}</span>
              <span className="text-xs font-normal opacity-80">{getTranslation("Start monitoring your crops", "আপনার ফসল পর্যবেক্ষণ শুরু করুন")}</span>
            </div>
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 w-full max-w-md">
          
          {/* Batch List / Empty State Card (Requirement 3) */}
          <BatchList />

        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;