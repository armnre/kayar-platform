import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { updateCoachProfile } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Label } from '@project/components/ui/label';
import { Switch } from '@project/components/ui/switch';
import { Panel, SPECIALTIES, SERVICES, LEVELS } from '../../lib/coach';
import { errMsg } from '../../lib/data';
import ChipSelect from './ChipSelect';
import UploadField from './UploadField';

export default function PanelProfile({ c }: { c: Panel['coach'] }) {
  const qc = useQueryClient();
  const [f, setF] = useState({ title: c.title, bio: c.bio, avatarUrl: c.avatarUrl, sports: c.sports, city: c.city, specialties: c.specialties, services: c.services, levels: c.levels, acceptingClients: c.acceptingClients, weeklyCapacity: c.weeklyCapacity });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.title.trim().length >= 2 && f.bio.trim().length >= 30 && f.specialties.length > 0 && f.services.length > 0 && f.levels.length > 0 && f.weeklyCapacity >= 0;
  const save = async () => {
    setBusy(true);
    try { await updateCoachProfile(f); toast.success('پروفایل به‌روزرسانی شد'); await qc.invalidateQueries(); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className="glass space-y-5 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 p-4">
        <div><div className="font-bold">پذیرش شاگرد جدید</div><div className="text-xs text-muted-foreground">در صورت خاموش بودن، دکمه رزرو در پروفایل عمومی غیرفعال می‌شود.</div></div>
        <Switch checked={f.acceptingClients} onCheckedChange={(v) => set('acceptingClients', v)} />
      </div>
      <div className="space-y-2"><Label>تصویر پروفایل</Label><UploadField label="تغییر تصویر" accept="image/*" value={f.avatarUrl ? [{ url: f.avatarUrl, filename: 'avatar' }] : []} onChange={(v) => set('avatarUrl', v[0]?.url ?? '')} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label>عنوان حرفه‌ای</Label><Input value={f.title} onChange={(e) => set('title', e.target.value)} className="h-11 rounded-xl" /></div>
        <div className="space-y-2"><Label>شهر</Label><Input value={f.city} onChange={(e) => set('city', e.target.value)} className="h-11 rounded-xl" /></div>
        <div className="space-y-2"><Label>رشته‌های ورزشی</Label><Input value={f.sports} onChange={(e) => set('sports', e.target.value)} className="h-11 rounded-xl" /></div>
        <div className="space-y-2"><Label>ظرفیت هفتگی (جلسه)</Label><Input type="number" value={f.weeklyCapacity} onChange={(e) => set('weeklyCapacity', Math.max(0, Math.round(Number(e.target.value) || 0)))} className="h-11 rounded-xl" /></div>
      </div>
      <div className="space-y-2"><Label>تخصص‌ها</Label><ChipSelect options={SPECIALTIES} value={f.specialties} onChange={(v) => set('specialties', v)} /></div>
      <div className="space-y-2"><Label>خدمات</Label><ChipSelect options={SERVICES} value={f.services} onChange={(v) => set('services', v)} /></div>
      <div className="space-y-2"><Label>سطح شاگردان</Label><ChipSelect options={LEVELS} value={f.levels} onChange={(v) => set('levels', v)} /></div>
      <div className="space-y-2"><Label>معرفی</Label><Textarea rows={5} maxLength={2000} value={f.bio} onChange={(e) => set('bio', e.target.value)} />{f.bio.trim().length < 30 && <p className="text-xs text-destructive">حداقل ۳۰ کاراکتر</p>}</div>
      <p className="text-xs text-muted-foreground">دسته‌بندی ({c.category || '—'})، امتیاز و وضعیت تأیید توسط ادمین کایار مدیریت می‌شود.</p>
      <Button disabled={!valid || busy} onClick={save} className="h-12 w-full rounded-xl font-bold sm:w-auto sm:px-10">{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ذخیره تغییرات</Button>
    </div>
  );
}
