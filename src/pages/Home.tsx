import { Link } from 'react-router-dom';
import { Activity, ArrowRight, BarChart3, Brain, Dumbbell, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components';

const features = [
  {
    icon: Brain,
    title: 'Context-Aware',
    description: 'We analyze your stress, energy, and sleep to create the perfect workout.',
  },
  {
    icon: Dumbbell,
    title: 'Personalized Plans',
    description: 'Get workouts tailored to how you feel today, not yesterday.',
  },
  {
    icon: Heart,
    title: 'Habit Tracking',
    description: 'Build consistency with streak tracking and progress insights.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI-Powered Fitness Coaching</span>
            </div>

            <PageHeader
              title="AdaFit Agent"
              subtitle="Your context-aware fitness coach that adapts workouts based on your stress, energy, and sleep. Tell us how you feel, and we'll create the perfect plan for today."
              className="animate-slide-up"
            >
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild variant="hero" size="xl">
                  <Link to="/workout">
                    Get My Workout Plan
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="hero-secondary" size="xl">
                  <Link to="/dashboard">
                    <BarChart3 className="h-5 w-5" />
                    View Progress
                  </Link>
                </Button>
              </div>
            </PageHeader>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 bg-secondary/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Fitness That Adapts to You
            </h2>
            <p className="mt-3 text-muted-foreground">
              No more one-size-fits-all routines. AdaFit understands your daily context.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/60 bg-card p-6 shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-center shadow-lg md:p-12">
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/10" />
          
          <div className="relative">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20">
              <Activity className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Tell us how you're feeling today and get a workout plan designed just for you.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-6 shadow-lg">
              <Link to="/workout">
                Start Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
