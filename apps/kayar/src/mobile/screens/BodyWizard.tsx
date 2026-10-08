import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen, Lime, Field, Chip, inputCls } from '../kit';
import { setSession, useSession, toEn, toFa } from '../store';

const LEVELS = ['مبتدی', 'متوسط', 'پیشرفته'];
const GOALS = ['کاهش وزن', 'افزایش عضله', 'استقامت', 'تناسب عمومی'];
const PLACES = ['خانه', 'باشگاه', 'فضای باز'];
const DAYS = ['۲', '۳', '۴', '۵', '۶'];

export default function BodyWizard() {
  const s = useSession();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ height: '', weight: '', age: '', gender: s.gender ?? '', level: '', goal: s.goals?.[0] ?? '', place: '', days: '', notes: '' });
  if (!s.bodyyarActive) return <Navigate to="/app/bodyyar" replace />;
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));
  const num = (k: 'height' | 'weight' | 'age') => Number(toEn(f[k]));
  const ok = [
    num('height') >= 120 && num('height') <= 230 && num('weight') >= 30 && num('weight') <= 250,
    num('age') >= 10 && num('age') <= 90 && !!f.gender,
    !!f.level, !!f.goal, !!f.place && !!f.days, true,
  ][step];
  const next = () => {
    if (step < 5) return setStep(step + 1);
    setSession({ body: { height: num('height'), weight: num('weight'), age: num('age'), gender: f.gender as 'male' | 'female', level: f.level, goal: f.goal } });
    nav('/app/bodyyar/analysis', { replace: true });
  };
  const nf = (k: 'height' | 'weight' | 'age', ph: string) => (
    <input inputMode="numeric" value={toFa(f[k])} onChange={(e) => set(k, toEn(e.target.value).replace(/\D/g, '').slice(0, 3))} placeholder={ph} className={`${inputCls} text-center text-xl font-black`} />
  );
  const chips = (k: 'level' | 'goal' | 'place' | 'days', arr: string[]) => (
    <div className="grid grid-cols-2 gap-3">{arr.map((o) => <Chip key={o} active={f[k] === o} onClick={() => set(k, o)}>{o}</Chip>)}</div>
  );
  const bodies = [
    <div className="space-y-5"><Field label="قد (سانتی‌متر)">{nf('height', '۱۷۵')}</Field><Field label="وزن (کیلوگرم)">{nf('weight', '۷۰')}</Field></div>,
    <div className="space-y-5"><Field label="سن">{nf('age', '۲۵')}</Field><Field label="جنسیت"><div className="grid grid-cols-2 gap-3"><Chip active={f.gender === 'male'} onClick={() => set('gender', 'male')}>مرد</Chip><Chip active={f.gender === 'female'} onClick={() => set('gender', 'female')}>زن</Chip></div></Field></div>,
    <Field label="سطح آمادگی جسمانی">{chips('level', LEVELS)}</Field>,
    <Field label="هدف اصلی">{chips('goal', GOALS)}</Field>,
    <div className="space-y-5"><Field label="محل تمرین">{chips('place', PLACES)}</Field><Field label="روز تمرین در هفته">{chips('days', DAYS)}</Field></div>,
    <Field label="آسیب‌دیدگی یا نکته سلامتی (اختیاری)"><textarea value={f.notes} onChange={(e) => set('notes', e.target.value)} rows={5} placeholder="مثلاً درد زانو…" className={`${inputCls} h-auto py-3`} /></Field>,
  ];
  return (
    <Screen title={`پروفایل بدنی - مرحله ${toFa(step + 1)} از ۶`} back="/app/bodyyar">
      <div className="mb-8 flex gap-1.5">{bodies.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-white/10'}`} />)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="rounded-3xl border border-white/[0.07] bg-card/60 p-5">{bodies[step]}</motion.div>
      </AnimatePresence>
      <div className="mt-auto flex gap-3 pt-8">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="h-14 rounded-2xl border border-white/10 px-6 text-sm font-bold">قبلی</button>}
        <Lime onClick={next} disabled={!ok}>{step < 5 ? 'بعدی' : 'تحلیل بدن من'}</Lime>
      </div>
    </Screen>
  );
}
