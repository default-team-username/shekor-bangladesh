import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Cloud, Map, Camera, Mic, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

// Define the structure for a navigation item
interface NavItem {
  path: string;
  icon: LucideIcon;
  labelEn: string;
  labelBn: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: Home, labelEn: 'Home', labelBn: 'ড্যাশবোর্ড' },
  { path: '/dashboard/weather', icon: Cloud, labelEn: 'Weather', labelBn: 'আবহাওয়া' },
  { path: '/dashboard/map', icon: Map, labelEn: 'Map', labelBn: 'মানচিত্র' },
  { path: '/dashboard/camera', icon: Camera, labelEn: 'Camera', labelBn: 'ক্যামেরা' },
  { path: '/dashboard/voice', icon: Mic, labelEn: 'Voice', labelBn: 'ভয়েস' },
];

const BottomNavBar = () => {
  const { language } = useLanguage();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-border bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-600")} />
                <span className={cn("mt-1 text-[10px] font-medium", isActive ? "text-primary" : "text-gray-600")}>
                  {getTranslation(item.labelEn, item.labelBn)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;