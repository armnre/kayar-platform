import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Headphones, Trophy, User, Zap } from 'lucide-react';
import { useSession, useCoachApps, isLoggedIn } from '../mobile/store';
import { homeFor } from '../mobile/auth';
import { Button } from '@project/components/ui/button';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { PlayerProvider } from '../lib/player';
import MiniPlayer from './morshed/MiniPlayer';

const nav = [
  { to: '/app/home', label: 'خانه', icon: Home },
  { to: '/app/coaches', label: 'مربیان', icon: Users },
  { to: '/app/bodyyar', label: 'بدن‌یار', icon: Zap },
  { to: '/app/morshed', label: 'مرشد', icon: Headphones },
  { to: '/campaigns', label: 'کمپین‌ها', icon: Trophy },
];

export default function Layout() {
  const s = useSession();
  const apps = useCoachApps();
  const loc = useLocation();
  return (
    <PlayerProvider>
    <div dir="rtl" className="relative min-h-screen pb-28 md:pb-10">
      <div className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-[140px]" />
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NavLink to="/"><Logo /></NavLink>
          <nav className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className="relative rounded-full px-4 py-2 text-sm font-medium">
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                    <span className={cn('relative transition', isActive ? 'font-bold text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>{n.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          {isLoggedIn(s) ? (
            <Button asChild size="sm" className="rounded-full px-5 font-bold"><NavLink to={homeFor(s, apps)}>ورود به اپ</NavLink></Button>
          ) : (
            <Button asChild size="sm" className="rounded-full px-5 font-bold"><NavLink to="/app/login">ورود / ثبت‌نام</NavLink></Button>
          )}
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname} initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <MiniPlayer />
      <MobileNav />
      <Toaster position="top-center" />
    </div>
    </PlayerProvider>
  );
}

function MobileNav() {
  const items = [nav[0], nav[1], nav[2], nav[3], { to: '/app/profile', label: 'پروفایل', icon: User }];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="glass border-gradient flex items-end justify-around rounded-3xl px-2 pb-2 pt-2 shadow-2xl">
        {items.map((n) => n.to === '/app/bodyyar' ? (
          <NavLink key={n.to} to={n.to} className="-mt-8 flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <motion.span whileTap={{ scale: 0.9 }} className={cn('grid h-16 w-16 place-items-center rounded-full border-4 border-background bg-gradient-to-br from-primary to-[hsl(150_90%_55%)] text-primary-foreground glow', isActive && 'scale-105')}>
                  <Zap className="h-7 w-7" fill="currentColor" />
                </motion.span>
                <span className="text-[11px] font-bold text-primary">{n.label}</span>
              </>
            )}
          </NavLink>
        ) : (
          <NavLink key={n.to} to={n.to} className="relative flex w-14 flex-col items-center gap-1 py-1 text-[11px]">
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="mpill" className="absolute -top-2 h-1 w-6 rounded-full bg-primary" />}
                <n.icon className={cn('h-5 w-5 transition', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
