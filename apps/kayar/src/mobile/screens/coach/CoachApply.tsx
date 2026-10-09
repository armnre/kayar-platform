import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { Lime } from '../../kit';
import { saveCoachApp } from '../../store';
import { STATUS_FA, useCoachStatus } from './CoachShell';

const CATS = ['فیتنس و بدنسازی', 'یوگا و پیلاتس', 'دویدن و کاردیو', 'تغذیه', 'ورزش‌های رزمی', 'حرکات اصلاحی'];
const schema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید'),
  category: z.string().min(1, 'حوزه تخصص را انتخاب کنید'),
  city: z.string().trim().min(2, 'شهر را وارد کنید'),
  bio: z.string().trim().min(20, 'حداقل ۲۰ کاراکتر درباره سوابق خود بنویسید'),
});
type Form = z.infer<typeof schema>;

export default function CoachApply() {
  const nav = useNavigate();
  const { s, app, status } = useCoachStatus();
  const [f, setF] = useState<Form>({ name: app?.name ?? '', category: app?.category ?? '', city: app?.city ?? '', bio: app?.bio ?? '' });
  const [touched, setTouched] = useState(false);
  const r = schema.safeParse(f);
  const errs = r.success ? {} : r.error.flatten().fieldErrors;
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    setTouched(true);
    if (!r.success || !s.phone) return;
    saveCoachApp({ phone: s.phone, ...r.data, status: 'pending' });
    toast.success('پرونده شما برای بررسی ارسال شد.');
    nav('/app/coach/status', { replace: true });
  };
  const err = (k: keyof Form) => touched && errs[k]?.[0] && <p className="mt-1 text-xs text-destructive">{errs[k]![0]}</p>;
  const input = 'h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 outline-none focus:border-accent';

  return (
    <div className="space-y-4 px-5 py-5">
      <div>
        <h1 className="text-xl font-black">{status === 'none' ? 'درخواست همکاری' : 'ویرایش پرونده'}</h1>
        {status !== 'none' && <p className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${STATUS_FA[status].tone}`}>{STATUS_FA[status].label}</p>}
        {app?.adminNote && <p className="mt-3 rounded-2xl bg-white/[0.04] p-3 text-sm"><b>توضیح ادمین:</b> {app.adminNote}</p>}
      </div>
      <label className="block text-sm">نام و نام خانوادگی<input className={`${input} mt-1`} value={f.name} onChange={set('name')} />{err('name')}</label>
      <div className="text-sm">حوزه تخصص
        <div className="mt-2 flex flex-wrap gap-2">{CATS.map((c) => (
          <button type="button" key={c} onClick={() => setF({ ...f, category: c })} className={`rounded-full border px-3 py-1.5 text-xs ${f.category === c ? 'border-accent bg-accent/15 text-accent' : 'border-white/10'}`}>{c}</button>
        ))}</div>{err('category')}
      </div>
      <label className="block text-sm">شهر<input className={`${input} mt-1`} value={f.city} onChange={set('city')} />{err('city')}</label>
      <label className="block text-sm">سوابق و معرفی<textarea rows={4} className={`${input} mt-1 h-auto py-3`} value={f.bio} onChange={set('bio')} />{err('bio')}</label>
      <Lime onClick={submit} disabled={touched && !r.success} className="bg-accent text-accent-foreground">ارسال برای بررسی</Lime>
    </div>
  );
}
