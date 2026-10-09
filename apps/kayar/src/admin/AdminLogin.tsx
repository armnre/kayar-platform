import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';
import { adminLogin } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { setAdminSession, useAdminSession } from './session';

/** Dedicated admin sign-in (username + password), separate from athlete and coach logins. */
export default function AdminLogin() {
  const session = useAdminSession();
  const nav = useNavigate();
  const loc = useLocation();
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const next = new URLSearchParams(loc.search).get('next');
  const target = next && next.startsWith('/admin/') && !next.startsWith('/admin/login') ? next : '/admin/dashboard';
  if (session) return <Navigate to={target} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!u.trim() || !p) { setErr('نام کاربری و رمز عبور را وارد کنید.'); return; }
    setBusy(true); setErr('');
    try {
      setAdminSession(await adminLogin({ username: u, password: p }));
      toast.success('خوش آمدید');
      nav(target, { replace: true });
    } catch (e) {
      setErr((e as { userFacingMessage?: string }).userFacingMessage ?? 'نام کاربری یا رمز عبور اشتباه است.');
    } finally { setBusy(false); }
  };

  return (
    <div dir="rtl" className="grid min-h-screen place-items-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl border border-border bg-card p-7 shadow-2xl">
        <div className="space-y-2 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15"><ShieldCheck className="h-7 w-7 text-primary" /></div>
          <h1 className="text-xl font-black">ورود به پنل مدیریت کایار</h1>
          <p className="text-xs text-muted-foreground">فقط برای تیم داخلی کایار</p>
        </div>
        <div className="space-y-2"><Label htmlFor="u">نام کاربری</Label><Input id="u" dir="ltr" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="p">رمز عبور</Label><Input id="p" dir="ltr" type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} /></div>
        {err && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ورود</Button>
        <p className="rounded-xl border border-dashed border-border p-3 text-center text-[11px] leading-6 text-muted-foreground">
          حالت آزمایشی — حساب تست: <b dir="ltr">admin</b> / <b dir="ltr">kayar-test-1234</b>
        </p>
      </form>
    </div>
  );
}
