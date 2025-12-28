import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center",
      className
    )}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        {icon || <FileQuestion className="h-7 w-7 text-muted-foreground" />}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
