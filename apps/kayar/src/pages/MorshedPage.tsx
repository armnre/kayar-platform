import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Headphones, Play, Pause, Bookmark, BookmarkCheck, RotateCcw, RotateCw } from 'lucide-react';
import { useAuth } from 'zitejs/auth';
import { saveListening } from 'zitejs/api';
import { Slider } from '@project/components/ui/slider';
import { cn } from '@project/components/lib/utils';
import { useCatalog, useMe, useRefresh, Audio, mmss, errMsg } from '../lib/data';
import { PageHeader, CardsSkeleton, Empty } from '../components/ui-kit';
import SafeImg from '../components/SafeImg';

const CATS = ['همه', 'ذخیره‌شده', 'پادکست', 'آموزشی', 'انگیزشی', 'موسیقی تمرین'];
const FALLBACK = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/xzi7aaogb719ssbKSRudkS/img_vG6Ea8C5fwnM0YqP.jpg';

export default function MorshedPage() {
  const { data, isLoading } = useCatalog();
  const { user } = useAuth();
  const me = useMe();
  const refresh = useRefresh();
  const [cat, setCat] = useState('همه');
  const [current, setCurrent] = useState<Audio>();
  const progress = useMemo(() => new Map((me.data?.listening ?? []).map((l) => [l.contentId, l])), [me.data]);
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({});
  const isSaved = (id: string) => optimistic[id] ?? !!progress.get(id)?.saved;
  const list = (data?.audio ?? []).filter((a) => cat === 'همه' || (cat === 'ذخیره‌شده' ? isSaved(a.id) : a.category === cat));

  const toggleSave = async (a: Audio) => {
    if (!user) return toast('برای ذخیره محتوا وارد شوید');
    const next = !isSaved(a.id);
    setOptimistic((o) => ({ ...o, [a.id]: next }));
    try { await saveListening({ contentId: a.id, saved: next }); refresh(); }
    catch (e) { setOptimistic((o) => ({ ...o, [a.id]: !next })); toast.error(errMsg(e)); }
  };

  return (
    <div>
      <PageHeader title="مرشد" sub="پادکست‌های توسعه فردی، آموزش و پلی‌لیست‌های باشگاه." />
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm', cat === c ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-white/10 text-muted-foreground')}>{c}</button>)}
      </div>
      {isLoading ? <CardsSkeleton n={8} /> : list.length === 0 ? <Empty icon={Headphones} title={cat === 'ذخیره‌شده' ? 'چیزی ذخیره نکرده‌ای' : 'محتوایی در این دسته نیست'} /> : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {list.map((a) => (
            <div key={a.id} className={cn('glass group overflow-hidden rounded-2xl transition', current?.id === a.id && 'border-primary glow')}>
              <button onClick={() => setCurrent(a)} className="relative block w-full">
                <SafeImg src={a.coverUrl} alt={a.title} className="aspect-square w-full object-cover transition group-hover:scale-105"
                  fallback={<img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/xzi7aaogb719ssbKSRudkS/img_vG6Ea8C5fwnM0YqP.jpg" alt={a.title} className="aspect-square w-full object-cover transition group-hover:scale-105" />} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-5 w-5" fill="currentColor" /></span>
              </button>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0"><div className="truncate text-sm font-bold">{a.title}</div><div className="truncate text-[11px] text-muted-foreground">{a.author} · {a.category}</div></div>
                <button onClick={() => toggleSave(a)} aria-label="ذخیره">{isSaved(a.id) ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5 text-muted-foreground" />}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {current && <Player key={current.id} a={current} start={progress.get(current.id)?.positionSeconds ?? 0} canSave={!!user} />}
    </div>
  );
}

function Player({ a, start, canSave }: { a: Audio; start: number; canSave: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(start);
  const [dur, setDur] = useState(a.durationSeconds);
  const lastSaved = useRef(start);
  const persist = (pos: number) => { if (canSave && Math.abs(pos - lastSaved.current) >= 10) { lastSaved.current = pos; saveListening({ contentId: a.id, positionSeconds: pos }).catch(() => {}); } };
  useEffect(() => { const el = ref.current; if (el && start) el.currentTime = start; el?.play().then(() => setPlaying(true)).catch(() => {}); }, [start]);
  const toggle = () => { const el = ref.current!; if (el.paused) el.play().then(() => setPlaying(true)).catch(() => toast.error('پخش این فایل ممکن نیست')); else { el.pause(); setPlaying(false); persist(el.currentTime); } };
  const seek = (d: number) => { ref.current!.currentTime = Math.max(0, ref.current!.currentTime + d); };

  return (
    <div className="glass fixed inset-x-3 bottom-28 z-40 rounded-2xl p-3 shadow-2xl md:bottom-4 md:left-auto md:right-4 md:w-[420px]">
      <audio ref={ref} src={a.audioUrl} onTimeUpdate={(e) => { setT(e.currentTarget.currentTime); persist(e.currentTarget.currentTime); }}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)} onEnded={() => setPlaying(false)}
        onError={() => toast.error('فایل صوتی در دسترس نیست')} />
      <div className="flex items-center gap-3">
        <SafeImg src={a.coverUrl} alt="" className="h-12 w-12 rounded-xl object-cover" fallback={<img src={FALLBACK} alt="" className="h-12 w-12 rounded-xl object-cover" />} />
        <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{a.title}</div><div className="truncate text-[11px] text-muted-foreground">{a.author}</div></div>
        <button onClick={() => seek(15)} aria-label="۱۵ ثانیه جلو"><RotateCw className="h-5 w-5 text-muted-foreground" /></button>
        <button onClick={toggle} className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground glow" aria-label="پخش">{playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}</button>
        <button onClick={() => seek(-15)} aria-label="۱۵ ثانیه عقب"><RotateCcw className="h-5 w-5 text-muted-foreground" /></button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground" dir="ltr">
        <span>{mmss(t)}</span>
        <Slider value={[t]} max={dur || 1} step={1} onValueChange={([v]) => { if (ref.current) ref.current.currentTime = v; }} className="flex-1" />
        <span>{mmss(dur)}</span>
      </div>
    </div>
  );
}
