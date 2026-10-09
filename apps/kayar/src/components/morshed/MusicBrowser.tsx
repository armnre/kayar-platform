import { useEffect, useRef, useState } from 'react';
import { Loader2, Music, RefreshCw, WifiOff, FlaskConical } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { GENRES, useJamendo } from '../../lib/jamendo';
import { errMsg } from '../../lib/data';
import type { Track } from '../../lib/player';
import { TrackRow, TrackRowsSkeleton } from './TrackRow';

/** Jamendo catalog: genre filter, search, infinite paging, and clear loading / empty / error states. */
export default function MusicBrowser({ q, isLiked, onLike }: { q: string; isLiked: (id: string) => boolean; onLike: (t: Track) => void }) {
  const [tag, setTag] = useState('');
  const j = useJamendo(q, tag);
  const sentinel = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = j;

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasNextPage) return undefined;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting && !isFetchingNextPage) fetchNextPage(); }, { rootMargin: '400px' });
    io.observe(node);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        {GENRES.map(([k, l]) => (
          <button key={k || 'all'} onClick={() => setTag(k)}
            className={cn('h-9 shrink-0 rounded-full border px-4 text-xs font-bold transition', tag === k ? 'border-primary bg-primary text-primary-foreground' : 'border-white/10 bg-white/[0.03] text-muted-foreground')}>{l}</button>
        ))}
      </div>
      {j.mock && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <FlaskConical className="h-4 w-4 shrink-0" />حالت تست (Mock): این فهرست ساختگی است و از Jamendo نیامده.
        </div>
      )}
      {j.isLoading ? <TrackRowsSkeleton />
        : j.isError && !j.tracks.length ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/[0.06] p-6 text-center">
            {typeof navigator !== 'undefined' && !navigator.onLine ? <WifiOff className="mx-auto mb-2 h-8 w-8 text-destructive" /> : <Music className="mx-auto mb-2 h-8 w-8 text-destructive" />}
            <p className="text-sm font-bold">دریافت موزیک ممکن نشد</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{errMsg(j.error)}</p>
            <button onClick={() => j.refetch()} className="mx-auto mt-3 flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
              {j.isRefetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}تلاش مجدد
            </button>
          </div>
        ) : !j.tracks.length ? (
          <div className="py-14 text-center text-sm text-muted-foreground"><Music className="mx-auto mb-3 h-10 w-10" />{q ? `برای «${q}» آهنگی پیدا نشد.` : 'آهنگی در این سبک پیدا نشد.'}</div>
        ) : (
          <div className="space-y-1">
            {j.tracks.map((t, i) => <TrackRow key={t.id} t={t} queue={j.tracks} index={i % 24} liked={isLiked(t.id)} onLike={() => onLike(t)} />)}
            <div ref={sentinel} className="h-8" />
            {j.isFetchingNextPage && <div className="flex justify-center py-3"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>}
            {j.isError && <button onClick={() => j.fetchNextPage()} className="mx-auto block py-3 text-xs font-bold text-primary">خطا در بارگذاری ادامه — تلاش مجدد</button>}
            {!j.hasNextPage && !j.isError && <p className="py-3 text-center text-[11px] text-muted-foreground">پایان نتایج</p>}
          </div>
        )}
      {!j.mock && <p className="mt-4 text-center text-[10px] leading-5 text-muted-foreground">موزیک‌ها از <a href="https://www.jamendo.com" target="_blank" rel="noreferrer" className="underline">Jamendo</a> با مجوز Creative Commons و فقط به‌صورت پخش آنلاین ارائه می‌شوند.</p>}
    </div>
  );
}
