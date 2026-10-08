import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCheck, BellOff } from 'lucide-react';
import { Screen } from '../kit';
import { setSession, useSession } from '../store';
import { NOTIFS } from './notifs';

const tabs = [{ k: 'all', l: 'همه' }, { k: 'msg', l: 'پیام‌ها' }, { k: 'sys', l: 'سیستم' }] as const;

export default function Notifications() {
  const s = useSession();
  const [tab, setTab] = useState<'all' | 'msg' | 'sys'>('all');
  const read = s.readNotifs ?? [];
  const list = NOTIFS.filter((n) => tab === 'all' || n.type === tab);
  const markAll = () => setSession({ readNotifs: NOTIFS.map((n) => n.id) });
  return (
    <Screen title="اعلان‌ها" back right={<button onClick={markAll} className="grid h-10 w-10 place-items-center rounded-full border border-white/10" aria-label="خواندن همه"><CheckCheck className="h-5 w-5 text-primary" /></button>}>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`relative h-10 rounded-xl border text-sm font-bold ${tab === t.k ? 'border-primary text-primary-foreground' : 'border-white/10 text-muted-foreground'}`}>
            {tab === t.k && <motion.span layoutId="ntab" className="absolute inset-0 rounded-xl bg-primary" />}<span className="relative">{t.l}</span>
          </button>
        ))}
      </div>
      {!list.length ? <div className="py-20 text-center text-muted-foreground"><BellOff className="mx-auto mb-3 h-10 w-10" />اعلانی نداری</div> : (
        <div className="space-y-3">
          {list.map((n, i) => {
            const unread = !read.includes(n.id);
            return (
              <motion.button key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSession({ readNotifs: [...read, n.id] })}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-right transition ${unread ? 'border-primary/25 bg-primary/[0.05]' : 'border-white/[0.07] bg-card/60'}`}>
                <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-primary/60 text-primary"><n.icon className="h-5 w-5" /></span>
                <div className="flex-1"><div className={`text-sm ${unread ? 'font-black' : 'font-medium text-muted-foreground'}`}>{n.title}</div><div className="mt-0.5 text-[11px] text-muted-foreground">{n.ago}</div></div>
                {unread && <span className={`h-2.5 w-2.5 rounded-full ${n.dot}`} />}
              </motion.button>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
