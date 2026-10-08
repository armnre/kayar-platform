import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Users, Award } from 'lucide-react';
import { Skeleton } from '@project/components/ui/skeleton';
import SafeImg from '../../components/SafeImg';
import { useCatalog } from '../../lib/data';
import { Screen } from '../kit';
import { toFa } from '../store';

export default function CoachesScreen() {
  const { data, isLoading } = useCatalog();
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('همه');
  const tags = useMemo(() => ['همه', ...Array.from(new Set((data?.coaches ?? []).flatMap((c) => c.specialties))).slice(0, 8)], [data]);
  const list = (data?.coaches ?? []).filter((c) => (tag === 'همه' || c.specialties.includes(tag)) && (c.name + c.title).includes(q));

  return (
    <Screen title="مربیان کایار" right={<Users className="h-6 w-6 text-primary" />}>
      <div className="mb-4 flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-primary">
        <Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی مربی یا تخصص…" className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5">
        {tags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${tag === t ? 'border-primary bg-primary text-primary-foreground' : 'border-white/10 text-muted-foreground'}`}>{t}</button>
        ))}
      </div>
      {isLoading ? <div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-60 rounded-3xl" />)}</div>
        : !list.length ? <div className="py-16 text-center text-sm text-muted-foreground"><Users className="mx-auto mb-3 h-10 w-10" />مربی‌ای پیدا نشد</div>
        : (
          <div className="grid grid-cols-2 gap-3">
            {list.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/app/coaches/${c.id}`} className="block rounded-3xl border border-white/[0.08] bg-card/80 p-4 text-center transition active:scale-[0.97]">
                  <div className="relative mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent p-[3px]">
                    <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full rounded-full object-cover" fallback={<span className="grid h-full w-full place-items-center rounded-full bg-card text-2xl font-black text-primary">{c.name[0]}</span>} />
                    <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-background px-2 py-0.5 text-[10px] font-black text-primary ring-1 ring-primary/40"><Star className="h-3 w-3" fill="currentColor" />{toFa(c.rating)}</span>
                  </div>
                  <div className="mt-3 truncate font-black">{c.name}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{c.title}</div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground"><Award className="h-3 w-3 text-accent" />{toFa(c.yearsExperience)} سال تجربه</div>
                  <span className="mt-3 block rounded-full bg-primary py-2 text-xs font-black text-primary-foreground">مشاهده پروفایل</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
    </Screen>
  );
}
