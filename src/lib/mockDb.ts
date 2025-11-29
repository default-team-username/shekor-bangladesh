import { type BadgeKey } from '@/contexts/SessionContext';

// --- Types ---
export interface UserProfile {
  id: string;
  nid: string;
  mobile: string;
  name: string;
  district: string;
  farmSize: number;
  password_hash: string; // In a real app, this would be a secure hash
  // For session context compatibility
  user_metadata: {
    name: string;
    district: string;
    role: string;
    totalScore: number;
    earnedBadges: BadgeKey[];
  };
}

// This type matches the signup form data
export interface NewUserProfileData {
  nid: string;
  mobile: string;
  name: string;
  district: string;
  farmSize: number;
  password: string;
}

interface MockDatabase {
  users: Record<string, UserProfile>; // Keyed by mobile number
  apiKeys: Record<string, string>;
}

const DB_KEY = 'shekor_mock_db';

// --- Private Functions ---

const getDb = (): MockDatabase => {
  if (typeof window === 'undefined') {
    return { users: {}, apiKeys: {} };
  }
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      return JSON.parse(dbString);
    }
  } catch (e) {
    console.error("Failed to parse mock DB:", e);
  }
  // Default initial state with placeholder API keys
  return {
    users: {},
    apiKeys: {
      weather: import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY',
      gemini: 'YOUR_GEMINI_API_KEY_PLACEHOLDER',
      elevenlabs: 'YOUR_ELEVENLABS_API_KEY_PLACEHOLDER',
    },
  };
};

const saveDb = (db: MockDatabase) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
};

// --- Public API ---

export const mockDb = {
  // User Management
  getUserByMobile: (mobile: string): UserProfile | null => {
    const db = getDb();
    return db.users[mobile] || null;
  },

  addUser: (profileData: NewUserProfileData): UserProfile => {
    const db = getDb();
    if (db.users[profileData.mobile]) {
      throw new Error('User with this mobile number already exists.');
    }
    const id = `user_${Date.now()}`;
    const newUser: UserProfile = {
      nid: profileData.nid,
      mobile: profileData.mobile,
      name: profileData.name,
      district: profileData.district,
      farmSize: profileData.farmSize,
      password_hash: profileData.password, // Storing plain text for mock purposes
      id,
      // For compatibility with existing SessionContext structure
      user_metadata: {
        name: profileData.name,
        district: profileData.district,
        role: 'farmer',
        totalScore: 100,
        earnedBadges: [],
      }
    };
    db.users[profileData.mobile] = newUser;
    saveDb(db);
    return newUser;
  },

  // API Key Management
  getApiKey: (keyName: string): string | null => {
    const db = getDb();
    return db.apiKeys[keyName] || null;
  },

  setApiKey: (keyName: string, keyValue: string): void => {
    const db = getDb();
    db.apiKeys[keyName] = keyValue;
    saveDb(db);
  },

  getAllApiKeys: (): Record<string, string> => {
    const db = getDb();
    return db.apiKeys;
  },
};

// Initialize DB on first load if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem(DB_KEY)) {
  saveDb(getDb());
}