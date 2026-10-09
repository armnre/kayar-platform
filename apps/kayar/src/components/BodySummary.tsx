import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Lock, Ruler, Scale, Cake, Target, Activity, Dumbbell, BadgeCheck } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { Me, fa } from '../lib/data';
import { STATUS_INFO } from '../lib/coach';
import BodyProfileForm from './bodyyar/BodyProfileForm';
import { fmtJalali } from '../mobile/components/JalaliPicker';

export function BodySummary({ me }: { me: Me }) {
  const [open, setOpen] = useState(false);
  const p = me.profile;
  const bmi = p.heightCm && p.weightKg ? p.weightKg / (p.heightCm / 100) ** 2 : null;
  const rows = [
    { i: Cake, l: 'سن', v: p.age !== null ? `${fa(p.age)} سال` : null, s: p.birthDate ? fmtJalali(p.birthDate + 'T12:00:00') : undefined },
    { i: Ruler, l: 'قد', v: p.heightCm ? `${fa(p.heightCm)} سانتی‌متر` : null },
    { i: Scale, l: 'وزن', v: p.weightKg ? `${fa(p.weightKg)} کیلوگرم` : null, s: bmi ? `BMI ${bmi.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}` : undefined },
    { i: Target, l: 'هدف', v: p.goal || null }, { i: Activity, l: 'سطح فعالیت', v: p.activityLevel || null }, { i: Dumbbell, l: 'سطح تمرین', v: p.level || null },
  ];
  return (
    <section className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div><h2 className="text-lg font-extrabold">پروفایل بدنی</h2><p className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />فقط برای تو و بدن‌یار قابل مشاهده است</p></div>
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => setOpen(true)}><Pencil className="ml-1 h-3.5 w-3.5" />ویرایش</Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.l} className="rounded-2xl bg-secondary/60 p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><r.i className="h-3.5 w-3.5 text-primary" />{r.l}</div>
            <div className="mt-1 font-bold">{r.v ?? <span className="text-sm font-normal text-muted-foreground">ثبت نشده</span>}</div>
            {r.s && <div className="text-[11px] text-muted-foreground">{r.s}</div>}
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-h-[90dvh] max-w-lg overflow-y-auto rounded-3xl">
          <DialogHeader className="text-right"><DialogTitle>ویرایش پروفایل بدنی</DialogTitle></DialogHeader>
          <BodyProfileForm profile={p} />
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function CoachStatusCard({ me }: { me: Me }) {
  const c = me.coach;
  if (!c) return (
    <Link to="/coach/apply" className="glass flex items-center justify-between gap-3 rounded-2xl p-4"><span className="text-sm">مربی هستی؟ درخواست همکاری با کایار را ثبت کن</span><span className="text-sm font-bold text-primary">درخواست</span></Link>
  );
  const s = STATUS_INFO[c.status] ?? STATUS_INFO['در انتظار تایید'];
  return (
    <Link to="/coach" className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
      <span className="flex items-center gap-2 text-sm"><BadgeCheck className="h-5 w-5 text-primary" />حساب مربیگری</span>
      <span className="flex items-center gap-2"><Badge className={`rounded-full border-0 ${s.tone}`}>{s.label}</Badge><span className="text-sm font-bold text-primary">پنل مربی</span></span>
    </Link>
  );
}
