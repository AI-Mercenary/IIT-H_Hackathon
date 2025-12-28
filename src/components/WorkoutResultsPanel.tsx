import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  MessageCircle,
  Clock,
  Zap,
  CheckCircle2,
  Salad,
  Target
} from 'lucide-react';
import type { WorkoutPlanResponse, LoadingState, ApiError } from '@/types';
import { cn } from '@/lib/utils';
import { formatDuration, capitalize } from '@/utils';

interface WorkoutResultsPanelProps {
  response: WorkoutPlanResponse | null;
  loadingState: LoadingState;
  error: ApiError | null;
  onRetry?: () => void;
}

export function WorkoutResultsPanel({ 
  response, 
  loadingState, 
  error, 
  onRetry 
}: WorkoutResultsPanelProps) {
  if (loadingState === 'loading') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Analyzing your context and generating your personalized plan..." />
      </div>
    );
  }

  if (loadingState === 'error' && error) {
    return (
      <ErrorMessage 
        message={error.message} 
        onRetry={onRetry}
        className="min-h-[300px]"
      />
    );
  }

  if (!response) {
    return (
      <EmptyState
        title="Ready for Your Plan"
        description="Fill in your daily context on the left and click the button to see today's personalized workout plan."
        icon={<Dumbbell className="h-7 w-7 text-muted-foreground" />}
        className="min-h-[400px]"
      />
    );
  }

  const { contextAnalysis, workoutPlan, dietRecommendation, habitStatus, motivation } = response;

  return (
    <div className="grid gap-6 animate-fade-in">
      {/* Workout Plan Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-primary pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-primary-foreground">{workoutPlan.name}</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {workoutPlan.type}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatDuration(workoutPlan.durationMinutes)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-accent" />
              <span>{workoutPlan.intensity} Intensity</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-sm text-success">
              <Target className="h-4 w-4" />
              <span>{workoutPlan.successLikelihood}% Success Rate</span>
            </div>
          </div>
          
          <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Instructions</h4>
          <ul className="space-y-2">
            {workoutPlan.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Context Analysis Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Brain className="h-5 w-5 text-info" />
            </div>
            <div>
              <CardTitle>Why This Workout?</CardTitle>
              <CardDescription>AI-powered context analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Feasibility</p>
              <p className="font-display text-xl font-bold text-foreground">
                {contextAnalysis.feasibilityScore}/10
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">Intensity</p>
              <p className="font-display text-xl font-bold text-foreground">
                {capitalize(contextAnalysis.recommendedIntensity)}
              </p>
            </div>
            <div className="col-span-2 rounded-lg bg-secondary p-3 text-center sm:col-span-1">
              <p className="text-xs text-muted-foreground">Best Time</p>
              <p className="font-display text-xl font-bold text-foreground">
                {capitalize(contextAnalysis.bestTime)}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{contextAnalysis.reasoning}</p>
          
          {contextAnalysis.riskFactors.length > 0 && (
            <div className="mt-4 rounded-lg bg-warning/10 p-3">
              <p className="mb-2 text-xs font-medium text-warning">Considerations</p>
              <ul className="space-y-1">
                {contextAnalysis.riskFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {factor}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diet Recommendation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Salad className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle>{dietRecommendation.mealType}</CardTitle>
              <CardDescription>Personalized nutrition for today</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{dietRecommendation.description}</p>
          
          <div className="mb-4 grid grid-cols-4 gap-2">
            <div className="rounded-lg bg-secondary p-2 text-center">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-display text-lg font-bold text-foreground">{dietRecommendation.calories}</p>
            </div>
            <div className="rounded-lg bg-secondary p-2 text-center">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-display text-lg font-bold text-foreground">{dietRecommendation.macros.protein}g</p>
            </div>
            <div className="rounded-lg bg-secondary p-2 text-center">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-display text-lg font-bold text-foreground">{dietRecommendation.macros.carbs}g</p>
            </div>
            <div className="rounded-lg bg-secondary p-2 text-center">
              <p className="text-xs text-muted-foreground">Fats</p>
              <p className="font-display text-lg font-bold text-foreground">{dietRecommendation.macros.fats}g</p>
            </div>
          </div>
          
          <h4 className="mb-2 font-display text-sm font-semibold text-foreground">Meal Suggestions</h4>
          <ul className="space-y-1">
            {dietRecommendation.suggestions.map((suggestion, index) => (
              <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-success">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Habit Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Your Habit Status</CardTitle>
              <CardDescription>Track your consistency</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gradient-primary p-4 text-center text-primary-foreground">
              <p className="text-xs opacity-80">Current Streak</p>
              <p className="font-display text-4xl font-bold">{habitStatus.currentStreak}</p>
              <p className="text-xs opacity-80">days</p>
            </div>
            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="text-xs text-muted-foreground">Consistency</p>
              <p className="font-display text-4xl font-bold text-foreground">{habitStatus.consistency}%</p>
              <p className="text-xs text-muted-foreground">this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Message Card */}
      <Card className={cn(
        "border-2",
        motivation.tone === 'energetic' ? 'border-accent/30 bg-accent/5' : 'border-primary/30 bg-primary/5'
      )}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              motivation.tone === 'energetic' ? 'bg-accent/20' : 'bg-primary/20'
            )}>
              <MessageCircle className={cn(
                "h-5 w-5",
                motivation.tone === 'energetic' ? 'text-accent' : 'text-primary'
              )} />
            </div>
            <div>
              <CardTitle>Your Coach Says</CardTitle>
              <CardDescription>{capitalize(motivation.type)} message</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground italic">
            "{motivation.message}"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
