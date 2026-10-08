import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const steps = ['در حال آماده‌سازی فضای تو…', 'همگام‌سازی پروفایل…', 'بیدار کردن بدن‌یار…', 'آماده‌ای!'];

/** Full-screen branded loader. Calls onDone after `duration` ms. */
export default function Splash({ onDone, duration = 2600 }: { onDone?: () => void; duration?: number }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const v = Math.min(1, (Date.now() - start) / duration);
      setP(v);
      if (v >= 1) { clearInterval(id); onDone?.(); }
    }, 30);
    return () => clearInterval(id);
  }, [duration, onDone]);

  const R = 70, C = 2 * Math.PI * R;
  return (
    <motion.div dir="rtl" exit={{ opacity: 0 }} className="grain fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background">
      <div className="grid-bg absolute inset-0" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
        className="absolute h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[22rem] w-[22rem] rounded-full border border-dashed border-accent/30" />
      <div className="relative flex flex-col items-center">
        <div className="relative grid h-44 w-44 place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <circle cx="80" cy="80" r={R} fill="none" stroke="url(#g)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
            <defs><linearGradient id="g"><stop offset="0" stopColor="hsl(var(--primary))" /><stop offset="1" stopColor="hsl(var(--accent))" /></linearGradient></defs>
          </svg>
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="glow grid h-24 w-24 place-items-center rounded-[1.75rem] bg-primary text-primary-foreground">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
              <Zap className="h-12 w-12" fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
          <div className="text-gradient text-5xl font-black">کایار</div>
          <div className="mt-1 text-[11px] font-semibold tracking-[0.6em] text-muted-foreground">KAYAR</div>
        </motion.div>
        <div className="mt-6 h-5 text-sm text-muted-foreground">{steps[Math.min(steps.length - 1, Math.floor(p * steps.length))]}</div>
        <div className="num mt-2 text-xs font-bold text-primary">{Math.round(p * 100).toLocaleString('fa-IR')}٪</div>
      </div>
    </motion.div>
  );
}
