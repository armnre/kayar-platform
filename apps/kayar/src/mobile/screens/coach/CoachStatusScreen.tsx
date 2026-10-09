import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Clock3, FileCheck2, ShieldCheck, Rocket, XCircle, MessageSquareWarning, Pencil, Headset } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { STATUS_FA, useCoachStatus } from './CoachShell';

const TIMELINE = [
  { I: FileCheck2, t: 'ارسال پرونده', d: 'اطلاعات شما ثبت شد' },
  { I: ShieldCheck, t: 'بررسی کارشناسی', d: 'معمولاً ۲ تا ۳ روز کاری' },
  { I: Rocket, t: 'فعال‌سازی پنل', d: 'شروع دریافت شاگرد' },
];

/** Shown while a coach is pending / rejected / suspended. Approval moves them to the dashboard automatically. */
export default function CoachStatusScreen() {
  const { app, status } = useCoachStatus();
  const info = STATUS_FA[status];
  const pending = status === 'pending';
  const bad = status === 'rejected' || status === 'suspended';
  const Icon = pending ? Clock3 : bad ? XCircle : BadgeCheck;
  const active = pending ? 1 : 0;

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-8">
      <div className="relative mx-auto grid h-40 w-40 place-items-center">
        {pending && [0, 1].map((i) => (
          <motion.span key={i} className="absolute inset-4 rounded-full border border-primary/40" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 2.4, delay: i * 1.2, repeat: Infinity }} />
        ))}
        <div className={cn('absolute inset-6 rounded-full blur-2xl', bad ? 'bg-destructive/25' : 'bg-primary/25')} />
        <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}
          className={cn('relative grid h-24 w-24 place-items-center rounded-[1.75rem] border', bad ? 'border-destructive/40 bg-destructive/10 text-destructive' : 'border-primary/40 bg-card text-primary shadow-[0_0_40px_-8px_hsl(var(--primary))]')}>
          <motion.span animate={pending ? { rotate: 360 } : {}} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><Icon className="h-11 w-11" /></motion.span>
        </motion.span>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${info.tone}`}>{info.label}</span>
        <h1 className="mt-3 text-2xl font-black">{pending ? 'پرونده‌ات در دست بررسی است' : bad ? 'وضعیت پرونده' : info.label}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-muted-foreground">{info.text}</p>
      </motion.div>

      {app && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-card/80 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-lg font-black text-primary">{app.name[0]}</span>
          <div className="min-w-0 flex-1"><div className="truncate font-black">{app.name}</div><div className="truncate text-xs text-muted-foreground">{app.category} · {app.city}</div></div>
          <Link to="/app/coach/apply" aria-label="ویرایش پرونده" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-muted-foreground transition active:scale-90"><Pencil className="h-4 w-4" /></Link>
        </div>
      )}

      {app?.adminNote && <div className="mt-3 flex gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm"><MessageSquareWarning className="h-4 w-4 shrink-0 text-yellow-400" /><span><b>توضیح ادمین:</b> {app.adminNote}</span></div>}

      {!bad && (
        <ol className="mt-6 space-y-0 rounded-3xl border border-white/[0.07] bg-card/60 p-5">
          {TIMELINE.map(({ I, t, d }, i) => {
            const done = i < active, cur = i === active;
            return (
              <motion.li key={t} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.1 }} className="relative flex gap-4 pb-6 last:pb-0">
                {i < TIMELINE.length - 1 && <span className={cn('absolute start-5 top-11 h-[calc(100%-2.75rem)] w-0.5 -translate-x-1/2', done ? 'bg-primary' : 'bg-white/10')} />}
                <span className={cn('relative grid h-10 w-10 shrink-0 place-items-center rounded-xl', done ? 'bg-primary text-primary-foreground' : cur ? 'border border-primary bg-primary/10 text-primary' : 'bg-white/5 text-muted-foreground')}>
                  <I className="h-5 w-5" />
                  {cur && <span className="absolute -end-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-primary" />}
                </span>
                <div className="pt-1"><div className={cn('text-sm font-black', !done && !cur && 'text-muted-foreground')}>{t}</div><div className="text-xs text-muted-foreground">{d}</div></div>
              </motion.li>
            );
          })}
        </ol>
      )}

      <div className="mt-auto space-y-3 pt-8">
        {status === 'rejected' && <Link to="/app/coach/apply" className="flex h-14 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)]">ویرایش و ارسال مجدد</Link>}
        <a href="mailto:support@kayar.app" className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 text-sm font-bold text-muted-foreground"><Headset className="h-4 w-4" />تماس با پشتیبانی</a>
      </div>
    </div>
  );
}
