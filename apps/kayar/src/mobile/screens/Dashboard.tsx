import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Crown, Settings, HelpCircle, LogOut, ChevronLeft, Play, Dumbbell, Flame, Medal } from 'lucide-react';
import Avatar from '../components/Avatar';
import { resetSession, useSession, toFa } from '../store';
import { Card } from '../kit';
import { NOTIFS } from './notifs';

export const STATS = { workouts: 78, streak: 24, badges: 12, kcal: 700, kcalGoal: 900 };

export function Ring({ value, size = 120 }: { value: number; size?: number }) {
  const r = size / 2 - 8, c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--primary) / 0.12)" strokeWidth="9" fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--primary))" strokeWidth="9" fill="none" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
      </svg>
      <span className="text-3xl font-black">{toFa(value)}٪</span>
    </div>
  );
}

export function StatTiles() {
  const t = [{ v: STATS.workouts, l: 'تمرین', i: Dumbbell }, { v: STATS.streak, l: 'روز پیاپی', i: Flame }, { v: STATS.badges, l: 'دستاورد', i: Medal }];
  return (
    <div className="grid grid-cols-3 gap-3">
      {t.map((x, k) => (
        <motion.div key={x.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + k * 0.08 }}
          className="rounded-2xl border border-white/[0.07] bg-card/80 p-3 text-center">
          <x.i className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-xl font-black">{toFa(x.v)}</div>
          <div className="text-[11px] text-muted-foreground">{x.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function MenuList() {
  const nav = useNavigate();
  const rows = [
    { i: Crown, l: 'اشتراک و پلن‌ها', go: () => nav('/app/bodyyar'), tone: 'text-accent' },
    { i: Settings, l: 'تنظیمات', go: () => nav('/app/complete-profile') },
    { i: HelpCircle, l: 'مرکز کمک', go: () => window.open('mailto:support@kayar.app') },
    { i: LogOut, l: 'خروج', go: () => { resetSession(); nav('/app/login', { replace: true }); }, tone: 'text-destructive' },
  ];
  return (
    <Card className="divide-y divide-white/5 p-1">
      {rows.map((r) => (
        <button key={r.l} onClick={r.go} className="flex w-full items-center gap-3 px-3 py-4 text-sm transition active:bg-white/5">
          <r.i className={`h-5 w-5 ${r.tone ?? 'text-muted-foreground'}`} /><span className="flex-1 text-right">{r.l}</span><ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}
    </Card>
  );
}

export default function Dashboard() {
  const s = useSession();
  const nav = useNavigate();
  const unread = NOTIFS.filter((n) => !s.readNotifs?.includes(n.id)).length;
  const pct = Math.round((STATS.kcal / STATS.kcalGoal) * 100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 px-5 pt-5">
      <div className="flex items-center gap-3">
        <button onClick={() => nav('/app/profile')} className="rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-background"><Avatar gender={s.gender} className="h-12 w-12" /></button>
        <div className="flex-1">
          <div className="text-lg font-black">سلام، {s.name?.split(' ')[0]} 👋</div>
          <div className="text-xs text-muted-foreground">بیا امروز رو بهتر بسازیم</div>
        </div>
        <button onClick={() => nav('/app/notifications')} className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10" aria-label="اعلان‌ها">
          <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute -top-0.5 -left-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">{toFa(unread)}</span>}
        </button>
      </div>
      <Card className="flex items-center gap-5 border-primary/20 bg-gradient-to-l from-primary/[0.08] to-transparent p-5">
        <Ring value={pct} />
        <div className="flex-1">
          <div className="text-sm font-bold">پیشرفت امروز</div>
          <div className="mt-1 text-xs text-muted-foreground">{toFa(STATS.kcal)} / {toFa(STATS.kcalGoal)} کالری</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-primary" /></div>
        </div>
      </Card>
      <StatTiles />
      <MenuList />
      <Card onClick={() => nav('/app/morshed')} className="flex items-center gap-3 border-accent/30 bg-gradient-to-l from-accent/15 to-transparent">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/25 text-2xl">🎧</span>
        <div className="flex-1"><div className="text-xs text-muted-foreground">آخرین مرشد</div><div className="font-bold">انگیزه برای ادامه</div></div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-4 w-4" fill="currentColor" /></span>
      </Card>
    </motion.div>
  );
}
