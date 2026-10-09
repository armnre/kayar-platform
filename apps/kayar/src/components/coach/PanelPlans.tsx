import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { saveCoachPlan } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Textarea } from '@project/components/ui/textarea';
import { Label } from '@project/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@project/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@project/components/ui/alert-dialog';
import { PanelPlan } from '../../lib/coach';
import { fa, toman, errMsg } from '../../lib/data';
import { Empty } from '../ui-kit';

const blank = { name: '', sessions: 8, durationWeeks: 4, price: 0, description: '' };

export default function PanelPlans({ plans }: { plans: PanelPlan[] }) {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Partial<PanelPlan> | null>(null);
  const [del, setDel] = useState<PanelPlan>();
  const [busy, setBusy] = useState(false);
  const valid = !!edit && (edit.name ?? '').trim().length >= 2 && (edit.sessions ?? 0) >= 1 && (edit.durationWeeks ?? 0) >= 1 && (edit.price ?? -1) >= 0;
  const run = async (input: Parameters<typeof saveCoachPlan>[0], ok: string) => {
    setBusy(true);
    try { await saveCoachPlan(input); toast.success(ok); await qc.invalidateQueries(); setEdit(null); setDel(undefined); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  const save = () => edit && run({ id: edit.id, name: edit.name!, sessions: edit.sessions!, durationWeeks: edit.durationWeeks!, price: edit.price!, description: edit.description ?? '' }, 'خدمت ذخیره شد');
  const num = (k: 'sessions' | 'durationWeeks' | 'price', l: string) => (
    <div className="space-y-2"><Label>{l}</Label><Input type="number" inputMode="numeric" value={edit?.[k] ?? ''} onChange={(e) => setEdit({ ...edit, [k]: e.target.value === '' ? undefined : Number(e.target.value) })} className="h-11 rounded-xl" /></div>
  );
  return (
    <div className="space-y-4">
      <Button onClick={() => setEdit({ ...blank })} className="rounded-full"><Plus className="ml-1 h-4 w-4" />خدمت جدید</Button>
      {plans.length === 0 ? <Empty icon={Package} title="هنوز خدمتی تعریف نکرده‌اید" text="بسته‌های تمرینی یا مشاوره خود را با قیمت و تعداد جلسات تعریف کنید." /> : (
        <div className="grid gap-3 md:grid-cols-2">{plans.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-bold">{p.name}</div><div className="text-xs text-muted-foreground">{fa(p.sessions)} جلسه · {fa(p.durationWeeks)} هفته</div></div>
              <div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setEdit(p)} aria-label="ویرایش"><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => setDel(p)} aria-label="حذف"><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            </div>
            {p.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
            <div className="mt-3 font-black text-primary">{toman(p.price)}</div>
          </div>
        ))}</div>
      )}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent dir="rtl" className="max-w-md rounded-3xl">
          <DialogHeader className="text-right"><DialogTitle>{edit?.id ? 'ویرایش خدمت' : 'خدمت جدید'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2"><Label>نام خدمت</Label><Input value={edit?.name ?? ''} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className="h-11 rounded-xl" /></div>
            <div className="grid grid-cols-3 gap-2">{num('sessions', 'جلسات')}{num('durationWeeks', 'هفته')}{num('price', 'قیمت (تومان)')}</div>
            <div className="space-y-2"><Label>توضیحات</Label><Textarea maxLength={1000} value={edit?.description ?? ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <Button disabled={!valid || busy} onClick={save} className="h-12 w-full rounded-xl font-bold">{busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}ذخیره</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(undefined)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right"><AlertDialogTitle>حذف «{del?.name}»؟</AlertDialogTitle><AlertDialogDescription>این خدمت از پروفایل عمومی شما حذف می‌شود.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="gap-2"><AlertDialogCancel>انصراف</AlertDialogCancel><AlertDialogAction onClick={() => del && run({ ...del, remove: true }, 'خدمت حذف شد')}>حذف</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
