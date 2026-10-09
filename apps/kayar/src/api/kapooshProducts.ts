import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';

/**
 * Latest products from the official Kapoosh store (kapoosh.ir), read through WooCommerce's public
 * Store API — the same read-only endpoint the storefront itself uses. No credentials or cookies.
 * Cached for 15 minutes so landing visits don't hammer the store.
 */
const STORE = 'https://kapoosh.ir';
const TTL = 15 * 60_000;
let cache: { at: number; data: Out } | null = null;

const OutSchema = z.object({
  storeUrl: z.string(),
  products: z.array(z.object({
    id: z.number(), name: z.string(), url: z.string(), image: z.string(),
    price: z.number(), regularPrice: z.number(), onSale: z.boolean(), inStock: z.boolean(), currency: z.string(),
  })),
});
type Out = z.infer<typeof OutSchema>;
type WcProduct = {
  id: number; name: string; permalink: string; on_sale: boolean; is_in_stock: boolean;
  images?: { src: string; thumbnail?: string }[];
  prices: { price: string; regular_price: string; sale_price: string; currency_symbol: string; currency_minor_unit: number; price_range?: { min_amount: string } | null };
};

const decode = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, '&').replace(/&quot;/g, '"');
const onStore = (u: string) => { try { return new URL(u).hostname.endsWith('kapoosh.ir') ? u : STORE; } catch { return STORE; } };

export default createEndpoint({
  description: 'Fetches the latest products from the official Kapoosh store for the landing page',
  inputSchema: z.object({}),
  outputSchema: OutSchema,
  execute: async () => {
    if (cache && Date.now() - cache.at < TTL) return cache.data;
    let list: WcProduct[];
    try {
      const res = await fetch(`${STORE}/wp-json/wc/store/v1/products?per_page=8&orderby=date&order=desc&stock_status=instock`, { headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`status ${res.status}`);
      list = await res.json();
      if (!Array.isArray(list)) throw new Error('unexpected body');
    } catch (e) {
      console.error('Kapoosh store request failed', (e as Error).message);
      throw new ZiteError({ code: 'INTERNAL_ERROR', message: 'kapoosh store unreachable', userFacingMessage: 'اتصال به فروشگاه کاپوش برقرار نشد.' });
    }
    const num = (v: string | undefined, unit: number) => (Number(v) || 0) / 10 ** (unit || 0);
    const products = list.map((p) => {
      const u = p.prices.currency_minor_unit;
      const sale = num(p.prices.sale_price, u), regular = num(p.prices.regular_price, u);
      const price = sale || num(p.prices.price, u) || num(p.prices.price_range?.min_amount, u) || regular;
      return {
        id: p.id, name: decode(p.name), url: onStore(p.permalink), image: p.images?.[0]?.thumbnail || p.images?.[0]?.src || '',
        price, regularPrice: regular, onSale: !!p.on_sale && regular > price, inStock: p.is_in_stock, currency: p.prices.currency_symbol || 'تومان',
      };
    }).filter((p) => p.price > 0 && p.image);
    const data = { storeUrl: STORE, products };
    cache = { at: Date.now(), data };
    return data;
  },
});
