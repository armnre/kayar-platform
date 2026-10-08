import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Bolt } from '../kit';
import { toFa } from '../store';

const STEPS = ['تحلیل شاخص توده بدنی', 'محاسبه کالری روزانه', 'طراحی برنامه تمرینی', 'آماده‌سازی پیشنهاد تغذیه'];

export default function Analysis() {
  const nav = useNavigate();
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setP((x) => {
      if (x >= 100) { clearInterval(t); setTimeout(() => nav('/app/bodyyar/chat', { replace: true }), 500); return 100; }
      return x + 1;
    }), 40);
    return () => clearInterval(t);
  }, [nav]);
  const done = Math.floor(p / 25);
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center px-6">
      <div className="relative grid h-56 w-56 place-items-center">
        {[0, 1, 2].map((i) => <motion.span key={i} className="absolute inset-0 rounded-full border border-primary/40" animate={{ scale: [0.5, 1.2], opacity: [1, 0] }} transition={{ duration: 2, delay: i * 0.66, repeat: Infinity }} />)}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-6 rounded-full border-2 border-transparent border-t-primary border-r-accent" />
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}><Bolt className="h-20 w-20" /></motion.div>
      </div>
      <div className="mt-4 text-4xl font-black text-primary">{toFa(p)}٪</div>
      <h1 className="mt-2 text-xl font-black">بدن‌یار در حال تحلیل بدن شماست</h1>
      <div className="mt-8 w-full max-w-xs space-y-3">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 text-sm transition ${i <= done ? 'text-foreground' : 'text-muted-foreground/40'}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full ${i < done ? 'bg-primary text-primary-foreground' : 'border border-white/20'}`}>{i < done && <Check className="h-4 w-4" />}</span>{s}
          </div>
        ))}
      </div>
    </div>
  );
}
