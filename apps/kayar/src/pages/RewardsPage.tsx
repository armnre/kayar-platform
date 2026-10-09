import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Trophy, Gift, Megaphone, Plus, Check, Loader2, Coins } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Progress } from '@project/components/ui/progress';
import { useCatalog, usePlay, fa, faDate, errMsg } from '../lib/data';
import { PageHeader, SectionTitle, CardsSkeleton, Empty } from '../components/ui-kit';
import SafeImg from '../components/SafeImg';
import { useBase } from '../lib/base';

export default function RewardsPage({ embedded }: { embedded?: boolean }) {
  const { data, isLoading } = useCatalog();
  const play = usePlay();
  const base = useBase();
  const points = play.points;
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={embedded ? 'چالش‌ها و' : 'چالش و'} accent="جایزه" sub="در چالش‌ها شرکت کن، امتیاز بگیر و جایزه ببر." />
      </div>
      <div className="grain relative -mt-4 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/25 via-card to-card p-5">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <Trophy className="absolute -bottom-4 left-4 h-28 w-28 rotate-12 text-primary/10" />
        <div className="relative flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-4px_hsl(var(--primary))]"><Coins className="h-7 w-7" /></span>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">امتیاز شما{play.mode === 'demo' && ' (آزمایشی)'}</div>
            <div className="text-4xl font-black leading-tight text-primary">{fa(points)}</div>
          </div>
        </div>
        {!isLoading && data && (
          <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
            {[[fa(data.challenges.length), 'چالش فعال'], [fa(data.challenges.filter((c) => play.partOf(c.id)?.completed).length), 'تکمیل‌شده'], [fa(data.rewards.length), 'جایزه']].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-background/50 py-2.5 backdrop-blur"><div className="text-lg font-black">{v}</div><div className="text-[10px] text-muted-foreground">{l}</div></div>
            ))}
          </div>
        )}
      </div>
      {isLoading ? <CardsSkeleton /> : (
        <>
          {!embedded && data!.campaigns.some((c) => c.phase === 'live') && (
            <section>
              <SectionTitle title="کمپین‌های فعال" />
              <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4">
                {data!.campaigns.filter((c) => c.phase === 'live').map((c) => (
                  <Link to={`${base}/campaigns/${c.id}`} key={c.id} className="glass relative w-72 shrink-0 snap-start overflow-hidden rounded-2xl md:w-80">
                    <SafeImg src={c.coverUrl} alt={c.title} className="h-32 w-full object-cover" fallback={<div className="grid h-32 place-items-center bg-gradient-to-br from-primary/25 via-card to-accent/30"><Megaphone className="h-10 w-10 text-primary" /></div>} />
                    <div className="p-4"><div className="text-[11px] text-primary">{c.brand}</div><div className="font-bold">{c.title}</div><p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>{c.endsOn && <div className="mt-2 text-[11px] text-muted-foreground">تا {faDate(c.endsOn)}</div>}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section>
            <SectionTitle title="چالش‌ها" />
            {data!.challenges.length === 0 ? <Empty icon={Trophy} title="فعلاً چالش فعالی نیست" /> : (
              <div className="grid gap-3 md:grid-cols-2">{data!.challenges.map((c) => <ChallengeCard key={c.id} c={c} part={play.partOf(c.id)} />)}</div>
            )}
          </section>
          <section>
            <SectionTitle title="جوایز" />
            {data!.rewards.length === 0 ? <Empty icon={Gift} title="جایزه‌ای تعریف نشده" /> : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{data!.rewards.map((r) => <RewardCard key={r.id} r={r} points={points} />)}</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

type Ch = NonNullable<ReturnType<typeof useCatalog>['data']>['challenges'][number];
function Ring({ pct }: { pct: number }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r={r} className="fill-none stroke-white/10" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, pct))} style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary)))' }} />
    </svg>
  );
}
export function ChallengeCard({ c, part }: { c: Ch; part?: { progress: number; completed: boolean } }) {
  const play = usePlay();
  const [amt, setAmt] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (add?: number) => {
    setBusy(true);
    try {
      await play.join(c, add);
      setAmt('');
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  const pct = part ? part.progress / Math.max(1, c.target) : 0;
  return (
    <div className={`relative overflow-hidden rounded-3xl border p-4 transition ${part?.completed ? 'border-primary/50 bg-gradient-to-br from-primary/15 to-card' : 'border-white/[0.08] bg-card/80'}`}>
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Ring pct={pct} />
          <span className="absolute inset-0 grid place-items-center">{part?.completed ? <Check className="h-5 w-5 text-primary" /> : part ? <span className="text-[11px] font-black">{fa(Math.round(pct * 100))}٪</span> : <Trophy className="h-5 w-5 text-primary" />}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="font-black leading-6">{c.title}</div>
            <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-black text-primary">+{fa(c.points)}</span>
          </div>
          {c.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{c.description}</p>}
          <div className="mt-1.5 text-[11px] text-muted-foreground">هدف: {fa(c.target)} {c.unit}{c.endsOn && ` · تا ${faDate(c.endsOn)}`}</div>
        </div>
      </div>
      {part ? (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground"><span>{fa(part.progress)} / {fa(c.target)} {c.unit}</span>{part.completed && <span className="font-bold text-primary">تکمیل شد 🎉</span>}</div>
          <Progress value={pct * 100} className="h-2" />
          {!part.completed && (
            <div className="mt-3 flex gap-2">
              <Input type="number" inputMode="numeric" min={1} value={amt} onChange={(e) => setAmt(e.target.value)} placeholder={`ثبت پیشرفت (${c.unit})`} className="h-11 rounded-xl border-white/10 bg-background/50" />
              <Button disabled={busy || !(Number(amt) > 0)} onClick={() => run(Number(amt))} className="h-11 w-11 shrink-0 rounded-xl p-0" aria-label="ثبت">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}</Button>
            </div>
          )}
        </div>
      ) : <Button disabled={busy} onClick={() => run()} className="mt-4 h-11 w-full rounded-xl font-black">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'شرکت در چالش'}</Button>}
    </div>
  );
}

type Rw = NonNullable<ReturnType<typeof useCatalog>['data']>['rewards'][number];
export function RewardCard({ r, points }: { r: Rw; points: number }) {
  const play = usePlay();
  const [busy, setBusy] = useState(false);
  const redeem = async () => {
    setBusy(true);
    try { await play.redeem(r); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  const can = r.stock > 0 && points >= r.costPoints;
  const need = Math.max(0, r.costPoints - points);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-card/80 p-4">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition group-hover:scale-150" />
      <div className="relative mb-3 flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"><Gift className="h-5 w-5" /></span>
        {r.kind && <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">{r.kind}</span>}
      </div>
      <div className="relative text-sm font-black leading-6">{r.title}</div>
      <p className="relative mt-1 line-clamp-2 flex-1 text-[11px] leading-5 text-muted-foreground">{r.description}</p>
      <div className="relative mt-2 space-y-0.5 text-[10px] text-muted-foreground">
        <div>{r.stock > 0 ? `موجودی ${fa(r.stock)}` : 'ناموجود'}{r.perUserLimit > 0 && ` · حداکثر ${fa(r.perUserLimit)} بار`}</div>
        {r.expiresOn && <div>تا {faDate(r.expiresOn)}</div>}
      </div>
      <Button size="sm" disabled={busy || !can} onClick={redeem} className="relative mt-3 h-10 rounded-xl font-black">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Coins className="h-4 w-4" />{fa(r.costPoints)}</>}</Button>
      {!can && r.stock > 0 && <div className="relative mt-1.5 text-center text-[10px] text-muted-foreground">{fa(need)} امتیاز دیگه لازم داری</div>}
    </div>
  );
}
