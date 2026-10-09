import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Headphones, Music, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@project/components/ui/skeleton';
import SafeImg from '../../components/SafeImg';
import { useCatalog, Audio } from '../../lib/data';
import { Screen } from '../kit';
import { setSession, useSession, toFa } from '../store';

const GRADS = ['from-lime-400/70', 'from-violet-500/70', 'from-cyan-500/70', 'from-amber-500/70', 'from-rose-500/70', 'from-emerald-500/70'];
const isMusic = (a: Audio) => /موزیک|موسیقی|music|playlist/i.test(a.category);
const mm = (s: number) => `${toFa(Math.floor(s / 60))}:${toFa(String(Math.floor(s % 60)).padStart(2, '0'))}`;

export default function MorshedScreen() {
  const { data, isLoading } = useCatalog();
  const s = useSession();
  const liked = s.liked ?? [];
  const [tab, setTab] = useState<'pod' | 'music' | 'liked'>('pod');
  const [q, setQ] = useState('');
  const [cur, setCur] = useState<Audio | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const el = useRef<HTMLAudioElement>(null);
  // /app/morshed/:id deep link → open that item in the player (no autoplay; browsers block it anyway).
  const { id } = useParams();
  const linked = id ? data?.audio.find((a) => a.id === id) : undefined;
  useEffect(() => { if (linked) { setCur(linked); setTab(isMusic(linked) ? 'music' : 'pod'); } }, [linked?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => (data?.audio ?? []).filter((a) =>
    (tab === 'liked' ? liked.includes(a.id) : tab === 'music' ? isMusic(a) : !isMusic(a)) && a.title.includes(q)), [data, tab, q, liked]);

  const play = (a: Audio) => {
    if (cur?.id === a.id) { playing ? el.current?.pause() : el.current?.play().catch(() => toast.error('پخش این فایل ممکن نیست.')); return; }
    setCur(a); setT(0);
    setTimeout(() => el.current?.play().catch(() => { setPlaying(false); toast.error('فایل صوتی هنوز بارگذاری نشده است.'); }), 50);
  };
  const like = (id: string) => setSession({ liked: liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id] });
  if (id && !isLoading && !linked) return <NotFound />;
  const dur = cur?.durationSeconds || el.current?.duration || 1;

  return (
    <Screen title={<span>مرشد<span className="block text-xs font-medium text-muted-foreground">پادکست و موزیک برای نسخه بهتر تو</span></span>} right={<span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary"><Headphones className="h-5 w-5" /></span>}>
      <div className="mb-4 flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-primary">
        <Search className="h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو در مرشد…" className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      <div className="mb-5 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
        {([['pod', 'پادکست‌ها'], ['music', 'موزیک‌ها'], ['liked', 'علاقه‌مندی']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="relative h-10 rounded-xl text-sm font-bold">
            {tab === k && <motion.span layoutId="mtabs" className="absolute inset-0 rounded-xl bg-primary" />}
            <span className={`relative ${tab === k ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{l}</span>
          </button>
        ))}
      </div>

      {!cur && !q && tab !== 'liked' && (() => {
        const f = (data?.audio ?? []).find((a) => a.featured) ?? data?.audio[0];
        if (!f) return null;
        return (
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onClick={() => play(f)}
            className="grain relative mb-6 block h-48 w-full overflow-hidden rounded-[2rem] border border-white/10 text-right">
            <img src="https://images.fillout.com/886978/vxifokrwnr/generated-images/cbdB6kJHZ9StPpLHYzZmd8/img_tqRVkqrDXZUKNjNp.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-left" />
            <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-transparent" />
            <div className="absolute inset-y-0 right-0 flex w-2/3 flex-col justify-center gap-2 p-5">
              <span className="w-fit rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-black text-primary backdrop-blur">پیشنهاد امروز</span>
              <div className="line-clamp-2 text-lg font-black leading-7 text-white">{f.title}</div>
              <div className="text-[11px] text-white/60">{f.author || f.category} · {mm(f.durationSeconds)}</div>
            </div>
            <span className="absolute bottom-5 left-5 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.7)]"><Play className="h-6 w-6" fill="currentColor" /></span>
            <div className="absolute bottom-6 left-24 flex h-6 items-end gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => <motion.span key={i} className="w-1 rounded-full bg-primary" animate={{ height: [6, 22, 10, 18, 6] }} transition={{ duration: 1.2, delay: i * 0.12, repeat: Infinity }} />)}
            </div>
          </motion.button>
        );
      })()}

      {cur && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 to-card p-4">
          <div className="flex items-center gap-3">
            <SafeImg src={cur.coverUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" fallback={<span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/30"><Music className="h-7 w-7" /></span>} />
            <div className="min-w-0 flex-1"><div className="truncate font-black">{cur.title}</div><div className="truncate text-xs text-muted-foreground">{cur.author || cur.category}</div></div>
            <button onClick={() => play(cur)} className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.6)]">{playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}</button>
          </div>
          <input type="range" min={0} max={dur} value={t} onChange={(e) => { if (el.current) el.current.currentTime = +e.target.value; }} className="mt-4 w-full accent-[hsl(var(--primary))]" />
          <div className="flex justify-between text-[10px] text-muted-foreground"><span>{mm(dur)}</span><span>{mm(t)}</span></div>
          <audio ref={el} src={cur.audioUrl} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} />
        </motion.div>
      )}

      {isLoading ? <div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square rounded-3xl" />)}</div>
        : !list.length ? <div className="py-16 text-center text-sm text-muted-foreground"><Music className="mx-auto mb-3 h-10 w-10" />{tab === 'liked' ? 'هنوز چیزی رو لایک نکردی' : 'محتوایی پیدا نشد'}</div>
        : (
          <div className="grid grid-cols-2 gap-3">
            {list.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className={`group relative aspect-square overflow-hidden rounded-3xl border bg-gradient-to-br ${GRADS[i % GRADS.length]} to-card ${cur?.id === a.id ? 'border-primary' : 'border-white/10'}`}>
                <SafeImg src={a.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" fallback={null} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <button onClick={() => like(a.id)} className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur" aria-label="علاقه‌مندی">
                  <Heart className={`h-4 w-4 ${liked.includes(a.id) ? 'fill-primary text-primary' : ''}`} />
                </button>
                <button onClick={() => play(a)} className="absolute inset-x-3 bottom-3 flex items-end justify-between text-right">
                  <div className="min-w-0"><div className="line-clamp-2 text-sm font-black leading-6">{a.title}</div><div className="text-[10px] text-white/70">{mm(a.durationSeconds)}</div></div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">{cur?.id === a.id && playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
    </Screen>
  );
}
