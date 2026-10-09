import { NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BarChart3, FlaskConical, Gift, Headphones, LogOut, Megaphone, ShieldCheck, Trophy, Users, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminListCoachesOutputType } from 'zitejs/api';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import AdminLogin from './AdminLogin';
import CoachesView from './CoachesView';
import EntityManager from './EntityManager';
import StatsDashboard from './StatsDashboard';
import TestCoaches from './TestCoaches';
import { isAuthError, setAdminSession, useAdminSession } from './session';

export type AdminCoach = AdminListCoachesOutputType['coaches'][number];

const qc = new QueryClient({
  defaultOptions: { queries: { retry: (n, e) => !isAuthError(e) && n < 2 } },
  queryCache: new QueryCache({ onError: (e) => { if (isAuthError(e)) { setAdminSession(null); toast.error('نشست مدیریت منقضی شد.'); } } }),
});

const GROUPS = [
  { title: 'نمای کلی', items: [{ to: 'dashboard', l: 'داشبورد', i: BarChart3 }] },
  { title: 'مربیان', items: [{ to: 'coaches', l: 'بررسی مربیان', i: Users }, { to: 'test-coaches', l: 'پرونده‌های آزمایشی', i: FlaskConical }] },
  { title: 'محتوا و کمپین', items: [
    { to: 'morshed', l: 'محتوای مرشد', i: Headphones }, { to: 'campaigns', l: 'کمپین و اسپانسر', i: Megaphone },
    { to: 'challenges', l: 'چالش‌ها', i: Trophy }, { to: 'rewards', l: 'پاداش‌ها', i: Gift },
  ] },
];
const TITLES: Record<string, string> = Object.fromEntries(GROUPS.flatMap((g) => g.items.map((i) => [i.to, i.l])));

function RequireAdmin() {
  const s = useAdminSession();
  const loc = useLocation();
  if (!s) return <Navigate to={`/admin/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  return <Shell />;
}

function Shell() {
  const nav = useNavigate();
  const page = useLocation().pathname.split('/')[2] ?? '';
  const logout = () => { setAdminSession(null); qc.clear(); nav('/admin/login', { replace: true }); };
  const link = (to: string) => ({ isActive }: { isActive: boolean }) =>
    cn('flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition', isActive ? 'bg-primary font-bold text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground');
  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur md:h-screen md:border-b-0 md:border-l">
        <div className="flex h-16 items-center gap-2 px-5"><ShieldCheck className="h-6 w-6 text-primary" /><span className="font-black">کایار · مدیریت</span>
          <span className="mr-auto rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground md:hidden">آزمایشی</span></div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-5 md:px-4">
          {GROUPS.map((g) => (
            <div key={g.title} className="flex gap-1 md:block md:space-y-1">
              <div className="hidden px-3 text-[11px] font-bold text-muted-foreground/70 md:block">{g.title}</div>
              {g.items.map((i) => <NavLink key={i.to} to={`/admin/${i.to}`} className={link(i.to)}><i.i className="h-4 w-4" />{i.l}</NavLink>)}
            </div>
          ))}
        </nav>
        <div className="hidden space-y-1 px-4 md:absolute md:inset-x-0 md:bottom-4 md:block">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><ExternalLink className="h-4 w-4" />مشاهده سایت</a>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />خروج</button>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 md:px-8">
          <h1 className="text-lg font-black">{TITLES[page] ?? 'مدیریت'}</h1>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-accent/15 px-3 py-1 text-xs font-bold md:inline">ورود آزمایشی</span>
            <button onClick={logout} aria-label="خروج" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground md:hidden"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8"><Outlet /></div>
      </main>
    </div>
  );
}

function NotFoundAdmin() {
  return <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">این صفحه در پنل مدیریت وجود ندارد. <NavLink className="text-primary underline" to="/admin/dashboard">بازگشت به داشبورد</NavLink></div>;
}

/** /admin/* — the full Kayar Admin panel (moved from the former separate kayar-admin app). */
export default function AdminApp() {
  return (
    <QueryClientProvider client={qc}>
      <div dir="rtl" className="dark min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StatsDashboard />} />
            <Route path="coaches" element={<CoachesView />} />
            <Route path="test-coaches" element={<TestCoaches />} />
            <Route path="morshed" element={<EntityManager key="audio" entity="audio" />} />
            <Route path="campaigns" element={<EntityManager key="campaigns" entity="campaigns" />} />
            <Route path="challenges" element={<EntityManager key="challenges" entity="challenges" />} />
            <Route path="rewards" element={<EntityManager key="rewards" entity="rewards" />} />
            <Route path="*" element={<NotFoundAdmin />} />
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </div>
    </QueryClientProvider>
  );
}
