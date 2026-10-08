import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, KeyRound, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Screen, Lime } from '../kit';
import { setSession, useSession } from '../store';

export default function BodyYarEntry() {
  const nav = useNavigate();
  const s = useSession();
  const opts = [
    { i: QrCode, t: 'اسکن QR لباس', d: 'با اسکن کد QR داخل لباس کایوش', go: () => nav('/app/bodyyar/scan') },
    { i: KeyRound, t: 'وارد کردن کد و رمز', d: 'کد دریافتی پشت لباس', go: () => nav('/app/bodyyar/activate') },
    { i: CreditCard, t: 'خرید اشتراک', d: 'دسترسی کامل به همه امکانات', go: () => { setSession({ bodyyarActive: true }); toast.success('اشتراک آزمایشی دمو فعال شد (درگاه پرداخت هنوز متصل نیست).'); nav('/app/bodyyar/profile'); } },
  ];
  const start = () => nav(!s.bodyyarActive ? '/app/bodyyar/scan' : s.body ? '/app/bodyyar/chat' : '/app/bodyyar/profile');
  return (
    <Screen>
      <div className="mb-8 text-center">
        <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-black text-primary drop-shadow-[0_0_25px_hsl(var(--primary)/0.6)]">بدن‌یار</motion.h1>
        <p className="mt-2 text-sm text-muted-foreground">دستیار هوشمند تناسب اندام شما</p>
        {s.bodyyarActive && <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><CheckCircle2 className="h-4 w-4" />بدن‌یار شما فعال است</div>}
      </div>
      <div className="space-y-3">
        {opts.map((o, k) => (
          <motion.button key={o.t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + k * 0.08 }} onClick={o.go}
            className="flex w-full items-center gap-4 rounded-3xl border border-white/[0.08] bg-card/80 p-4 text-right transition active:scale-[0.98] hover:border-primary/40">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-primary/60 text-primary shadow-[0_0_20px_-4px_hsl(var(--primary))]"><o.i className="h-6 w-6" /></span>
            <div className="flex-1"><div className="font-black">{o.t}</div><div className="mt-0.5 text-xs text-muted-foreground">{o.d}</div></div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        ))}
      </div>
      <div className="mt-auto pt-10"><Lime onClick={start}>{s.bodyyarActive ? 'ادامه با بدن‌یار' : 'شروع کنید'}</Lime></div>
    </Screen>
  );
}
