import { useInfiniteQuery } from '@tanstack/react-query';
import { jamendoTracks, JamendoTracksOutputType } from 'zitejs/api';
import type { Track } from './player';

export type JTrack = JamendoTracksOutputType['tracks'][number];

/** Genres from Jamendo's own "featured selections" (per the API docs), labelled in Persian. */
export const GENRES = [
  ['', 'همه'], ['electronic', 'الکترونیک'], ['hiphop', 'هیپ‌هاپ'], ['rock', 'راک'], ['pop', 'پاپ'],
  ['lounge', 'لانژ'], ['relaxation', 'آرامش'], ['soundtrack', 'حماسی'], ['world', 'جهانی'], ['jazz', 'جاز'], ['classical', 'کلاسیک'],
] as const;

export const toTrack = (j: JTrack, source: Track['source'] = 'jamendo'): Track => ({
  id: j.id, title: j.title, author: j.artist, coverUrl: j.coverUrl, audioUrl: j.audioUrl,
  durationSeconds: j.durationSeconds, source, licenseUrl: j.licenseUrl,
});

/* ---------- Development-only mock (clearly labelled, never presented as Jamendo) ---------- */
/** On only in local dev or when explicitly enabled with ?mock=jamendo (stored per browser; ?mock=off disables). */
export function isJamendoMock() {
  if (typeof window === 'undefined') return false;
  const p = new URLSearchParams(window.location.search).get('mock');
  if (p === 'jamendo') localStorage.setItem('kayar.jamendoMock', '1');
  if (p === 'off') localStorage.removeItem('kayar.jamendoMock');
  return import.meta.env.DEV || localStorage.getItem('kayar.jamendoMock') === '1';
}

let toneCache: string[] | null = null;
/** Short synthesized tones (WAV blobs) so the player can be exercised without any external audio. */
function tones() {
  if (toneCache) return toneCache;
  toneCache = [220, 262, 330, 392, 440, 523].map((hz) => {
    const rate = 8000, secs = 12, n = rate * secs, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.sin((2 * Math.PI * hz * i) / rate) * 6000 * Math.min(1, (n - i) / 2000), true);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  });
  return toneCache;
}
function mockPage(q: string, offset: number, limit: number): JamendoTracksOutputType {
  const total = 60;
  const tracks = Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, k) => {
    const i = offset + k;
    return { id: `mock-${i}`, title: `آهنگ آزمایشی ${i + 1}`, artist: 'داده تست (Mock)', album: '', coverUrl: '', audioUrl: tones()[i % 6], durationSeconds: 12, licenseUrl: '', shareUrl: '' };
  }).filter((t) => !q || t.title.includes(q));
  return { tracks, nextOffset: offset + limit < total ? offset + limit : null };
}

const PAGE = 24;
/** Paged Jamendo catalog. Same query → one cached request (10 min) shared by every screen. */
export function useJamendo(q: string, tag: string, enabled = true) {
  const mock = isJamendoMock();
  const query = useInfiniteQuery({
    queryKey: ['jamendo', mock, q.trim().toLowerCase(), tag],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => (mock ? Promise.resolve(mockPage(q, pageParam, PAGE)) : jamendoTracks({ q: q.trim() || undefined, tag: tag || undefined, offset: pageParam, limit: PAGE })),
    getNextPageParam: (last) => last.nextOffset ?? undefined,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled,
  });
  const seen = new Set<string>();
  const tracks = (query.data?.pages ?? []).flatMap((p) => p.tracks).filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));
  return { ...query, tracks: tracks.map((t) => toTrack(t, mock ? 'mock' : 'jamendo')), mock };
}
