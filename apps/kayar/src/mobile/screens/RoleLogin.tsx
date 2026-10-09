import { ReactNode, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, KeyRound, Smartphone, ChevronLeft, Users, CalendarCheck, Wallet } from 'lucide-react';
import { Screen, Lime } from '../kit';
import { otp, isValidIrMobile, normalizePhone, OTP_MODE, DEMO_CODE, OTP_LENGTH } from '../otp';
import { Role, startSession, toEn, toFa, useCoachApps } from '../store';
import { homeFor, safeNext } from '../auth';
import AuthBackdrop, { StepDots } from '../components/AuthBackdrop';

const PERKS = [[Users, 'شاگرد واقعی'], [CalendarCheck, 'مدیریت جلسات'], [Wallet, 'درآمد آنلاین']] as const;

/**
 * Dedicated test-mode sign-in for coaches and admins (phone + one-time code on one screen).
 * Never sends people to the public email / Google sign-in page.
 */
export default function RoleLogin({ role, title, badge, intro, allowPhone, footer }: {
  role: Exclude<Role, 'user'>; title: string; badge: string; intro: ReactNode;
  allowPhone?: (p: string) => boolean; footer?: ReactNode;
}) {
  const nav = useNavigate();
  const apps = useCoachApps();
  const [sp] = useSearchParams();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const p = normalizePhone(toEn(phone));
  const valid = isValidIrMobile(p);

  const send = async () => {
    if (allowPhone && !allowPhone(p)) { toast.error('این شماره دسترسی به این بخش ندارد.'); return; }
    setBusy(true);
    try { await otp.send(p); setSent(true); } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };
  const verify = async () => {
    setBusy(true);
    try {
      if (!(await otp.verify(p, code))) { toast.error('کد وارد شده صحیح نیست.'); setCode(''); return; }
      startSession(role, p, true);
      nav(safeNext(sp.get('next'), role) ?? homeFor({ role, phone: p, verified: true }, apps), { replace: true });
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Screen className="pb-5">
      <AuthBackdrop back="/app/login" img="https://images.fillout.com/886978/vxifokrwnr/generated-images/kmAsFTuYTSezzezPvRzXC9/img_miXn1GtlWJAIGuSj.jpg">
        <span className="rounded-full border border-primary/40 bg-background/70 px-3 py-1 text-xs font-bold text-primary backdrop-blur">{badge}</span>
      </AuthBackdrop>

      <div className="mt-3 text-center">
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[1.45rem] font-black leading-9 sm:text-[1.6rem]">{title}</motion.h1>
        <div className="mx-auto mt-1.5 max-w-xs text-[13px] leading-6 text-muted-foreground">{intro}</div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 [@media(max-height:640px)]:hidden">
        {PERKS.map(([I, l]) => (
          <div key={l} className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.07] bg-card/70 py-2.5 text-[11px] font-bold"><I className="h-4 w-4 text-primary" />{l}</div>
        ))}
      </div>

      <form className="mt-5 space-y-3 [@media(max-height:640px)]:mt-4" onSubmit={(e) => { e.preventDefault(); if (!sent) { if (valid) send(); } else if (code.length === OTP_LENGTH) verify(); }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">{sent ? 'کد تأیید را وارد کنید' : 'شماره موبایل'}</span>
          <StepDots step={sent ? 1 : 0} total={2} />
        </div>
        <div dir="ltr" className="flex h-[60px] items-center rounded-2xl border border-white/10 bg-card/80 transition focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]">
          <span className="flex h-full items-center border-r border-white/10 px-4 text-sm font-black">+98</span>
          <input autoFocus inputMode="numeric" maxLength={11} disabled={sent} value={toFa(phone)} onChange={(e) => setPhone(toEn(e.target.value).replace(/\D/g, ''))}
            placeholder="۹۱۲ ۳۴۵ ۶۷۸۹" aria-label="شماره موبایل" className="h-full min-w-0 flex-1 bg-transparent px-4 text-lg font-bold tracking-widest outline-none disabled:opacity-60 placeholder:font-normal placeholder:text-muted-foreground/40" />
          <Smartphone className="me-4 h-5 w-5 text-muted-foreground" />
        </div>
        {phone && !valid && <p className="text-xs text-destructive">شماره موبایل معتبر نیست.</p>}
        <AnimatePresence>
          {sent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
              <div dir="ltr" className="flex h-[60px] items-center rounded-2xl border border-primary/50 bg-primary/[0.04] shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]">
                <KeyRound className="ms-4 h-5 w-5 text-primary" />
                <input autoFocus inputMode="numeric" maxLength={OTP_LENGTH} value={toFa(code)} onChange={(e) => setCode(toEn(e.target.value).replace(/\D/g, ''))}
                  placeholder="––––––" aria-label="کد تأیید" className="h-full min-w-0 flex-1 bg-transparent px-4 text-center text-2xl font-black tracking-[0.5em] outline-none placeholder:text-muted-foreground/30" />
              </div>
              <button type="button" onClick={() => { setSent(false); setCode(''); }} className="text-xs font-bold text-primary">ویرایش شماره</button>
            </motion.div>
          )}
        </AnimatePresence>
        <Lime type="submit" loading={busy} disabled={sent ? code.length !== OTP_LENGTH : !valid}>
          {sent ? 'ورود به پرتال' : 'دریافت کد'}<ChevronLeft className="h-5 w-5" />
        </Lime>
        {OTP_MODE === 'demo' && (
          <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/[0.06] p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-primary" />ورود آزمایشی: کد تأیید <b className="text-primary">{toFa(DEMO_CODE)}</b>
          </div>
        )}
      </form>
      <div className="mt-auto space-y-2 pt-5 text-center text-xs text-muted-foreground">
        {footer}
        <div>ورزشکار هستید؟ <Link to="/app/login" className="font-bold text-primary">ورود کاربران</Link></div>
      </div>
    </Screen>
  );
}
