import { Inbox, CalendarCheck, Users, Wallet, Star, Bell } from 'lucide-react';
import { Panel } from '../../lib/coach';
import { fa, toman, faDate } from '../../lib/data';

export default function PanelOverview({ p, unread }: { p: Panel; unread: number }) {
  const stats = [
    { i: Inbox, l: 'درخواست در انتظار', v: fa(p.stats.pending) }, { i: CalendarCheck, l: 'جلسات پیش رو', v: fa(p.stats.upcoming) },
    { i: Users, l: 'شاگردان فعال', v: fa(p.clients.length) }, { i: Wallet, l: 'ارزش رزروهای پذیرفته', v: toman(p.stats.revenue) },
  ];
  const upcoming = p.requests.filter((r) => r.status === 'پذیرفته شده' && r.sessionAt && r.sessionAt > new Date().toISOString()).sort((a, b) => a.sessionAt!.localeCompare(b.sessionAt!)).slice(0, 5);
  const notifs = [
    ...(p.stats.pending ? [`${fa(p.stats.pending)} درخواست رزرو جدید منتظر پاسخ شماست.`] : []),
    ...(unread ? [`${fa(unread)} پیام خوانده‌نشده دارید.`] : []),
    ...(p.availability.length === 0 ? ['هنوز زمان در دسترس تعریف نکرده‌اید.'] : []),
    ...(p.plans.length === 0 ? ['برای دریافت رزرو، حداقل یک خدمت تعریف کنید.'] : []),
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="glass rounded-2xl p-4"><s.i className="h-5 w-5 text-primary" /><div className="mt-3 text-xl font-black">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Bell className="h-4 w-4 text-accent" />اعلان‌ها</h3>
          {notifs.length ? <ul className="space-y-2 text-sm">{notifs.map((n) => <li key={n} className="rounded-xl bg-secondary/60 p-3">{n}</li>)}</ul> : <p className="text-sm text-muted-foreground">همه‌چیز مرتب است ✨</p>}
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold"><CalendarCheck className="h-4 w-4 text-primary" />جلسات پیش رو</h3>
          {upcoming.length ? <ul className="space-y-2 text-sm">{upcoming.map((r) => <li key={r.id} className="flex justify-between gap-2 rounded-xl bg-secondary/60 p-3"><span className="truncate">{r.clientName} · {r.planName}</span><span className="shrink-0 text-muted-foreground">{faDate(r.sessionAt, true)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">جلسه‌ای در پیش نیست.</p>}
        </div>
      </div>
      <div className="glass flex items-center gap-3 rounded-2xl p-4 text-sm"><Star className="h-5 w-5 fill-primary text-primary" />امتیاز شما: {p.coach.reviewCount ? `${p.coach.rating.toLocaleString('fa-IR')} از ${fa(p.coach.reviewCount)} نظر` : 'هنوز نظری ثبت نشده'}</div>
    </div>
  );
}
