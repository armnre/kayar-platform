import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Screen, Lime, Field, inputCls } from '../kit';
import { setSession, toEn } from '../store';

// Demo validation. Live: verify against a garment-codes table via an endpoint.
const valid = (u: string, p: string) => /^B\d{5}$/i.test(u) && /^[A-Z0-9]{5}$/i.test(p);

export default function Activation() {
  const nav = useNavigate();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true); setErr(false);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    if (!valid(toEn(u.trim()), toEn(p.trim()))) return setErr(true);
    setSession({ bodyyarActive: true });
    toast.success('بدن‌یار با موفقیت فعال شد ⚡');
    nav('/app/bodyyar/profile', { replace: true });
  };
  return (
    <Screen title="فعال‌سازی بدن‌یار" back="/app/bodyyar">
      <div className="space-y-5">
        <Field label="نام کاربری"><input dir="ltr" value={u} onChange={(e) => setU(e.target.value.toUpperCase())} placeholder="مثال: B12345" className={inputCls} /></Field>
        <Field label="رمز عبور"><input dir="ltr" value={p} onChange={(e) => setP(e.target.value.toUpperCase())} placeholder="مثال: 3F3K2" className={inputCls} /></Field>
        <Lime onClick={submit} loading={busy} disabled={!u || !p}>فعال‌سازی</Lime>
        <AnimatePresence>
          {err && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
              <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />
              <div><div className="text-sm font-black text-destructive">کد وارد شده نامعتبر است</div><div className="mt-1 text-xs text-muted-foreground">لطفاً کد و رمز را بررسی کنید.</div></div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-xs text-muted-foreground">دمو: هر نام کاربری با قالب B + ۵ رقم و رمز ۵ کاراکتری پذیرفته می‌شود.</p>
      </div>
    </Screen>
  );
}
