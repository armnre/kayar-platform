import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from 'zitejs/auth';
import { saveListening } from 'zitejs/api';
import { Audio, useMe } from './data';

type Ctx = {
  current?: Audio; queue: Audio[]; playing: boolean; t: number; dur: number; rate: number;
  play: (a: Audio, queue?: Audio[]) => void; toggle: () => void; seekTo: (s: number) => void; skip: (d: number) => void;
  next: () => void; prev: () => void; setRate: (r: number) => void; close: () => void;
};
const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => useContext(PlayerCtx)!;

/** One audio element for the whole app, so playback survives navigation. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();
  const me = useMe();
  const [current, setCurrent] = useState<Audio>();
  const [queue, setQueue] = useState<Audio[]>([]);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRateState] = useState(1);
  const lastSaved = useRef(0);

  const persist = useCallback((pos: number, force = false) => {
    if (!user || !current) return;
    if (force || Math.abs(pos - lastSaved.current) >= 10) { lastSaved.current = pos; saveListening({ contentId: current.id, positionSeconds: pos }).catch(() => {}); }
  }, [user, current]);

  const play = (a: Audio, q?: Audio[]) => {
    if (a.locked) return toast('این محتوا مخصوص اعضای کایار است؛ ابتدا وارد شوید.');
    if (!a.audioUrl) return toast.error('فایل صوتی این محتوا هنوز بارگذاری نشده است.');
    if (q) setQueue(q.filter((x) => !x.locked && x.audioUrl));
    if (current?.id === a.id) return toggle();
    if (current && el.current) persist(el.current.currentTime, true);
    const start = me.data?.listening.find((l) => l.contentId === a.id)?.positionSeconds ?? 0;
    lastSaved.current = start;
    setCurrent(a); setT(start); setDur(a.durationSeconds);
    requestAnimationFrame(() => {
      const x = el.current; if (!x) return;
      x.src = a.audioUrl; x.playbackRate = rate;
      x.currentTime = start && start < (a.durationSeconds || Infinity) - 5 ? start : 0;
      x.play().catch(() => toast.error('پخش این فایل ممکن نیست'));
    });
  };
  const toggle = () => { const x = el.current; if (!x) return; if (x.paused) x.play().catch(() => {}); else { x.pause(); persist(x.currentTime, true); } };
  const seekTo = (s: number) => { if (el.current) el.current.currentTime = Math.max(0, Math.min(s, dur || s)); };
  const skip = (d: number) => el.current && seekTo(el.current.currentTime + d);
  const idx = current ? queue.findIndex((q) => q.id === current.id) : -1;
  const next = () => { if (idx >= 0 && queue[idx + 1]) play(queue[idx + 1]); };
  const prev = () => { if (t > 5) seekTo(0); else if (idx > 0) play(queue[idx - 1]); };
  const setRate = (r: number) => { setRateState(r); if (el.current) el.current.playbackRate = r; };
  const close = () => { if (el.current) { persist(el.current.currentTime, true); el.current.pause(); } setCurrent(undefined); };

  useEffect(() => {
    if (!current || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: current.title, artist: current.author, artwork: current.coverUrl ? [{ src: current.coverUrl }] : [] });
  }, [current]);

  return (
    <PlayerCtx.Provider value={{ current, queue, playing, t, dur, rate, play, toggle, seekTo, skip, next, prev, setRate, close }}>
      {children}
      <audio ref={el} preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => { setT(e.currentTarget.currentTime); persist(e.currentTarget.currentTime); }}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDur(e.currentTarget.duration)}
        onEnded={() => { persist(0, true); next(); }}
        onError={() => current && toast.error('فایل صوتی در دسترس نیست')} />
    </PlayerCtx.Provider>
  );
}
