import { Link } from 'react-router-dom';
import { Headphones, Users, Star, Play } from 'lucide-react';
import { Skeleton } from '@project/components/ui/skeleton';
import SafeImg from '../../components/SafeImg';
import { useCatalog } from '../../lib/data';
import { Screen, Card } from '../kit';
import { toFa } from '../store';

export default function Explore({ kind }: { kind: 'morshed' | 'coaches' }) {
  const { data, isLoading } = useCatalog();
  const isM = kind === 'morshed';
  return (
    <Screen title={isM ? 'مرشد' : 'مربیان کایار'}>
      <p className="-mt-3 mb-5 text-sm text-muted-foreground">{isM ? 'پادکست و موزیک برای هر تمرین' : 'با بهترین‌ها تمرین کن'}</p>
      {isLoading ? <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-3xl" />)}</div> : (
        <div className="space-y-3">
          {isM ? data?.audio.map((a) => (
            <Link key={a.id} to="/morshed">
              <Card className="mb-3 flex items-center gap-3">
                <SafeImg src={a.coverUrl} alt="" className="h-14 w-14 rounded-2xl object-cover" fallback={<span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/20 text-accent"><Headphones className="h-6 w-6" /></span>} />
                <div className="min-w-0 flex-1"><div className="truncate font-bold">{a.title}</div><div className="truncate text-xs text-muted-foreground">{a.category}</div></div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-4 w-4" fill="currentColor" /></span>
              </Card>
            </Link>
          )) : data?.coaches.map((c) => (
            <Link key={c.id} to={`/coaches/${c.id}`}>
              <Card className="mb-3 flex items-center gap-3">
                <SafeImg src={c.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" fallback={<span className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><Users className="h-6 w-6" /></span>} />
                <div className="min-w-0 flex-1"><div className="truncate font-bold">{c.name}</div><div className="truncate text-xs text-muted-foreground">{c.title}</div></div>
                <span className="flex items-center gap-1 text-sm font-bold text-primary"><Star className="h-4 w-4" fill="currentColor" />{toFa(c.rating ?? 0)}</span>
              </Card>
            </Link>
          ))}
          {!(isM ? data?.audio.length : data?.coaches.length) && <div className="py-16 text-center text-sm text-muted-foreground">به‌زودی محتوا اضافه می‌شود.</div>}
        </div>
      )}
    </Screen>
  );
}
