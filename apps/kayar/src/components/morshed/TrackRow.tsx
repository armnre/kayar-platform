import { motion } from 'framer-motion';
import { Pause, Play, Loader2, Heart, AlertCircle } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Skeleton } from '@project/components/ui/skeleton';
import { usePlayer, Track } from '../../lib/player';
import { mmss } from '../../lib/data';
import Cover from './Cover';

/** One playable row. State (playing / loading / error) comes from the single global player. */
export function TrackRow({ t, queue, liked, onLike, index = 0, badge }: { t: Track; queue: Track[]; liked?: boolean; onLike?: () => void; index?: number; badge?: string }) {
  const p = usePlayer();
  const isCur = p.current?.id === t.id;
  const playable = !!t.audioUrl && !t.locked;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 8) * 0.03 }}
      className={cn('flex items-center gap-3 rounded-2xl border p-2 transition', isCur ? 'border-primary/50 bg-primary/[0.07]' : 'border-transparent hover:bg-white/[0.03]')}>
      <button onClick={() => p.play(t, queue)} disabled={!playable} aria-label={isCur && p.playing ? `توقف ${t.title}` : `پخش ${t.title}`}
        className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted disabled:cursor-not-allowed">
        <Cover a={t} className="h-full w-full" />
        <span className={cn('absolute inset-0 grid place-items-center bg-black/45 transition', isCur ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100')}>
          {!playable ? <AlertCircle className="h-5 w-5 text-white/70" />
            : isCur && p.status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin text-primary" />
            : isCur && p.playing ? <Pause className="h-5 w-5 text-primary" fill="currentColor" /> : <Play className="h-5 w-5 text-white" fill="currentColor" />}
        </span>
      </button>
      <button onClick={() => playable && p.play(t, queue)} className="min-w-0 flex-1 text-right">
        <div className={cn('truncate text-sm font-bold', isCur && 'text-primary')}>{t.title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
          {badge && <span className="rounded-full bg-white/10 px-1.5 py-px text-[10px]">{badge}</span>}
          <span className="truncate" dir="auto">{t.author}</span>
        </div>
      </button>
      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground" dir="ltr">{playable ? mmss(t.durationSeconds) : 'به‌زودی'}</span>
      {onLike && (
        <button onClick={onLike} aria-label="علاقه‌مندی" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition active:scale-90">
          <Heart className={cn('h-4 w-4', liked && 'fill-primary text-primary')} />
        </button>
      )}
    </motion.div>
  );
}

export function TrackRowsSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="در حال بارگذاری">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2"><Skeleton className="h-14 w-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-2/3" /><Skeleton className="h-3 w-1/3" /></div><Skeleton className="h-3 w-8" /></div>
      ))}
    </div>
  );
}
