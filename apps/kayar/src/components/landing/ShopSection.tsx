import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag, RefreshCw } from 'lucide-react';
import { kapooshProducts } from 'zitejs/api';
import { Skeleton } from '@project/components/ui/skeleton';

const STORE = 'https://kapoosh.ir/';
const fa = (n: number) => n.toLocaleString('fa-IR');

/** Kapoosh — products come live from the official store's public Store API; links go to kapoosh.ir. */
export default function ShopSection() {
  const q = useQuery({ queryKey: ['kapoosh'], queryFn: () => kapooshProducts({}), staleTime: 15 * 60_000, retry: 1 });
  const items = q.data?.products.slice(0, 4) ?? [];
  return (
    <motion.section id="shop" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      className="relative mx-auto max-w-7xl scroll-mt-20 overflow-hidden rounded-[2rem] border border-white/10 bg-card/70 p-5 md:p-10">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><ShoppingBag className="h-3.5 w-3.5" />پوشاک ورزشی کاپوش</span>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">جدیدترین‌های کاپوش</h2>
          <p className="mt-1 text-sm text-muted-foreground">قیمت و موجودی مستقیم از فروشگاه رسمی kapoosh.ir</p>
        </div>
        <a href={STORE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary">همه محصولات<ExternalLink className="h-4 w-4" /></a>
      </div>
      <div className="relative mt-6">
        {q.isLoading ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />)}</div>
          : q.isError || !items.length ? (
            <div className="rounded-3xl border border-white/10 bg-background/40 p-8 text-center">
              <p className="text-sm">{q.isError ? 'دریافت محصولات از فروشگاه کاپوش ممکن نشد.' : 'فعلاً محصولی برای نمایش نیست.'}</p>
              <div className="mt-4 flex justify-center gap-2">
                {q.isError && <button onClick={() => q.refetch()} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold"><RefreshCw className="h-3.5 w-3.5" />تلاش مجدد</button>}
                <a href={STORE} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground">رفتن به kapoosh.ir</a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {items.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-3xl border border-white/10 bg-background/50 transition hover:border-primary/40">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    {p.onSale && <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-black text-accent-foreground">تخفیف</span>}
                  </div>
                  <div className="p-3">
                    <div className="line-clamp-1 text-sm font-bold">{p.name}</div>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xs">
                      <span className="font-black text-primary">{fa(p.price)} {p.currency}</span>
                      {p.onSale && <s className="text-[10px] text-muted-foreground">{fa(p.regularPrice)}</s>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
      </div>
    </motion.section>
  );
}
