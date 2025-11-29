import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Phone, Lock, Wheat, Briefcase, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/contexts/SessionContext';
import { mockDb } from '@/lib/mockDb';
import { type MockUser } from '@/contexts/SessionContext';

// --- Schema Definition ---
const loginSchema = z.object({
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['farmer', 'executive'], {
    errorMap: () => ({ message: "Please select a role." }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// --- Role Definitions ---
const roles = [
  { 
    key: 'farmer', 
    icon: Wheat, 
    titleEn: 'Farmer', 
    titleBn: 'কৃষক',
    descEn: 'Cultivator',
    descBn: 'চাষী',
  },
  { 
    key: 'executive', 
    icon: Briefcase, 
    titleEn: 'Executive', 
    titleBn: 'নির্বাহী',
    descEn: 'Manager',
    descBn: 'কর্মকর্তা',
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { mockLogin } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: '',
      role: 'farmer',
    },
  });

  const selectedRole = form.watch('role');

  const handleRoleSelect = (role: LoginFormValues['role']) => {
    form.setValue('role', role, { shouldValidate: true });
  };

  const onSubmit = async (data: LoginFormValues) => {
    const { mobile, password } = data;
    
    const loadingToastId = toast.loading(language === 'en' ? 'Signing In...' : 'সাইন ইন হচ্ছে...');

    const userProfile = mockDb.getUserByMobile(mobile);

    // In a real app, you'd compare hashed passwords
    if (userProfile && userProfile.password_hash === password) {
      toast.success(language === 'en' ? 'Login successful!' : 'লগইন সফল!', { id: loadingToastId });
      
      const userForSession: MockUser = {
        id: userProfile.id,
        email: `${userProfile.mobile}@shekor.com`,
        user_metadata: userProfile.user_metadata,
      };
      mockLogin(userForSession);
    } else {
      toast.error(language === 'en' ? 'Authentication failed: Invalid credentials.' : 'প্রমাণীকরণ ব্যর্থ হয়েছে।', { id: loadingToastId });
    }
  };

  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  return (
    <div 
      className="min-h-screen flex flex-col items-center"
      style={{ 
        background: 'linear-gradient(135deg, hsl(130 40% 98%) 0%, hsl(130 40% 90%) 50%, hsl(130 40% 99%) 100%)',
      }}
    >
      <header className="sticky top-0 z-10 w-full bg-primary shadow-md">
        <div className="container mx-auto flex h-[68px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">
              {getTranslation("Shekor", "শেকড়")}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {getTranslation("Back", "ফিরে যান")}
          </Button>
        </div>
      </header>

      <div className="container mx-auto flex justify-center py-12">
        <Card className="w-full max-w-md p-8 shadow-2xl border-border/50">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg">
                <Sprout className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {getTranslation("Welcome Back", "স্বাগতম")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {getTranslation("Sign in to access your dashboard", "আপনার ড্যাশবোর্ড অ্যাক্সেস করতে সাইন ইন করুন")}
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-center block">
                  <span className="text-sm font-medium text-foreground block">
                    {getTranslation("Select Your Role", "আপনার ভূমিকা নির্বাচন করুন")}
                  </span>
                </Label>
                <div className="flex justify-between gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.key}
                      type="button"
                      onClick={() => handleRoleSelect(role.key as LoginFormValues['role'])}
                      className={
                        'flex flex-col items-center justify-center p-4 w-1/2 rounded-xl transition-all duration-200 ' +
                        (selectedRole === role.key
                          ? 'bg-primary text-primary-foreground shadow-lg border-2 border-primary'
                          : 'bg-background text-foreground border border-border hover:bg-secondary/50')
                      }
                    >
                      <role.icon className="h-6 w-6 mb-1" />
                      <span className="text-xs font-semibold">
                        {getTranslation(role.titleEn, role.titleBn)}
                      </span>
                      <span className="text-[10px] opacity-80">
                        {getTranslation(role.descEn, role.descBn)}
                      </span>
                    </button>
                  ))}
                </div>
                {form.formState.errors.role && (
                  <p className="text-xs text-destructive text-center">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  <span className="text-sm font-medium text-foreground block">
                    {getTranslation("Mobile Number", "মোবাইল নম্বর")}
                  </span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="mobile"
                    placeholder={getTranslation("01XXXXXXXXX", "০১৮XXXXXXXX")}
                    {...form.register('mobile')}
                    className="pl-10 bg-muted/50"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                {form.formState.errors.mobile && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.mobile.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <span className="text-sm font-medium text-foreground block">
                    {getTranslation("Password", "পাসওয়ার্ড")}
                  </span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={getTranslation("Enter password", "পাসওয়ার্ড লিখুন")}
                    {...form.register('password')}
                    className="pl-10 bg-muted/50"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <Button variant="link" type="button" className="h-auto p-0 text-primary hover:text-primary/80 text-sm">
                  {getTranslation("Forgot password?", "পাসওয়ার্ড ভুলে গেছেন?")}
                </Button>
              </div>

              <Button type="submit" className="w-full text-lg font-semibold h-10">
                {getTranslation("Sign In", "সাইন ইন")}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {getTranslation("Don't have an account?", "অ্যাকাউন্ট নেই?")}
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate('/signup')}
                className="h-auto p-0 text-primary hover:text-primary/80 text-sm font-semibold mt-1"
              >
                {getTranslation("Sign Up", "সাইন আপ করুন")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;