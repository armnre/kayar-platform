import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@project/components/lib/utils';

/**
 * Photo header that fades into the app background — shared by the athlete & coach sign-in screens.
 * Full-bleed to the top edge (respects the iPhone notch via safe-area), with an optional back
 * button overlaid on the photo so the page doesn't spend a whole header row above the image.
 * Height scales with the viewport and shrinks on short screens so the form stays reachable.
 */
export default function AuthBackdrop({ img, children, back, className }: { img: string; children?: ReactNode; back?: string; className?: string }) {
  const nav = useNavigate();
  const reduce = useReducedMotion();
  return (
    <div className={cn(
      'relative -mx-5 -mt-4 shrink-0 overflow-hidden',
      'h-[calc(clamp(150px,27dvh,270px)+env(safe-area-inset-top))] [@media(max-height:640px)]:h-[calc(118px+env(safe-area-inset-top))]',
      className,
    )}>
      <motion.img initial={reduce ? false : { scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_25%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/5" />
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent mix-blend-overlay" />
      <div className="absolute -bottom-16 left-1/2 h-36 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
      {back && (
        <button onClick={() => nav(back)} aria-label="بازگشت"
          className="absolute right-4 top-[calc(env(safe-area-inset-top)+0.75rem)] grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background/50 backdrop-blur transition active:scale-90">
          <ArrowRight className="h-5 w-5" />
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-1 text-center">{children}</div>
    </div>
  );
}

export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'w-1.5 bg-white/15'}`} />
      ))}
    </div>
  );
}
