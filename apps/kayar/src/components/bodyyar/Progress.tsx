import { useState } from 'react';
import { toast } from 'sonner';
import { Activity, Flame, Timer, Trash2, Plus, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { logActivity } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Input } from '@project/components/ui/input';
import { Me, errMsg, useRefresh, fa, faDate } from '../../lib/data';
import { Empty } from '../ui-kit';

export default function Progress({ activity }: { activity: Me['activity'] }) {
  const refresh = useRefresh();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ title: '', date: today, durationMinutes: '', calories: '', weightKg: '' });
  const [busy, setBusy] = useState(false);
  const weights = activity.filter((a) => a.weightKg).map((a) => ({ d: a.date.slice(5), w: a.weightKg })).reverse();
  const week = activity.filter((a) => Date.now() - new Date(a.date).getTime() < 7 * 864e5);
  const valid = f.title.trim().length > 0 && !!f.date;

  const add = async () => {
    setBusy(true);
    try {
      await logActivity({ title: f.title, date: f.date, durationMinutes: Number(f.durationMinutes) || 0, calories: Number(f.calories) || 0, weightKg: f.weightKg ? Number(f.weightKg) : null });
      toast.success('فعالیت ثبت شد'); setF({ ...f, title: '', durationMinutes: '', calories: '', weightKg: '' }); refresh();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  const del = async (id: string) => { try { await logActivity({ deleteId: id }); refresh(); } catch (e) { toast.error(errMsg(e)); } };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ i: Activity, v: week.length, l: 'تمرین این هفته' }, { i: Timer, v: week.reduce((s, a) => s + a.durationMinutes, 0), l: 'دقیقه' }, { i: Flame, v: week.reduce((s, a) => s + a.calories, 0), l: 'کالری' }].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-4 text-center"><s.i className="mx-auto mb-2 h-5 w-5 text-primary" /><div className="text-xl font-black">{fa(s.v)}</div><div className="text-[11px] text-muted-foreground">{s.l}</div></div>
        ))}
      </div>
      {weights.length > 1 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 font-bold">روند وزن</div>
          <div className="h-48" dir="ltr">
            <ResponsiveContainer><LineChart data={weights}><XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis domain={['auto', 'auto']} stroke="hsl(var(--muted-foreground))" fontSize={11} width={30} />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: 'none', borderRadius: 12 }} /><Line type="monotone" dataKey="w" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="glass space-y-3 rounded-2xl p-4">
        <div className="font-bold">ثبت فعالیت</div>
        <Input placeholder="عنوان (مثلاً دویدن، تمرین سینه)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="h-11 rounded-xl" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Input type="date" value={f.date} max={today} onChange={(e) => setF({ ...f, date: e.target.value })} className="h-11 rounded-xl" />
          <Input type="number" placeholder="دقیقه" value={f.durationMinutes} onChange={(e) => setF({ ...f, durationMinutes: e.target.value })} className="h-11 rounded-xl" />
          <Input type="number" placeholder="کالری" value={f.calories} onChange={(e) => setF({ ...f, calories: e.target.value })} className="h-11 rounded-xl" />
          <Input type="number" placeholder="وزن (اختیاری)" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: e.target.value })} className="h-11 rounded-xl" />
        </div>
        <Button disabled={!valid || busy} onClick={add} className="h-11 w-full rounded-xl font-bold">{busy ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Plus className="ml-2 h-4 w-4" />}ثبت</Button>
      </div>
      {activity.length === 0 ? <Empty icon={Activity} title="هنوز فعالیتی ثبت نکردی" /> : (
        <div className="space-y-2">
          {activity.slice(0, 30).map((a) => (
            <div key={a.id} className="glass flex items-center justify-between rounded-xl px-4 py-3">
              <div><div className="text-sm font-bold">{a.title}</div><div className="text-[11px] text-muted-foreground">{faDate(a.date)} · {fa(a.durationMinutes)} دقیقه · {fa(a.calories)} کالری{a.weightKg ? ` · ${a.weightKg.toLocaleString('fa-IR')} کیلو` : ''}</div></div>
              <Button size="icon" variant="ghost" onClick={() => del(a.id)} aria-label="حذف"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
