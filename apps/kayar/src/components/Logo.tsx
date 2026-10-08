import { Zap } from 'lucide-react';
import { cn } from '@project/components/lib/utils';

export default function Logo({ className, size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const big = size === 'lg';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('grid place-items-center rounded-xl bg-primary text-primary-foreground glow', big ? 'h-14 w-14' : 'h-9 w-9')}>
        <Zap className={big ? 'h-8 w-8' : 'h-5 w-5'} fill="currentColor" />
      </div>
      <div className="leading-none">
        <div className={cn('font-black tracking-tight', big ? 'text-4xl' : 'text-xl')}>کایار</div>
        <div className={cn('font-semibold tracking-[0.35em] text-muted-foreground', big ? 'text-xs mt-1' : 'text-[9px]')}>KAYAR</div>
      </div>
    </div>
  );
}
