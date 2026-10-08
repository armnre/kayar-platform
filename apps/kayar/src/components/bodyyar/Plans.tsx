import { useState } from 'react';
import { toast } from 'sonner';
import { Dumbbell, Loader2, Sparkles } from 'lucide-react';
import { generateWorkoutPlan } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@project/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@project/components/ui/select';
import { Me, errMsg, useRefresh, fa } from '../../lib/data';
import { Empty } from '../ui-kit';

type PlanJson = { title?: string; notes?: string; days?: { name: string; focus: string; exercises: { name: string; sets: number; reps: string; rest: string }[] }[] };
const parse = (s: string): PlanJson => { try { return JSON.parse(s); } catch { return {}; } };

export default function Plans({ plans, aiReady }: { plans: Me['plans']; aiReady: boolean }) {
  const refresh = useRefresh();
  const [days, setDays] = useState('3');
  const [busy, setBusy] = useState(false);
  const gen = async () => {
    setBusy(true);
    try { await generateWorkoutPlan({ daysPerWeek: Number(days) }); toast.success('برنامه جدید ساخته شد'); refresh(); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="flex-1"><div className="font-bold">ساخت برنامه هفتگی با بدن‌یار</div><div className="text-xs text-muted-foreground">بر اساس هدف، سطح و امکانات تو</div></div>
        <Select value={days} onValueChange={setDays} dir="rtl">
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{[2, 3, 4, 5, 6].map((d) => <SelectItem key={d} value={String(d)}>{fa(d)} روز در هفته</SelectItem>)}</SelectContent>
        </Select>
        <Button disabled={!aiReady || busy} onClick={gen} className="h-11 rounded-xl font-bold">{busy ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}ساخت برنامه</Button>
      </div>
      {plans.length === 0 ? <Empty icon={Dumbbell} title="هنوز برنامه‌ای نداری" text="برنامه شخصی‌ات را با بدن‌یار بساز یا از یک مربی درخواست کن." /> : plans.map((p) => {
        const j = parse(p.content);
        return (
          <div key={p.id} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between"><div className="font-bold">{p.title}</div><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{p.source}</span></div>
            {j.days?.length ? (
              <Accordion type="single" collapsible className="mt-2">
                {j.days.map((d, i) => (
                  <AccordionItem key={i} value={String(i)}>
                    <AccordionTrigger className="text-sm">{d.name} — <span className="text-muted-foreground">{d.focus}</span></AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {d.exercises.map((x, k) => (
                        <div key={k} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-sm">
                          <span>{x.name}</span><span className="text-xs text-muted-foreground">{x.sets} × {x.reps} · استراحت {x.rest}</span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{p.content}</p>}
            {j.notes && <p className="mt-3 text-xs leading-6 text-muted-foreground">{j.notes}</p>}
          </div>
        );
      })}
    </div>
  );
}
