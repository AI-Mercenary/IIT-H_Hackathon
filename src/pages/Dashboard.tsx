import { Link } from 'react-router-dom';
import { Flame, Target, Activity, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader, StatCard } from '@/components';
import { useLatestWorkoutResponse } from '@/store';

// Mock data for the weekly progress chart
const weeklyData = [
  { day: 'Mon', completed: true, intensity: 'moderate' },
  { day: 'Tue', completed: true, intensity: 'intense' },
  { day: 'Wed', completed: false, intensity: null },
  { day: 'Thu', completed: true, intensity: 'light' },
  { day: 'Fri', completed: true, intensity: 'moderate' },
  { day: 'Sat', completed: false, intensity: null },
  { day: 'Sun', completed: false, intensity: null },
];

const intensityColors = {
  light: 'bg-info',
  moderate: 'bg-primary',
  intense: 'bg-accent',
};

export default function Dashboard() {
  const latestResponse = useLatestWorkoutResponse();

  // Use data from store if available, otherwise use defaults
  const streak = latestResponse?.habitStatus.currentStreak ?? 12;
  const consistency = latestResponse?.habitStatus.consistency ?? 78;

  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Your Progress"
        subtitle="Track your fitness journey and stay consistent with your goals."
      />

      {/* Main Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Streak"
          value={`${streak} days`}
          subtitle="Keep it going!"
          icon={Flame}
          trend="up"
          className="sm:col-span-1"
          valueClassName="text-accent"
        />
        <StatCard
          title="Consistency"
          value={`${consistency}%`}
          subtitle="This month"
          icon={Target}
          trend={consistency >= 70 ? 'up' : 'neutral'}
        />
        <StatCard
          title="Workouts Completed"
          value="24"
          subtitle="This month"
          icon={Activity}
        />
      </div>

      {/* Weekly Progress */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week
            </CardTitle>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-info" />
                <span className="text-muted-foreground">Light</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Intense</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all ${
                    day.completed && day.intensity
                      ? `${intensityColors[day.intensity as keyof typeof intensityColors]} text-primary-foreground shadow-md`
                      : 'border-2 border-dashed border-border bg-secondary/50'
                  }`}
                >
                  {day.completed ? (
                    <Activity className="h-5 w-5" />
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="hero" size="lg" className="flex-1">
              <Link to="/workout">
                Go to Today's Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="flex-1" disabled>
              View Full History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Banner */}
      {latestResponse?.motivation && (
        <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <p className="text-center text-lg italic text-foreground">
              "{latestResponse.motivation.message}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
