import type { WorkoutPlanRequest, WorkoutPlanResponse } from '@/types';

// Base URL for the API - easily configurable for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Simulated network latency for mock responses
const MOCK_DELAY_MS = 1500;

/**
 * Mock data generator for workout plan responses
 * This simulates what the real backend would return
 */
function generateMockResponse(request: WorkoutPlanRequest): WorkoutPlanResponse {
  const { stressLevel, energyLevel, sleepHours } = request;
  
  // Determine recommended intensity based on inputs
  let recommendedIntensity: 'light' | 'moderate' | 'intense' = 'moderate';
  if (stressLevel >= 7 || energyLevel <= 3 || sleepHours < 5) {
    recommendedIntensity = 'light';
  } else if (stressLevel <= 3 && energyLevel >= 7 && sleepHours >= 7) {
    recommendedIntensity = 'intense';
  }

  // Calculate feasibility score
  const feasibilityScore = Math.round(
    ((10 - stressLevel) * 0.3 + energyLevel * 0.4 + (sleepHours / 12) * 10 * 0.3) * 10
  ) / 10;

  // Determine best workout time
  let bestTime: 'morning' | 'afternoon' | 'evening' = 'afternoon';
  if (energyLevel >= 7 && sleepHours >= 7) {
    bestTime = 'morning';
  } else if (stressLevel >= 7) {
    bestTime = 'evening';
  }

  // Generate workout based on intensity
  const workouts = {
    light: {
      name: 'Restorative Flow',
      type: 'Yoga & Mobility',
      durationMinutes: 30,
      intensity: 'Low',
      instructions: [
        'Begin with 5 minutes of deep breathing exercises',
        'Gentle neck and shoulder rolls for 3 minutes',
        'Cat-cow stretches: 10 repetitions',
        'Child\'s pose hold for 2 minutes',
        'Supine spinal twist: 1 minute each side',
        'Legs up the wall for 5 minutes',
        'End with 5 minutes of savasana'
      ],
      successLikelihood: 95
    },
    moderate: {
      name: 'Dynamic Strength Circuit',
      type: 'Full Body Strength',
      durationMinutes: 45,
      intensity: 'Moderate',
      instructions: [
        'Warm-up: 5 minutes of jumping jacks and arm circles',
        'Squats: 3 sets of 12 repetitions',
        'Push-ups: 3 sets of 10 repetitions',
        'Lunges: 3 sets of 10 each leg',
        'Plank holds: 3 sets of 30 seconds',
        'Dumbbell rows: 3 sets of 12 each arm',
        'Cool-down: 5 minutes of stretching'
      ],
      successLikelihood: 82
    },
    intense: {
      name: 'Peak Performance HIIT',
      type: 'High-Intensity Interval',
      durationMinutes: 50,
      intensity: 'High',
      instructions: [
        'Dynamic warm-up: 7 minutes',
        'Burpees: 4 sets of 15 repetitions',
        'Box jumps or step-ups: 4 sets of 12',
        'Mountain climbers: 4 sets of 20 each side',
        'Kettlebell swings: 4 sets of 15',
        'Sprint intervals: 8 rounds of 30 seconds on, 30 off',
        'Cool-down and stretch: 8 minutes'
      ],
      successLikelihood: 75
    }
  };

  // Generate risk factors based on inputs
  const riskFactors: string[] = [];
  if (sleepHours < 6) riskFactors.push('Sleep deficit may affect recovery');
  if (stressLevel >= 7) riskFactors.push('High stress increases injury risk');
  if (energyLevel <= 3) riskFactors.push('Low energy may limit performance');
  if (request.notes?.toLowerCase().includes('injury')) {
    riskFactors.push('Noted injury requires modified movements');
  }

  const selectedWorkout = workouts[recommendedIntensity];

  return {
    contextAnalysis: {
      feasibilityScore,
      recommendedIntensity,
      bestTime,
      riskFactors,
      reasoning: `Based on your stress level of ${stressLevel}/10, energy at ${energyLevel}/10, and ${sleepHours} hours of sleep, a ${recommendedIntensity} intensity workout is recommended. ${
        feasibilityScore >= 7 
          ? 'Your body is well-prepared for exercise today.' 
          : 'Consider taking it easier today and focusing on recovery.'
      }`,
      confidence: Math.round((0.7 + Math.random() * 0.25) * 100) / 100
    },
    workoutPlan: selectedWorkout,
    dietRecommendation: {
      mealType: recommendedIntensity === 'intense' ? 'High-Protein Recovery' : 'Balanced Energy',
      description: recommendedIntensity === 'intense' 
        ? 'Focus on protein-rich foods within 30 minutes post-workout for optimal muscle recovery.'
        : 'Maintain steady energy with complex carbs and lean proteins throughout the day.',
      calories: recommendedIntensity === 'intense' ? 2400 : 2000,
      macros: {
        protein: recommendedIntensity === 'intense' ? 140 : 100,
        carbs: recommendedIntensity === 'intense' ? 280 : 250,
        fats: recommendedIntensity === 'intense' ? 70 : 65
      },
      suggestions: recommendedIntensity === 'intense' 
        ? [
            'Greek yogurt with berries and honey',
            'Grilled chicken with quinoa and vegetables',
            'Protein shake with banana post-workout',
            'Salmon with sweet potato for dinner'
          ]
        : [
            'Oatmeal with nuts and fruit for breakfast',
            'Mixed salad with grilled protein',
            'Whole grain wrap with lean meat',
            'Light fish with steamed vegetables'
          ]
    },
    habitStatus: {
      currentStreak: 7 + Math.floor(Math.random() * 10),
      consistency: 72 + Math.floor(Math.random() * 20),
      patterns: {
        preferredTime: bestTime,
        averageSessionLength: selectedWorkout.durationMinutes,
        weeklyFrequency: 4 + Math.floor(Math.random() * 2)
      }
    },
    motivation: {
      message: feasibilityScore >= 7
        ? "You're in great shape today! Channel that energy into your workout and remember: every rep brings you closer to your goals. You've got this!"
        : "Recovery is just as important as the workout itself. Listen to your body today, and know that taking it easy when needed is a sign of wisdom, not weakness. Tomorrow is another opportunity to push harder.",
      type: feasibilityScore >= 7 ? 'encouragement' : 'supportive',
      tone: feasibilityScore >= 7 ? 'energetic' : 'gentle'
    },
    reasoningTrail: [
      `Analyzed stress level: ${stressLevel}/10`,
      `Evaluated energy level: ${energyLevel}/10`,
      `Considered sleep duration: ${sleepHours} hours`,
      `Calculated feasibility score: ${feasibilityScore}/10`,
      `Determined optimal intensity: ${recommendedIntensity}`,
      `Selected workout: ${selectedWorkout.name}`,
      `Generated personalized recommendations`
    ]
  };
}

/**
 * Fetches a personalized workout plan from the backend
 * Currently returns mock data; ready to switch to real API
 */
export async function getWorkoutPlan(request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> {
  // Toggle this to use real API when backend is ready
  const USE_MOCK = true;

  if (USE_MOCK) {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    return generateMockResponse(request);
  }

  // Real API call (for when backend is ready)
  const response = await fetch(`${API_BASE_URL}/workout-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Health check for the API
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
