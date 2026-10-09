import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession, useCoachApps, toFa } from '../store';
import { homeFor } from '../auth';

/** Full intro once per browser tab; afterwards (refresh, back to /app) it resolves almost instantly. */
const SEEN = 'kayar.splash.seen';

const MSGS = ['گرم کردن موتور…', 'شارژ انرژی…', 'آماده‌سازی بدن‌یار…', 'بزن بریم!'];

export default function SplashScreen() {
  const nav = useNavigate();
  const s = useSession();
  const apps = useCoachApps();
  const [p, setP] = useState(0);
  useEffect(() => {
    const quick = sessionStorage.getItem(SEEN) === '1';
    const total = quick ? 450 : 2600;
    const t = setInterval(() => setP((x) => Math.min(100, x + 100 / (total / 40))), 40);
    const d = setTimeout(() => {
      sessionStorage.setItem(SEEN, '1');
      // Session + role are read synchronously from storage, so the target is final — no intermediate pages.
      nav(homeFor(s, apps), { replace: true });
    }, total);
    return () => { clearInterval(t); clearTimeout(d); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 md:min-h-[860px]">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span key={i} className="absolute h-1 w-1 rounded-full bg-primary" style={{ left: `${(i * 53) % 100}%`, bottom: -10 }}
          animate={{ y: [0, -900], opacity: [0, 1, 0] }} transition={{ duration: 4 + (i % 4), delay: (i % 6) * 0.4, repeat: Infinity, ease: 'linear' }} />
      ))}
      <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 2.2, repeat: Infinity }} className="absolute h-80 w-80 rounded-full bg-primary/30 blur-[90px]" />
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="absolute h-56 w-56 rounded-full border border-primary/40" animate={{ scale: [0.4, 2.2], opacity: [0.7, 0] }} transition={{ duration: 3, delay: 0.8 + i, repeat: Infinity }} />
      ))}
      <svg viewBox="0 0 100 160" className="relative h-36 w-24">
        <motion.path d="M60 2 L18 88 L46 88 L32 158 L84 62 L54 62 L72 2 Z" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinejoin="round"
          initial={{ pathLength: 0, fill: 'hsl(var(--primary) / 0)' }} animate={{ pathLength: 1, fill: 'hsl(var(--primary) / 1)' }}
          transition={{ pathLength: { duration: 1, ease: 'easeInOut' }, fill: { delay: 0.9, duration: 0.4 } }}
          style={{ filter: 'drop-shadow(0 0 18px hsl(var(--primary)))' }} />
      </svg>
      <motion.div initial={{ opacity: 0, y: 30, filter: 'blur(12px)', scale: 0.9 }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
        className="relative mt-5 text-6xl font-black">کایار</motion.div>
      <motion.div initial={{ opacity: 0, letterSpacing: '0.2em' }} animate={{ opacity: 1, letterSpacing: '0.9em' }} transition={{ delay: 1.5, duration: 0.8 }} className="relative mt-1 text-sm font-bold text-muted-foreground">KAYAR</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="relative mt-6 text-center">
        <div className="text-base font-medium">همراه ورزشی و سلامت تو</div>
        <div className="mt-1 text-xs text-muted-foreground">با حمایت <span className="font-bold text-primary">برند کایوش</span></div>
      </motion.div>
      <div className="absolute inset-x-10 bottom-14">
        <div className="mb-2 flex justify-between text-[11px] text-muted-foreground"><span>{MSGS[Math.min(3, Math.floor(p / 26))]}</span><span className="font-bold text-primary">{toFa(Math.round(p))}٪</span></div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="relative h-full rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))] transition-[width] duration-75" style={{ width: `${p}%` }}>
            <span className="absolute inset-0 animate-pulse bg-white/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
