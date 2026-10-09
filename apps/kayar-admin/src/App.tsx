import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShieldCheck, Users, Headphones, Megaphone, Trophy, Gift, BarChart3 } from 'lucide-react';
import { ListCoachesOutputType } from 'zitejs/api';
import { Toaster } from '@project/components/ui/sonner';
import { cn } from '@project/components/lib/utils';
import CoachesView from './components/CoachesView';
import EntityManager from './components/EntityManager';
import StatsDashboard from './components/StatsDashboard';

export type AdminCoach = ListCoachesOutputType['coaches'][number];
const qc = new QueryClient();
const TABS = [
  { v: 'stats', l: 'داشبورد', i: BarChart3 },
  { v: 'coaches', l: 'مربیان', i: Users },
  { v: 'audio', l: 'محتوای مرشد', i: Headphones },
  { v: 'campaigns', l: 'کمپین و اسپانسر', i: Megaphone },
  { v: 'challenges', l: 'چالش‌ها', i: Trophy },
  { v: 'rewards', l: 'پاداش‌ها', i: Gift },
] as const;
type Tab = (typeof TABS)[number]['v'];

export default function App() {
  const [tab, setTab] = useState<Tab>('stats');
  return (
    <QueryClientProvider client={qc}>
      <div dir="rtl" className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4"><ShieldCheck className="h-6 w-6 text-primary" /><span className="text-lg font-black">کایار · پنل مدیریت</span></div>
          <nav className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
            {TABS.map((t) => (
              <button key={t.v} onClick={() => setTab(t.v)} className={cn('flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm', tab === t.v ? 'bg-primary font-bold text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <t.i className="h-4 w-4" />{t.l}
              </button>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {tab === 'stats' && <StatsDashboard />}
          {tab === 'coaches' && <CoachesView />}
          {(tab === 'audio' || tab === 'campaigns' || tab === 'challenges' || tab === 'rewards') && <EntityManager key={tab} entity={tab} />}
        </main>
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
