import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, ArrowLeft, User, Smartphone, MapPin, Ruler, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
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

const districts = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
];

const SignupInfographicPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  // Function to calculate and set progress based on current form values
  const calculateProgress = () => {
    const values = form.getValues();
    const fields = Object.values(values);
    
    const filledFields = fields.filter(field => {
        if (typeof field === 'string') {
            return field.trim() !== '' && field.trim() !== '0';
        }
        // Check for farmSize specifically
        if (typeof field === 'number') {
            return field > 0;
        }
        return field !== undefined && field !== null;
    }).length;
    
    const totalFields = fields.length;
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };
  
  // Watch all fields for changes to update progress
  useEffect(() => {
    const subscription = form.watch(() => {
      calculateProgress();
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);


  const getTranslation = (en: string, bn: string) => (language === "en" ? en : bn);

  const onSubmit = async (data: SignupFormValues) => {
    const { mobile, password, name, district, farmSize, nid } = data;
    
    // Supabase uses email/password. We map mobile number to a dummy email for demonstration.
    const email = `${mobile}@harvestguard.com`; 

    const loadingToastId = toast.loading(getTranslation('Registering...', 'নিবন্ধন হচ্ছে...'));

    try {
      // We pass the required farmer data in the user_metadata to be picked up by the handle_new_farmer trigger
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'farmer', 
            district: district,
            nid: nid,
            mobile: mobile,
            farm_size: farmSize,
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

  // Handle Enter key press to move to next field or submit
  const handleKeyDown = (e: React.KeyboardEvent, nextField: string | null = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        // Find the next input element and focus it
        const nextInput = document.getElementById(nextField);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        // If no next field, submit the form
        form.handleSubmit(onSubmit)();
      }
    }
  };

  // --- Digital Farmer Score Card ---
  const DigitalFarmerScoreCard = () => (
    <Card 
      className="w-full p-4 shadow-lg"
      style={{ 
        background: 'linear-gradient(90deg, #FFFBEB 0%, #FFF7ED 100%)',
        border: '0.8px solid #FEE685',
        borderRadius: '14px',
      }}
    >
      <CardContent className="p-0 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          {/* Left side: Titles */}
          <div className="flex flex-col">
            <p className="text-sm font-normal text-[#4A5565] leading-tight">
              {getTranslation("Digital Farmer Score", "ডিজিটাল কৃষক স্কোর")}
            </p>
            <p className="text-xs text-[#6A7282] leading-tight">
              {getTranslation("Complete your profile to unlock benefits", "সুবিধাগুলি আনলক করতে আপনার প্রোফাইল সম্পূর্ণ করুন")}
            </p>
          </div>
          
          {/* Right side: Score */}
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#BB4D00]" />
            <span className="text-base font-normal text-[#BB4D00]">{progress}%</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FFB900 0%, #FF6900 100%)',
            }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );

  // --- Registration Form ---
  const RegistrationForm = () => (
    <Card className="w-full max-w-md p-8 shadow-2xl border-border/50">
      <CardContent className="p-0">
        <form 
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
        >
          <DigitalFarmerScoreCard />

          <div className="space-y-4">
            {/* NID Input - Only numbers allowed */}
            <div className="space-y-2">
              <Label htmlFor="nid" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <CreditCard className="h-4 w-4 text-primary" />
                {getTranslation("National ID Number (NID)", "জাতীয় পরিচয়পত্র নম্বর (NID)")}
              </Label>
              <Input
                id="nid"
                type="text"
                inputMode="numeric"
                placeholder={getTranslation("1234567890", "১২৩৪৫৬৭৮৯০")}
                {...form.register('nid')}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  form.setValue('nid', value, { shouldValidate: true });
                }}
                onFocus={() => setActiveField('nid')}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => handleKeyDown(e, 'name')}
                className={`bg-[#F3F3F5] h-9 text-sm ${activeField === 'nid' ? 'ring-2 ring-primary' : ''}`}
              />
              {form.formState.errors.nid && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.nid.message}
                </p>
              )}
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <User className="h-4 w-4 text-primary" />
                {getTranslation("Name", "নাম")}
              </Label>
              <Input
                id="name"
                placeholder={getTranslation("Enter your name", "আপনার নাম লিখুন")}
                {...form.register('name')}
                onFocus={() => setActiveField('name')}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => handleKeyDown(e, 'mobile')}
                className={`bg-[#F3F3F5] h-9 text-sm ${activeField === 'name' ? 'ring-2 ring-primary' : ''}`}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Mobile Number Input - Only numbers allowed */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <Smartphone className="h-4 w-4 text-primary" />
                {getTranslation("Mobile Number", "মোবাইল নম্বর")}
              </Label>
              <Input
                id="mobile"
                type="text"
                inputMode="numeric"
                placeholder={getTranslation("01712345678", "০১৭১২৩৪৫৬৭৮")}
                {...form.register('mobile')}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  form.setValue('mobile', value, { shouldValidate: true });
                }}
                onFocus={() => setActiveField('mobile')}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => handleKeyDown(e, 'district')}
                className={`bg-[#F3F3F5] h-9 text-sm ${activeField === 'mobile' ? 'ring-2 ring-primary' : ''}`}
              />
              {form.formState.errors.mobile && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.mobile.message}
                </p>
              )}
            </div>

            {/* District Select */}
            <div className="space-y-2">
              <Label htmlFor="district" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <MapPin className="h-4 w-4 text-primary" />
                {getTranslation("District", "জেলা")}
              </Label>
              <Select 
                onValueChange={(value) => {
                  form.setValue('district', value, { shouldValidate: true });
                  setActiveField(null);
                }} 
                value={form.watch('district') || ''}
              >
                <SelectTrigger 
                  id="district"
                  className={`w-full bg-[#F3F3F5] h-9 text-sm ${activeField === 'district' ? 'ring-2 ring-primary' : ''}`}
                  onFocus={() => setActiveField('district')}
                  onBlur={() => setActiveField(null)}
                >
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
              <Label htmlFor="farmSize" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <Ruler className="h-4 w-4 text-primary" />
                {getTranslation("Farm Size (acres)", "জমির পরিমাণ (একর)")}
              </Label>
              <Input
                id="farmSize"
                type="number"
                step="0.1"
                placeholder="2.5"
                {...form.register('farmSize', { valueAsNumber: true })}
                onFocus={() => setActiveField('farmSize')}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => handleKeyDown(e, 'password')}
                className={`bg-[#F3F3F5] h-9 text-sm ${activeField === 'farmSize' ? 'ring-2 ring-primary' : ''}`}
              />
              <p className="text-xs text-[#6A7282] mt-1">
                {getTranslation("Enter the total size of your farm land in acres.", "আপনার মোট জমির পরিমাণ একরে লিখুন।")}
              </p>
              {form.formState.errors.farmSize && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.farmSize.message}
                </p>
              )}
            </div>

            {/* Password Input (for Supabase Auth) */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm font-normal text-[#0A0A0A]">
                <Lock className="h-4 w-4 text-primary" />
                {getTranslation("Set Password", "পাসওয়ার্ড সেট করুন")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={getTranslation("Minimum 6 characters", "কমপক্ষে ৬ অক্ষর")}
                {...form.register('password')}
                onFocus={() => setActiveField('password')}
                onBlur={() => setActiveField(null)}
                onKeyDown={(e) => handleKeyDown(e)}
                className={`bg-[#F3F3F5] h-9 text-sm ${activeField === 'password' ? 'ring-2 ring-primary' : ''}`}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full text-base font-normal h-12 mt-6 bg-[#009966] hover:bg-[#008055]"
          >
            {getTranslation("Complete Registration", "নিবন্ধন সম্পন্ন করুন")}
          </Button>
        </form>
        
        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {getTranslation("Already have an account?", "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?")}
          </p>
          <Button 
            variant="link" 
            onClick={() => navigate('/login')}
            className="h-auto p-0 text-primary hover:text-primary/80 text-sm font-semibold mt-1"
          >
            {getTranslation("Sign In", "সাইন ইন")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // --- Main Render ---
  return (
    <div
      className="flex min-h-screen flex-col items-center"
      style={{
        // Approximating linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)
        background: "linear-gradient(180deg, hsl(130 40% 98%) 0%, hsl(0 0% 100%) 100%)",
      }}
    >
      {/* Header */}
      <header 
        className="w-full py-4 px-4 shadow-md"
        style={{ background: '#009966' }} // Using specific color for header
      >
        <div className="container mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">
              {getTranslation("HarvestGuard", "হারভেস্টগার্ড")}
            </h1>
          </div>
          <p className="text-sm text-[#D0FAE5] mt-1">
            {getTranslation("Farmer Registration", "কৃষক নিবন্ধন")}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex flex-grow items-center justify-center py-12">
        <RegistrationForm />
      </div>

      {/* Footer Navigation (Removed carousel navigation) */}
      <footer className="w-full py-4 px-4">
        <div className="container mx-auto flex max-w-md justify-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-primary hover:bg-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getTranslation("Back to Home", "হোমে ফিরে যান")}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SignupInfographicPage;