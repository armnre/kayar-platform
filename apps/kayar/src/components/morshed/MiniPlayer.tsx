import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, X, SkipForward, SkipBack, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { usePlayer } from '../../lib/player';
import { mmss } from '../../lib/data';
import Cover from './Cover';

/** Docked player shown while something is loaded (hidden on the Morshed screen, which has the full player). */
export default function MiniPlayer({ className }: { className?: string }) {
  const p = usePlayer();
  const loc = useLocation();
  const hidden = !p.current || /^\/app\/morshed(\/|$)/.test(loc.pathname);
  const pct = p.dur ? Math.min(100, (p.t / p.dur) * 100) : 0;
  return (
    <AnimatePresence>
      {!hidden && p.current && (
        <motion.div key="mini" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ duration: 0.25 }}
          className={cn('glass z-40 overflow-hidden rounded-2xl border border-white/10 shadow-2xl', className)}>
          <div className="h-0.5 bg-white/10"><div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} /></div>
          <div className="flex items-center gap-2 p-2.5">
            <Link to="/app/morshed" className="flex min-w-0 flex-1 items-center gap-3">
              <Cover a={p.current} className="h-11 w-11 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{p.current.title}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {p.status === 'error' ? <span className="text-destructive">خطا در پخش</span> : <>{p.current.author} · <span dir="ltr">{mmss(p.t)}</span></>}
                </div>
              </div>
            </Link>
            <button onClick={p.prev} aria-label="قبلی" className="hidden p-1 text-muted-foreground sm:block"><SkipForward className="h-4 w-4" /></button>
            {p.status === 'error' ? (
              <button onClick={p.retry} aria-label="تلاش مجدد" className="grid h-10 w-10 place-items-center rounded-full bg-destructive/20 text-destructive"><RefreshCw className="h-4 w-4" /></button>
            ) : (
              <button onClick={p.toggle} aria-label={p.playing ? 'توقف' : 'پخش'} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                {p.status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : p.playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
              </button>
            )}
            <button onClick={p.next} disabled={!p.hasNext} aria-label="بعدی" className="p-1 text-muted-foreground disabled:opacity-30"><SkipBack className="h-4 w-4" /></button>
            <button onClick={p.close} aria-label="بستن" className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
