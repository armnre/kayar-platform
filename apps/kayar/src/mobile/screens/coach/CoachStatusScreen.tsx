import { Link } from 'react-router-dom';
import { BadgeCheck, Clock3 } from 'lucide-react';
import { STATUS_FA, useCoachStatus } from './CoachShell';

/** Shown while a coach is pending / rejected / suspended. Approval moves them to the dashboard automatically. */
export default function CoachStatusScreen() {
  const { app, status } = useCoachStatus();
  const info = STATUS_FA[status];
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-accent/10 text-accent">
        {status === 'pending' ? <Clock3 className="h-9 w-9" /> : <BadgeCheck className="h-9 w-9" />}
      </span>
      <span className={`mt-5 rounded-full px-3 py-1 text-xs font-bold ${info.tone}`}>{info.label}</span>
      <p className="mt-3 max-w-xs text-sm leading-7 text-muted-foreground">{info.text}</p>
      {app?.adminNote && <p className="mt-4 w-full rounded-2xl bg-white/[0.04] p-3 text-right text-sm"><b>توضیح ادمین:</b> {app.adminNote}</p>}
      {status === 'rejected' && <Link to="/app/coach/apply" className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-black text-accent-foreground">ویرایش و ارسال مجدد</Link>}
      {status === 'pending' && <Link to="/app/coach/apply" className="mt-6 text-sm text-accent">مشاهده پرونده ارسالی</Link>}
    </div>
  );
}
