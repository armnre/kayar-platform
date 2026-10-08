import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, CalendarCheck, Clock } from 'lucide-react';
import { Skeleton } from '@project/components/ui/skeleton';
import SafeImg from '../../components/SafeImg';
import { useCatalog } from '../../lib/data';
import { Screen, Card } from '../kit';
import { toFa } from '../store';
import NotFound from './NotFound';

export default function CoachDetail() {
  const { id } = useParams();
  const { data, isLoading } = useCatalog();
  if (isLoading) return <Screen back="/app/coaches"><Skeleton className="h-72 rounded-3xl" /></Screen>;
  const c = data?.coaches.find((x) => x.id === id);
  if (!c) return <NotFound />;
  return (
    <Screen back="/app/coaches" title="پروفایل مربی">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/15 to-card p-6 text-center">
        <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-[0_0_40px_hsl(var(--primary)/0.4)]">
          <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full rounded-full object-cover" fallback={<span className="grid h-full w-full place-items-center rounded-full bg-card text-4xl font-black text-primary">{c.name[0]}</span>} />
        </div>
        <div className="mt-4 text-2xl font-black">{c.name}</div>
        <div className="text-sm text-muted-foreground">{c.title}</div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-2xl bg-background/50 p-2"><Star className="mx-auto h-4 w-4 text-primary" fill="currentColor" /><b className="mt-1 block">{toFa(c.rating)}</b>امتیاز</div>
          <div className="rounded-2xl bg-background/50 p-2"><Award className="mx-auto h-4 w-4 text-accent" /><b className="mt-1 block">{toFa(c.yearsExperience)}</b>سال تجربه</div>
          <div className="rounded-2xl bg-background/50 p-2"><CalendarCheck className="mx-auto h-4 w-4 text-primary" /><b className="mt-1 block">{toFa(c.reviewCount)}</b>نظر</div>
        </div>
      </div>
      {c.specialties.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{c.specialties.map((s) => <span key={s} className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">{s}</span>)}</div>}
      {c.bio && <p className="mt-4 text-sm leading-7 text-muted-foreground">{c.bio}</p>}
      <div className="mb-3 mt-6 font-black">پلن‌های مربیگری</div>
      <div className="space-y-3">
        {c.plans.length ? c.plans.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="flex items-center gap-3">
              <div className="flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{toFa(p.durationWeeks)} هفته</span><span>{toFa(p.sessions)} جلسه</span></div>
              </div>
              <div className="text-left"><div className="font-black text-primary">{toFa(p.price.toLocaleString('en'))}</div><div className="text-[10px] text-muted-foreground">تومان</div></div>
            </Card>
          </motion.div>
        )) : <p className="text-sm text-muted-foreground">این مربی هنوز پلنی ثبت نکرده است.</p>}
      </div>
      <a href={`/coaches/${c.id}`} className="mt-6 flex h-14 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)]">رزرو جلسه با {c.name.split(' ')[0]}</a>
    </Screen>
  );
}
