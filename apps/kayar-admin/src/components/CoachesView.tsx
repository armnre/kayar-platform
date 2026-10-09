import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertTriangle, Inbox } from 'lucide-react';
import { listCoaches } from 'zitejs/api';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import CoachSheet, { TONE } from './CoachSheet';


const TABS = ['در انتظار تایید', 'نیاز به اصلاح', 'تایید شده', 'رد شده', 'معلق', 'همه'];

export default function CoachesView() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['coaches'], queryFn: () => listCoaches({}) });
  const [tab, setTab] = useState(TABS[0]);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<string>();
  const all = data?.coaches ?? [];
  const list = useMemo(() => all.filter((c) => (tab === 'همه' || c.status === tab) && [c.name, c.email, c.phone, c.city, c.category].join(' ').includes(q.trim())), [all, tab, q]);
  const count = (t: string) => (t === 'همه' ? all.length : all.filter((c) => c.status === t).length);
  return (
    <div>
      <main className="space-y-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn('flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm', tab === t ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-border text-muted-foreground')}>
              {t}<span className="rounded-full bg-background/30 px-1.5 text-xs">{count(t).toLocaleString('fa-IR')}</span>
            </button>
          ))}
        </div>
        <div className="relative"><Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجو با نام، ایمیل، موبایل، شهر…" className="h-12 rounded-2xl pr-11" /></div>
        {isLoading ? <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
          : isError ? <div className="rounded-2xl border border-border p-10 text-center"><AlertTriangle className="mx-auto mb-2 h-8 w-8 text-destructive" />بارگذاری ناموفق بود<div className="mt-3"><Button variant="outline" onClick={() => refetch()}>تلاش دوباره</Button></div></div>
          : list.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground"><Inbox className="mx-auto mb-2 h-8 w-8 text-primary" />موردی در این بخش نیست.</div>
          : <div className="space-y-2">{list.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-right transition hover:border-primary/50">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">{c.avatarUrl ? <img src={c.avatarUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-black text-primary">{c.name[0]}</div>}</div>
              <div className="min-w-0 flex-1"><div className="truncate font-bold">{c.name || 'بدون نام'}</div><div className="truncate text-xs text-muted-foreground">{c.title} · {c.city || '—'} · {c.documents.length.toLocaleString('fa-IR')} مدرک</div></div>
              <div className="hidden text-xs text-muted-foreground sm:block">{c.category || 'بدون دسته'}</div>
              <Badge className={cn('shrink-0 rounded-full border-0', TONE[c.status])}>{c.status}</Badge>
            </button>
          ))}</div>}
      </main>
      <CoachSheet coach={all.find((c) => c.id === sel)} onClose={() => setSel(undefined)} />
    </div>
  );
}
