import { CalendarClock, Inbox, Star, Users } from 'lucide-react';
import { toFa } from '../../store';
import { useCoachStatus } from './CoachShell';

const REQUESTS = [
  { n: 'سارا م.', t: 'برنامه تمرینی ۸ هفته', at: 'شنبه ۱۸:۰۰' },
  { n: 'علی ر.', t: 'جلسه آنلاین', at: 'دوشنبه ۲۰:۰۰' },
];

/** Approved coach home (test data until coach panel endpoints are wired to the test session). */
export default function CoachDashboard() {
  const { app } = useCoachStatus();
  const stats = [
    { i: Inbox, l: 'درخواست جدید', v: REQUESTS.length },
    { i: Users, l: 'شاگرد فعال', v: 12 },
    { i: CalendarClock, l: 'جلسه این هفته', v: 5 },
    { i: Star, l: 'امتیاز', v: '۴٫۹' },
  ];
  return (
    <div className="space-y-5 px-5 py-5">
      <div>
        <h1 className="text-xl font-black">سلام {app?.name?.split(' ')[0] ?? 'مربی'} 👋</h1>
        <p className="text-sm text-muted-foreground">{app?.category} · {app?.city}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((x) => (
          <div key={x.l} className="rounded-2xl border border-white/10 bg-card/80 p-4">
            <x.i className="h-5 w-5 text-primary" />
            <div className="mt-2 text-2xl font-black">{typeof x.v === 'number' ? toFa(x.v) : x.v}</div>
            <div className="text-xs text-muted-foreground">{x.l}</div>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-2 text-sm font-bold">درخواست‌های رزرو</h2>
        <div className="space-y-2">
          {REQUESTS.map((r) => (
            <div key={r.n} className="flex items-center justify-between rounded-2xl border border-white/10 bg-card/80 p-4 text-sm">
              <div><div className="font-bold">{r.n}</div><div className="text-xs text-muted-foreground">{r.t}</div></div>
              <span className="text-xs text-primary">{r.at}</span>
            </div>
          ))}
        </div>
      </section>
      <p className="text-center text-[11px] text-muted-foreground">داده‌های این صفحه نمونه (حالت تست) هستند.</p>
    </div>
  );
}
