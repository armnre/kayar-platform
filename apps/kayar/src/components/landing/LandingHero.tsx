import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Dumbbell, Bot, Users, Trophy, Menu, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LaunchLink from './LaunchLink';
import Logo from '../Logo';

const NAV = [['بدن‌یار', '#bodyyar'], ['مربیان', '#coaches'], ['مرشد', '#morshed'], ['کمپین‌ها', '#campaigns'], ['نصب اپ', '#install'], ['فروشگاه کاپوش', '#shop']];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden gap-8 text-sm text-muted-foreground lg:flex">{NAV.map(([l, h]) => <a key={h} href={h} className="transition hover:text-primary">{l}</a>)}</nav>
        <div className="flex items-center gap-2">
          <Link to="/app/coach/login" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-primary hover:text-primary sm:inline-flex">ورود مربیان</Link>
          <LaunchLink className="rounded-full bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-[0_0_24px_-4px_hsl(var(--primary))] transition hover:scale-105 sm:px-5">ورود / ثبت‌نام</LaunchLink>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden" aria-label="منو"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-white/5 p-4 lg:hidden">{NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">{l}</a>)}<Link to="/app/coach/login" className="rounded-xl px-3 py-3 font-bold text-primary hover:bg-white/5">ورود و درخواست همکاری مربیان</Link></nav>}
    </header>
  );
}

const WORDS = ['قوی‌تر', 'سالم‌تر', 'پرانرژی‌تر', 'بهتر'];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200); return () => clearInterval(t); }, []);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span key={i} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="text-gradient">
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function LandingHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 pb-10 pt-3 md:px-4 md:pt-10">
      <div className="grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-black md:rounded-[2.5rem]">
        <motion.img initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          src="https://images.fillout.com/886978/vxifokrwnr/generated-images/5oofLcdDf2DXimRW6qu2UY/img_OgYGR0rY1VONHWM-.jpg" alt="ورزشکاران کایار"
          className="absolute inset-x-0 top-0 h-[62%] w-full object-cover object-[30%_20%] md:inset-0 md:h-full md:object-left" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent md:bg-gradient-to-l md:from-black md:via-black/80 md:to-black/10" />
        <div className="grid-bg absolute inset-0 opacity-30" />
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
        <motion.div animate={{ opacity: [0.2, 0.45, 0.2] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" />
        {/* mobile floating chips */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, y: [0, -6, 0] }} transition={{ delay: 0.8, y: { duration: 4, repeat: Infinity } }}
          className="absolute right-4 top-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl md:hidden">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="h-4 w-4" /></span>
          <div><div className="text-[10px] text-white/60">تمرین امروز</div><div className="text-xs font-black text-white">۴۵ دقیقه · ۳۲۰ کالری</div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [0, 6, 0] }} transition={{ delay: 1.1, y: { duration: 5, repeat: Infinity } }}
          className="absolute left-4 top-[30%] flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/55 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-xl md:hidden">
          <Trophy className="h-3.5 w-3.5 text-primary" />+۵۰ امتیاز
        </motion.div>
        <div className="relative flex min-h-[640px] flex-col justify-end p-5 pt-[60%] sm:p-8 md:min-h-[680px] md:max-w-[58%] md:justify-center md:p-14 md:pt-14">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
            همراه هوشمند ورزش و سلامت
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-4 text-[2.1rem] font-black leading-[1.35] text-white sm:text-5xl md:mt-5 md:text-6xl">
            تو فقط یک لباس نخریدی؛<br /><span className="text-gradient">تو یه همراه داری</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3 text-lg font-bold text-white/85 md:text-2xl">
            هر روز <RotatingWord /> از دیروز
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 max-w-lg text-sm leading-7 text-white/70 md:mt-5 md:text-base md:leading-8">
            <b className="text-white">کایار</b> با بدن‌یار هوشمند، مربیان تأییدشده، پادکست‌های مرشد و چالش‌های جایزه‌دار، هر روز یک قدم به نسخه بهتر تو نزدیک‌ترت می‌کند.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-6 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap md:mt-8">
            <LaunchLink className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-black text-primary-foreground shadow-[0_10px_40px_-8px_hsl(var(--primary))] transition active:scale-95 md:hover:scale-105">
              <span className="absolute inset-0 -translate-x-full animate-[sweep_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <Sparkles className="relative h-4 w-4" /><span className="relative">برنامه‌ام رو بساز</span>
            </LaunchLink>
            <a href="#coaches" className="inline-flex justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-bold text-white backdrop-blur transition hover:border-primary hover:text-primary">با مربی‌ها آشنا شو</a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 grid max-w-lg grid-cols-3 gap-2 md:mt-10">
            {([[Bot, 'بدن‌یار', 'برنامه هوشمند'], [Headphones, 'مرشد', 'پادکست ورزشی'], [Users, 'مربیان', 'تأییدشده']] as const).map(([Ic, v, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
                <Ic className="h-4 w-4 text-primary" />
                <div className="mt-2 text-base font-black text-white">{v}</div>
                <div className="text-[11px] text-white/60">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
          className="absolute left-6 top-6 hidden items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl md:flex">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="h-5 w-5" /></span>
          <div><div className="text-xs text-white/60">تمرین امروز</div><div className="text-sm font-black text-white">۴۵ دقیقه · ۳۲۰ کالری</div></div>
        </motion.div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-8 left-8 hidden items-center gap-2 rounded-2xl border border-primary/30 bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-xl md:flex">
          <Trophy className="h-4 w-4 text-primary" />+۵۰ امتیاز چالش
        </motion.div>
      </div>
    </section>
  );
}

export const MODULES = [
  { t: 'بدن‌یار', d: 'دستیار هوش مصنوعی شخصی‌سازی برنامه', I: Bot, tone: 'accent', href: '#bodyyar' },
  { t: 'مربیان کایار', d: 'مربیان حرفه‌ای و متخصص', I: Users, tone: 'primary', href: '#coaches' },
  { t: 'مرشد', d: 'پادکست و موزیک برای بهترین نسخه تو', I: Headphones, tone: 'accent', href: '#morshed' },
  { t: 'کمپین و جایزه', d: 'کمپین برندها، چالش‌ها و جوایز', I: Trophy, tone: 'primary', href: '#campaigns' },
] as const;

export function ModuleCards() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-5">
      {MODULES.map((m, i) => (
        <motion.a key={m.t} href={m.href} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          whileHover={{ y: -6 }} className="border-gradient group relative overflow-hidden rounded-3xl bg-card/70 p-5 text-center backdrop-blur md:p-7">
          <div className={`absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl transition group-hover:scale-150 ${m.tone === 'primary' ? 'bg-primary/25' : 'bg-accent/30'}`} />
          <span className={`relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl ${m.tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-accent/20 text-accent'}`}><m.I className="h-8 w-8" /></span>
          <div className="relative text-xl font-black">{m.t}</div>
          <div className="relative mt-1 text-xs leading-6 text-muted-foreground md:text-sm">{m.d}</div>
        </motion.a>
      ))}
    </section>
  );
}
