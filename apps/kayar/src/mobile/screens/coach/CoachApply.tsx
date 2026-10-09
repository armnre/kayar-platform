import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Dumbbell, Flower2, Footprints, Salad, Swords, Activity, MapPin, User, FileText, ChevronLeft, ChevronRight, MessageSquareWarning } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { Lime } from '../../kit';
import { saveCoachApp } from '../../store';
import { StepDots } from '../../components/AuthBackdrop';
import { STATUS_FA, useCoachStatus } from './CoachShell';

const CATS = [
  { l: 'فیتنس و بدنسازی', I: Dumbbell }, { l: 'یوگا و پیلاتس', I: Flower2 }, { l: 'دویدن و کاردیو', I: Footprints },
  { l: 'تغذیه', I: Salad }, { l: 'ورزش‌های رزمی', I: Swords }, { l: 'حرکات اصلاحی', I: Activity },
];
const schema = z.object({
  name: z.string().trim().min(3, 'نام و نام خانوادگی را کامل وارد کنید'),
  city: z.string().trim().min(2, 'شهر را وارد کنید'),
  category: z.string().min(1, 'حوزه تخصص را انتخاب کنید'),
  bio: z.string().trim().min(20, 'حداقل ۲۰ کاراکتر درباره سوابق خود بنویسید'),
});
type Form = z.infer<typeof schema>;
const STEPS: { title: string; sub: string; keys: (keyof Form)[] }[] = [
  { title: 'معرفی شما', sub: 'نامی که شاگردان می‌بینند', keys: ['name', 'city'] },
  { title: 'حوزه تخصص', sub: 'در کدام زمینه مربیگری می‌کنید؟', keys: ['category'] },
  { title: 'سوابق و رزومه', sub: 'تجربه، مدارک و افتخارات', keys: ['bio'] },
];

export default function CoachApply() {
  const nav = useNavigate();
  const { s, app, status } = useCoachStatus();
  const [f, setF] = useState<Form>({ name: app?.name ?? '', category: app?.category ?? '', city: app?.city ?? '', bio: app?.bio ?? '' });
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const r = schema.safeParse(f);
  const errs = r.success ? {} : r.error.flatten().fieldErrors;
  const stepOk = STEPS[step].keys.every((k) => !errs[k]);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const err = (k: keyof Form) => touched && errs[k]?.[0] && <p className="mt-1.5 text-xs text-destructive">{errs[k]![0]}</p>;

  const next = () => {
    setTouched(true);
    if (!stepOk) return;
    setTouched(false);
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    if (!r.success || !s.phone) return;
    saveCoachApp({ phone: s.phone, ...r.data, status: 'pending' });
    toast.success('پرونده شما برای بررسی ارسال شد.');
    nav('/app/coach/status', { replace: true });
  };
  const field = 'h-14 w-full rounded-2xl border border-white/10 bg-card/80 ps-12 pe-4 text-base outline-none transition placeholder:text-muted-foreground/50 focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]';

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-5">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-primary/15 via-card to-card p-5">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold text-primary">مرحله {(step + 1).toLocaleString('fa-IR')} از {STEPS.length.toLocaleString('fa-IR')}</span>
          <StepDots step={step} total={STEPS.length} />
        </div>
        <h1 className="relative mt-3 text-2xl font-black">{status === 'none' ? 'درخواست همکاری' : 'ویرایش پرونده'}</h1>
        <p className="relative mt-1 text-sm text-muted-foreground">به جمع مربیان تأییدشده کایار بپیوندید.</p>
        {status !== 'none' && <span className={`relative mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${STATUS_FA[status].tone}`}>{STATUS_FA[status].label}</span>}
      </div>
      {app?.adminNote && (
        <div className="mt-3 flex gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm"><MessageSquareWarning className="h-4 w-4 shrink-0 text-yellow-400" /><span><b>توضیح ادمین:</b> {app.adminNote}</span></div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.25 }} className="mt-6 flex-1">
          <h2 className="text-lg font-black">{STEPS[step].title}</h2>
          <p className="mb-4 text-xs text-muted-foreground">{STEPS[step].sub}</p>
          {step === 0 && (
            <div className="space-y-4">
              <label className="block"><span className="mb-2 block text-xs font-bold text-muted-foreground">نام و نام خانوادگی</span>
                <div className="relative"><User className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input className={field} value={f.name} onChange={set('name')} placeholder="مثلاً سارا محمدی" /></div>{err('name')}</label>
              <label className="block"><span className="mb-2 block text-xs font-bold text-muted-foreground">شهر محل فعالیت</span>
                <div className="relative"><MapPin className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input className={field} value={f.city} onChange={set('city')} placeholder="مثلاً تهران" /></div>{err('city')}</label>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {CATS.map(({ l, I }) => {
                  const on = f.category === l;
                  return (
                    <motion.button whileTap={{ scale: 0.96 }} type="button" key={l} onClick={() => setF({ ...f, category: l })}
                      className={cn('relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-right transition', on ? 'border-primary bg-primary/10 shadow-[0_0_24px_-8px_hsl(var(--primary))]' : 'border-white/10 bg-card/70')}>
                      <span className={cn('grid h-10 w-10 place-items-center rounded-xl', on ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground')}><I className="h-5 w-5" /></span>
                      <span className={cn('text-sm font-bold', on && 'text-primary')}>{l}</span>
                    </motion.button>
                  );
                })}
              </div>
              {err('category')}
            </>
          )}
          {step === 2 && (
            <label className="block">
              <div className="relative">
                <FileText className="absolute start-4 top-4 h-5 w-5 text-muted-foreground" />
                <textarea rows={7} className={cn(field, 'h-auto resize-none py-4 leading-7')} value={f.bio} onChange={set('bio')} placeholder="سال‌های تجربه، مدارک مربیگری، تیم‌ها یا شاگردانی که با آن‌ها کار کرده‌اید…" />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground"><span>{err('bio') || 'حداقل ۲۰ کاراکتر'}</span><span className={f.bio.trim().length >= 20 ? 'text-primary' : ''}>{f.bio.trim().length.toLocaleString('fa-IR')}</span></div>
            </label>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} aria-label="مرحله قبل" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-card/70 transition active:scale-95"><ChevronRight className="h-5 w-5" /></button>}
        <Lime onClick={next} disabled={touched && !stepOk}>{step < STEPS.length - 1 ? <>ادامه<ChevronLeft className="h-5 w-5" /></> : 'ارسال برای بررسی'}</Lime>
      </div>
    </div>
  );
}
