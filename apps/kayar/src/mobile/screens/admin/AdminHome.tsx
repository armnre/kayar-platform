import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogOut, ShieldCheck } from 'lucide-react';
import { CoachStatus, resetSession, setCoachStatus, toFa, useCoachApps } from '../../store';
import { STATUS_FA } from '../coach/CoachShell';

const ACTIONS: { s: CoachStatus; l: string }[] = [
  { s: 'approved', l: 'تأیید' }, { s: 'changes', l: 'نیاز به اصلاح' }, { s: 'rejected', l: 'رد' }, { s: 'suspended', l: 'تعلیق' },
];

/** Test-mode admin area: review coach applications submitted on this device. */
export default function AdminHome() {
  const nav = useNavigate();
  const apps = Object.values(useCoachApps()).sort((a, b) => b.updatedAt - a.updatedAt);
  const act = (phone: string, s: CoachStatus) => {
    setCoachStatus(phone, s, s === 'changes' ? 'لطفاً سوابق و مدارک را کامل‌تر بنویسید.' : undefined);
    toast.success(`وضعیت به «${STATUS_FA[s].label}» تغییر کرد.`);
  };
  return (
    <div className="space-y-5 px-5 py-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-accent" /><h1 className="text-xl font-black">مدیریت کایار</h1></div>
        <button onClick={() => { resetSession(); nav('/app/admin/login', { replace: true }); }} aria-label="خروج"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-muted-foreground"><LogOut className="h-4 w-4" /></button>
      </header>
      <h2 className="text-sm font-bold">درخواست‌های مربیگری ({toFa(apps.length)})</h2>
      {apps.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">هنوز درخواستی ثبت نشده است.</p>}
      {apps.map((a) => (
        <div key={a.phone} className="space-y-3 rounded-2xl border border-white/10 bg-card/80 p-4">
          <div className="flex items-start justify-between gap-2">
            <div><div className="font-bold">{a.name}</div><div className="text-xs text-muted-foreground">{a.category} · {a.city} · <span dir="ltr">0{toFa(a.phone)}</span></div></div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${STATUS_FA[a.status].tone}`}>{STATUS_FA[a.status].label}</span>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">{a.bio}</p>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.filter((x) => x.s !== a.status).map((x) => (
              <button key={x.s} onClick={() => act(a.phone, x.s)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs transition active:scale-95">{x.l}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
