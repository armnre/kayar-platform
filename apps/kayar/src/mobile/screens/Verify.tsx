import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MessageSquareText, Timer } from 'lucide-react';
import { Screen, Lime } from '../kit';
import { otp, OTP_LENGTH, RESEND_SECONDS, OTP_MODE, DEMO_CODE } from '../otp';
import { setSession, useSession, toEn, toFa } from '../store';

export default function Verify() {
  const s = useSession();
  const nav = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000); return () => clearInterval(t); }, []);
  if (s.verified) return <Navigate to={s.name ? '/app/home' : '/app/complete-profile'} replace />;
  if (!s.phone) return <Navigate to="/app/login" replace />;

  const check = async (code: string) => {
    setBusy(true);
    try {
      const ok = await otp.verify(s.phone!, code);
      if (!ok) { setShake((x) => x + 1); setDigits(Array(OTP_LENGTH).fill('')); refs.current[0]?.focus(); toast.error('کد وارد شده صحیح نیست.'); return; }
      setSession({ verified: true });
      // Replace both login & verify entries so "back" can't return to the phone screen.
      nav(s.name ? '/app/home' : '/app/complete-profile', { replace: true });
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const setAt = (i: number, v: string) => {
    const clean = toEn(v).replace(/\D/g, '');
    const next = [...digits];
    if (clean.length > 1) { clean.slice(0, OTP_LENGTH).split('').forEach((c, k) => (next[k] = c)); }
    else next[i] = clean;
    setDigits(next);
    if (clean && i < OTP_LENGTH - 1) refs.current[Math.min(OTP_LENGTH - 1, i + Math.max(1, clean.length))]?.focus();
    if (next.every(Boolean)) check(next.join(''));
  };

  const resend = async () => { await otp.send(s.phone!); setLeft(RESEND_SECONDS); toast.success('کد جدید ارسال شد.'); };
  const mm = `${toFa(Math.floor(left / 60)).padStart(2, '۰')}:${toFa(left % 60).padStart(2, '۰')}`;

  return (
    <Screen back="/app/login">
      <div className="flex flex-col items-center text-center">
        <div className="relative my-6 grid h-32 w-32 place-items-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-dashed border-primary/40" />
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-primary/10 text-primary shadow-[0_0_40px_hsl(var(--primary)/0.35)]"><MessageSquareText className="h-9 w-9" /></span>
        </div>
        <h1 className="text-2xl font-black">کد تأیید پیامکی</h1>
        <p className="mt-2 text-sm text-muted-foreground">کد ارسال شده به شماره</p>
        <p dir="ltr" className="mt-1 font-bold tracking-wider">+۹۸ {toFa(s.phone)}</p>
        <button onClick={() => nav('/app/login')} className="mt-1 text-xs text-primary">ویرایش شماره</button>
      </div>
      <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} dir="ltr" className="mt-8 flex justify-center gap-2">
        {digits.map((d, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} value={toFa(d)} inputMode="numeric" maxLength={OTP_LENGTH} autoFocus={i === 0}
            onChange={(e) => setAt(i, e.target.value)} onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i) refs.current[i - 1]?.focus(); }}
            className={`h-14 w-12 rounded-2xl border bg-white/[0.03] text-center text-2xl font-black outline-none transition focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] ${d ? 'border-primary/60 text-primary' : 'border-white/10'}`} />
        ))}
      </motion.div>
      <div className="mt-6 flex flex-col items-center gap-1 text-sm">
        {left > 0 ? <span className="flex items-center gap-2 text-muted-foreground"><Timer className="h-4 w-4 text-primary" />{mm}</span>
          : <button onClick={resend} className="font-bold text-primary">ارسال مجدد کد</button>}
        {left > 0 && <span className="text-xs text-muted-foreground">ارسال مجدد کد</span>}
      </div>
      {OTP_MODE === 'demo' && <p className="mt-4 text-center text-xs text-muted-foreground">کد دمو: <b className="text-primary">{toFa(DEMO_CODE)}</b></p>}
      <div className="mt-auto pt-8"><Lime loading={busy} disabled={!digits.every(Boolean)} onClick={() => check(digits.join(''))}>تأیید و ورود</Lime></div>
    </Screen>
  );
}
