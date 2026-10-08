import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Smartphone, Info } from 'lucide-react';
import { loginWithRedirect } from 'zitejs/auth';
import { Screen, Lime, Bolt } from '../kit';
import { otp, isValidIrMobile, normalizePhone, OTP_MODE, DEMO_CODE } from '../otp';
import { setSession, useSession, toEn, toFa } from '../store';

export default function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const s = useSession();
  const p = normalizePhone(toEn(phone));
  const valid = isValidIrMobile(p);

  if (s.verified) return <Navigate to={s.name ? '/app/home' : '/app/complete-profile'} replace />;

  const submit = async () => {
    setBusy(true);
    try {
      await otp.send(p);
      setSession({ phone: p, verified: false });
      nav('/app/verify');
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Screen className="justify-between">
      <div className="flex flex-col items-center pt-10 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}><Bolt className="h-16 w-16" /></motion.div>
        <div className="mt-2 text-4xl font-black">کایار</div>
        <div className="text-[10px] font-bold tracking-[0.7em] text-muted-foreground">KAYAR</div>
        <h1 className="mt-10 text-2xl font-black">ورود به کایار</h1>
        <p className="mt-2 text-sm text-muted-foreground">شماره موبایل خود را وارد کنید</p>
      </div>
      <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }}>
        <div dir="ltr" className="flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.03] transition focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]">
          <span className="flex h-full items-center gap-2 border-r border-white/10 px-4 text-sm font-bold">🇮🇷 +98</span>
          <input autoFocus inputMode="numeric" maxLength={11} value={toFa(phone)} onChange={(e) => setPhone(toEn(e.target.value).replace(/\D/g, ''))}
            placeholder="۹۱۲ ۳۴۵ ۶۷۸۹" className="h-full flex-1 bg-transparent px-4 text-lg tracking-widest outline-none placeholder:text-muted-foreground/50" />
          <Smartphone className="me-4 h-5 w-5 text-muted-foreground" />
        </div>
        {phone && !valid && <p className="text-xs text-destructive">شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)</p>}
        <Lime type="submit" disabled={!valid} loading={busy}>ادامه</Lime>
        {OTP_MODE === 'demo' && (
          <div className="flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 p-3 text-xs text-accent-foreground/90">
            <Info className="h-4 w-4 shrink-0 text-accent" /> نسخه دمو: کد تأیید برای همه شماره‌ها <b className="text-primary">{toFa(DEMO_CODE)}</b> است.
          </div>
        )}
      </form>
      <div className="mt-8">
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-white/10" />یا ورود با<span className="h-px flex-1 bg-white/10" /></div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => loginWithRedirect({ redirectUrl: '/home' })} className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl font-black text-[#4285F4] transition active:scale-90" aria-label="ورود با ایمیل">G</button>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">حساب کاربری ندارید؟ <button onClick={() => valid ? submit() : toast('شماره موبایلت رو وارد کن؛ ثبت‌نام خودکار انجام می‌شه.')} className="font-bold text-primary">ثبت‌نام کنید</button></p>
      </div>
    </Screen>
  );
}
