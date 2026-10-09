import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, UserRound, LayoutGrid, Bot, Users, Headphones, Trophy, ChevronLeft } from 'lucide-react';

const STEPS = [
  { I: Smartphone, t: 'شروع کن', d: 'با شماره موبایل وارد شو؛ حساب در چند ثانیه ساخته می‌شود.' },
  { I: UserRound, t: 'پروفایلت را بساز', d: 'هدف، سطح و اطلاعات بدنی‌ات را وارد کن.' },
  { I: LayoutGrid, t: 'قابلیت مناسب را انتخاب کن', d: 'بدن‌یار، مربی، مرشد یا چالش‌ها — هرچه امروز لازم داری.' },
];
const FEATURES = [
  { I: Bot, t: 'بدن‌یار', d: 'پروفایل بدنی، تحلیل و ثبت فعالیت؛ برنامه و گفتگوی هوشمند پس از فعال‌سازی سرویس هوش مصنوعی.', href: '#bodyyar', tone: 'bg-primary/15 text-primary' },
  { I: Users, t: 'مربیان', d: 'مربیان بررسی‌شده با خدمات آنلاین و حضوری، رزرو و پیام‌رسانی.', href: '#coaches', tone: 'bg-accent/20 text-accent' },
  { I: Headphones, t: 'مرشد', d: 'موزیک‌های مجاز Jamendo و پادکست‌های کایار برای همراهی تمرین.', href: '#morshed', tone: 'bg-accent/20 text-accent' },
  { I: Trophy, t: 'کمپین و چالش', d: 'در چالش‌های برندها شرکت کن، پیشرفتت را ثبت کن و امتیاز بگیر.', href: '#campaigns', tone: 'bg-primary/15 text-primary' },
];

/** Newcomer explainer: what KAYAR is, how to start, and what each part really does. */
export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-1">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold text-primary">کایار چیست؟</span>
        <h2 className="mt-2 text-3xl font-black leading-[1.5] md:text-4xl">یک اپ برای همه‌ی مسیر ورزشی‌ات</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">به‌جای چند اپ پراکنده، برنامه، مربی، موزیک تمرین و چالش‌ها را یک‌جا داشته باش.</p>
      </div>
      <ol className="relative mt-8 grid gap-3 md:grid-cols-3 md:gap-5">
        <div className="absolute inset-x-[16%] top-8 hidden h-px bg-gradient-to-l from-primary/60 via-white/15 to-accent/60 md:block" />
        {STEPS.map((s, i) => (
          <motion.li key={s.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="relative flex items-start gap-4 rounded-3xl border border-white/10 bg-card/60 p-5 md:flex-col md:items-center md:text-center">
            <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><s.I className="h-6 w-6" />
              <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-background text-[11px] font-black text-primary ring-1 ring-primary/40">{(i + 1).toLocaleString('fa-IR')}</span></span>
            <div><div className="font-black">{s.t}</div><p className="mt-1 text-xs leading-6 text-muted-foreground md:text-sm">{s.d}</p></div>
          </motion.li>
        ))}
      </ol>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.a key={f.t} href={f.href} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group flex gap-4 rounded-3xl border border-white/[0.07] bg-background/40 p-5 transition hover:border-primary/40 lg:flex-col">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${f.tone}`}><f.I className="h-6 w-6" /></span>
            <div><div className="flex items-center gap-1 font-black">{f.t}<ChevronLeft className="h-4 w-4 opacity-0 transition group-hover:opacity-100" /></div><p className="mt-1 text-xs leading-6 text-muted-foreground">{f.d}</p></div>
          </motion.a>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/app/login" className="rounded-full bg-primary px-7 py-3 text-sm font-black text-primary-foreground">ثبت‌نام رایگان</Link>
        <a href="#install" className="rounded-full border border-white/15 px-7 py-3 text-sm font-bold">نصب اپ</a>
      </div>
    </section>
  );
}
