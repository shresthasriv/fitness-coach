// User Form Types
export interface UserFormData {
  // Basic Info
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number; // in cm
  weight: number; // in kg

  // Fitness Details
  fitnessGoal: "weight_loss" | "muscle_gain" | "general_fitness" | "endurance" | "flexibility";
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  workoutLocation: "home" | "gym" | "outdoor";

  // Diet Preferences
  dietaryPreference: "vegetarian" | "non_vegetarian" | "vegan" | "keto";

  // Optional Fields
  medicalHistory?: string;
  stressLevel?: "low" | "medium" | "high";
}

// Workout Plan Types
export interface Exercise {
  name: string;
  sets: number;
  reps: string; // Can be "10-12" or "30 seconds"
  rest: string; // e.g., "60 seconds"
  instructions: string;
  muscleGroup?: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
  totalDuration: string;
}

export interface WorkoutPlan {
  workouts: DailyWorkout[];
  weeklySchedule: string;
}

// Diet Plan Types
export interface Meal {
  name: string;
  items: string[];
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  instructions?: string;
}

export interface DailyDiet {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

export interface DietPlan {
  dailyCalories: string;
  dailyProtein: string;
  meals: DailyDiet;
  hydration: string;
  notes: string;
}

// Complete AI Generated Plan
export interface FitnessPlan {
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  tips: {
    lifestyle: string[];
    posture: string[];
    recovery: string[];
  };
  motivation: string;
  generatedAt: string;
  userData: UserFormData;
}

// Local Storage Types
export interface SavedPlan {
  id: string;
  plan: FitnessPlan;
  savedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  type: "exercise" | "meal";
}

// Text to Speech Types
export interface TTSRequest {
  text: string;
  voice?: string;
}
