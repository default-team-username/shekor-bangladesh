import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/contexts/SessionContext';
import { Trophy, Star, Diamond, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const BadgeDisplay: React.FC = () => {
  const { language } = useLanguage();
  const { currentBadge } = useSession();
  const getTranslation = (en: string, bn: string) => (language === 'en' ? en : bn);

  if (!currentBadge) {
    return (
      <div className="flex items-center justify-center gap-1 text-xs font-medium text-white/70">
        <Shield className="h-3 w-3" />
        {getTranslation("No Badge Yet", "কোন ব্যাজ নেই")}
      </div>
    );
  }

  let Icon: React.ElementType = Trophy;
  let badgeColorClass = 'text-gray-300'; // Default for Bronze/Low tier

  switch (currentBadge.key) {
    case 'Bronze':
      Icon = Trophy;
      badgeColorClass = 'text-amber-400';
      break;
    case 'Silver':
      Icon = Star;
      badgeColorClass = 'text-slate-300';
      break;
    case 'Gold':
      Icon = Diamond;
      badgeColorClass = 'text-yellow-500';
      break;
    case 'Platinum':
      Icon = Zap;
      badgeColorClass = 'text-cyan-300';
      break;
    case 'Master':
      Icon = Shield;
      badgeColorClass = 'text-red-500';
      break;
  }

  return (
    <div className="flex items-center justify-center gap-1 text-sm font-semibold text-white">
      <Icon className={cn("h-4 w-4", badgeColorClass)} fill={badgeColorClass} />
      <span className={badgeColorClass}>
        {getTranslation(currentBadge.en, currentBadge.bn)}
      </span>
    </div>
  );
};

export default BadgeDisplay;