import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Timer, Coins, Zap, ArrowLeft } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { useMe, fa } from '../../lib/data';

const IMG = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/5Q8niSnGHWpRxmPjgYRRT1/img_xLGSvANH7NVuyCj7.jpg';

export default function HomeHero() {
  const { user, isLoading } = useAuth();
  const me = useMe();
  return (
    <section className="grain relative overflow-hidden rounded-[2rem] border border-border">
      <img src={IMG} alt="" className="absolute inset-0 h-full w-full object-cover object-left" />
      <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/20" />
      <div className="relative grid gap-6 p-6 md:p-10 lg:grid-cols-[1.3fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {isLoading || (user && me.isLoading) ? <Skeleton className="h-40 w-full max-w-md rounded-2xl" /> : user && me.data ? (
            <>
              <p className="text-sm text-muted-foreground">سلام {me.data.profile.displayName} 👋</p>
              <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">امروز یک قدم<br /><span className="text-primary">قوی‌تر</span> از دیروز</h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-7 font-bold glow"><Link to="/bodyyar"><Zap className="ml-1 h-4 w-4" />ادامه برنامه</Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary/40 px-7"><Link to="/coaches">پیدا کردن مربی</Link></Button>
              </div>
            </>
          ) : (
            <>
              <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">اکوسیستم ورزشی کایار</span>
              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">ورزش، مربی، انگیزه<br /><span className="text-primary">همه در یک جا</span></h1>
              <p className="mt-3 max-w-md text-muted-foreground">برنامه هوشمند بدن‌یار، مربیان تأییدشده، محتوای مرشد و چالش‌های جایزه‌دار.</p>
              <Button size="lg" className="mt-6 rounded-full px-8 font-bold glow" onClick={() => loginWithRedirect()}>شروع رایگان</Button>
            </>
          )}
        </motion.div>
        {user && me.data && <Stats />}
      </div>
    </section>
  );
}

function Stats() {
  const { data } = useMe();
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
  const week = (data?.activity ?? []).filter((a) => a.date >= weekAgo);
  const items = [
    { i: Timer, l: 'دقیقه تمرین این هفته', v: fa(week.reduce((s, a) => s + a.durationMinutes, 0)) },
    { i: Flame, l: 'کالری این هفته', v: fa(week.reduce((s, a) => s + a.calories, 0)) },
    { i: Coins, l: 'امتیاز کایار', v: fa(data?.profile.points ?? 0) },
  ];
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-2 self-end lg:grid-cols-1">
      {items.map((s) => (
        <div key={s.l} className="glass flex flex-col gap-1 rounded-2xl p-3 lg:flex-row lg:items-center lg:gap-3 lg:p-4">
          <s.i className="h-5 w-5 text-primary" /><div className="text-lg font-black lg:text-2xl">{s.v}</div><div className="text-[11px] text-muted-foreground lg:mr-auto">{s.l}</div>
        </div>
      ))}
      {week.length === 0 && <Link to="/bodyyar" className="col-span-3 flex items-center justify-between rounded-2xl bg-primary/10 p-3 text-xs text-primary lg:col-span-1">اولین تمرین این هفته را ثبت کن<ArrowLeft className="h-4 w-4" /></Link>}
    </motion.div>
  );
}
