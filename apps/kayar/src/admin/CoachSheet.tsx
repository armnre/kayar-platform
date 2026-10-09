import { adminToken } from './session';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Loader2, Mail, Phone } from 'lucide-react';
import { adminReviewCoach, AdminReviewCoachInputType } from 'zitejs/api';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@project/components/ui/sheet';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Label } from '@project/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import type { AdminCoach } from './AdminApp';

export const TONE: Record<string, string> = {
  'در انتظار تایید': 'bg-accent/20 text-accent', 'تایید شده': 'bg-primary/20 text-primary', 'نیاز به اصلاح': 'bg-orange-500/20 text-orange-400',
  'رد شده': 'bg-destructive/20 text-destructive', 'معلق': 'bg-muted text-muted-foreground',
};
const CATEGORIES = ['فیتنس و بدنسازی', 'یوگا و پیلاتس', 'دویدن و کاردیو', 'تغذیه', 'ورزش‌های رزمی', 'حرکات اصلاحی'];
type Status = AdminReviewCoachInputType['status'];

export default function CoachSheet({ coach, onClose }: { coach?: AdminCoach; onClose: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({ category: '', adminNotes: '', title: '', rating: 0, reviewCount: 0 });
  const [busy, setBusy] = useState<string>();
  useEffect(() => { if (coach) setF({ category: coach.category, adminNotes: coach.adminNotes, title: coach.title, rating: coach.rating, reviewCount: coach.reviewCount }); }, [coach]);
  const act = async (status: Status) => {
    if (!coach) return;
    setBusy(status);
    try { await adminReviewCoach({ token: adminToken(), id: coach.id, status, ...f }); toast.success(`وضعیت: ${status}`); await qc.invalidateQueries({ queryKey: ['coaches'] }); onClose(); }
    catch (e) { toast.error((e as { userFacingMessage?: string }).userFacingMessage ?? 'ذخیره ناموفق بود'); } finally { setBusy(undefined); }
  };
  const B = ({ s, label, variant }: { s: Status; label: string; variant?: 'outline' | 'destructive' }) => (
    <Button variant={variant} disabled={!!busy} onClick={() => act(s)} className="rounded-xl">{busy === s && <Loader2 className="ml-1 h-4 w-4 animate-spin" />}{label}</Button>
  );
  return (
    <Sheet open={!!coach} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" dir="rtl" className="w-full overflow-y-auto sm:max-w-lg">
        {coach && <>
          <SheetHeader className="text-right"><SheetTitle>{coach.name}</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-5 text-sm">
            <div className="flex gap-4">
              {coach.avatarUrl && <img src={coach.avatarUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />}
              <div className="space-y-1"><div className="flex items-center gap-2" dir="ltr"><Mail className="h-4 w-4" />{coach.email || '—'}</div><div className="flex items-center gap-2" dir="ltr"><Phone className="h-4 w-4" />{coach.phone || '—'}</div>
                <div>{coach.city} · {coach.yearsExperience.toLocaleString('fa-IR')} سال سابقه</div><div className="text-xs text-muted-foreground">ثبت: {coach.submittedAt ? new Date(coach.submittedAt).toLocaleDateString('fa-IR') : '—'}</div></div>
            </div>
            <Row l="تخصص‌ها" v={coach.specialties.join('، ')} /><Row l="خدمات" v={coach.services.join('، ')} /><Row l="سطوح" v={coach.levels.join('، ')} />
            <Row l="رشته‌ها" v={coach.sports} /><Row l="گواهی‌ها" v={coach.certifications} />
            <div><div className="mb-1 text-xs text-muted-foreground">معرفی</div><p className="whitespace-pre-line leading-7">{coach.bio || '—'}</p></div>
            <div><div className="mb-2 text-xs text-muted-foreground">مدارک</div>
              {coach.documents.length ? <div className="flex flex-col gap-2">{coach.documents.map((d) => <a key={d.url} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl bg-secondary p-3 hover:text-primary"><FileText className="h-4 w-4" /><span dir="ltr" className="truncate">{d.filename}</span></a>)}</div> : <span className="text-muted-foreground">مدرکی بارگذاری نشده</span>}</div>
            <div className="space-y-3 rounded-2xl border border-border p-4">
              <div className="space-y-1"><Label>دسته‌بندی</Label>
                <Select value={f.category || undefined} onValueChange={(v) => setF({ ...f, category: v })}><SelectTrigger><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1"><Label>عنوان نمایشی</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label>امتیاز (۰ تا ۵)</Label><Input type="number" step="0.1" min={0} max={5} value={f.rating} onChange={(e) => setF({ ...f, rating: Math.min(5, Math.max(0, Number(e.target.value) || 0)) })} /></div>
                <div className="space-y-1"><Label>تعداد نظرات</Label><Input type="number" min={0} value={f.reviewCount} onChange={(e) => setF({ ...f, reviewCount: Math.max(0, Math.round(Number(e.target.value) || 0)) })} /></div>
              </div>
              <div className="space-y-1"><Label>توضیح برای مربی</Label><Textarea value={f.adminNotes} maxLength={2000} onChange={(e) => setF({ ...f, adminNotes: e.target.value })} placeholder="در صورت رد یا نیاز به اصلاح الزامی است" /></div>
              <div className="flex flex-wrap gap-2 pt-1">
                <B s="تایید شده" label="تأیید" /><B s="نیاز به اصلاح" label="نیاز به اصلاح" variant="outline" /><B s="رد شده" label="رد" variant="destructive" />
                {coach.status === 'تایید شده' && <B s="معلق" label="تعلیق" variant="outline" />}
                {coach.status !== 'در انتظار تایید' && <B s={coach.status as Status} label="ذخیره بدون تغییر وضعیت" variant="outline" />}
              </div>
            </div>
          </div>
        </>}
      </SheetContent>
    </Sheet>
  );
}

const Row = ({ l, v }: { l: string; v: string }) => <div className="flex gap-3"><span className="w-20 shrink-0 text-xs text-muted-foreground">{l}</span><span>{v || '—'}</span></div>;
