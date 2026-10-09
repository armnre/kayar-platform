import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, X, RotateCw } from 'lucide-react';
import { usePlayer } from '../../lib/player';
import Cover from './Cover';

/** Docked player shown on every page while something is loaded. */
export default function MiniPlayer() {
  const p = usePlayer();
  const loc = useLocation();
  const hidden = !p.current || loc.pathname === `/morshed/${p.current.id}`;
  const pct = p.dur ? (p.t / p.dur) * 100 : 0;
  return (
    <AnimatePresence>
      {!hidden && p.current && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="glass fixed inset-x-3 bottom-28 z-40 overflow-hidden rounded-2xl shadow-2xl md:bottom-4 md:left-auto md:right-4 md:w-[400px]">
          <div className="h-0.5 bg-white/10"><div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} /></div>
          <div className="flex items-center gap-3 p-2.5">
            <Link to="/app/morshed" className="flex min-w-0 flex-1 items-center gap-3">
              <Cover a={p.current} className="h-11 w-11 rounded-xl" />
              <div className="min-w-0"><div className="truncate text-sm font-bold">{p.current.title}</div><div className="truncate text-[11px] text-muted-foreground">{p.current.author}</div></div>
            </Link>
            <button onClick={() => p.skip(15)} aria-label="۱۵ ثانیه جلو" className="p-1 text-muted-foreground"><RotateCw className="h-5 w-5" /></button>
            <button onClick={p.toggle} aria-label={p.playing ? 'توقف' : 'پخش'} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              {p.playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
            </button>
            <button onClick={p.close} aria-label="بستن" className="p-1 text-muted-foreground"><X className="h-4 w-4" /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
