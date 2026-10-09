import { useEffect, useState, useSyncExternalStore } from 'react';

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

/** The browser may fire `beforeinstallprompt` before any component mounts, so it is captured at module load. */
let deferred: BIP | null = null;
let installed = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e as BIP; emit(); });
  window.addEventListener('appinstalled', () => { installed = true; deferred = null; emit(); });
}

export function usePwa() {
  const snap = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => `${!!deferred}|${installed}`);
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(display-mode: standalone)');
    const u = () => setStandalone(q.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    u(); q.addEventListener('change', u);
    return () => q.removeEventListener('change', u);
  }, []);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const platform: 'ios' | 'android' | 'desktop' = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document) ? 'ios' : /android/i.test(ua) ? 'android' : 'desktop';
  return {
    platform,
    isInstalled: standalone || snap.endsWith('true'),
    canPrompt: snap.startsWith('true'),
    install: async () => {
      if (!deferred) return false;
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null; emit();
      return outcome === 'accepted';
    },
  };
}
