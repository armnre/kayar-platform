import { motion } from 'framer-motion';
import { Zap, Users, Headphones, Trophy, UserPlus, Target, Rocket, ArrowLeft } from 'lucide-react';
import { Button } from '@project/components/ui/button';

const reveal = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.6 } };

export function Marquee() {
  const items = ['مربیان حرفه‌ای', 'هوش مصنوعی', 'برنامه شخصی', 'پادکست تمرین', 'چالش هفتگی', 'جایزه واقعی', 'پیگیری پیشرفت'];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-primary py-4 text-primary-foreground [transform:rotate(-1.5deg)]">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-black">{t}<Zap className="h-5 w-5" fill="currentColor" /></span>
        ))}
      </div>
    </div>
  );
}

const IMG_BODY = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/9yrof1ZLWXP4sXVwhZimgH/img_umkYVDp5QjZBrmfF.jpg';

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <motion.div {...reveal} className="mb-12 max-w-xl">
        <div className="text-sm font-bold text-primary">همه‌چیز در یک اپ</div>
        <h2 className="mt-2 text-4xl font-black leading-tight md:text-5xl">چهار قدرت، <span className="text-gradient">یک همراه</span></h2>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        <motion.div {...reveal} className="border-gradient grain relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2">
          <img src={IMG_BODY} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-8">
            <span className="glow mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Zap className="h-7 w-7" fill="currentColor" /></span>
            <h3 className="text-3xl font-black">بدن‌یار هوشمند</h3>
            <p className="mt-2 max-w-md text-muted-foreground">دستیار شخصی که بدنت رو می‌شناسه؛ برنامه تمرینی می‌سازه، به سوال‌هات جواب میده و پیشرفتت رو دنبال می‌کنه.</p>
          </div>
        </motion.div>
        <Tile icon={Users} title="مربیان کایار" text="رزرو جلسه با مربیان تأییدشده" tone="accent" />
        <Tile icon={Headphones} title="مرشد" text="پادکست و موزیک برای هر تمرین" tone="primary" />
        <Tile icon={Trophy} title="چالش و جایزه" text="امتیاز جمع کن و جایزه بگیر" tone="accent" className="md:col-span-3" />
      </div>
    </section>
  );
}

function Tile({ icon: Icon, title, text, tone, className = '' }: { icon: typeof Zap; title: string; text: string; tone: 'primary' | 'accent'; className?: string }) {
  return (
    <motion.div {...reveal} whileHover={{ y: -6 }} className={`glass border-gradient group relative overflow-hidden rounded-3xl p-7 ${className}`}>
      <div className={`absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl transition group-hover:scale-150 ${tone === 'primary' ? 'bg-primary/20' : 'bg-accent/25'}`} />
      <span className={`relative mb-5 grid h-12 w-12 place-items-center rounded-2xl ${tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-accent/20 text-accent'}`}><Icon className="h-6 w-6" /></span>
      <h3 className="relative text-xl font-black">{title}</h3>
      <p className="relative mt-1 text-sm text-muted-foreground">{text}</p>
    </motion.div>
  );
}

export function Steps() {
  const steps = [
    { icon: UserPlus, t: 'ثبت‌نام در چند ثانیه', d: 'فقط با ایمیل وارد شو.' },
    { icon: Target, t: 'هدفت رو مشخص کن', d: 'پروفایل بدنی و هدف ورزشی‌ات رو بساز.' },
    { icon: Rocket, t: 'پرواز کن', d: 'برنامه، مربی و انگیزه — هر روز کنارت.' },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <motion.h2 {...reveal} className="mb-12 text-center text-4xl font-black">سه قدم تا <span className="text-gradient">نسخه بهتر تو</span></motion.h2>
      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="absolute inset-x-16 top-10 hidden h-px bg-gradient-to-l from-primary via-accent to-primary md:block" />
        {steps.map((s, i) => (
          <motion.div key={s.t} {...reveal} transition={{ duration: 0.6, delay: i * 0.15 }} className="relative text-center">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-primary/40 bg-background text-primary shadow-[0_0_40px_hsl(var(--primary)/0.25)]"><s.icon className="h-8 w-8" /></div>
            <div className="text-xs font-black text-accent">قدم {(i + 1).toLocaleString('fa-IR')}</div>
            <h3 className="mt-1 text-xl font-black">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div {...reveal} className="grain relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-center text-primary-foreground md:p-16">
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/60 blur-3xl" />
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
        <h2 className="relative text-4xl font-black leading-tight md:text-6xl">امروز شروع کن.<br />فردا تشکر کن.</h2>
        <p className="relative mx-auto mt-4 max-w-md font-medium opacity-80">عضویت رایگانه و کمتر از یک دقیقه طول می‌کشه.</p>
        <Button size="lg" onClick={onStart} className="group relative mt-8 h-14 rounded-full bg-background px-10 text-base font-bold text-foreground hover:bg-background/90">
          ورود / ثبت‌نام <ArrowLeft className="ms-2 h-5 w-5 transition group-hover:-translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
}
