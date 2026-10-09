import { Loader2 } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
export { Skeleton } from '@project/components/ui/skeleton';

/** Shared loading primitives: inline spinner for pending actions, and a centered page loader. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn('h-4 w-4 animate-spin', className)} />;
}
export function PageLoader({ label = 'در حال بارگذاری…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground"><Spinner className="h-6 w-6 text-primary" />{label}</div>
    </div>
  );
}
