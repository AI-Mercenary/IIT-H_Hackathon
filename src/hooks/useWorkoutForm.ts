import { useState, useCallback } from 'react';
import type { WorkoutFormState, WorkoutPlanRequest, WorkoutPlanResponse, LoadingState, ApiError } from '@/types';
import { getWorkoutPlan } from '@/api';
import { useAppStore } from '@/store';

const initialFormState: WorkoutFormState = {
  stressLevel: 5,
  energyLevel: 5,
  sleepHours: 7,
  notes: '',
};

export function useWorkoutForm() {
  const [formState, setFormState] = useState<WorkoutFormState>(initialFormState);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ApiError | null>(null);
  
  const userId = useAppStore((state) => state.userId);
  const setLatestWorkoutResponse = useAppStore((state) => state.setLatestWorkoutResponse);

  const updateField = useCallback(<K extends keyof WorkoutFormState>(
    field: K,
    value: WorkoutFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
    setError(null);
  }, []);

  const submitForm = useCallback(async (): Promise<WorkoutPlanResponse | null> => {
    setLoadingState('loading');
    setError(null);

    const request: WorkoutPlanRequest = {
      userId,
      stressLevel: formState.stressLevel,
      energyLevel: formState.energyLevel,
      sleepHours: formState.sleepHours,
      notes: formState.notes || undefined,
    };

    try {
      const response = await getWorkoutPlan(request);
      setLatestWorkoutResponse(response);
      setLoadingState('success');
      return response;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
      setError(apiError);
      setLoadingState('error');
      return null;
    }
  }, [formState, userId, setLatestWorkoutResponse]);

  const isValid = 
    formState.stressLevel >= 1 && formState.stressLevel <= 10 &&
    formState.energyLevel >= 1 && formState.energyLevel <= 10 &&
    formState.sleepHours >= 3 && formState.sleepHours <= 12;

  const isLoading = loadingState === 'loading';

  return {
    formState,
    loadingState,
    error,
    isValid,
    isLoading,
    updateField,
    resetForm,
    submitForm,
  };
}
