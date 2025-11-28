import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, ArrowRight, ArrowLeft, User, Smartphone, MapPin, Ruler, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// --- Schema Definition ---
const signupSchema = z.object({
  nid: z.string().min(10, { message: "NID must be at least 10 digits." }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
  name: z.string().min(2, { message: "Name is required." }),
  district: z.string().min(1, { message: "Please select a district." }),
  farmSize: z.number().min(0.1, { message: "Farm size must be greater than 0." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

// Infographic steps data
const stepsData = [
  {
    icon: "💰",
    titleEn: "Increase Your Income",
    titleBn: "আয় বৃদ্ধি করুন",
    descEn: "Get maximum price by selling crops at the right time.",
    descBn: "সঠিক সময়ে ফসল বিক্রি করে সর্বোচ্চ মূল্য পান।",
  },
  {
    icon: "🌾",
    titleEn: "Reduce Waste",
    titleBn: "অপচয় কমান",
    descEn: "Know before crops spoil and take quick action.",
    descBn: "ফসল নষ্ট হওয়ার আগেই জানুন এবং দ্রুত ব্যবস্থা নিন।",
  },
  {
    icon: "📱",
    titleEn: "Easy to Use",
    titleBn: "সহজ ব্যবহার",
    descEn: "Easily register crops and see results on mobile.",
    descBn: "মোবাইলে সহজেই ফসল নিবন্ধন করুন এবং ফলাফল দেখুন।",
  },
];

const districts = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
];

const SignupInfographicPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const totalSteps = stepsData.length;
  const [showForm, setShowForm] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nid: '',
      mobile: '',
      name: '',
      district: '',
      farmSize: 0,
      password: '',
    },
  });

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getTranslation = (en: string, bn: string) => (language === "en" ? en : bn);

  const handleNext = () => {
    if (current < totalSteps - 1) {
      api?.scrollNext();
    } else {
      // Last step: Show the actual signup form
      setShowForm(true);
    }
  };

  const handlePrevious = () => {
    if (showForm) {
      setShowForm(false);
    } else {
      api?.scrollPrev();
    }
  };

  const isLastStep = current === totalSteps - 1;
  const isFirstStep = current === 0;

  const onSubmit = async (data: SignupFormValues) => {
    const { mobile, password, name, district } = data;
    
    // Supabase uses email/password. We map mobile number to a dummy email for demonstration.
    const email = `${mobile}@harvestguard.com`; 

    const loadingToastId = toast.loading(getTranslation('Registering...', 'নিবন্ধন হচ্ছে...'));

    try {
      // We pass the name and role ('farmer') in the user_metadata to be picked up by the handle_new_user trigger
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            role: 'farmer', // Assuming all signups here are farmers
            district: district,
          }
        }
      });

      if (error) throw error;
      
      toast.success(getTranslation('Registration successful! Please check your email to confirm.', 'নিবন্ধন সফল! নিশ্চিত করতে আপনার ইমেল চেক করুন।'), { id: loadingToastId });
      navigate('/login');
      
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(getTranslation(`Registration failed: ${errorMessage}`, 'নিবন্ধন ব্যর্থ হয়েছে।'), { id: loadingToastId });
    }
  };

  // --- Digital Farmer Score Card ---
  const DigitalFarmerScoreCard = () => (
    <Card className="w-full bg-harvest-yellow/10 border-harvest-yellow/50 shadow-lg">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-harvest-dark">
            {getTranslation("Digital Farmer Score", "ডিজিটাল কৃষক স্কোর")}
          </p>
          <p className="text-xs text-muted-foreground">
            {getTranslation("Registration Progress", "নিবন্ধনের অগ্রগতি")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-harvest-dark">
            0/100
          </div>
          <Ruler className="h-5 w-5 text-harvest-yellow" />
        </div>
      </CardContent>
    </Card>
  );

  // --- Registration Form ---
  const RegistrationForm = () => (
    <Card className="w-full max-w-md p-8 shadow-2xl border-border/50">
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {getTranslation("Farmer Registration", "কৃষক নিবন্ধন")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {getTranslation("Enter your details to join HarvestGuard", "হারভেস্টগার্ডে যোগ দিতে আপনার বিবরণ লিখুন")}
          </p>
        </div>

        <DigitalFarmerScoreCard />

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* NID Input */}
          <div className="space-y-2">
            <Label htmlFor="nid" className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-primary" />
              {getTranslation("National ID Number (NID)", "জাতীয় পরিচয়পত্র নম্বর (NID)")}
            </Label>
            <Input
              id="nid"
              placeholder={getTranslation("1234567890", "১২৩৪৫৬৭৮৯০")}
              {...form.register('nid')}
              className="bg-muted/50"
            />
            {form.formState.errors.nid && (
              <p className="text-xs text-destructive">
                {form.formState.errors.nid.message}
              </p>
            )}
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-primary" />
              {getTranslation("Name", "নাম")}
            </Label>
            <Input
              id="name"
              placeholder={getTranslation("Enter your name", "আপনার নাম লিখুন")}
              {...form.register('name')}
              className="bg-muted/50"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mobile Number Input */}
          <div className="space-y-2">
            <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-medium">
              <Smartphone className="h-4 w-4 text-primary" />
              {getTranslation("Mobile Number", "মোবাইল নম্বর")}
            </Label>
            <Input
              id="mobile"
              placeholder={getTranslation("01712345678", "০১৭১২৩৪৫৬৭৮")}
              {...form.register('mobile')}
              className="bg-muted/50"
            />
            {form.formState.errors.mobile && (
              <p className="text-xs text-destructive">
                {form.formState.errors.mobile.message}
              </p>
            )}
          </div>

          {/* District Select */}
          <div className="space-y-2">
            <Label htmlFor="district" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              {getTranslation("District", "জেলা")}
            </Label>
            <Select onValueChange={(value) => form.setValue('district', value, { shouldValidate: true })} value={form.watch('district')}>
              <SelectTrigger className="w-full bg-muted/50">
                <SelectValue placeholder={getTranslation("Select District", "জেলা নির্বাচন করুন")} />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.district && (
              <p className="text-xs text-destructive">
                {form.formState.errors.district.message}
              </p>
            )}
          </div>

          {/* Farm Size Input */}
          <div className="space-y-2">
            <Label htmlFor="farmSize" className="flex items-center gap-2 text-sm font-medium">
              <Ruler className="h-4 w-4 text-primary" />
              {getTranslation("Farm Size (acres)", "জমির পরিমাণ (একর)")}
            </Label>
            <Input
              id="farmSize"
              type="number"
              step="0.1"
              placeholder="2.5"
              {...form.register('farmSize', { valueAsNumber: true })}
              className="bg-muted/50"
            />
            {form.formState.errors.farmSize && (
              <p className="text-xs text-destructive">
                {form.formState.errors.farmSize.message}
              </p>
            )}
          </div>

          {/* Password Input (for Supabase Auth) */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Smartphone className="h-4 w-4 text-primary" />
              {getTranslation("Set Password", "পাসওয়ার্ড সেট করুন")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={getTranslation("Minimum 6 characters", "কমপক্ষে ৬ অক্ষর")}
              {...form.register('password')}
              className="bg-muted/50"
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-lg font-semibold h-12 mt-6">
            {getTranslation("Complete Registration", "নিবন্ধন সম্পন্ন করুন")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // --- Main Render ---
  return (
    <div
      className="flex min-h-screen flex-col items-center"
      style={{
        // Replicating the green gradient background
        background: "linear-gradient(180deg, hsl(160 100% 37%) 0%, hsl(160 100% 23%) 100%)",
      }}
    >
      {/* Header */}
      <header className="w-full py-4 px-4 bg-primary">
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              {getTranslation("HarvestGuard", "হারভেস্টগার্ড")}
            </h1>
          </div>
          <p className="text-sm text-primary-foreground/80">
            {getTranslation(showForm ? "Farmer Registration" : "Crop Protection System", showForm ? "কৃষক নিবন্ধন" : "ফসল সুরক্ষা সিস্টেম")}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex flex-grow items-center justify-center py-12">
        {showForm ? (
          <RegistrationForm />
        ) : (
          <Carousel setApi={setApi} opts={{ align: "start" }} className="w-full max-w-md">
            <CarouselContent>
              {stepsData.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="p-4">
                    <Card className="flex h-[400px] flex-col items-center justify-center p-8 text-center shadow-2xl">
                      <div className="mb-6 text-6xl">{step.icon}</div>
                      
                      <h2 className="mb-1 text-xl font-bold text-primary">
                        {getTranslation(step.titleEn, step.titleBn)}
                      </h2>
                      <p className="mb-6 text-sm text-muted-foreground">
                        {getTranslation(step.titleEn, step.titleBn)}
                      </p>

                      <p className="text-lg font-medium text-foreground">
                        {getTranslation(step.descEn, step.descBn)}
                      </p>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Footer Navigation and Pagination */}
      <footer className="w-full py-6 px-4">
        <div className="container mx-auto flex max-w-md flex-col items-center gap-4">
          {/* Pagination Dots (Only show if not on form) */}
          {!showForm && (
            <div className="flex gap-2">
              {stepsData.map((_, index) => (
                <div
                  key={index}
                  className={
                    "h-2 rounded-full transition-all duration-300 " +
                    (current === index
                      ? "w-8 bg-white"
                      : "w-2 bg-green-300/50")
                  }
                />
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex w-full gap-4">
            <Button
              onClick={handlePrevious}
              disabled={!showForm && isFirstStep}
              variant="outline"
              className="flex-1 border-white/40 bg-white/20 text-white hover:bg-white/30 disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getTranslation("Previous", "পূর্ববর্তী")}
            </Button>

            <Button
              onClick={showForm ? form.handleSubmit(onSubmit) : handleNext}
              className="flex-1 bg-white text-primary hover:bg-gray-100"
              type={showForm ? "submit" : "button"}
            >
              {showForm
                ? getTranslation("Complete Registration", "নিবন্ধন সম্পন্ন করুন")
                : isLastStep
                ? getTranslation("Start Registration", "নিবন্ধন শুরু করুন")
                : getTranslation("Next", "পরবর্তী")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupInfographicPage;