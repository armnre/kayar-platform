import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';

/**
 * Jamendo read API (https://developer.jamendo.com/v3.0/tracks).
 * Read methods need only the app's client_id — no OAuth, no client secret — and the id
 * stays on the server so it never appears in the browser, URLs or logs.
 * Only tracks that come back with a stream URL (`audio`) are returned; nothing is downloaded or re-hosted.
 */
const API = 'https://api.jamendo.com/v3.0/tracks/';
const TTL = 10 * 60_000;
const cache = new Map<string, { at: number; data: Out }>();

const Track = z.object({
  id: z.string(), title: z.string(), artist: z.string(), album: z.string(),
  coverUrl: z.string(), audioUrl: z.string(), durationSeconds: z.number(),
  licenseUrl: z.string(), shareUrl: z.string(),
});
const OutSchema = z.object({ tracks: z.array(Track), nextOffset: z.number().nullable() });
type Out = z.infer<typeof OutSchema>;

type JTrack = { id: string; name: string; artist_name: string; album_name: string; image: string; album_image: string; audio: string; duration: number; license_ccurl: string; shareurl: string };

type JResp = { headers?: { status?: string; code?: number; error_message?: string }; results?: JTrack[] };
const DEFAULT_CLIENT_ID = 'e974c508';

export default createEndpoint({
  description: 'Lists and searches playable Creative Commons tracks from Jamendo for Morshed',
  inputSchema: z.object({
    q: z.string().max(80).optional(),
    tag: z.string().max(30).optional(),
    offset: z.number().int().min(0).max(5000).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  }),
  outputSchema: OutSchema,
  execute: async ({ input }) => {
    const q = (input.q ?? '').trim();
    const tag = (input.tag ?? '').trim().toLowerCase().replace(/[^a-z]/g, '');
    const offset = input.offset ?? 0;
    const limit = input.limit ?? 24;
    const key = JSON.stringify([q.toLowerCase(), tag, offset, limit]);
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL) return hit.data;

    // Jamendo read client_id is a public app identifier (it appears in every stream URL).
    // The secret wins when it's valid; the verified id is the fallback.
    const ids = [...new Set([(process.env.ZITE_JAMENDO_CLIENT_ID || '').trim(), DEFAULT_CLIENT_ID].filter(Boolean))];
    let json = await request(ids[0], input.q, tag, offset, limit);
    if (json.headers?.code === 5 && ids[1]) json = await request(ids[1], input.q, tag, offset, limit);
    return finish(json, key, offset, limit);
  },
});

async function request(clientId: string, rawQ: string | undefined, tag: string, offset: number, limit: number) {
    const q = (rawQ ?? '').trim();
    const params: Record<string, string> = {
      client_id: clientId, format: 'json', limit: String(limit), offset: String(offset),
      audioformat: 'mp32', imagesize: '300', type: 'single albumtrack',
    };
    if (q) { params.search = q; params.boost = 'popularity_month'; } else params.order = 'popularity_month';
    if (tag) params.tags = tag;
    const url = new URL(API);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    let json: JResp;
    try {
      const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
      if (res.status === 429) throw new ZiteError({ code: 'BAD_REQUEST', message: 'Jamendo rate limited', userFacingMessage: 'تعداد درخواست‌ها به Jamendo زیاد شده؛ کمی بعد دوباره تلاش کنید.' });
      json = await res.json();
    } catch (e) {
      if (e instanceof ZiteError) throw e;
      console.error('Jamendo request failed', (e as Error).message);
      throw new ZiteError({ code: 'INTERNAL_ERROR', message: 'Jamendo unreachable', userFacingMessage: 'سرویس موزیک در دسترس نیست. اتصال را بررسی و دوباره تلاش کنید.' });
    }
    return json;
}

function finish(json: JResp, key: string, offset: number, limit: number): Out {
    if (json.headers?.status !== 'success') {
      const code = json.headers?.code;
      // Never echo the request URL (it carries the client id).
      console.error('Jamendo API error code', code);
      throw new ZiteError({
        code: 'INTERNAL_ERROR',
        message: `Jamendo error ${code}`,
        userFacingMessage: code === 5 ? 'شناسه برنامه Jamendo معتبر نیست یا هنوز فعال نشده است.' : 'دریافت موزیک از Jamendo ناموفق بود.',
      });
    }
    const results = json.results ?? [];
    const tracks = results.filter((t) => t.audio).map((t) => ({
      id: `jm-${t.id}`, title: t.name, artist: t.artist_name ?? '', album: t.album_name ?? '',
      coverUrl: t.image || t.album_image || '', audioUrl: t.audio, durationSeconds: Number(t.duration) || 0,
      licenseUrl: t.license_ccurl ?? '', shareUrl: t.shareurl ?? '',
    }));
    const data: Out = { tracks, nextOffset: results.length === limit ? offset + limit : null };
    if (cache.size > 200) cache.clear();
    cache.set(key, { at: Date.now(), data });
    return data;
}
