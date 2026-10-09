import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Music, Search, X, Mic } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import NotFound from './NotFound';
import { Screen } from '../kit';
import { setSession, useSession } from '../store';
import { useCatalog } from '../../lib/data';
import { fromAudio, Track, usePlayer } from '../../lib/player';
import NowPlaying from '../../components/morshed/NowPlaying';
import MusicBrowser from '../../components/morshed/MusicBrowser';
import { TrackRow, TrackRowsSkeleton } from '../../components/morshed/TrackRow';

type Tab = 'music' | 'pod' | 'liked';
const TABS: [Tab, string][] = [['music', 'موزیک'], ['pod', 'پادکست کایار'], ['liked', 'علاقه‌مندی']];

/** Morshed: Jamendo music + KAYAR's own audio, all played through the one global player. */
export default function MorshedScreen() {
  const { id } = useParams();
  const { data, isLoading } = useCatalog();
  const s = useSession();
  const p = usePlayer();
  const [tab, setTab] = useState<Tab>(id ? 'pod' : 'music');
  const [q, setQ] = useState('');
  const [dq] = useDebounce(q, 400);

  const pods = useMemo(() => (data?.audio ?? []).map(fromAudio), [data]);
  const podList = useMemo(() => pods.filter((t) => !dq || t.title.includes(dq) || t.author.includes(dq)), [pods, dq]);
  const likedIds = new Set([...(s.liked ?? []), ...(s.likedTracks ?? []).map((t) => t.id)]);
  const likedList = [...pods.filter((t) => s.liked?.includes(t.id)), ...(s.likedTracks ?? [])];

  const toggleLike = (t: Track) => {
    if (t.source === 'morshed') setSession((x) => ({ liked: x.liked?.includes(t.id) ? x.liked.filter((i) => i !== t.id) : [...(x.liked ?? []), t.id] }));
    else setSession((x) => ({ likedTracks: x.likedTracks?.some((i) => i.id === t.id) ? x.likedTracks.filter((i) => i.id !== t.id) : [...(x.likedTracks ?? []), t] }));
  };

  const linked = id ? pods.find((t) => t.id === id) : undefined;
  if (id && !isLoading && !linked) return <NotFound />;
  const badge = (t: Track) => (t.id.startsWith('demo-') ? 'نمونه' : undefined);

  return (
    <Screen title={<span>مرشد<span className="block text-xs font-medium text-muted-foreground">موزیک و پادکست برای همراهی تمرین</span></span>}
      right={<span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary"><Headphones className="h-5 w-5" /></span>}>
      <NowPlaying />
      {linked && p.current?.id !== linked.id && (
        <div className="mb-4 rounded-3xl border border-primary/30 bg-primary/[0.05] p-2"><TrackRow t={linked} queue={pods} badge={badge(linked)} /></div>
      )}

      <div className="mb-4 flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-primary">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === 'music' ? 'جستجوی آهنگ، هنرمند یا سبک…' : 'جستجو در پادکست‌ها…'} aria-label="جستجو" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        {q && <button onClick={() => setQ('')} aria-label="پاک کردن"><X className="h-4 w-4 text-muted-foreground" /></button>}
      </div>
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="relative h-10 rounded-xl text-[13px] font-bold">
            {tab === k && <motion.span layoutId="mtabs" className="absolute inset-0 rounded-xl bg-primary" />}
            <span className={`relative ${tab === k ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{l}</span>
          </button>
        ))}
      </div>

      {tab === 'music' && <MusicBrowser q={dq} isLiked={(i) => likedIds.has(i)} onLike={toggleLike} />}

      {tab === 'pod' && (isLoading ? <TrackRowsSkeleton n={4} />
        : !podList.length ? <Empty icon={<Mic className="mx-auto mb-3 h-10 w-10" />} text={dq ? 'پادکستی با این عنوان پیدا نشد.' : 'هنوز پادکستی منتشر نشده است.'} />
        : <div className="space-y-1">{podList.map((t, i) => <TrackRow key={t.id} t={t} queue={podList} index={i} badge={badge(t)} liked={likedIds.has(t.id)} onLike={() => toggleLike(t)} />)}</div>)}

      {tab === 'liked' && (!likedList.length ? <Empty icon={<Music className="mx-auto mb-3 h-10 w-10" />} text="هنوز چیزی را به علاقه‌مندی‌ها اضافه نکرده‌ای." />
        : <div className="space-y-1">{likedList.map((t, i) => <TrackRow key={t.id} t={t} queue={likedList} index={i} liked onLike={() => toggleLike(t)} />)}</div>)}
    </Screen>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="py-14 text-center text-sm text-muted-foreground">{icon}{text}</div>;
}
