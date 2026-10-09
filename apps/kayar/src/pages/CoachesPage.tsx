import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, SlidersHorizontal, X, UserPlus } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import { Switch } from '@project/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { cn } from '@project/components/lib/utils';
import { useCatalog } from '../lib/data';
import { CATEGORIES, SPECIALTIES, SERVICES, LEVELS } from '../lib/coach';
import { PageHeader, CardsSkeleton, Empty } from '../components/ui-kit';
import CoachCard from '../components/CoachCard';

const ALL = 'all';

export default function CoachesPage() {
  const { data, isLoading, isError, refetch } = useCatalog();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(ALL);
  const [spec, setSpec] = useState(ALL);
  const [svc, setSvc] = useState(ALL);
  const [lvl, setLvl] = useState(ALL);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('rating');
  const list = useMemo(() => (data?.coaches ?? [])
    .filter((c) => (cat === ALL || c.category === cat) && (spec === ALL || c.specialties.includes(spec)) && (svc === ALL || c.services.includes(svc))
      && (lvl === ALL || c.levels.includes(lvl)) && (!open || c.acceptingClients)
      && [c.name, c.title, c.sports, c.city].join(' ').includes(q.trim()))
    .sort((a, b) => sort === 'rating' ? (b.reviewCount ? b.rating : 0) - (a.reviewCount ? a.rating : 0) : sort === 'reviews' ? b.reviewCount - a.reviewCount : b.yearsExperience - a.yearsExperience),
  [data, q, cat, spec, svc, lvl, open, sort]);
  const active = [spec, svc, lvl].filter((x) => x !== ALL).length + (open ? 1 : 0);
  const reset = () => { setSpec(ALL); setSvc(ALL); setLvl(ALL); setOpen(false); setCat(ALL); setQ(''); };
  const sel = (v: string, on: (v: string) => void, opts: string[], ph: string) => (
    <Select value={v} onValueChange={on}><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={ph} /></SelectTrigger>
      <SelectContent><SelectItem value={ALL}>{ph}: همه</SelectItem>{opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title="مربیان" accent="کایار" sub="مربی تأییدشده متناسب با هدف و سطحت را پیدا کن." />
        <Button asChild variant="outline" className="mb-6 rounded-full"><Link to="/coach/apply"><UserPlus className="ml-2 h-4 w-4" />مربی هستید؟</Link></Button>
      </div>
      <div className="sticky top-16 z-30 -mx-4 mb-5 space-y-3 bg-background/85 px-4 py-3 backdrop-blur-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="نام، رشته یا شهر…" className="h-12 rounded-2xl pr-11" />
          </div>
          <Select value={sort} onValueChange={setSort}><SelectTrigger className="h-12 w-36 rounded-2xl"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="rating">بیشترین امتیاز</SelectItem><SelectItem value="reviews">بیشترین نظر</SelectItem><SelectItem value="exp">بیشترین سابقه</SelectItem></SelectContent></Select>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {[ALL, ...CATEGORIES].map((s) => (
            <button key={s} onClick={() => setCat(s)} className={cn('min-h-10 shrink-0 rounded-full border px-4 text-sm transition', cat === s ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>{s === ALL ? 'همه' : s}</button>
          ))}
        </div>
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="h-4 w-4" />فیلترهای بیشتر{active > 0 && <span className="rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">{active.toLocaleString('fa-IR')}</span>}</summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {sel(spec, setSpec, SPECIALTIES, 'تخصص')}{sel(svc, setSvc, SERVICES, 'خدمت')}{sel(lvl, setLvl, LEVELS, 'سطح')}
            <label className="flex h-11 items-center justify-between rounded-xl border border-border px-3 text-sm">فقط پذیرش شاگرد<Switch checked={open} onCheckedChange={setOpen} /></label>
          </div>
        </details>
      </div>
      {isLoading ? <CardsSkeleton n={8} /> : isError ? <Empty icon={Users} title="بارگذاری مربیان ناموفق بود" action={<Button variant="outline" onClick={() => refetch()}>تلاش دوباره</Button>} />
        : list.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{list.map((c) => <CoachCard key={c.id} c={c} />)}</div>
        : <Empty icon={Users} title={data?.coaches.length ? 'مربی‌ای با این فیلترها پیدا نشد' : 'هنوز مربی تأییدشده‌ای نداریم'} text={data?.coaches.length ? 'فیلترها را تغییر دهید.' : 'به‌زودی مربیان حرفه‌ای اینجا معرفی می‌شوند.'}
          action={data?.coaches.length ? <Button variant="outline" onClick={reset}><X className="ml-1 h-4 w-4" />حذف فیلترها</Button> : undefined} />}
    </div>
  );
}
