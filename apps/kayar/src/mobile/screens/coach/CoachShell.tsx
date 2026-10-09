import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { coachStatusOf, resetSession, useCoachApps, useSession, CoachStatus } from '../../store';
import { coachHome } from '../../auth';

export const STATUS_FA: Record<CoachStatus, { label: string; text: string; tone: string }> = {
  none: { label: 'بدون پرونده', text: 'هنوز درخواست همکاری ثبت نکرده‌اید.', tone: 'bg-white/10 text-muted-foreground' },
  pending: { label: 'در انتظار تأیید', text: 'پرونده شما در حال بررسی کارشناسی است (معمولاً ۲ تا ۳ روز کاری).', tone: 'bg-primary/15 text-primary' },
  approved: { label: 'تأیید شده', text: 'پنل مربی شما فعال است.', tone: 'bg-primary/15 text-primary' },
  changes: { label: 'نیاز به اصلاح', text: 'لطفاً موارد خواسته‌شده را اصلاح و دوباره ارسال کنید.', tone: 'bg-yellow-500/15 text-yellow-400' },
  rejected: { label: 'رد شده', text: 'درخواست شما تأیید نشد.', tone: 'bg-destructive/15 text-destructive' },
  suspended: { label: 'معلق', text: 'دسترسی پنل شما موقتاً غیرفعال شده است. با پشتیبانی تماس بگیرید.', tone: 'bg-destructive/15 text-destructive' },
};

export function useCoachStatus() {
  const s = useSession();
  const apps = useCoachApps();
  return { s, app: s.phone ? apps[s.phone] : undefined, status: coachStatusOf(s.phone, apps) };
}

/** Coach area chrome (inside /app, role already checked by RequireRole). */
export default function CoachShell() {
  const nav = useNavigate();
  const { app, s, status } = useCoachStatus();
  const out = () => { resetSession(); nav('/app/coach/login', { replace: true }); };
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-background/80 px-5 py-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />پرتال مربیان کایار</div>
          <div className="text-sm font-black">{app?.name || `مربی ${s.phone ?? ''}`}</div>
        </div>
        <button onClick={out} aria-label="خروج" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-muted-foreground"><LogOut className="h-4 w-4" /></button>
      </header>
      {status === 'approved' && (
        <nav className="flex gap-2 border-b border-white/5 px-5 py-2 text-sm">
          {[['/app/coach/dashboard', 'داشبورد'], ['/app/coach/messages', 'پیام‌ها']].map(([to, l]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-4 py-1.5 ${isActive ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'}`}>{l}</NavLink>
          ))}
        </nav>
      )}
      <div className="flex-1"><Outlet /></div>
    </div>
  );
}

/** /app/coach → the right coach page for the current approval status. */
export function CoachIndex() {
  const { status } = useCoachStatus();
  return <Navigate to={coachHome(status)} replace />;
}

