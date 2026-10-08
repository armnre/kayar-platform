import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';

export function Screen({ title, back, right, children, className }: { title?: ReactNode; back?: boolean | string; right?: ReactNode; children: ReactNode; className?: string }) {
  const nav = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex min-h-full flex-col px-5 pb-6 pt-4', className)}>
      {(title || back || right) && (
        <div className="mb-5 flex h-11 items-center gap-3">
          {back && (
            <button onClick={() => (typeof back === 'string' ? nav(back) : nav(-1))} aria-label="بازگشت"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] transition active:scale-90">
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
          <h1 className="flex-1 text-xl font-black">{title}</h1>
          {right}
        </div>
      )}
      {children}
    </motion.div>
  );
}

export function Lime({ children, loading, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button {...p} disabled={p.disabled || loading}
      className={cn('flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)] transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none', className)}>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </button>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputCls = 'h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-base outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:bg-primary/[0.04] focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]';

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('h-12 rounded-2xl border px-4 text-sm font-bold transition active:scale-95', active ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_-6px_hsl(var(--primary))]' : 'border-white/10 bg-white/[0.03] text-muted-foreground')}>
      {children}
    </button>
  );
}

export function Bolt({ className }: { className?: string }) {
  return <Zap className={cn('text-primary drop-shadow-[0_0_18px_hsl(var(--primary)/0.8)]', className)} fill="currentColor" />;
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const C = onClick ? 'button' : 'div';
  return <C onClick={onClick} className={cn('block w-full rounded-3xl border border-white/[0.07] bg-card/80 p-4 text-right backdrop-blur', onClick && 'transition active:scale-[0.98]', className)}>{children}</C>;
}
