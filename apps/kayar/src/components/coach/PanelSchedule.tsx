import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { saveAvailability } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { PanelSlot, WEEKDAYS } from '../../lib/coach';
import { errMsg } from '../../lib/data';

export default function PanelSchedule({ slots }: { slots: PanelSlot[] }) {
  const qc = useQueryClient();
  const sorted = [...slots].sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday) || a.startTime.localeCompare(b.startTime));
  const [rows, setRows] = useState<PanelSlot[]>(sorted);
  const [busy, setBusy] = useState(false);
  const bad = rows.some((r) => !r.startTime || !r.endTime || r.endTime <= r.startTime);
  const upd = (i: number, p: Partial<PanelSlot>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  const save = async () => {
    setBusy(true);
    try { await saveAvailability({ slots: rows.map(({ weekday, startTime, endTime }) => ({ weekday, startTime, endTime })) }); toast.success('زمان‌بندی ذخیره شد'); await qc.invalidateQueries(); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className="glass space-y-4 rounded-2xl p-4 md:p-5">
      <p className="text-sm text-muted-foreground">بازه‌های هفتگی که برای جلسه در دسترس هستید. این زمان‌ها در صفحه عمومی شما نمایش داده می‌شود. ظرفیت هفتگی را از تب پروفایل تنظیم کنید.</p>
      {rows.length === 0 && <p className="rounded-xl bg-secondary/60 p-4 text-center text-sm">هنوز بازه‌ای اضافه نشده است.</p>}
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto] items-center gap-2 sm:grid-cols-[160px_1fr_1fr_auto]">
          <Select value={r.weekday} onValueChange={(v) => upd(i, { weekday: v })}>
            <SelectTrigger className="col-span-2 h-11 rounded-xl sm:col-span-1"><SelectValue /></SelectTrigger>
            <SelectContent>{WEEKDAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <div className="col-span-2 grid grid-cols-[1fr_1fr_auto] gap-2 sm:col-span-3">
            <Input type="time" dir="ltr" value={r.startTime} onChange={(e) => upd(i, { startTime: e.target.value })} className="h-11 rounded-xl" aria-label="شروع" />
            <Input type="time" dir="ltr" value={r.endTime} onChange={(e) => upd(i, { endTime: e.target.value })} className="h-11 rounded-xl" aria-label="پایان" />
            <Button size="icon" variant="ghost" className="h-11 w-11" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="حذف"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
      ))}
      {bad && <p className="text-xs text-destructive">ساعت پایان هر بازه باید بعد از ساعت شروع باشد.</p>}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="rounded-full" onClick={() => setRows([...rows, { weekday: 'شنبه', startTime: '09:00', endTime: '12:00' }])}><Plus className="ml-1 h-4 w-4" />افزودن بازه</Button>
        <Button disabled={bad || busy} onClick={save} className="rounded-full px-6">{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ذخیره زمان‌بندی</Button>
      </div>
    </div>
  );
}
