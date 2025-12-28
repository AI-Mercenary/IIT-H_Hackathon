import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

const INITIAL_PROFILE: UserProfile = {
    basicInfo: { age: 30, gender: 'Not specified', height: 170, weight: 70, phoneNumber: '', avatarUrl: '' },
    fitnessProfile: { experienceLevel: 'beginner', primaryGoal: 'lose_weight', targetWeight: 65, weeklyWorkoutDays: 3, sessionDuration: 45 },
    equipment: { bodyweight: true, dumbbells: false, barbell: false, cardio: false, yogaMat: false, runningShoes: false },
    healthConstraints: { injuries: [], conditions: [], recoveryFocus: 'none' },
    nutritionPreferences: { dietaryRestrictions: [], dietType: 'balanced', calorieTarget: 2000, mealsPerDay: 3, proteinPreference: 'moderate' },
    schedulePreferences: { preferredTime: 'evening', restDays: ['Sunday'] },
    completedWizard: false,
};

interface ProfileContextType {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
    updateSection: <K extends keyof UserProfile>(section: K, data: Partial<UserProfile[K]>) => void;
    completeWizard: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<UserProfile>(() => {
        const stored = localStorage.getItem('adafit_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Deep merge with INITIAL_PROFILE to ensure new fields are present
                return {
                    ...INITIAL_PROFILE,
                    ...parsed,
                    basicInfo: { ...INITIAL_PROFILE.basicInfo, ...parsed.basicInfo },
                    fitnessProfile: { ...INITIAL_PROFILE.fitnessProfile, ...parsed.fitnessProfile },
                    equipment: { ...INITIAL_PROFILE.equipment, ...parsed.equipment },
                    healthConstraints: { ...INITIAL_PROFILE.healthConstraints, ...parsed.healthConstraints },
                    nutritionPreferences: { ...INITIAL_PROFILE.nutritionPreferences, ...parsed.nutritionPreferences },
                    schedulePreferences: { ...INITIAL_PROFILE.schedulePreferences, ...parsed.schedulePreferences },
                };
            } catch (e) {
                console.error("Failed to parse profile", e);
                return INITIAL_PROFILE;
            }
        }
        return INITIAL_PROFILE;
    });

    useEffect(() => {
        localStorage.setItem('adafit_profile', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const updateSection = <K extends keyof UserProfile>(section: K, data: Partial<UserProfile[K]>) => {
        setProfile(prev => {
            const prevValue = prev[section];
            // Ensure we only spread if it's an object (non-primitive)
            const updatedValue = (typeof prevValue === 'object' && prevValue !== null)
                ? { ...prevValue, ...data }
                : data; // For primitives like boolean, just replace

            return {
                ...prev,
                [section]: updatedValue
            };
        });
    };

    const completeWizard = () => {
        updateProfile({ completedWizard: true });
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, updateSection, completeWizard }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
