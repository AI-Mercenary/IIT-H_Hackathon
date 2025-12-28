import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkoutPlan, MealPlan, DashboardStats, ProgressData } from '../types';



interface PlanContext {
    [key: string]: any;
}

interface AppContextState {
    latestWorkout: WorkoutPlan | null;
    latestDiet: MealPlan | null;
    isLoading: boolean;
    error: string | null;
}

interface AppDataContextType extends AppContextState {
    generateWorkoutPlan: (context?: PlanContext) => Promise<void>;
    generateMealPlan: (context?: PlanContext) => Promise<void>;
    dashboardStats: DashboardStats;
    progressHistory: ProgressData[];
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Mock Data
const MOCK_WORKOUT: WorkoutPlan = {
    id: 'w1',
    title: 'High Intensity Interval Training',
    duration: '30 mins',
    focus: 'Cardio & Core',
    exercises: ['Burpees - 3x15', 'Mountain Climbers - 3x40s', 'Plank - 3x60s', 'Squat Jumps - 3x15'],
    coachMessage: "Since your energy is high today, let's push for intensity!",
    whyThisWorkout: "This routine adapts to your high energy and low stress levels reported today.",
};

const MOCK_MEAL: MealPlan = {
    mainMeal: {
        name: 'Grilled Salmon Quinoa Bowl',
        calories: 650,
        protein: 45,
        carbs: 50,
        fats: 25,
        ingredients: ['Salmon Fillet', 'Quinoa', 'Avocado', 'Spinach', 'Lemon Dressing'],
    },
    alternatives: ['Chicken Salad', 'Tofu Stir-fry'],
    shoppingList: ['Salmon', 'Quinoa', 'Avocado', 'Spinach', 'Lemon'],
};

const MOCK_STATS: DashboardStats = {
    currentStreak: 5,
    consistencyScore: 85,
    workoutsThisWeek: 3,
    weeklyProgress: [40, 60, 50, 80, 70, 90, 85],
};

const MOCK_HISTORY: ProgressData[] = [
    { date: '2025-12-25', workoutCompleted: true, caloriesConsumed: 2200, streak: 3, consistency: 80 },
    { date: '2025-12-26', workoutCompleted: true, caloriesConsumed: 2100, streak: 4, consistency: 82 },
    { date: '2025-12-27', workoutCompleted: true, caloriesConsumed: 2300, streak: 5, consistency: 85 },
];

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AppContextState>({
        latestWorkout: null,
        latestDiet: null,
        isLoading: false,
        error: null,
    });

    const generateWorkoutPlan = async (context: PlanContext = {}) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setState(prev => ({ ...prev, latestWorkout: MOCK_WORKOUT, isLoading: false }));
        } catch (err) {
            setState(prev => ({ ...prev, isLoading: false, error: "Failed to generate workout plan." }));
        }
    };

    const generateMealPlan = async (context: PlanContext = {}) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setState(prev => ({ ...prev, latestDiet: MOCK_MEAL, isLoading: false }));
        } catch (err) {
            setState(prev => ({ ...prev, isLoading: false, error: "Failed to generate meal plan." }));
        }
    };

    return (
        <AppDataContext.Provider value={{
            ...state,
            generateWorkoutPlan,
            generateMealPlan,
            dashboardStats: MOCK_STATS,
            progressHistory: MOCK_HISTORY,
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};
