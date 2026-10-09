import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from 'zitejs/auth';
import { saveListening } from 'zitejs/api';
import { Audio, useMe } from './data';

/** Anything the app can play: Morshed episodes (our DB) or Jamendo tracks. */
export type Track = {
  id: string; title: string; author: string; coverUrl: string; audioUrl: string; durationSeconds: number;
  source: 'morshed' | 'jamendo' | 'mock'; licenseUrl?: string; locked?: boolean;
};
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export const fromAudio = (a: Audio): Track => ({
  id: a.id, title: a.title, author: a.author || a.category, coverUrl: a.coverUrl, audioUrl: a.audioUrl,
  durationSeconds: a.durationSeconds, source: 'morshed', locked: a.locked,
});

type Ctx = {
  current?: Track; queue: Track[]; status: PlayerStatus; playing: boolean; t: number; dur: number; rate: number;
  play: (a: Track, queue?: Track[]) => void; toggle: () => void; seekTo: (s: number) => void; skip: (d: number) => void;
  next: () => void; prev: () => void; hasNext: boolean; hasPrev: boolean; setRate: (r: number) => void; close: () => void; retry: () => void;
};
const PlayerCtx = createContext<Ctx | null>(null);
export function usePlayer() {
  const c = useContext(PlayerCtx);
  if (!c) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return c;
}

/**
 * The ONE audio element for the whole app (mounted at the root), so playback survives route changes,
 * a track is never played by two elements at once, and every screen shows the same state.
 * Handlers read the latest track/queue through refs — no stale closures when an episode ends.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const { user } = useAuth();
  const me = useMe();
  const [current, setCurrent] = useState<Track>();
  const [queue, setQueue] = useState<Track[]>([]);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRateState] = useState(1);
  const cur = useRef<Track>(); const q = useRef<Track[]>([]); const lastSaved = useRef(0);
  const ctx = useRef({ user, listening: me.data?.listening });
  ctx.current = { user, listening: me.data?.listening };

  const persist = useCallback((pos: number, force = false) => {
    const c = cur.current;
    if (!ctx.current.user || !c || c.source !== 'morshed' || c.id.startsWith('demo-')) return;
    if (force || Math.abs(pos - lastSaved.current) >= 10) { lastSaved.current = pos; saveListening({ contentId: c.id, positionSeconds: pos }).catch(() => {}); }
  }, []);

  const start = useCallback((x: HTMLAudioElement) => {
    x.play().catch((e: DOMException) => {
      if (e.name === 'AbortError') return; // superseded by a newer play/pause — not an error
      setStatus('paused');
      if (e.name === 'NotAllowedError') toast('برای پخش، دکمه پخش را بزنید.');
      else toast.error('پخش این آهنگ ممکن نیست.');
    });
  }, []);

  const load = useCallback((a: Track) => {
    const x = el.current; if (!x) return;
    if (cur.current && cur.current.id !== a.id) persist(x.currentTime, true);
    const resume = a.source === 'morshed' ? ctx.current.listening?.find((l) => l.contentId === a.id)?.positionSeconds ?? 0 : 0;
    lastSaved.current = resume;
    cur.current = a; setCurrent(a); setT(resume); setDur(a.durationSeconds || 0); setStatus('loading');
    x.src = a.audioUrl; x.playbackRate = x.playbackRate || 1;
    x.currentTime = resume && resume < (a.durationSeconds || Infinity) - 5 ? resume : 0;
    start(x);
  }, [persist, start]);

  const toggle = useCallback(() => {
    const x = el.current; if (!x || !cur.current) return;
    if (x.paused) start(x); else { x.pause(); persist(x.currentTime, true); }
  }, [persist, start]);

  const play = useCallback((a: Track, list?: Track[]) => {
    if (a.locked) { toast('این محتوا مخصوص اعضای کایار است؛ ابتدا وارد شوید.'); return; }
    if (!a.audioUrl) { toast.error('فایل صوتی این محتوا هنوز منتشر نشده است.'); return; }
    if (list) { q.current = list.filter((x) => !x.locked && x.audioUrl); setQueue(q.current); }
    if (cur.current?.id === a.id) { toggle(); return; }
    load(a);
  }, [load, toggle]);

  const step = useCallback((d: 1 | -1) => {
    const i = cur.current ? q.current.findIndex((x) => x.id === cur.current!.id) : -1;
    const n = i >= 0 ? q.current[i + d] : undefined;
    if (n) load(n);
    return !!n;
  }, [load]);
  const seekTo = useCallback((s: number) => { const x = el.current; if (x) x.currentTime = Math.max(0, Math.min(s, Number.isFinite(x.duration) ? x.duration : s)); }, []);
  const next = useCallback(() => { step(1); }, [step]);
  const prev = useCallback(() => { const x = el.current; if (x && x.currentTime > 5) seekTo(0); else if (!step(-1)) seekTo(0); }, [seekTo, step]);
  const skip = useCallback((d: number) => { const x = el.current; if (x) seekTo(x.currentTime + d); }, [seekTo]);
  const setRate = useCallback((r: number) => { setRateState(r); if (el.current) el.current.playbackRate = r; }, []);
  const close = useCallback(() => {
    const x = el.current; if (x) { persist(x.currentTime, true); x.pause(); x.removeAttribute('src'); x.load(); }
    cur.current = undefined; setCurrent(undefined); setStatus('idle'); setT(0);
  }, [persist]);
  const retry = useCallback(() => {
    const x = el.current, a = cur.current; if (!x || !a) return;
    const at = x.currentTime; setStatus('loading'); x.src = a.audioUrl; x.currentTime = at; start(x);
  }, [start]);

  // Lock-screen / headset controls. The effect always returns a cleanup function.
  useEffect(() => {
    if (!current || !('mediaSession' in navigator)) return undefined;
    const ms = navigator.mediaSession;
    ms.metadata = new MediaMetadata({ title: current.title, artist: current.author, artwork: current.coverUrl ? [{ src: current.coverUrl, sizes: '300x300' }] : [] });
    const set = (a: MediaSessionAction, h: MediaSessionActionHandler | null) => { try { ms.setActionHandler(a, h); } catch { /* action unsupported on this browser */ } };
    set('play', () => toggle()); set('pause', () => toggle()); set('nexttrack', () => next()); set('previoustrack', () => prev());
    return () => { (['play', 'pause', 'nexttrack', 'previoustrack'] as MediaSessionAction[]).forEach((a) => set(a, null)); };
  }, [current, toggle, next, prev]);

  const idx = current ? queue.findIndex((x) => x.id === current.id) : -1;
  const value = useMemo<Ctx>(() => ({
    current, queue, status, playing: status === 'playing', t, dur, rate, play, toggle, seekTo, skip, next, prev,
    hasNext: idx >= 0 && idx < queue.length - 1, hasPrev: idx > 0, setRate, close, retry,
  }), [current, queue, status, t, dur, rate, play, toggle, seekTo, skip, next, prev, idx, setRate, close, retry]);

  return (
    <PlayerCtx.Provider value={value}>
      {children}
      <audio ref={el} preload="metadata"
        onPlaying={() => setStatus('playing')} onPause={() => setStatus((s) => (s === 'error' ? s : 'paused'))}
        onWaiting={() => setStatus('loading')}
        onTimeUpdate={(e) => { setT(e.currentTarget.currentTime); persist(e.currentTarget.currentTime); }}
        onLoadedMetadata={(e) => { if (Number.isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration); e.currentTarget.playbackRate = rate; }}
        onEnded={() => { persist(0, true); if (!step(1)) setStatus('paused'); }}
        onError={() => {
          if (!cur.current || !el.current?.getAttribute('src')) return;
          setStatus('error');
          toast.error(navigator.onLine ? 'لینک پخش این آهنگ معتبر نیست یا حذف شده است.' : 'اتصال اینترنت قطع است؛ پس از اتصال دوباره تلاش کنید.');
        }} />
    </PlayerCtx.Provider>
  );
}
