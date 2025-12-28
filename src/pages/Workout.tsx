import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, SliderField, TextareaField, WorkoutResultsPanel } from '@/components';
import { useWorkoutForm } from '@/hooks';
import { useLatestWorkoutResponse } from '@/store';

export default function Workout() {
  const {
    formState,
    loadingState,
    error,
    isValid,
    isLoading,
    updateField,
    submitForm,
  } = useWorkoutForm();

  const latestResponse = useLatestWorkoutResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Today's Workout"
        subtitle="Tell us how you're feeling, and we'll create a personalized workout plan for you."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Daily Context</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <SliderField
                  label="Stress Level"
                  value={formState.stressLevel}
                  min={1}
                  max={10}
                  onChange={(value) => updateField('stressLevel', value)}
                  helperText="1 = completely relaxed, 10 = extremely stressed"
                />

                <SliderField
                  label="Energy Level"
                  value={formState.energyLevel}
                  min={1}
                  max={10}
                  onChange={(value) => updateField('energyLevel', value)}
                  helperText="1 = exhausted, 10 = full of energy"
                />

                <SliderField
                  label="Sleep Last Night"
                  value={formState.sleepHours}
                  min={3}
                  max={12}
                  step={0.5}
                  unit="h"
                  onChange={(value) => updateField('sleepHours', value)}
                  helperText="How many hours did you sleep?"
                />

                <TextareaField
                  label="Notes (Optional)"
                  value={formState.notes}
                  onChange={(value) => updateField('notes', value)}
                  placeholder="Any injuries, travel fatigue, or other context..."
                  helperText="Help us understand your situation better"
                />

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? 'Generating Your Plan...' : 'Get My Workout Plan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div>
          <WorkoutResultsPanel
            response={loadingState === 'success' ? latestResponse : null}
            loadingState={loadingState}
            error={error}
            onRetry={submitForm}
          />
        </div>
      </div>
    </div>
  );
}
