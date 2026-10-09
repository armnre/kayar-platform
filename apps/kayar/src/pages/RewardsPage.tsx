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

export default function RewardsPage({ embedded }: { embedded?: boolean }) {
  const { data, isLoading } = useCatalog();
  const play = usePlay();
  const points = play.points;
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={embedded ? 'چالش‌ها و' : 'چالش و'} accent="جایزه" sub="در چالش‌ها شرکت کن، امتیاز بگیر و جایزه ببر." />
        {<div className="glass glow flex items-center gap-3 rounded-2xl px-5 py-3"><Coins className="h-6 w-6 text-primary" /><div><div className="text-[11px] text-muted-foreground">امتیاز شما{play.mode === 'demo' && ' (آزمایشی)'}</div><div className="text-2xl font-black text-primary">{fa(points)}</div></div></div>}
      </div>
      {isLoading ? <CardsSkeleton /> : (
        <>
          {!embedded && data!.campaigns.length > 0 && (
            <section>
              <SectionTitle title="کمپین‌های فعال" />
              <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4">
                {data!.campaigns.map((c) => (
                  <Link to={`/campaigns/${c.id}`} key={c.id} className="glass relative w-72 shrink-0 snap-start overflow-hidden rounded-2xl md:w-80">
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
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div><div className="font-bold">{c.title}</div><p className="mt-1 text-xs text-muted-foreground">{c.description}</p></div>
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{fa(c.points)} امتیاز</span>
      </div>
      {part ? (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{fa(part.progress)} / {fa(c.target)} {c.unit}</span>{part.completed && <span className="flex items-center gap-1 text-primary"><Check className="h-3 w-3" /> تکمیل شد</span>}</div>
          <Progress value={(part.progress / c.target) * 100} className="h-2" />
          {!part.completed && (
            <div className="mt-3 flex gap-2">
              <Input type="number" min={1} value={amt} onChange={(e) => setAmt(e.target.value)} placeholder={`مقدار (${c.unit})`} className="h-10 rounded-xl" />
              <Button disabled={busy || !(Number(amt) > 0)} onClick={() => run(Number(amt))} className="h-10 rounded-xl">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}</Button>
            </div>
          )}
        </div>
      ) : <Button disabled={busy} onClick={() => run()} variant="outline" className="mt-4 w-full rounded-xl border-primary/40">شرکت در چالش</Button>}
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
  return (
    <div className="glass flex flex-col rounded-2xl p-4">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent"><Gift className="h-5 w-5" /></div>
      <div className="text-sm font-bold">{r.title}</div>
      <p className="mt-1 line-clamp-2 flex-1 text-[11px] text-muted-foreground">{r.description}</p>
      <div className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
        <div>{r.kind && `${r.kind} · `}{r.stock > 0 ? `موجودی ${fa(r.stock)}` : 'ناموجود'}</div>
        {r.perUserLimit > 0 && <div>حداکثر {fa(r.perUserLimit)} بار برای هر نفر</div>}
        {r.expiresOn && <div>مهلت دریافت تا {faDate(r.expiresOn)}</div>}
      </div>
      <Button size="sm" disabled={busy || r.stock <= 0 || points < r.costPoints} onClick={redeem} className="mt-3 rounded-xl font-bold">{fa(r.costPoints)} امتیاز</Button>
    </div>
  );
}
