import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Star, Award, CheckCircle2, UserX } from 'lucide-react';
import { Badge } from '@project/components/ui/badge';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import { useCatalog, fa, toman } from '../lib/data';
import { Empty } from '../components/ui-kit';
import BookingDialog from '../components/BookingDialog';
import SafeImg from '../components/SafeImg';

export default function CoachDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useCatalog();
  const [planId, setPlanId] = useState<string>();
  const [open, setOpen] = useState(false);
  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;
  const c = data?.coaches.find((x) => x.id === id);
  if (!c) return <Empty icon={UserX} title="مربی پیدا نشد" action={<Button asChild variant="outline"><Link to="/coaches">بازگشت به مربیان</Link></Button>} />;
  const plan = c.plans.find((p) => p.id === planId);

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/coaches" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowRight className="h-4 w-4" /> مربیان</Link>
      <div className="glass relative overflow-hidden rounded-3xl p-6 text-center">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary ring-offset-4 ring-offset-card">
          <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover"
            fallback={<div className="grid h-full place-items-center bg-gradient-to-br from-primary/25 to-accent/25 text-4xl font-black text-primary">{c.name[0]}</div>} />
        </div>
        <h1 className="relative mt-5 text-2xl font-black">{c.name}</h1>
        <p className="text-muted-foreground">{c.title}</p>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{c.rating.toLocaleString('fa-IR')} ({fa(c.reviewCount)})</span>
          <span>{fa(c.yearsExperience)} سال سابقه</span>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">{c.specialties.map((s) => <Badge key={s} variant="outline" className="rounded-full border-primary/40">{s}</Badge>)}</div>
      </div>
      {c.bio && <section className="glass mt-4 rounded-2xl p-5"><h2 className="mb-2 font-bold">درباره من</h2><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{c.bio}</p></section>}
      {c.certifications && <section className="glass mt-4 flex items-center gap-3 rounded-2xl p-5"><Award className="h-5 w-5 text-accent" /><span className="text-sm">{c.certifications}</span></section>}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-extrabold">انتخاب پلن</h2>
        {c.plans.length === 0 ? <p className="text-sm text-muted-foreground">این مربی هنوز پلنی تعریف نکرده است.</p> : (
          <div className="space-y-3">
            {c.plans.map((p) => (
              <button key={p.id} onClick={() => setPlanId(p.id)} className={cn('glass flex w-full items-center justify-between rounded-2xl p-4 text-right transition', planId === p.id && 'border-primary glow')}>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{fa(p.sessions)} جلسه · {fa(p.durationWeeks)} هفته</div>
                  <div className="mt-2 font-bold text-primary">{toman(p.price)}</div>
                </div>
                <CheckCircle2 className={cn('h-6 w-6', planId === p.id ? 'text-primary' : 'text-muted')} />
              </button>
            ))}
          </div>
        )}
      </section>
      <div className="sticky bottom-28 mt-6 md:bottom-4">
        <Button disabled={!plan} onClick={() => setOpen(true)} size="lg" className="h-14 w-full rounded-2xl text-base font-bold glow">
          {plan ? `رزرو و شروع همکاری — ${toman(plan.price)}` : 'یک پلن انتخاب کنید'}
        </Button>
      </div>
      {plan && <BookingDialog open={open} onOpenChange={setOpen} coachId={c.id} coachName={c.name} plan={plan} />}
    </div>
  );
}
