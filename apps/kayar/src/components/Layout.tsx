import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Headphones, Trophy, User, Zap } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import { motion } from 'framer-motion';
import Logo from './Logo';

const nav = [
  { to: '/', label: 'خانه', icon: Home },
  { to: '/coaches', label: 'مربیان', icon: Users },
  { to: '/bodyyar', label: 'بدن‌یار', icon: Zap },
  { to: '/morshed', label: 'مرشد', icon: Headphones },
  { to: '/rewards', label: 'جوایز', icon: Trophy },
];

export default function Layout() {
  const { user } = useAuth();
  const loc = useLocation();
  return (
    <div dir="rtl" className="min-h-screen pb-28 md:pb-10">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NavLink to="/"><Logo /></NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => cn('rounded-full px-4 py-2 text-sm font-medium transition', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          {user ? (
            <NavLink to="/profile" className="flex items-center gap-2 rounded-full border border-white/10 py-1 pe-3 ps-1 text-sm hover:border-primary/50">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">{(user.firstName || user.email)[0]?.toUpperCase()}</span>
              <span className="hidden sm:inline">پروفایل</span>
            </NavLink>
          ) : (
            <Button size="sm" className="rounded-full px-5 font-bold" onClick={() => loginWithRedirect()}>ورود / ثبت‌نام</Button>
          )}
        </div>
      </header>
      <motion.main key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </motion.main>
      <MobileNav />
      <Toaster position="top-center" />
    </div>
  );
}

function MobileNav() {
  const items = [nav[0], nav[1], nav[2], nav[3], { to: '/profile', label: 'پروفایل', icon: User }];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="glass flex items-end justify-around rounded-3xl px-2 pb-2 pt-2 shadow-xl">
        {items.map((n) => n.to === '/bodyyar' ? (
          <NavLink key={n.to} to={n.to} className="-mt-8 flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <span className={cn('grid h-16 w-16 place-items-center rounded-full border-4 border-background bg-primary text-primary-foreground glow transition', isActive && 'scale-105')}>
                  <Zap className="h-7 w-7" fill="currentColor" />
                </span>
                <span className="text-[11px] font-bold text-primary">{n.label}</span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => cn('flex w-14 flex-col items-center gap-1 py-1 text-[11px]', isActive ? 'text-primary' : 'text-muted-foreground')}>
            <n.icon className="h-5 w-5" />
            {n.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
