import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { fmtJalali } from '../components/JalaliPicker';
import { useSession, toFa } from '../store';
import { Screen } from '../kit';
import { StatTiles, MenuList } from './Dashboard';

export default function Profile() {
  const s = useSession();
  const nav = useNavigate();
  const level = 52;
  return (
    <Screen title="پروفایل من">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1.5 rounded-full bg-[conic-gradient(hsl(var(--primary)),transparent_40%,hsl(var(--primary)))]" />
          <Avatar gender={s.gender} className="relative h-24 w-24 border-4 border-background" />
          <button onClick={() => nav('/app/complete-profile')} aria-label="ویرایش" className="absolute bottom-0 left-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Pencil className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 text-xl font-black">{s.name}</div>
        <div dir="ltr" className="text-xs text-muted-foreground">+۹۸ {toFa(s.phone ?? '')}</div>
        <div className="mt-1 text-xs font-bold text-primary">کاربر نقره‌ای{s.birth ? ` · متولد ${fmtJalali(s.birth)}` : ''}</div>
      </div>
      <div className="my-6">
        <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">تا سطح طلایی</span><span className="font-bold">{toFa(level)}٪</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${level}%` }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" /></div>
      </div>
      <div className="space-y-5"><StatTiles /><MenuList /></div>
    </Screen>
  );
}
