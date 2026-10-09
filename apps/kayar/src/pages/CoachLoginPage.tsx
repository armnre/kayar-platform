import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, CalendarClock, FileCheck2, LogIn, ShieldCheck, UserPlus, Users, Wallet } from 'lucide-react';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import Logo from '../components/Logo';

const steps = [
  { i: UserPlus, t: 'ساخت حساب', d: 'با ایمیل وارد شو' },
  { i: FileCheck2, t: 'تکمیل پرونده', d: 'تخصص، خدمات و مدارک' },
  { i: ShieldCheck, t: 'بررسی کارشناسی', d: 'معمولاً ۲ تا ۳ روز کاری' },
  { i: BadgeCheck, t: 'فعال‌سازی پنل', d: 'نمایش عمومی و دریافت رزرو' },
];
const perks = [
  { i: Users, t: 'دسترسی به ورزشکاران کایار' },
  { i: CalendarClock, t: 'مدیریت زمان‌بندی و رزرو' },
  { i: Wallet, t: 'تعریف خدمات و تعرفه' },
];

export default function CoachLoginPage() {
  const { user, isLoading } = useAuth();
  const [sp] = useSearchParams();
  const next = sp.get('next') || '/coach';
  if (!isLoading && user) return <Navigate to={next} replace />;
  return (
    <div dir="rtl" className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/teRZy9FtA6SAmLQ8Z5BY6e/img_y_vNAiVjDxgXvYxI.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute bottom-0 p-10">
          <p className="text-4xl font-black leading-tight">تخصصت را<br /><span className="text-accent">به کسب‌وکار</span> تبدیل کن</p>
          <div className="mt-6 flex flex-wrap gap-2">{perks.map((p) => <span key={p.t} className="flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1.5 text-xs"><p.i className="h-4 w-4 text-accent" />{p.t}</span>)}</div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 md:px-16">
        <div className="mb-10 flex items-center justify-between"><Logo /><span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">پرتال مربیان</span></div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <h1 className="text-3xl font-black md:text-4xl">ورود مربیان کایار</h1>
          <p className="mt-3 text-muted-foreground">این بخش مخصوص مربیان و متخصصان ورزشی است. اگر ورزشکار هستید، از <Link to="/app" className="text-primary underline-offset-4 hover:underline">اپ کایار</Link> وارد شوید.</p>
          <div className="mt-8 space-y-3">
            <Button disabled={isLoading} onClick={() => loginWithRedirect({ redirectUrl: next })} className="h-14 w-full rounded-2xl bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90"><LogIn className="ml-2 h-5 w-5" />ورود به پنل مربی</Button>
            <Button disabled={isLoading} variant="outline" onClick={() => loginWithRedirect({ redirectUrl: '/coach/apply' })} className="h-14 w-full rounded-2xl text-base"><UserPlus className="ml-2 h-5 w-5" />درخواست همکاری به‌عنوان مربی</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">ورود و ثبت‌نام با کد یک‌بارمصرف ایمیل انجام می‌شود.</p>
          <ol className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <li key={s.t} className="flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><s.i className="h-5 w-5" /></span>
                <div><div className="text-sm font-bold">{(i + 1).toLocaleString('fa-IR')}. {s.t}</div><div className="text-xs text-muted-foreground">{s.d}</div></div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}
