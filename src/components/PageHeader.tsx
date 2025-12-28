import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, className, children }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
