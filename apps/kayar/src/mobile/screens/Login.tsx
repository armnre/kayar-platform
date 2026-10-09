import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Smartphone, Info, BadgeCheck, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Screen, Lime, Bolt } from '../kit';
import { otp, isValidIrMobile, normalizePhone, OTP_MODE, DEMO_CODE } from '../otp';
import { startSession, toEn, toFa } from '../store';
import AuthBackdrop from '../components/AuthBackdrop';

export default function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [sp] = useSearchParams();
  const next = sp.get('next');
  const p = normalizePhone(toEn(phone));
  const valid = isValidIrMobile(p);

  const submit = async () => {
    setBusy(true);
    try {
      await otp.send(p);
      startSession('user', p, false);
      nav(`/app/verify${next ? `?next=${encodeURIComponent(next)}` : ''}`);
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Screen className="pb-8">
      <AuthBackdrop img="https://images.fillout.com/886978/vxifokrwnr/generated-images/5oofLcdDf2DXimRW6qu2UY/img_OgYGR0rY1VONHWM-.jpg">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.2 }}
          className="grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-background/70 backdrop-blur-xl">
          <Bolt className="h-9 w-9" />
        </motion.div>
      </AuthBackdrop>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-4 text-center">
        <h1 className="text-[1.7rem] font-black">به <span className="text-primary">کایار</span> خوش اومدی</h1>
        <p className="mt-2 text-sm text-muted-foreground">با شماره موبایلت وارد شو؛ اگه حساب نداری خودکار ساخته می‌شه.</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="mt-7 space-y-3" onSubmit={(e) => { e.preventDefault(); if (valid) submit(); }}>
        <label className="block text-xs font-bold text-muted-foreground">شماره موبایل</label>
        <div dir="ltr" className={`flex h-[60px] items-center rounded-2xl border bg-card/80 backdrop-blur transition focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] ${phone && !valid ? 'border-destructive/60' : 'border-white/10'}`}>
          <span className="flex h-full items-center gap-2 border-r border-white/10 px-4 text-sm font-black">+98</span>
          <input autoFocus inputMode="numeric" maxLength={11} value={toFa(phone)} onChange={(e) => setPhone(toEn(e.target.value).replace(/\D/g, ''))}
            placeholder="۹۱۲ ۳۴۵ ۶۷۸۹" aria-label="شماره موبایل" className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-bold tracking-widest outline-none placeholder:font-normal placeholder:text-muted-foreground/40" />
          <span className={`me-3 grid h-9 w-9 place-items-center rounded-xl transition ${valid ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground'}`}><Smartphone className="h-4 w-4" /></span>
        </div>
        {phone && !valid && <p className="text-xs text-destructive">شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)</p>}
        <Lime type="submit" disabled={!valid} loading={busy} className="mt-2">دریافت کد تأیید<ChevronLeft className="h-5 w-5" /></Lime>
        {OTP_MODE === 'demo' && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/[0.06] p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary" />نسخه آزمایشی: کد تأیید برای همه شماره‌ها <b className="text-primary">{toFa(DEMO_CODE)}</b> است.
          </div>
        )}
        <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-primary" />اطلاعاتت امن نگه داشته می‌شه</p>
      </motion.form>

      <div className="mt-auto pt-8">
        <div className="mb-4 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-white/10" />یا<span className="h-px flex-1 bg-white/10" /></div>
        <Link to="/app/coach/login" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-card/70 p-3.5 transition active:scale-[0.98]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary"><BadgeCheck className="h-5 w-5" /></span>
          <span className="flex-1"><span className="block text-sm font-black">مربی هستید؟</span><span className="block text-[11px] text-muted-foreground">ورود به پرتال مربیان و درخواست همکاری</span></span>
          <ChevronLeft className="h-5 w-5 text-muted-foreground transition group-hover:-translate-x-1 group-hover:text-primary" />
        </Link>
      </div>
    </Screen>
  );
}
