import { NavLink } from 'react-router-dom';
import { Home, Headphones, Users, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';

const items = [
  { to: '/app/home', label: 'خانه', icon: Home },
  { to: '/app/morshed', label: 'مرشد', icon: Headphones },
  { to: '/app/bodyyar', label: 'بدن‌یار', icon: Zap, center: true },
  { to: '/app/coaches', label: 'مربی', icon: Users },
  { to: '/app/rewards', label: 'چالش‌ها', icon: Trophy },
];

export default function BottomNav() {
  return (
    <nav className="absolute inset-x-3 bottom-3 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-end justify-around rounded-[1.75rem] border border-white/10 bg-card/90 px-2 py-2 shadow-2xl backdrop-blur-xl">
        {items.map((n) => (
          <NavLink key={n.to} to={n.to} className={cn('relative flex flex-col items-center gap-1 text-[11px]', n.center ? '-mt-9' : 'w-14 py-1')}>
            {({ isActive }) => n.center ? (
              <>
                <motion.span whileTap={{ scale: 0.9 }} className="grid h-16 w-16 place-items-center rounded-full border-[5px] border-background bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.6)]">
                  <Zap className="h-7 w-7" fill="currentColor" />
                </motion.span>
                <span className="font-bold text-primary">{n.label}</span>
              </>
            ) : (
              <>
                {isActive && <motion.span layoutId="mtab" className="absolute -top-2 h-1 w-6 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />}
                <n.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className={isActive ? 'font-bold text-primary' : 'text-muted-foreground'}>{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
