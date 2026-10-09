import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, AudioLines, Dumbbell, Bot, Users, Trophy, Menu, Clock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Logo from '../Logo';

const IMG = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/ehiCe6mR6VKtYGiUcxJA6q/img_XqWVTvQkpFraQZTO.jpg';
const NAV = [['بدن‌یار', '#bodyyar'], ['مربیان', '#coaches'], ['مرشد', '#morshed'], ['کمپین‌ها', '#campaigns'], ['نصب اپ', '#install'], ['فروشگاه کایوش', '#shop']];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden gap-8 text-sm text-muted-foreground lg:flex">{NAV.map(([l, h]) => <a key={h} href={h} className="transition hover:text-primary">{l}</a>)}</nav>
        <div className="flex items-center gap-2">
          <Link to="/app/coach/login" className="hidden rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-primary hover:text-primary sm:inline-flex">ورود مربیان</Link>
          <Link to="/app" className="rounded-full bg-primary px-5 py-2 text-sm font-black text-primary-foreground shadow-[0_0_24px_-4px_hsl(var(--primary))] transition hover:scale-105">ورود / ثبت‌نام</Link>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden" aria-label="منو"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
      {open && <nav className="flex flex-col gap-1 border-t border-white/5 p-4 lg:hidden">{NAV.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white/5">{l}</a>)}<Link to="/app/coach/login" className="rounded-xl px-3 py-3 font-bold text-primary hover:bg-white/5">ورود و درخواست همکاری مربیان</Link></nav>}
    </header>
  );
}

const orbit = [
  { I: Headphones, c: 'right-[8%] top-[10%]' }, { I: AudioLines, c: 'left-[6%] top-[38%]' },
  { I: Dumbbell, c: 'left-[14%] top-[6%]' }, { I: AudioLines, c: 'right-[2%] bottom-[22%]' },
];

export default function LandingHero() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-10 md:grid-cols-2 md:pt-16">
      <div className="order-2 md:order-1">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl font-black leading-[1.35] md:text-6xl">
          تو فقط یک لباس نخریدی؛<br /><span className="text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]">تو یه همراه داری</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 max-w-lg leading-8 text-muted-foreground">
          <b className="text-foreground">کایار</b>، همراه ورزشی و سلامتی تو: با ابزارهای هوشمند، مربیان حرفه‌ای و محتوای اختصاصی کایوش.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 flex flex-wrap gap-3">
          <Link to="/app" className="rounded-full bg-primary px-8 py-3.5 font-black text-primary-foreground shadow-[0_10px_40px_-8px_hsl(var(--primary))] transition hover:scale-105">برنامه‌ام رو بساز</Link>
          <Link to="/app" className="rounded-full border-2 border-primary/50 px-8 py-3.5 font-bold transition hover:bg-primary/10">با مربی‌ها آشنا شو</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-x-reverse divide-white/10 rounded-2xl border border-white/10 bg-card/60 py-4 text-center backdrop-blur">
          {[[Bot, 'بدن‌یار', 'برنامه هوشمند'], [Clock, 'مرشد', 'پادکست ورزشی'], [Users, 'مربیان', 'تأییدشده']].map(([I, v, l]) => {
            const Ic = I as typeof Bot;
            return <div key={l as string} className="flex flex-col items-center gap-1"><Ic className="h-4 w-4 text-primary" /><div className="text-lg font-black text-primary">{v as string}</div><div className="text-[11px] text-muted-foreground">{l as string}</div></div>;
          })}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative order-1 mx-auto aspect-square w-full max-w-[520px] md:order-2">
        <motion.div animate={{ rotate: [12, 16, 12] }} transition={{ duration: 6, repeat: Infinity }} className="absolute inset-[12%] rounded-[3rem] bg-primary shadow-[0_0_120px_hsl(var(--primary)/0.6)]" />
        <div className="absolute inset-[12%] overflow-hidden rounded-[3rem]">
          <img src={IMG} alt="ورزشکار کایار" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        {orbit.map(({ I, c }, i) => (
          <motion.span key={i} animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, delay: i * 0.5, repeat: Infinity }}
            className={`absolute ${c} grid h-14 w-14 place-items-center rounded-full border-2 border-primary bg-background/80 text-primary shadow-[0_0_24px_hsl(var(--primary)/0.6)] backdrop-blur`}>
            <I className="h-6 w-6" />
          </motion.span>
        ))}
        <div className="absolute bottom-[6%] right-[4%] flex items-center gap-2 rounded-2xl border border-white/10 bg-card/90 px-4 py-2 text-xs backdrop-blur"><Sparkles className="h-4 w-4 text-primary" />همراه ۲۴ ساعته تو</div>
      </motion.div>
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
