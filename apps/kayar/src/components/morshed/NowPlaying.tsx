import { motion } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward, Loader2, RefreshCw, RotateCcw, RotateCw, ExternalLink, X } from 'lucide-react';
import { usePlayer } from '../../lib/player';
import { mmss } from '../../lib/data';
import Cover from './Cover';

/** Full player card for the Morshed screen (same global player as the mini player). */
export default function NowPlaying() {
  const p = usePlayer();
  const c = p.current;
  if (!c) return null;
  const dur = p.dur || c.durationSeconds || 0;
  const pct = dur ? Math.min(100, (p.t / dur) * 100) : 0;
  return (
    <motion.section initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} aria-label="در حال پخش"
      className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-4">
      <button onClick={p.close} aria-label="بستن پخش‌کننده" className="absolute left-3 top-3 p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
      <div className="flex items-center gap-3">
        <Cover a={c} className="h-16 w-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 pl-6">
          <div className="truncate font-black" dir="auto">{c.title}</div>
          <div className="truncate text-xs text-muted-foreground" dir="auto">{c.author}</div>
          {c.source === 'jamendo' && (
            <a href={c.licenseUrl || 'https://www.jamendo.com'} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground underline-offset-2 hover:underline">
              Jamendo · مجوز Creative Commons <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {c.source === 'mock' && <span className="mt-1 inline-block rounded bg-amber-500/20 px-1.5 text-[10px] text-amber-300">داده آزمایشی (Mock)</span>}
        </div>
      </div>
      <input type="range" min={0} max={dur || 1} step={1} value={Math.min(p.t, dur || 1)} onChange={(e) => p.seekTo(+e.target.value)} aria-label="نوار پیشرفت"
        className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[hsl(var(--primary))]"
        style={{ background: `linear-gradient(to left, hsl(var(--primary)) ${pct}%, hsl(0 0% 100% / 0.1) ${pct}%)` }} />
      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground" dir="ltr"><span>{mmss(p.t)}</span><span>{mmss(dur)}</span></div>
      <div className="mt-2 flex items-center justify-center gap-4" dir="ltr">
        <button onClick={p.prev} aria-label="قبلی" className="p-2 text-foreground/80"><SkipBack className="h-5 w-5" /></button>
        <button onClick={() => p.skip(-15)} aria-label="۱۵ ثانیه عقب" className="p-2 text-muted-foreground"><RotateCcw className="h-5 w-5" /></button>
        {p.status === 'error' ? (
          <button onClick={p.retry} aria-label="تلاش مجدد" className="grid h-14 w-14 place-items-center rounded-full bg-destructive/20 text-destructive"><RefreshCw className="h-6 w-6" /></button>
        ) : (
          <button onClick={p.toggle} aria-label={p.playing ? 'توقف' : 'پخش'} className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.5)] transition active:scale-95">
            {p.status === 'loading' ? <Loader2 className="h-6 w-6 animate-spin" /> : p.playing ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6" fill="currentColor" />}
          </button>
        )}
        <button onClick={() => p.skip(15)} aria-label="۱۵ ثانیه جلو" className="p-2 text-muted-foreground"><RotateCw className="h-5 w-5" /></button>
        <button onClick={p.next} disabled={!p.hasNext} aria-label="بعدی" className="p-2 text-foreground/80 disabled:opacity-30"><SkipForward className="h-5 w-5" /></button>
      </div>
      {p.status === 'error' && <p className="mt-2 text-center text-xs text-destructive">پخش ممکن نشد — دوباره تلاش کنید یا آهنگ بعدی را انتخاب کنید.</p>}
    </motion.section>
  );
}
