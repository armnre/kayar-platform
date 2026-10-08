import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, Headphones, Trophy, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { useCatalog, fa } from '../lib/data';
import { SectionTitle, CardsSkeleton, Empty } from '../components/ui-kit';
import CoachCard from '../components/CoachCard';

const modules = [
  { to: '/bodyyar', icon: Zap, title: 'بدن‌یار', text: 'دستیار هوشمند و برنامه شخصی', tone: 'text-accent bg-accent/15' },
  { to: '/coaches', icon: Users, title: 'مربیان کایار', text: 'مربیان حرفه‌ای و متخصص', tone: 'text-primary bg-primary/15' },
  { to: '/morshed', icon: Headphones, title: 'مرشد', text: 'پادکست و موزیک تمرین', tone: 'text-accent bg-accent/15' },
  { to: '/rewards', icon: Trophy, title: 'چالش و جایزه', text: 'امتیاز بگیر، جایزه ببر', tone: 'text-primary bg-primary/15' },
];

export default function HomePage() {
  const { data, isLoading } = useCatalog();
  return (
    <div className="space-y-12">
      <Hero coaches={data?.coaches.length ?? 0} audio={data?.audio.length ?? 0} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {modules.map((m, i) => (
          <motion.div key={m.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
            <Link to={m.to} className="glass group block h-full rounded-2xl p-4 transition hover:border-primary/40 md:p-5">
              <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${m.tone}`}><m.icon className="h-6 w-6" /></div>
              <div className="text-lg font-extrabold">{m.title}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{m.text}</div>
              <ArrowLeft className="mt-3 h-4 w-4 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" />
            </Link>
          </motion.div>
        ))}
      </div>
      <section>
        <SectionTitle title="مربیان کایار" sub="با بهترین‌ها تمرین کن" action={<Link to="/coaches" className="text-sm text-primary">همه مربیان</Link>} />
        {isLoading ? <CardsSkeleton /> : data && data.coaches.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{data.coaches.slice(0, 4).map((c) => <CoachCard key={c.id} c={c} />)}</div>
        ) : <Empty icon={Users} title="هنوز مربی تأییدشده‌ای نداریم" text="به‌زودی مربیان حرفه‌ای اینجا معرفی می‌شوند." />}
      </section>
      <section className="relative overflow-hidden rounded-3xl border border-primary/20">
        <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/9yrof1ZLWXP4sXVwhZimgH/img_umkYVDp5QjZBrmfF.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/60 to-transparent" />
        <div className="relative max-w-lg p-6 md:p-10">
          <h3 className="text-2xl font-black md:text-3xl">آماده‌ای برای <span className="text-primary">نسخه بهتر خودت؟</span></h3>
          <p className="mt-2 text-sm text-white/80">با بدن‌یار، قدم‌به‌قدم به سمت سلامتی، قدرت و اعتمادبه‌نفس.</p>
          <Button asChild className="mt-5 rounded-full px-8 font-bold"><Link to="/bodyyar">برنامه‌ام رو بساز</Link></Button>
        </div>
      </section>
    </div>
  );
}

function Hero({ coaches, audio }: { coaches: number; audio: number }) {
  return (
    <section className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="order-2 md:order-1">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" /> همراه ورزشی و سلامت تو</div>
        <h1 className="text-4xl font-black leading-[1.25] md:text-6xl">تو فقط یک لباس نخریدی؛<br /><span className="text-primary glow-text">تو یه همراه داری</span></h1>
        <p className="mt-4 max-w-md text-muted-foreground">کایار، همراه ورزشی و سلامتی تو: با ابزارهای هوشمند، مربیان حرفه‌ای و محتوای اختصاصی.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-8 font-bold glow"><Link to="/bodyyar">برنامه‌ام رو بساز</Link></Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-primary/40 px-8"><Link to="/coaches">با مربی‌ها آشنا شو</Link></Button>
        </div>
        <div className="glass mt-8 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-white/10 rounded-2xl py-3 text-center">
          <div><div className="text-lg font-black text-primary">۲۴/۷</div><div className="text-[11px] text-muted-foreground">بدن‌یار هوشمند</div></div>
          <div><div className="text-lg font-black text-primary">{fa(audio)}+</div><div className="text-[11px] text-muted-foreground">محتوای صوتی</div></div>
          <div><div className="text-lg font-black text-primary">{fa(coaches)}+</div><div className="text-[11px] text-muted-foreground">مربی</div></div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative order-1 md:order-2">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/20 blur-3xl" />
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/30">
          <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/5Q8niSnGHWpRxmPjgYRRT1/img_xLGSvANH7NVuyCj7.jpg" alt="ورزشکار کایار" className="aspect-[4/3] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
