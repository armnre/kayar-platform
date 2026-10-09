import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileSignature, MessagesSquare, LogOut, ArrowRight } from 'lucide-react';
import { useAuth, logout } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Toaster } from '@project/components/ui/sonner';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import Logo from '../Logo';

const nav = [
  { to: '/coach', label: 'پنل', icon: LayoutDashboard, end: true },
  { to: '/coach/apply', label: 'پرونده همکاری', icon: FileSignature },
  { to: '/messages', label: 'پیام‌ها', icon: MessagesSquare },
];

/** Separate shell for the coach portal — distinct from the athlete app. */
export default function CoachLayout() {
  const { user, isLoading } = useAuth();
  const loc = useLocation();
  if (isLoading) return <div dir="rtl" className="mx-auto max-w-5xl p-6"><Skeleton className="h-96 rounded-3xl" /></div>;
  if (!user) return <Navigate to={`/coach/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  return (
    <div dir="rtl" className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.12),transparent_60%)]">
      <header className="sticky top-0 z-40 border-b border-accent/20 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">پرتال مربیان</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition', isActive ? 'bg-accent/15 font-bold text-accent' : 'text-muted-foreground hover:text-foreground')}>
                <n.icon className="h-4 w-4" />{n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="rounded-full"><NavLink to="/home"><ArrowRight className="ml-1 h-4 w-4" />اپ ورزشکار</NavLink></Button>
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => logout()} aria-label="خروج"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
        <nav className="flex justify-around border-t border-white/5 md:hidden">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]', isActive ? 'text-accent' : 'text-muted-foreground')}>
              <n.icon className="h-4 w-4" />{n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6"><Outlet /></main>
      <Toaster position="top-center" />
    </div>
  );
}
