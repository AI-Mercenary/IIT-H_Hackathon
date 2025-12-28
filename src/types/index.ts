export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface WorkoutContextData {
  stressStart: number | '';
  energy: number | '';
  sleep: number | '';
  notes: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  duration: string;
  focus: string;
  exercises: string[];
  coachMessage: string;
  whyThisWorkout: string;
}

export interface DietContextData {
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | '';
  hungerLevel: number | '';
  timeAvailable: number | '';
}

export interface MealPlan {
  mainMeal: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: string[];
  };
  alternatives: string[];
  shoppingList: string[];
}

export interface ProgressData {
  date: string;
  workoutCompleted: boolean;
  caloriesConsumed: number;
  streak: number;
  consistency: number;
}

export interface DashboardStats {
  currentStreak: number;
  consistencyScore: number;
  workoutsThisWeek: number;
  weeklyProgress: number[];
}

export interface UserProfile {
  basicInfo: {
    age: number;
    gender: string;
    height: number; // cm
    weight: number; // kg
    phoneNumber?: string;
    avatarUrl?: string;
  };
  fitnessProfile: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    primaryGoal: 'lose_weight' | 'gain_muscle' | 'endurance' | 'flexibility';
    targetWeight: number;
    weeklyWorkoutDays: number;
    sessionDuration: number;
  };
  equipment: {
    bodyweight: boolean;
    dumbbells: boolean;
    barbell: boolean;
    cardio: boolean;
    yogaMat: boolean;
    runningShoes: boolean;
  };
  healthConstraints: {
    injuries: { location: string; severity: number }[]; // severity 1-10
    conditions: string[];
    recoveryFocus: 'active' | 'passive' | 'none';
  };
  nutritionPreferences: {
    dietaryRestrictions: string[];
    dietType: 'balanced' | 'low_carb' | 'keto' | 'vegetarian' | 'vegan' | 'paleo';
    calorieTarget: number;
    mealsPerDay: number;
    proteinPreference: 'low' | 'moderate' | 'high';
  };
  schedulePreferences: {
    preferredTime: 'morning' | 'afternoon' | 'evening';
    restDays: string[];
  };
  completedWizard: boolean;
}
