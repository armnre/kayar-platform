import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Settings, HelpCircle, LogOut, ChevronLeft, MessageCircle, Trophy, Megaphone, Coins, Gift, CheckCircle2, User } from 'lucide-react';
import { resetSession, useSession, toFa } from '../store';
import { Card } from '../kit';
import { useCatalog, usePlay, fa } from '../../lib/data';
import { useDemo, demoId } from '../../lib/demo';
import Avatar from '../components/Avatar';
import { NOTIFS } from './notifs';
import { HomeHero, HomeCampaignRail, HomeQuickActions, HomeCoaches, HomeMorshed, HomeChallenges } from './home/HomeSections';

/** Real activity numbers for the signed-in test account (from the local test store — nothing invented). */
export function useMyStats() {
  const s = useSession();
  const demo = useDemo();
  const play = usePlay();
  const who = demoId(s.phone);
  const parts = Object.values(demo.parts[who] ?? {});
  return { points: play.points, joined: parts.length, completed: parts.filter((p) => p.completed).length, rewards: (demo.redemptions[who] ?? []).length, mode: play.mode };
}

export function StatTiles() {
  const st = useMyStats();
  const t = [{ v: st.points, l: 'امتیاز', i: Coins }, { v: st.completed, l: 'چالش تکمیل‌شده', i: CheckCircle2 }, { v: st.rewards, l: 'جایزه دریافتی', i: Gift }];
  return (
    <div className="grid grid-cols-3 gap-3">
      {t.map((x, k) => (
        <motion.div key={x.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.06 }}
          className="rounded-2xl border border-white/[0.07] bg-card/80 p-3 text-center">
          <x.i className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-xl font-black">{fa(x.v)}</div>
          <div className="text-[11px] text-muted-foreground">{x.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function MenuList() {
  const nav = useNavigate();
  const rows = [
    { i: User, l: 'ویرایش اطلاعات حساب', go: () => nav('/app/complete-profile') },
    { i: MessageCircle, l: 'پیام‌ها', go: () => nav('/app/messages') },
    { i: Megaphone, l: 'کمپین‌ها', go: () => nav('/app/campaigns') },
    { i: Trophy, l: 'چالش‌ها و جوایز', go: () => nav('/app/rewards') },
    { i: Bell, l: 'اعلان‌ها', go: () => nav('/app/notifications') },
    { i: HelpCircle, l: 'مرکز کمک', go: () => window.open('mailto:support@kayar.app') },
    { i: LogOut, l: 'خروج از حساب', go: () => { resetSession(); nav('/app/login', { replace: true }); }, tone: 'text-destructive' },
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

/** /app/home — the super-app hub. Campaigns lead; everything else is ordered by how often people use it. */
export default function Dashboard() {
  const s = useSession();
  const nav = useNavigate();
  const { data, isLoading } = useCatalog();
  const st = useMyStats();
  const unread = NOTIFS.filter((n) => !s.readNotifs?.includes(n.id)).length;
  const campaigns = data?.campaigns ?? [];
  const featured = campaigns.find((c) => c.phase === 'live' && c.placement.includes('بنر برجسته')) ?? campaigns.find((c) => c.phase === 'live') ?? campaigns[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7 px-5 pt-5">
      <header className="flex items-center gap-3">
        <Link to="/app/profile" aria-label="پروفایل من" className="rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-background"><Avatar gender={s.gender} className="h-11 w-11" /></Link>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">سلام {s.name?.split(' ')[0]}</div>
          <button onClick={() => nav('/app/rewards')} className="flex items-center gap-1.5 text-sm font-black"><Coins className="h-4 w-4 text-primary" />{fa(st.points)} امتیاز{st.mode === 'demo' && <span className="text-[10px] font-normal text-muted-foreground">(آزمایشی)</span>}</button>
        </div>
        <button onClick={() => nav('/app/notifications')} className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10" aria-label="اعلان‌ها">
          <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute -left-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">{toFa(unread)}</span>}
        </button>
        <button onClick={() => nav('/app/profile')} className="grid h-11 w-11 place-items-center rounded-full border border-white/10" aria-label="تنظیمات حساب"><Settings className="h-5 w-5" /></button>
      </header>

      <HomeHero c={featured} loading={isLoading} />
      <HomeQuickActions />
      <HomeCampaignRail list={campaigns.filter((c) => c.id !== featured?.id)} loading={isLoading} />
      <HomeChallenges list={data?.challenges ?? []} />
      <HomeCoaches list={data?.coaches ?? []} loading={isLoading} />
      <HomeMorshed list={data?.audio ?? []} />
    </motion.div>
  );
}
