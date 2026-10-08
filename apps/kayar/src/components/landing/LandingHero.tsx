import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Flame, HeartPulse, Sparkles, Star } from 'lucide-react';
import { Button } from '@project/components/ui/button';

const HERO = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/5Q8niSnGHWpRxmPjgYRRT1/img_xLGSvANH7NVuyCj7.jpg';
const word = { hidden: { opacity: 0, y: 40, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } };

export default function LandingHero({ onStart }: { onStart: () => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-20">
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> نسل جدید همراه ورزشی هوشمند
        </motion.div>
        <motion.h1 initial="hidden" animate="show" transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
          className="text-5xl font-black leading-[1.2] md:text-7xl">
          {['قوی‌تر', 'از', 'دیروز،'].map((w) => (
            <motion.span key={w} variants={word} className="ms-3 inline-block">{w}</motion.span>
          ))}
          <br />
          <motion.span variants={word} className="text-gradient inline-block">با کایار</motion.span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
          مربی حرفه‌ای، دستیار هوشمند بدن‌یار، پادکست‌های انگیزشی و چالش‌های جایزه‌دار — همه در یک اپ.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={onStart} className="glow group h-14 rounded-full px-8 text-base font-bold">
            شروع رایگان <ArrowLeft className="ms-2 h-5 w-5 transition group-hover:-translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" asChild className="h-14 rounded-full border-white/15 px-8 text-base">
            <a href="#features">بیشتر بدان</a>
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-3 space-x-reverse">
            {['ع', 'م', 'س', 'ن'].map((l, i) => (
              <span key={l} className="grid h-10 w-10 place-items-center rounded-full border-2 border-background text-sm font-black text-primary-foreground"
                style={{ background: `hsl(${71 + i * 50} 90% 60%)` }}>{l}</span>
            ))}
          </div>
          <div className="text-sm">
            <div className="flex text-primary">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}</div>
            <div className="text-muted-foreground">همراه ورزشکاران کایار</div>
          </div>
        </motion.div>
      </div>

      <motion.div style={{ y }} initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative">
        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-primary/30 via-transparent to-accent/40 blur-3xl" />
        <div className="border-gradient relative overflow-hidden rounded-[2.5rem]">
          <img src={HERO} alt="ورزشکار کایار" className="aspect-[4/5] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
        <FloatCard className="-right-4 top-10 md:-right-10" icon={Flame} label="کالری امروز" value="۶۴۰" delay={0} />
        <FloatCard className="-left-4 bottom-24 md:-left-10" icon={HeartPulse} label="ضربان تمرین" value="۱۴۲" delay={1.5} accent />
      </motion.div>
    </section>
  );
}

function FloatCard({ className, icon: Icon, label, value, delay, accent }:
  { className: string; icon: typeof Flame; label: string; value: string; delay: number; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + delay / 3 }}
      className={`glass animate-float absolute flex items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl ${className}`} style={{ animationDelay: `${delay}s` }}>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}><Icon className="h-5 w-5" /></span>
      <div><div className="text-[11px] text-muted-foreground">{label}</div><div className="text-xl font-black">{value}</div></div>
    </motion.div>
  );
}
