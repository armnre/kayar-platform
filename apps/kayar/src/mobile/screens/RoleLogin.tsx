import { ReactNode, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Info, KeyRound, Smartphone } from 'lucide-react';
import { Screen, Lime } from '../kit';
import { otp, isValidIrMobile, normalizePhone, OTP_MODE, DEMO_CODE, OTP_LENGTH } from '../otp';
import { Role, startSession, toEn, toFa, useCoachApps } from '../store';
import { homeFor, safeNext } from '../auth';

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
    <Screen back="/app/login" className="justify-between">
      <div className="pt-4 text-center">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">{badge}</span>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-2xl font-black">{title}</motion.h1>
        <div className="mt-2 text-sm leading-7 text-muted-foreground">{intro}</div>
      </div>
      <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); if (!sent) { if (valid) send(); } else if (code.length === OTP_LENGTH) verify(); }}>
        <div dir="ltr" className="flex h-14 items-center rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-accent">
          <span className="flex h-full items-center border-r border-white/10 px-4 text-sm font-bold">+98</span>
          <input autoFocus inputMode="numeric" maxLength={11} disabled={sent} value={toFa(phone)} onChange={(e) => setPhone(toEn(e.target.value).replace(/\D/g, ''))}
            placeholder="۹۱۲ ۳۴۵ ۶۷۸۹" aria-label="شماره موبایل" className="h-full flex-1 bg-transparent px-4 text-lg tracking-widest outline-none disabled:opacity-60" />
          <Smartphone className="me-4 h-5 w-5 text-muted-foreground" />
        </div>
        {phone && !valid && <p className="text-xs text-destructive">شماره موبایل معتبر نیست.</p>}
        {sent && (
          <>
            <div dir="ltr" className="flex h-14 items-center rounded-2xl border border-accent/50 bg-white/[0.03]">
              <KeyRound className="ms-4 h-5 w-5 text-accent" />
              <input autoFocus inputMode="numeric" maxLength={OTP_LENGTH} value={toFa(code)} onChange={(e) => setCode(toEn(e.target.value).replace(/\D/g, ''))}
                placeholder="کد ۶ رقمی" aria-label="کد تأیید" className="h-full flex-1 bg-transparent px-4 text-center text-xl tracking-[0.5em] outline-none" />
            </div>
            <button type="button" onClick={() => { setSent(false); setCode(''); }} className="text-xs text-accent">ویرایش شماره</button>
          </>
        )}
        <Lime type="submit" loading={busy} disabled={sent ? code.length !== OTP_LENGTH : !valid} className="bg-accent text-accent-foreground">
          {sent ? 'ورود' : 'دریافت کد'}
        </Lime>
        {OTP_MODE === 'demo' && (
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-accent" />ورود تستی: کد تأیید <b className="text-primary">{toFa(DEMO_CODE)}</b>
          </div>
        )}
      </form>
      <div className="mt-8 space-y-2 text-center text-xs text-muted-foreground">
        {footer}
        <div>ورزشکار هستید؟ <Link to="/app/login" className="font-bold text-primary">ورود کاربران</Link></div>
      </div>
    </Screen>
  );
}
