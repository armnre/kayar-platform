import { toast } from 'sonner';
import { FlaskConical } from 'lucide-react';
import { CoachStatus, setCoachStatus, toFa, useCoachApps } from '../mobile/store';
import { STATUS_FA } from '../mobile/screens/coach/CoachShell';

const ACTIONS: { s: CoachStatus; l: string }[] = [
  { s: 'pending', l: 'در انتظار' }, { s: 'approved', l: 'تأیید' }, { s: 'changes', l: 'نیاز به اصلاح' },
  { s: 'rejected', l: 'رد' }, { s: 'suspended', l: 'تعلیق' },
];

/** Test-mode coach files (stored in this browser) — lets the admin move a test coach between statuses. */
export default function TestCoaches() {
  const apps = Object.values(useCoachApps()).sort((a, b) => b.updatedAt - a.updatedAt);
  const act = (phone: string, s: CoachStatus) => {
    setCoachStatus(phone, s, s === 'changes' ? 'لطفاً سوابق و مدارک را کامل‌تر بنویسید.' : undefined);
    toast.success(`وضعیت به «${STATUS_FA[s].label}» تغییر کرد.`);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="leading-7">پرونده‌های آزمایشی مربیان که از مسیر <b dir="ltr">/app/coach/apply</b> در <b>همین مرورگر</b> ثبت شده‌اند. تغییر وضعیت در اینجا فوراً در تب‌های دیگر همین مرورگر دیده می‌شود، اما بین دستگاه‌ها همگام نمی‌شود.</p>
      </div>
      <h2 className="text-sm font-bold">پرونده‌های آزمایشی ({toFa(apps.length)})</h2>
      {apps.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">هنوز پرونده آزمایشی در این مرورگر ثبت نشده است.</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {apps.map((a) => (
          <div key={a.phone} className="space-y-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-bold">{a.name}</div><div className="text-xs text-muted-foreground">{a.category} · {a.city} · <span dir="ltr">0{toFa(a.phone)}</span></div></div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${STATUS_FA[a.status].tone}`}>{STATUS_FA[a.status].label}</span>
            </div>
            <p className="text-xs leading-6 text-muted-foreground">{a.bio}</p>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.filter((x) => x.s !== a.status).map((x) => (
                <button key={x.s} onClick={() => act(a.phone, x.s)} className="rounded-full border border-border px-3 py-1.5 text-xs transition hover:border-primary active:scale-95">{x.l}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
