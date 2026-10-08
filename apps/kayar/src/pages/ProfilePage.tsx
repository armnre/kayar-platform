import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { CalendarClock, LogOut, Coins, Ticket, Bookmark, Zap } from 'lucide-react';
import { useAuth, logout } from 'zitejs/auth';
import { cancelCoachingRequest } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { Skeleton } from '@project/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@project/components/ui/alert-dialog';
import { useMe, useCatalog, useRefresh, fa, faDate, errMsg } from '../lib/data';
import { RequireAuth, SectionTitle, Empty } from '../components/ui-kit';

export default function ProfilePage() {
  return <RequireAuth title="برای دیدن پروفایل وارد شوید"><Inner /></RequireAuth>;
}

const statusTone: Record<string, string> = { 'در انتظار': 'bg-accent/15 text-accent', 'پذیرفته شده': 'bg-primary/15 text-primary', 'رد شده': 'bg-destructive/15 text-destructive', 'لغو شده': 'bg-muted text-muted-foreground' };

function Inner() {
  const { user } = useAuth();
  const { data } = useMe();
  const cat = useCatalog();
  const refresh = useRefresh();
  const [cancelId, setCancelId] = useState<string>();
  if (!data) return <Skeleton className="h-96 rounded-3xl" />;
  const p = data.profile;
  const saved = (cat.data?.audio ?? []).filter((a) => data.listening.some((l) => l.contentId === a.id && l.saved));
  const rewardTitle = (id: string) => cat.data?.rewards.find((r) => r.id === id)?.title ?? 'جایزه';

  const cancel = async () => {
    try { await cancelCoachingRequest({ requestId: cancelId! }); toast.success('درخواست لغو شد'); refresh(); } catch (e) { toast.error(errMsg(e)); }
    setCancelId(undefined);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="glass relative overflow-hidden rounded-3xl p-6 text-center">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary text-4xl font-black text-primary-foreground ring-4 ring-primary/30 ring-offset-4 ring-offset-card">{(p.displayName || user!.email)[0]?.toUpperCase()}</div>
        <h1 className="mt-4 text-2xl font-black">{p.displayName}</h1>
        <p className="text-sm text-muted-foreground" dir="ltr">{user!.email}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat v={fa(p.points)} l="امتیاز" />
          <Stat v={fa(data.activity.length)} l="تمرین ثبت‌شده" />
          <Stat v={fa(data.participations.filter((x) => x.completed).length)} l="چالش موفق" />
        </div>
        {!p.onboarded && <Button asChild className="mt-5 rounded-full"><Link to="/bodyyar"><Zap className="ml-1 h-4 w-4" />تکمیل پروفایل بدنی</Link></Button>}
      </div>

      <section>
        <SectionTitle title="درخواست‌های مربیگری" />
        {data.requests.length === 0 ? <Empty icon={CalendarClock} title="درخواستی ثبت نکرده‌ای" action={<Button asChild variant="outline"><Link to="/coaches">پیدا کردن مربی</Link></Button>} /> : (
          <div className="space-y-2">{data.requests.map((r) => (
            <div key={r.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
              <div className="min-w-0"><div className="truncate font-bold">{r.title}</div><div className="text-xs text-muted-foreground">جلسه: {faDate(r.sessionAt, true)}</div></div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={`rounded-full border-0 ${statusTone[r.status] ?? ''}`}>{r.status}</Badge>
                {r.status === 'در انتظار' && <Button size="sm" variant="ghost" onClick={() => setCancelId(r.id)}>لغو</Button>}
              </div>
            </div>
          ))}</div>
        )}
      </section>

      <section>
        <SectionTitle title="محتوای ذخیره‌شده" />
        {saved.length === 0 ? <Empty icon={Bookmark} title="هنوز محتوایی ذخیره نکرده‌ای" action={<Button asChild variant="outline"><Link to="/morshed">رفتن به مرشد</Link></Button>} /> : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{saved.map((a) => <Link to="/morshed" key={a.id} className="glass truncate rounded-xl p-3 text-sm">{a.title}</Link>)}</div>
        )}
      </section>

      <section>
        <SectionTitle title="جوایز من" />
        {data.redemptions.length === 0 ? <Empty icon={Coins} title="هنوز جایزه‌ای نگرفته‌ای" /> : (
          <div className="space-y-2">{data.redemptions.map((r) => (
            <div key={r.id} className="glass flex items-center justify-between rounded-xl p-4"><span className="flex items-center gap-2 text-sm"><Ticket className="h-4 w-4 text-primary" />{rewardTitle(r.rewardId)}</span><code className="rounded bg-secondary px-2 py-1 text-xs" dir="ltr">{r.code}</code></div>
          ))}</div>
        )}
      </section>

      <Button variant="outline" className="h-12 w-full rounded-2xl text-destructive" onClick={() => logout()}><LogOut className="ml-2 h-4 w-4" />خروج از حساب</Button>

      <AlertDialog open={!!cancelId} onOpenChange={(o) => !o && setCancelId(undefined)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right"><AlertDialogTitle>لغو درخواست؟</AlertDialogTitle><AlertDialogDescription>این درخواست مربیگری لغو می‌شود و قابل بازگشت نیست.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="gap-2"><AlertDialogCancel>انصراف</AlertDialogCancel><AlertDialogAction onClick={cancel}>لغو درخواست</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const Stat = ({ v, l }: { v: string; l: string }) => <div className="rounded-2xl bg-secondary/60 py-3"><div className="text-xl font-black text-primary">{v}</div><div className="text-[11px] text-muted-foreground">{l}</div></div>;
