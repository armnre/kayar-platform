import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Award, CheckCircle2, UserX, MessageCircle, MapPin, CalendarClock, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { startConversation } from 'zitejs/api';
import { Badge } from '@project/components/ui/badge';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import { useCatalog, fa, toman, errMsg } from '../lib/data';
import { WEEKDAYS } from '../lib/coach';
import { Empty } from '../components/ui-kit';
import BookingDialog from '../components/BookingDialog';
import SafeImg from '../components/SafeImg';
import { RatingBadge } from '../components/CoachCard';

export default function CoachDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const { data, isLoading } = useCatalog();
  const [planId, setPlanId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  if (isLoading) return <Skeleton className="h-96 rounded-3xl" />;
  const c = data?.coaches.find((x) => x.id === id);
  if (!c) return <Empty icon={UserX} title="مربی پیدا نشد" action={<Button asChild variant="outline"><Link to="/coaches">بازگشت به مربیان</Link></Button>} />;
  const plan = c.plans.find((p) => p.id === planId);
  const days = WEEKDAYS.map((d) => ({ d, s: c.availability.filter((a) => a.weekday === d).sort((a, b) => a.startTime.localeCompare(b.startTime)) })).filter((x) => x.s.length);

  const chat = async () => {
    if (!user) return loginWithRedirect();
    setChatBusy(true);
    try { const r = await startConversation({ coachId: c.id }); nav(`/messages/${r.id}`); } catch (e) { toast.error(errMsg(e)); } finally { setChatBusy(false); }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/coaches" className="mb-4 inline-flex min-h-10 items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowRight className="h-4 w-4" /> مربیان</Link>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-square bg-secondary">
              <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover" fallback={<div className="grid h-full place-items-center bg-gradient-to-br from-primary/25 to-accent/25 text-6xl font-black text-primary">{c.name[0]}</div>} />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
            <div className="-mt-16 relative space-y-2 p-5">
              <Badge className="rounded-full border-0 bg-primary/15 text-primary"><ShieldCheck className="ml-1 h-3 w-3" />مربی تأییدشده</Badge>
              <h1 className="text-2xl font-black">{c.name}</h1>
              <p className="text-sm text-muted-foreground">{c.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm"><RatingBadge c={c} /><span>{fa(c.yearsExperience)} سال سابقه</span>{c.city && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{c.city}</span>}</div>
              <Button onClick={chat} disabled={chatBusy} variant="outline" className="mt-2 h-12 w-full rounded-2xl">{chatBusy ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <MessageCircle className="ml-2 h-4 w-4" />}شروع گفتگو با مربی</Button>
            </div>
          </div>
        </aside>
        <div className="space-y-4">
          <section className="glass rounded-2xl p-5">
            <div className="mb-3 flex flex-wrap gap-2">{c.category && <Badge className="rounded-full">{c.category}</Badge>}{c.specialties.map((s) => <Badge key={s} variant="outline" className="rounded-full border-primary/40">{s}</Badge>)}</div>
            {c.bio && <p className="whitespace-pre-line text-sm leading-8 text-muted-foreground">{c.bio}</p>}
            {c.sports && <p className="mt-3 text-sm"><b>رشته‌ها:</b> {c.sports}</p>}
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info t="خدمات" items={c.services} />
            <Info t="مناسب برای سطح" items={c.levels} />
          </div>
          {c.certifications && <section className="glass flex items-center gap-3 rounded-2xl p-5"><Award className="h-5 w-5 shrink-0 text-accent" /><span className="text-sm">{c.certifications}</span></section>}
          <section className="glass rounded-2xl p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><CalendarClock className="h-4 w-4 text-primary" />زمان‌های در دسترس</h2>
            {days.length ? <div className="grid gap-2 sm:grid-cols-2">{days.map((x) => <div key={x.d} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-sm"><span className="font-bold">{x.d}</span><span dir="ltr" className="text-muted-foreground">{x.s.map((s) => `${s.startTime}–${s.endTime}`).join('، ')}</span></div>)}</div>
              : <p className="text-sm text-muted-foreground">زمان‌بندی هنوز اعلام نشده؛ می‌توانید زمان دلخواه را هنگام رزرو پیشنهاد دهید.</p>}
          </section>
          <section>
            <h2 className="mb-3 text-lg font-extrabold">انتخاب برنامه</h2>
            {c.plans.length === 0 ? <p className="glass rounded-2xl p-5 text-sm text-muted-foreground">این مربی هنوز برنامه‌ای تعریف نکرده است. برای هماهنگی پیام بدهید.</p> : (
              <div className="grid gap-3 sm:grid-cols-2">
                {c.plans.map((p) => (
                  <button key={p.id} onClick={() => setPlanId(p.id)} className={cn('glass flex items-start justify-between gap-3 rounded-2xl p-4 text-right transition', planId === p.id && 'border-primary glow')}>
                    <div><div className="font-bold">{p.name}</div><div className="mt-1 text-xs text-muted-foreground">{fa(p.sessions)} جلسه · {fa(p.durationWeeks)} هفته</div>
                      {p.description && <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.description}</div>}
                      <div className="mt-2 font-black text-primary">{toman(p.price)}</div></div>
                    <CheckCircle2 className={cn('h-6 w-6 shrink-0', planId === p.id ? 'text-primary' : 'text-muted')} />
                  </button>
                ))}
              </div>
            )}
          </section>
          <div className="sticky bottom-28 md:bottom-4">
            <Button disabled={!plan || !c.acceptingClients} onClick={() => setOpen(true)} size="lg" className="h-14 w-full rounded-2xl text-base font-bold glow">
              {!c.acceptingClients ? 'ظرفیت این مربی فعلاً تکمیل است' : plan ? `رزرو — ${toman(plan.price)}` : 'یک برنامه انتخاب کنید'}
            </Button>
          </div>
        </div>
      </div>
      {plan && <BookingDialog open={open} onOpenChange={setOpen} coachId={c.id} coachName={c.name} plan={plan} />}
    </div>
  );
}

const Info = ({ t, items }: { t: string; items: string[] }) => (
  <section className="glass rounded-2xl p-5"><h3 className="mb-2 text-sm font-bold">{t}</h3>
    {items.length ? <div className="flex flex-wrap gap-1.5">{items.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs">{s}</span>)}</div> : <span className="text-xs text-muted-foreground">—</span>}</section>
);
