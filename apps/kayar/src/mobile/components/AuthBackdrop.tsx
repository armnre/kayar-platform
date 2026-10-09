import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Photo header that fades into the app background — shared by the athlete & coach sign-in screens. */
export default function AuthBackdrop({ img, children }: { img: string; children?: ReactNode }) {
  return (
    <div className="relative -mx-5 -mt-4 h-[34vh] min-h-[220px] max-h-[320px] overflow-hidden">
      <motion.img initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        src={img} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent mix-blend-overlay" />
      <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-2 text-center">{children}</div>
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
