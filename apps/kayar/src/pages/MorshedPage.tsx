import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Headphones, Play, Pause, Bookmark, BookmarkCheck, Lock, Search } from 'lucide-react';
import { useAuth } from 'zitejs/auth';
import { saveListening } from 'zitejs/api';
import { Input } from '@project/components/ui/input';
import { cn } from '@project/components/lib/utils';
import { useCatalog, useMe, useRefresh, Audio, mmss, errMsg } from '../lib/data';
import { usePlayer } from '../lib/player';
import { PageHeader, CardsSkeleton, Empty, SectionTitle } from '../components/ui-kit';
import Cover from '../components/morshed/Cover';

const CATS = ['همه', 'ذخیره‌شده', 'پادکست', 'آموزشی', 'انگیزشی', 'موسیقی تمرین'];

export function useSaved() {
  const { user } = useAuth();
  const me = useMe();
  const refresh = useRefresh();
  const [opt, setOpt] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => new Map((me.data?.listening ?? []).map((l) => [l.contentId, l])), [me.data]);
  const isSaved = (id: string) => opt[id] ?? !!progress.get(id)?.saved;
  const toggle = async (a: Audio) => {
    if (!user) return toast('برای ذخیره محتوا وارد شوید');
    const next = !isSaved(a.id);
    setOpt((o) => ({ ...o, [a.id]: next }));
    try { await saveListening({ contentId: a.id, saved: next }); refresh(); }
    catch (e) { setOpt((o) => ({ ...o, [a.id]: !next })); toast.error(errMsg(e)); }
  };
  return { progress, isSaved, toggle };
}

export default function MorshedPage() {
  const { data, isLoading } = useCatalog();
  const { progress, isSaved, toggle } = useSaved();
  const player = usePlayer();
  const [cat, setCat] = useState('همه');
  const [q, setQ] = useState('');
  const all = data?.audio ?? [];
  const featured = all.find((a) => a.featured) ?? all[0];
  const resume = all.filter((a) => (progress.get(a.id)?.positionSeconds ?? 0) > 5).slice(0, 6);
  const list = all.filter((a) => (cat === 'همه' || (cat === 'ذخیره‌شده' ? isSaved(a.id) : a.category === cat)) && (!q || `${a.title} ${a.author}`.includes(q)));

  return (
    <div className="space-y-8">
      <PageHeader title="مرشد" accent="صوتی" sub="پادکست، آموزش و پلی‌لیست‌های باشگاه — هر جا متوقف شدی، از همان‌جا ادامه بده." />
      {isLoading ? <CardsSkeleton n={8} /> : all.length === 0 ? <Empty icon={Headphones} title="هنوز محتوایی منتشر نشده" text="به‌زودی محتوای صوتی مرشد این‌جا قرار می‌گیرد." /> : (
        <>
          {featured && <Featured a={featured} onPlay={() => player.play(featured, all)} active={player.current?.id === featured.id && player.playing} />}
          {resume.length > 0 && (
            <section>
              <SectionTitle title="ادامه گوش دادن" />
              <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
                {resume.map((a) => {
                  const pos = progress.get(a.id)?.positionSeconds ?? 0;
                  return (
                    <button key={a.id} onClick={() => player.play(a, resume)} className="glass flex w-64 shrink-0 items-center gap-3 rounded-2xl p-2 text-right">
                      <Cover a={a} className="h-14 w-14 rounded-xl" />
                      <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{a.title}</div>
                        <div className="mt-2 h-1 rounded-full bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (pos / (a.durationSeconds || 1)) * 100)}%` }} /></div>
                        <div className="mt-1 text-[10px] text-muted-foreground">{mmss(Math.max(0, a.durationSeconds - pos))} باقی‌مانده</div></div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
          <section>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
                {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm', cat === c ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-white/10 text-muted-foreground')}>{c}</button>)}
              </div>
              <div className="relative md:w-64"><Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو در مرشد" className="h-10 rounded-full pr-9" /></div>
            </div>
            {list.length === 0 ? <Empty icon={Headphones} title={cat === 'ذخیره‌شده' ? 'چیزی ذخیره نکرده‌ای' : 'محتوایی پیدا نشد'} /> : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {list.map((a) => (
                  <div key={a.id} className={cn('glass group overflow-hidden rounded-2xl', player.current?.id === a.id && 'border-primary')}>
                    <div className="relative">
                      <Link to={`/morshed/${a.id}`}><Cover a={a} className="aspect-square w-full transition group-hover:scale-105" /></Link>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <button onClick={() => player.play(a, list)} aria-label="پخش" className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                        {a.locked ? <Lock className="h-4 w-4" /> : player.current?.id === a.id && player.playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-[10px]" dir="ltr">{mmss(a.durationSeconds)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 p-3">
                      <Link to={`/morshed/${a.id}`} className="min-w-0"><div className="truncate text-sm font-bold">{a.title}</div><div className="truncate text-[11px] text-muted-foreground">{a.author} · {a.category}</div></Link>
                      <button onClick={() => toggle(a)} aria-label="ذخیره">{isSaved(a.id) ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5 text-muted-foreground" />}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Featured({ a, onPlay, active }: { a: Audio; onPlay: () => void; active: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10">
      <Cover a={a} className="absolute inset-0 h-full w-full scale-110 blur-2xl opacity-50" />
      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center md:p-8">
        <Link to={`/morshed/${a.id}`}><Cover a={a} className="h-40 w-40 rounded-2xl shadow-2xl md:h-48 md:w-48" /></Link>
        <div className="min-w-0">
          <span className="text-xs font-bold text-primary">پیشنهاد مرشد · {a.category}</span>
          <h2 className="mt-1 text-2xl font-black md:text-3xl">{a.title}</h2>
          <p className="mt-2 line-clamp-2 max-w-xl text-sm text-muted-foreground">{a.description}</p>
          <button onClick={onPlay} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-bold text-primary-foreground">
            {active ? <Pause className="h-4 w-4" fill="currentColor" /> : a.locked ? <Lock className="h-4 w-4" /> : <Play className="h-4 w-4" fill="currentColor" />}{active ? 'توقف' : 'پخش'}
          </button>
        </div>
      </div>
    </div>
  );
}
