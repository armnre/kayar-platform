import { useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { cn } from '@project/components/lib/utils';
import { useCatalog } from '../lib/data';
import { PageHeader, CardsSkeleton, Empty } from '../components/ui-kit';
import CoachCard from '../components/CoachCard';

const SPECS = ['همه', 'فیتنس', 'بدنسازی', 'کاردیو', 'یوگا', 'تغذیه', 'اصلاح فرم'];

export default function CoachesPage() {
  const { data, isLoading } = useCatalog();
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('همه');
  const [sort, setSort] = useState<'rating' | 'exp'>('rating');
  const list = useMemo(() => (data?.coaches ?? [])
    .filter((c) => (spec === 'همه' || c.specialties.includes(spec)) && (c.name + c.title).includes(q.trim()))
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : b.yearsExperience - a.yearsExperience), [data, q, spec, sort]);

  return (
    <div>
      <PageHeader title="مربیان" accent="کایار" sub="مربی مناسب هدفت را پیدا کن، پلن را انتخاب کن و جلسه رزرو کن." />
      <div className="relative mb-4">
        <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی مربی…" className="h-12 rounded-2xl pr-11" />
      </div>
      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        {SPECS.map((s) => (
          <button key={s} onClick={() => setSpec(s)} className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm transition', spec === s ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-white/10 text-muted-foreground hover:text-foreground')}>{s}</button>
        ))}
      </div>
      <div className="mb-5 flex gap-4 text-xs text-muted-foreground">
        مرتب‌سازی:
        <button className={cn(sort === 'rating' && 'font-bold text-primary')} onClick={() => setSort('rating')}>بیشترین امتیاز</button>
        <button className={cn(sort === 'exp' && 'font-bold text-primary')} onClick={() => setSort('exp')}>بیشترین سابقه</button>
      </div>
      {isLoading ? <CardsSkeleton n={8} /> : list.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{list.map((c) => <CoachCard key={c.id} c={c} />)}</div>
      ) : <Empty icon={Users} title="مربی‌ای پیدا نشد" text="فیلتر یا عبارت جستجو را تغییر دهید." />}
    </div>
  );
}
