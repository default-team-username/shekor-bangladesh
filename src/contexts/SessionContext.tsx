import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { toast } from 'sonner';

// --- New types and constants for scoring ---
type BadgeKey = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Master';

const BADGE_THRESHOLDS: { score: number; key: BadgeKey; en: string; bn: string }[] = [
  { score: 1000, key: 'Bronze', en: 'Bronze', bn: 'ব্রোঞ্জ' },
  { score: 2000, key: 'Silver', en: 'Silver', bn: 'সিলভার' },
  { score: 3000, key: 'Gold', en: 'Gold', bn: 'গোল্ড' },
  { score: 4000, key: 'Platinum', en: 'Platinum', bn: 'প্লাটিনাম' },
  { score: 5000, key: 'Master', en: 'Master', bn: 'মাস্টার' },
];

// Helper to determine the current highest badge
const getCurrentBadge = (score: number): { score: number; key: BadgeKey; en: string; bn: string } | null => {
  // Sort descending to find the highest earned badge
  const sortedThresholds = [...BADGE_THRESHOLDS].sort((a, b) => b.score - a.score);
  const earnedBadge = sortedThresholds.find(b => score >= b.score);
  return earnedBadge || null;
};

// --- Mock Types for Prototyping ---
interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    district: string;
    role: string;
    totalScore: number; // Added
    earnedBadges: BadgeKey[]; // Added
    [key: string]: any;
  };
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

interface SessionContextType {
  session: MockSession | null;
  user: MockUser | null;
  isLoading: boolean;
  mockLogin: (userData: MockUser) => void;
  mockLogout: () => void;
  updateScore: (points: number) => void; // Added
  currentBadge: { score: number; key: BadgeKey; en: string; bn: string } | null; // Added
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);
const MOCK_SESSION_KEY = 'mock_session';

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<MockSession | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Calculate current badge based on user score
  const currentBadge = user ? getCurrentBadge(user.user_metadata.totalScore) : null;

  // Function to show the milestone popup
  const showMilestonePopup = (badgeKey: BadgeKey) => {
    const badge = BADGE_THRESHOLDS.find(b => b.key === badgeKey);
    if (!badge) return;

    const badgeName = language === 'en' ? badge.en : badge.bn;
    const message = language === 'en' 
      ? `Congratulations! You earned the ${badgeName} badge.` 
      : `অভিনন্দন! আপনি ${badgeName} ব্যাজ অর্জন করেছেন।`;

    toast.success(message, { 
      duration: 4000,
      style: { 
        background: 'hsl(130 45% 35%)', 
        color: 'white', 
        border: '1px solid white' 
      },
      icon: '🏆'
    });
  };

  const updateScore = (points: number) => {
    setUser(prevUser => {
      if (!prevUser) return null;

      const oldScore = prevUser.user_metadata.totalScore;
      const newScore = oldScore + points;
      const newEarnedBadges = [...prevUser.user_metadata.earnedBadges];
      
      let newlyEarnedBadgeKey: BadgeKey | null = null;

      // Check for new badge milestones
      BADGE_THRESHOLDS.forEach(badge => {
        if (newScore >= badge.score && oldScore < badge.score && !prevUser.user_metadata.earnedBadges.includes(badge.key)) {
          newEarnedBadges.push(badge.key);
          newlyEarnedBadgeKey = badge.key; // Track the newly earned badge
        }
      });
      
      const updatedUser: MockUser = {
        ...prevUser,
        user_metadata: {
          ...prevUser.user_metadata,
          totalScore: newScore,
          earnedBadges: newEarnedBadges,
        }
      };
      
      const updatedSession: MockSession = {
        ...session!,
        user: updatedUser,
      };

      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(updatedSession));
      
      // Trigger popup if a new badge was earned
      if (newlyEarnedBadgeKey) {
        showMilestonePopup(newlyEarnedBadgeKey);
      }

      return updatedUser;
    });
  };

  const mockLogin = (userData: MockUser) => {
    // Ensure score and badges are initialized if missing (Default +100 on signup)
    const initialScore = userData.user_metadata.totalScore ?? 100; 
    const initialBadges = userData.user_metadata.earnedBadges ?? [];
    
    const userWithScore: MockUser = {
      ...userData,
      user_metadata: {
        ...userData.user_metadata,
        totalScore: initialScore,
        earnedBadges: initialBadges,
      }
    };

    const mockSession: MockSession = {
      user: userWithScore,
      access_token: 'mock_token_123',
    };
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockSession));
    setSession(mockSession);
    setUser(userWithScore);
    navigate('/dashboard');
  };

  const mockLogout = () => {
    localStorage.removeItem(MOCK_SESSION_KEY);
    setSession(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    // Load initial session from local storage
    const storedSession = localStorage.getItem(MOCK_SESSION_KEY);
    if (storedSession) {
      try {
        const parsedSession: MockSession = JSON.parse(storedSession);
        
        // Ensure score and badges are initialized upon loading
        const userMetadata = parsedSession.user.user_metadata;
        userMetadata.totalScore = userMetadata.totalScore ?? 100;
        userMetadata.earnedBadges = userMetadata.earnedBadges ?? [];
        
        setSession(parsedSession);
        setUser(parsedSession.user);
      } catch (e) {
        console.error("Failed to parse mock session:", e);
        localStorage.removeItem(MOCK_SESSION_KEY);
      }
    }
    setIsLoading(false);

    // Handle initial redirect logic
    const currentPath = window.location.pathname;
    const isAuthenticated = !!storedSession;

    if (isAuthenticated && (currentPath === '/login' || currentPath === '/signup' || currentPath === '/')) {
      navigate('/dashboard');
    } else if (!isAuthenticated && currentPath !== '/login' && currentPath !== '/' && currentPath !== '/signup') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, user, isLoading, mockLogin, mockLogout, updateScore, currentBadge }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};