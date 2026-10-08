import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, X } from 'lucide-react';
import { toFa } from '../store';

export const J_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export function j2g(jy: number, jm: number, jd: number): Date {
  jy += 1595;
  let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097); days %= 146097;
  if (days > 36524) { gy += 100 * Math.floor(--days / 36524); days %= 36524; if (days >= 365) days++; }
  gy += 4 * Math.floor(days / 1461); days %= 1461;
  if (days > 365) { gy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let gd = days + 1;
  const sal = [31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && gd > sal[gm]) gd -= sal[gm++];
  return new Date(Date.UTC(gy, gm, gd, 12));
}

export function g2j(d: Date): [number, number, number] {
  const p = new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }).formatToParts(d);
  const n = (t: string) => parseInt(p.find((x) => x.type === t)!.value, 10);
  return [n('year'), n('month'), n('day')];
}
const monthLen = (y: number, m: number) => (m <= 6 ? 31 : m <= 11 ? 30 : g2j(j2g(y, 12, 30))[1] === 12 ? 30 : 29);
export const fmtJalali = (iso?: string) => { if (!iso) return ''; const [y, m, d] = g2j(new Date(iso)); return `${toFa(d)} ${J_MONTHS[m - 1]} ${toFa(y)}`; };

const ITEM = 44;
function Wheel({ items, value, onChange }: { items: { v: number; l: string }[]; value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = Math.max(0, items.findIndex((i) => i.v === value));
  useEffect(() => { ref.current?.scrollTo({ top: idx * ITEM }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const t = useRef<number>();
  return (
    <div ref={ref} onScroll={(e) => {
      const top = e.currentTarget.scrollTop;
      clearTimeout(t.current);
      t.current = window.setTimeout(() => { const i = Math.round(top / ITEM); const it = items[Math.min(items.length - 1, i)]; if (it && it.v !== value) onChange(it.v); }, 80);
    }} className="no-scrollbar relative h-[220px] flex-1 snap-y snap-mandatory overflow-y-auto py-[88px]">
      {items.map((it, i) => {
        const dist = Math.abs(i - idx);
        return (
          <button key={it.v} type="button" onClick={() => ref.current?.scrollTo({ top: i * ITEM, behavior: 'smooth' })}
            className="flex h-11 w-full snap-center items-center justify-center transition-all"
            style={{ opacity: dist === 0 ? 1 : Math.max(0.2, 0.6 - dist * 0.15), transform: `scale(${dist === 0 ? 1.1 : 0.92})` }}>
            <span className={dist === 0 ? 'text-lg font-black text-primary' : 'text-base'}>{it.l}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function JalaliPicker({ value, onChange, placeholder = 'انتخاب تاریخ تولد' }: { value?: string; onChange: (iso: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const thisYear = g2j(new Date())[0];
  const init = value ? g2j(new Date(value)) : [thisYear - 25, 1, 1];
  const [y, setY] = useState(init[0]); const [m, setM] = useState(init[1]); const [d, setD] = useState(init[2]);
  const maxD = monthLen(y, m);
  useEffect(() => { if (d > maxD) setD(maxD); }, [maxD, d]);
  const years = Array.from({ length: 80 }, (_, i) => thisYear - 8 - i).map((v) => ({ v, l: toFa(v) }));
  const months = J_MONTHS.map((l, i) => ({ v: i + 1, l }));
  const days = Array.from({ length: maxD }, (_, i) => ({ v: i + 1, l: toFa(i + 1) }));
  const age = thisYear - y;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`flex h-14 w-full items-center gap-3 rounded-2xl border bg-white/[0.03] px-4 text-right transition active:scale-[0.99] ${value ? 'border-primary/40' : 'border-white/10'}`}>
        <CalendarDays className="h-5 w-5 text-primary" />
        <span className={`flex-1 ${value ? 'font-bold' : 'text-muted-foreground/60'}`}>{value ? fmtJalali(value) : placeholder}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }} onClick={(e) => e.stopPropagation()}
              dir="rtl" className="w-full max-w-[430px] rounded-t-[2rem] border-t border-primary/30 bg-card p-5 pb-8 shadow-[0_-20px_60px_-10px_hsl(var(--primary)/0.3)]">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
              <div className="mb-3 flex items-center justify-between">
                <div><div className="text-lg font-black">تاریخ تولد</div><div className="text-xs text-muted-foreground">{toFa(d)} {J_MONTHS[m - 1]} {toFa(y)} · {toFa(age)} سال</div></div>
                <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/5" aria-label="بستن"><X className="h-4 w-4" /></button>
              </div>
              <div className="relative flex gap-1">
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-xl border border-primary/30 bg-primary/[0.07]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-card to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-card to-transparent" />
                <Wheel key={`d${maxD}`} items={days} value={d} onChange={setD} />
                <Wheel items={months} value={m} onChange={setM} />
                <Wheel items={years} value={y} onChange={setY} />
              </div>
              <button onClick={() => { onChange(j2g(y, m, Math.min(d, maxD)).toISOString()); setOpen(false); }}
                className="mt-5 h-14 w-full rounded-2xl bg-primary font-black text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)] active:scale-[0.98]">تأیید</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
