import * as z from 'zod';

// --- Schema Definition ---
export const batchSchema = z.object({
  cropType: z.string().min(1, { message: "Crop type is required." }),
  estimatedWeight: z.number().min(1, { message: "Weight must be greater than 0 kg." }),
  harvestDate: z.date({ required_error: "Harvest date is required." }),
  storageLocation: z.string().min(1, { message: "Storage location is required." }),
  storageMethod: z.string().min(1, { message: "Storage method is required." }),
  storageTemperature: z.number().min(0, { message: "Temperature must be non-negative." }),
  moistureLevel: z.number().min(0).max(100, { message: "Moisture must be between 0 and 100." }),
});

export type BatchFormValues = z.infer<typeof batchSchema>;

// --- Data Definitions ---
export const cropTypes = [
  { key: 'paddy', en: 'Paddy/Rice', bn: 'ধান/চাল' },
  { key: 'wheat', en: 'Wheat', bn: 'গম' },
  { key: 'maize', en: 'Maize', bn: 'ভুট্টা' },
];

export const storageMethods = [
  { key: 'jute_bag_stack', en: 'Jute Bag Stack', bn: 'পাটের বস্তার স্তূপ' },
  { key: 'silo', en: 'Silo', bn: 'সাইলো' },
  { key: 'open_area', en: 'Open Area', bn: 'খোলা জায়গা' },
];

export const districts = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
];

// --- Prediction Types ---
export interface PredictionResult {
  etclDays: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  guidanceEn: string;
  guidanceBn: string;
}