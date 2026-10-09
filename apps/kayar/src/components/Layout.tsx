import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Headphones, Trophy, User, Zap, LogOut, MessagesSquare, BadgeCheck } from 'lucide-react';
import { useConversations } from '../lib/chat';
import { useMe } from '../lib/data';
import { useAuth, loginWithRedirect, logout } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { PlayerProvider } from '../lib/player';
import MiniPlayer from './morshed/MiniPlayer';

const nav = [
  { to: '/home', label: 'خانه', icon: Home },
  { to: '/coaches', label: 'مربیان', icon: Users },
  { to: '/bodyyar', label: 'بدن‌یار', icon: Zap },
  { to: '/morshed', label: 'مرشد', icon: Headphones },
  { to: '/campaigns', label: 'کمپین‌ها', icon: Trophy },
];

export default function Layout() {
  const { user } = useAuth();
  const loc = useLocation();
  return (
    <PlayerProvider>
    <div dir="rtl" className="relative min-h-screen pb-28 md:pb-10">
      <div className="pointer-events-none fixed -top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-[140px]" />
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <NavLink to="/home"><Logo /></NavLink>
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
          {user ? (
            <div className="flex items-center gap-2">
              <CoachLink />
              <MessagesLink />
              <NavLink to="/profile" className="flex items-center gap-2 rounded-full border border-white/10 py-1 pe-3 ps-1 text-sm transition hover:border-primary/50">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-black text-primary-foreground">{(user.firstName || user.email)[0]?.toUpperCase()}</span>
                <span className="hidden sm:inline">پروفایل</span>
              </NavLink>
              <Button size="icon" variant="ghost" className="hidden rounded-full md:inline-flex" onClick={() => logout()} aria-label="خروج"><LogOut className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Button size="sm" className="rounded-full px-5 font-bold" onClick={() => loginWithRedirect({ redirectUrl: '/welcome' })}>ورود / ثبت‌نام</Button>
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
  const items = [nav[0], nav[1], nav[2], nav[3], { to: '/profile', label: 'پروفایل', icon: User }];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="glass border-gradient flex items-end justify-around rounded-3xl px-2 pb-2 pt-2 shadow-2xl">
        {items.map((n) => n.to === '/bodyyar' ? (
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

function MessagesLink() {
  const { data } = useConversations();
  const n = data?.totalUnread ?? 0;
  return (
    <NavLink to="/messages" aria-label="پیام‌ها" className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-primary/50">
      <MessagesSquare className="h-4 w-4" />
      {n > 0 && <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">{n > 99 ? '۹۹+' : n.toLocaleString('fa-IR')}</span>}
    </NavLink>
  );
}

function CoachLink() {
  const { data } = useMe();
  if (!data?.coach) return null;
  return (
    <NavLink to="/coach" className="hidden h-10 items-center gap-1.5 rounded-full border border-accent/40 px-3 text-sm text-accent transition hover:bg-accent/10 sm:flex">
      <BadgeCheck className="h-4 w-4" />پنل مربی
    </NavLink>
  );
}
