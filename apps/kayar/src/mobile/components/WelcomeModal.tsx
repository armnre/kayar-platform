import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Avatar from './Avatar';

/** Celebration overlay shown once after the profile is completed. */
export default function WelcomeModal({ open, name, gender, onClose }: { open: boolean; name: string; gender?: 'male' | 'female'; onClose: () => void }) {
  useEffect(() => { if (open) navigator.vibrate?.([40, 60, 40]); }, [open]);
  const bits = Array.from({ length: 22 });
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] grid place-items-center bg-black/75 px-6 backdrop-blur-md" onClick={onClose}>
          {bits.map((_, i) => (
            <motion.span key={i} className={`absolute top-1/2 left-1/2 h-2 w-2 rounded-sm ${i % 3 ? 'bg-primary' : 'bg-accent'}`}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: Math.cos((i / bits.length) * Math.PI * 2) * (140 + (i % 4) * 40), y: Math.sin((i / bits.length) * Math.PI * 2) * (140 + (i % 4) * 40) + 80, opacity: 0, rotate: 360 }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 }} />
          ))}
          <motion.div initial={{ scale: 0.6, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 16, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()} dir="rtl"
            className="border-gradient relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-card p-7 text-center shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.5)]">
            <div className="absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative mx-auto w-fit">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute -inset-1.5 rounded-full bg-[conic-gradient(hsl(var(--primary)),transparent_50%,hsl(var(--accent)),hsl(var(--primary)))]" />
              <Avatar gender={gender} className="relative h-24 w-24 border-4 border-card" />
            </div>
            <div className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5" />+۵۰ امتیاز خوش‌آمدگویی</div>
            <h2 className="relative mt-3 text-2xl font-black">خوش اومدی {name.split(' ')[0]}! ⚡</h2>
            <p className="relative mt-2 text-sm leading-7 text-muted-foreground">به خانواده کایار پیوستی. از امروز هر قدمت حساب میشه — بیا با هم بهترین نسخه‌ات رو بسازیم.</p>
            <button onClick={onClose} className="relative mt-6 h-14 w-full rounded-2xl bg-primary font-black text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)] active:scale-[0.98]">بزن بریم</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
