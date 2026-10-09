import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2, BadgeCheck, ShieldCheck, Users, Wallet } from 'lucide-react';
import { applyCoach } from 'zitejs/api';
import { useAuth } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Label } from '@project/components/ui/label';
import { Badge } from '@project/components/ui/badge';
import { Skeleton } from '@project/components/ui/skeleton';
import { useMe, useRefresh, errMsg } from '../lib/data';
import { CATEGORIES, SPECIALTIES, SERVICES, LEVELS, STATUS_INFO } from '../lib/coach';
import ChipSelect from '../components/coach/ChipSelect';
import UploadField, { Doc } from '../components/coach/UploadField';

const schema = z.object({
  name: z.string().trim().min(2, 'نام و نام خانوادگی را وارد کنید'),
  phone: z.string().trim().regex(/^(\+98|0)?9\d{9}$/, 'شماره موبایل معتبر نیست'),
  email: z.string().email('ایمیل معتبر نیست'),
  city: z.string().trim().min(2, 'شهر را وارد کنید'),
  title: z.string().trim().min(2, 'عنوان حرفه‌ای را وارد کنید'),
  category: z.string().min(1, 'دسته‌بندی را انتخاب کنید'),
  specialties: z.array(z.string()).min(1, 'حداقل یک تخصص'),
  services: z.array(z.string()).min(1, 'حداقل یک خدمت'),
  levels: z.array(z.string()).min(1, 'حداقل یک سطح'),
  sports: z.string().trim().max(200),
  yearsExperience: z.number({ invalid_type_error: 'سابقه را وارد کنید' }).min(0).max(60),
  certifications: z.string().trim().max(300),
  bio: z.string().trim().min(30, 'معرفی حداقل ۳۰ کاراکتر باشد').max(2000),
  avatar: z.array(z.any()).length(1, 'تصویر پروفایل الزامی است'),
  documents: z.array(z.any()).min(1, 'حداقل یک مدرک بارگذاری کنید'),
});

export default function CoachApplyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Hero />
      <Gate />
    </div>
  );
}

function Hero() {
  const perks = [{ i: Users, t: 'دسترسی به هزاران ورزشکار' }, { i: Wallet, t: 'مدیریت رزرو و درآمد' }, { i: ShieldCheck, t: 'نشان مربی تأییدشده' }];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20">
      <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/teRZy9FtA6SAmLQ8Z5BY6e/img_y_vNAiVjDxgXvYxI.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-background via-background/90 to-background/40" />
      <div className="relative p-6 md:p-10">
        <Badge className="mb-3 rounded-full border-0 bg-primary/15 text-primary">همکاری با کایار</Badge>
        <h1 className="text-3xl font-black md:text-4xl">مربی کایار شو</h1>
        <p className="mt-2 max-w-md text-muted-foreground">پروفایل حرفه‌ای بساز، خدماتت را عرضه کن و شاگردانت را از یک پنل مدیریت کن.</p>
        <div className="mt-5 flex flex-wrap gap-2">{perks.map((p) => <span key={p.t} className="flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1.5 text-xs"><p.i className="h-4 w-4 text-primary" />{p.t}</span>)}</div>
      </div>
    </div>
  );
}

function Gate() {
  const { data, isLoading } = useMe();
  if (isLoading || !data) return <Skeleton className="h-96 rounded-3xl" />;
  const c = data.coach;
  if (c && c.status !== 'نیاز به اصلاح' && c.status !== 'رد شده') {
    const s = STATUS_INFO[c.status] ?? STATUS_INFO['در انتظار تایید'];
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <BadgeCheck className="mx-auto h-12 w-12 text-primary" />
        <Badge className={`mt-4 rounded-full border-0 ${s.tone}`}>{s.label}</Badge>
        <p className="mt-3 text-muted-foreground">{s.text}</p>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between text-[11px]">
          {['ثبت درخواست', 'در حال بررسی', 'تأیید و فعال‌سازی'].map((t, i) => {
            const done = i < 2 || c.status === 'تایید شده';
            return <div key={t} className="flex flex-1 flex-col items-center gap-1"><span className={`h-2.5 w-2.5 rounded-full ${done ? 'bg-primary' : 'bg-muted'}`} /><span className={done ? '' : 'text-muted-foreground'}>{t}</span></div>;
          })}
        </div>
        <Button asChild className="mt-5 rounded-full px-8"><Link to="/coach">ورود به پنل مربی</Link></Button>
      </div>
    );
  }
  return <ApplyForm resubmit={!!c} />;
}

function ApplyForm({ resubmit }: { resubmit: boolean }) {
  const { user } = useAuth();
  const refresh = useRefresh();
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const [f, setF] = useState({ name: user?.name ?? '', phone: '', email: user?.email ?? '', city: '', title: '', category: '', specialties: [] as string[], services: [] as string[], levels: [] as string[], sports: '', yearsExperience: NaN, certifications: '', bio: '', avatar: [] as Doc[], documents: [] as Doc[] });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const parsed = schema.safeParse(f);
  const errs: Record<string, string> = parsed.success ? {} : Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
  const E = ({ k }: { k: string }) => (touched && errs[k] ? <p className="text-xs text-destructive">{errs[k]}</p> : null);

  const submit = async () => {
    setTouched(true);
    if (!parsed.success) return toast.error('لطفاً موارد مشخص‌شده را کامل کنید');
    setBusy(true);
    try {
      const { avatar, ...rest } = f;
      await applyCoach({ ...rest, avatarUrl: avatar[0].url });
      toast.success('درخواست شما ثبت شد و پس از بررسی نتیجه اعلام می‌شود');
      refresh();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  const txt = (k: 'name' | 'phone' | 'email' | 'city' | 'title' | 'sports' | 'certifications', label: string, ltr?: boolean) => (
    <div className="space-y-2"><Label>{label}</Label><Input dir={ltr ? 'ltr' : undefined} value={f[k]} onChange={(e) => set(k, e.target.value)} className="h-12 rounded-xl" /><E k={k} /></div>
  );

  return (
    <div className="glass space-y-8 rounded-3xl p-5 md:p-8">
      {resubmit && <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm">درخواست قبلی شما نیاز به اصلاح دارد یا تأیید نشده است. اطلاعات را کامل کنید و دوباره ارسال کنید.</div>}
      <Section t="اطلاعات هویتی و تماس">
        <div className="grid gap-4 sm:grid-cols-2">{txt('name', 'نام و نام خانوادگی')}{txt('phone', 'شماره موبایل', true)}{txt('email', 'ایمیل', true)}{txt('city', 'شهر')}</div>
      </Section>
      <Section t="تخصص و خدمات">
        {txt('title', 'عنوان حرفه‌ای (مثلاً مربی بدنسازی و تغذیه)')}
        <div className="space-y-2"><Label>دسته‌بندی اصلی</Label><ChipSelect multi={false} options={CATEGORIES} value={f.category ? [f.category] : []} onChange={(v) => set('category', v[0])} /><E k="category" /></div>
        <div className="space-y-2"><Label>تخصص‌ها</Label><ChipSelect options={SPECIALTIES} value={f.specialties} onChange={(v) => set('specialties', v)} /><E k="specialties" /></div>
        <div className="space-y-2"><Label>خدمات</Label><ChipSelect options={SERVICES} value={f.services} onChange={(v) => set('services', v)} /><E k="services" /></div>
        <div className="space-y-2"><Label>سطح شاگردان</Label><ChipSelect options={LEVELS} value={f.levels} onChange={(v) => set('levels', v)} /><E k="levels" /></div>
        {txt('sports', 'رشته‌های ورزشی (اختیاری)')}
      </Section>
      <Section t="سوابق و مدارک">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>سال‌های سابقه</Label><Input type="number" inputMode="numeric" value={Number.isNaN(f.yearsExperience) ? '' : f.yearsExperience} onChange={(e) => set('yearsExperience', e.target.value === '' ? NaN : Number(e.target.value))} className="h-12 rounded-xl" /><E k="yearsExperience" /></div>
          {txt('certifications', 'گواهی‌ها و مدارک (خلاصه)')}
        </div>
        <div className="space-y-2"><Label>مدارک مربیگری (کارت، گواهی، مدرک تحصیلی)</Label><UploadField multiple label="بارگذاری مدارک (PDF یا تصویر)" accept="image/*,application/pdf" value={f.documents} onChange={(v) => set('documents', v)} /><E k="documents" /></div>
      </Section>
      <Section t="معرفی و تصویر">
        <div className="space-y-2"><Label>تصویر پروفایل</Label><UploadField label="انتخاب تصویر" accept="image/*" value={f.avatar} onChange={(v) => set('avatar', v)} /><E k="avatar" /></div>
        <div className="space-y-2"><Label>معرفی کوتاه</Label><Textarea rows={5} maxLength={2000} value={f.bio} onChange={(e) => set('bio', e.target.value)} placeholder="روش کار، سوابق قهرمانی، تمرکز تخصصی…" /><E k="bio" /></div>
      </Section>
      <Button onClick={submit} disabled={busy} className="h-14 w-full rounded-2xl text-base font-bold">{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}{resubmit ? 'ارسال مجدد درخواست' : 'ثبت درخواست مربیگری'}</Button>
    </div>
  );
}

const Section = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section className="space-y-4"><h2 className="border-r-4 border-primary pr-3 text-lg font-extrabold">{t}</h2>{children}</section>
);
