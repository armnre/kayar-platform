import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import { saveProfile } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Label } from '@project/components/ui/label';
import { Textarea } from '@project/components/ui/textarea';
import { Progress } from '@project/components/ui/progress';
import { cn } from '@project/components/lib/utils';
import { Me, errMsg, useRefresh, fa } from '../../lib/data';
import JalaliPicker from '../../mobile/components/JalaliPicker';

const toYmd = (iso: string) => new Date(iso).toLocaleDateString('en-CA');
export function ageFromYmd(ymd?: string | null) {
  if (!ymd) return null;
  const [y, m, d] = ymd.split('-').map(Number); const n = new Date();
  let a = n.getFullYear() - y; if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) a--;
  return a;
}

const schema = z.object({
  displayName: z.string().min(1, 'نام الزامی است'),
  heightCm: z.number({ invalid_type_error: 'قد را وارد کنید' }).min(100, 'قد بین ۱۰۰ تا ۲۵۰').max(250, 'قد بین ۱۰۰ تا ۲۵۰'),
  weightKg: z.number({ invalid_type_error: 'وزن را وارد کنید' }).min(30, 'وزن بین ۳۰ تا ۳۰۰').max(300, 'وزن بین ۳۰ تا ۳۰۰'),
  birthDate: z.string({ invalid_type_error: 'تاریخ تولد را انتخاب کنید' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'تاریخ تولد را انتخاب کنید')
    .refine((v) => { const a = ageFromYmd(v); return a !== null && a >= 12 && a <= 100; }, 'سن باید بین ۱۲ تا ۱۰۰ سال باشد'),
  activityLevel: z.string().min(1, 'انتخاب کنید'),
  gender: z.string().min(1, 'انتخاب کنید'),
  goal: z.string().min(1, 'انتخاب کنید'),
  level: z.string().min(1, 'انتخاب کنید'),
  equipment: z.string().min(1, 'انتخاب کنید'),
});

const Chips = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="grid grid-cols-2 gap-2">
    {options.map((o) => (
      <button type="button" key={o} onClick={() => onChange(o)} className={cn('rounded-xl border px-3 py-2.5 text-sm transition', value === o ? 'border-primary bg-primary/10 font-bold text-primary' : 'border-white/10 text-muted-foreground')}>{o}</button>
    ))}
  </div>
);

export default function BodyProfileForm({ profile, wizard }: { profile: Me['profile']; wizard?: boolean }) {
  const refresh = useRefresh();
  const [f, setF] = useState({ ...profile, heightCm: profile.heightCm ?? NaN, weightKg: profile.weightKg ?? NaN, birthDate: profile.birthDate ?? '' });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: unknown) => setF((p) => ({ ...p, [k]: v }));
  const parsed = schema.safeParse(f);
  const errors = parsed.success ? {} : Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]));
  const err = (k: string) => (errors as Record<string, string>)[k];
  const num = (k: string) => <Input type="number" inputMode="decimal" value={Number.isNaN(f[k as 'heightCm']) ? '' : f[k as 'heightCm']} onChange={(e) => set(k, e.target.value === '' ? NaN : Number(e.target.value))} className="h-12 rounded-xl" />;

  const sections = [
    <div key="0" className="space-y-4">
      <Field label="نام نمایشی" error={err('displayName')}><Input value={f.displayName} onChange={(e) => set('displayName', e.target.value)} className="h-12 rounded-xl" /></Field>
      <Field label="تاریخ تولد" error={f.birthDate ? err('birthDate') : undefined}>
        <JalaliPicker value={f.birthDate ? f.birthDate + 'T12:00:00' : undefined} onChange={(iso) => set('birthDate', toYmd(iso))} />
        {ageFromYmd(f.birthDate) !== null && <p className="text-xs text-primary">سن شما: {fa(ageFromYmd(f.birthDate)!)} سال (خودکار)</p>}
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="قد (سانتی‌متر)" error={err('heightCm')}>{num('heightCm')}</Field>
        <Field label="وزن (کیلوگرم)" error={err('weightKg')}>{num('weightKg')}</Field>
      </div>
      <Field label="جنسیت" error={err('gender')}><Chips options={['مرد', 'زن']} value={f.gender} onChange={(v) => set('gender', v)} /></Field>
    </div>,
    <div key="1" className="space-y-4">
      <Field label="هدف اصلی" error={err('goal')}><Chips options={['کاهش وزن', 'افزایش حجم', 'آمادگی جسمانی', 'سلامت و انرژی']} value={f.goal} onChange={(v) => set('goal', v)} /></Field>
      <Field label="سطح تمرین" error={err('level')}><Chips options={['مبتدی', 'متوسط', 'پیشرفته']} value={f.level} onChange={(v) => set('level', v)} /></Field>
      <Field label="سطح فعالیت روزانه" error={err('activityLevel')}><Chips options={['کم‌تحرک', 'سبک', 'متوسط', 'فعال', 'خیلی فعال']} value={f.activityLevel} onChange={(v) => set('activityLevel', v)} /></Field>
    </div>,
    <div key="2" className="space-y-4">
      <Field label="امکانات تمرین" error={err('equipment')}><Chips options={['بدون تجهیزات', 'تجهیزات خانگی', 'باشگاه کامل']} value={f.equipment} onChange={(v) => set('equipment', v)} /></Field>
      <Field label="ملاحظات سلامتی (آسیب، بیماری، …)"><Textarea value={f.healthNotes} maxLength={1000} onChange={(e) => set('healthNotes', e.target.value)} /></Field>
    </div>,
  ];

  const save = async () => {
    if (!parsed.success) return toast.error('لطفاً همه فیلدها را درست پر کنید');
    setBusy(true);
    try { await saveProfile({ ...parsed.data, phone: profile.phone || undefined, healthNotes: f.healthNotes }); toast.success('پروفایل ذخیره شد'); refresh(); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const last = !wizard || step === 2;
  return (
    <div className="glass rounded-3xl p-5">
      {wizard && <div className="mb-5"><div className="mb-2 text-sm text-muted-foreground">مرحله {(step + 1).toLocaleString('fa-IR')} از ۳</div><Progress value={((step + 1) / 3) * 100} className="h-1.5" /></div>}
      {wizard ? sections[step] : <div className="space-y-6">{sections}</div>}
      <div className="mt-6 flex gap-2">
        {wizard && step > 0 && <Button variant="outline" className="h-12 rounded-xl" onClick={() => setStep(step - 1)}>قبلی</Button>}
        {last ? <Button disabled={busy || !parsed.success} onClick={save} className="h-12 flex-1 rounded-xl font-bold">{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ذخیره پروفایل</Button>
          : <Button onClick={() => setStep(step + 1)} className="h-12 flex-1 rounded-xl font-bold">بعدی</Button>}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-xs text-muted-foreground">{label}</Label>{children}{error && <p className="text-xs text-destructive">{error}</p>}</div>;
}
