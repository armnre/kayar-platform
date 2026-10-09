import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Dumbbell, Brain, AudioLines, Music, Footprints, Watch, Gamepad2, Trophy } from 'lucide-react';
import { setSession } from '../store';
import { Lime } from '../kit';

const slides = [
  { img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/ehiCe6mR6VKtYGiUcxJA6q/img_XqWVTvQkpFraQZTO.jpg', title: 'بدن قوی‌تر، ذهن آرام‌تر', text: 'کایار همراه هوشمند تو برای تمرین، تغذیه، انگیزه و رشد فردی.', icons: [Dumbbell, Brain, AudioLines] },
  { img: 'https://images.fillout.com/886978/vxifokrwnr/generated-images/cbdB6kJHZ9StPpLHYzZmd8/img_tqRVkqrDXZUKNjNp.jpg', title: 'بهتر از دیروز', text: 'با برنامه‌های حرفه‌ای، مربیان مجرب و محتوای اختصاصی، هر روز به نسخه بهتر خودت برس.', icons: [Footprints, Music, Watch] },
  { img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/teRZy9FtA6SAmLQ8Z5BY6e/img_y_vNAiVjDxgXvYxI.jpg', title: 'بازی کن، جایزه بگیر', text: 'با انجام چالش‌ها و مأموریت‌ها امتیاز جمع کن و جوایز جذاب بگیر.', icons: [Dumbbell, Trophy, Gamepad2] },
];
const pos = ['right-2 top-16', 'left-auto right-8 bottom-28', 'right-24 top-6'];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const finish = () => { setSession({ onboarded: true }); nav('/app/login', { replace: true }); };
  const s = slides[i];
  return (
    <div className="relative flex min-h-[100svh] flex-col md:min-h-[860px]">
      <div className="flex items-center gap-3 px-6 pt-5">
        <div className="flex flex-1 gap-1.5">
          {slides.map((_, k) => (
            <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <motion.span className="block h-full bg-primary" initial={false} animate={{ width: k <= i ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
            </span>
          ))}
        </div>
        <button onClick={finish} className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">رد کردن</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }} transition={{ duration: 0.4 }}
          drag="x" dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, d) => { if (d.offset.x < -60 && i > 0) setI(i - 1); if (d.offset.x > 60) (i < 2 ? setI(i + 1) : finish()); }}
          className="relative flex-1">
          <div className="relative mx-5 mt-4 h-[50vh] max-h-[480px]">
            <motion.div animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -inset-3 rounded-[2.75rem] bg-primary/40 blur-2xl" />
            <div className="border-gradient relative h-full overflow-hidden rounded-[2.5rem] bg-black">
              <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 6, ease: 'easeOut' }} src={s.img} alt="" className="h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/25 via-transparent to-transparent mix-blend-overlay" />
              <svg viewBox="0 0 100 160" className="pointer-events-none absolute -left-6 top-6 h-[75%] opacity-90">
                <motion.path d="M60 2 L18 88 L46 88 L32 158 L84 62 L54 62 L72 2 Z" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary))" strokeWidth="1.6" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary)))' }} />
              </svg>
            </div>
            {s.icons.map((Ic, k) => (
              <motion.span key={k} animate={{ y: [0, -10, 0] }} transition={{ duration: 3, delay: k * 0.6, repeat: Infinity }}
                className={`absolute ${pos[k]} grid h-12 w-12 place-items-center rounded-full border-2 border-primary bg-background/60 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.6)] backdrop-blur`}>
                <Ic className="h-5 w-5" />
              </motion.span>
            ))}
          </div>
          <div className="mt-6 px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-xs font-bold tracking-widest text-primary">{['۰۱', '۰۲', '۰۳'][i]} / ۰۳</motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-2 text-3xl font-black">{s.title.split('،')[0]}{s.title.includes('،') && <>، <span className="text-primary">{s.title.split('،')[1]}</span></>}</motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mx-auto mt-3 max-w-xs leading-7 text-muted-foreground">{s.text}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="py-4" />
      <div className="flex items-center gap-4 px-6 pb-8">
        {i > 0 && <button onClick={() => setI(i - 1)} className="h-12 rounded-full border border-white/15 px-5 text-sm">قبلی</button>}
        <Lime onClick={() => (i < 2 ? setI(i + 1) : finish())} className="flex-1">{i < 2 ? 'بعدی' : 'شروع کن 🚀'}</Lime>
      </div>
    </div>
  );
}
