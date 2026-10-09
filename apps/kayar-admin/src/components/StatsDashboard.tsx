import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminStats, AdminStatsOutputType } from 'zitejs/api';
import { Skeleton } from '@project/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@project/components/ui/table';

const fa = (n: number) => n.toLocaleString('fa-IR');
const pct = (a: number, b: number) => (b ? `${fa(Math.round((a / b) * 100))}٪` : '—');

export default function StatsDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['stats'], queryFn: async () => (await adminStats({})) as AdminStatsOutputType });
  if (isLoading || !data) return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>;
  const t = data.totals;
  const kpis = [
    ['کمپین فعال', t.activeCampaigns], ['بازدید کمپین‌ها', t.views], ['شرکت‌کنندگان یکتا', t.participants], ['مشارکت در چالش', t.participations],
    ['تکمیل چالش', t.completions], ['نرخ تکمیل', pct(t.completions, t.participations)], ['دریافت پاداش', t.redemptions], ['شنوندگان مرشد', t.listeners],
  ] as const;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map(([l, v]) => <div key={l} className="rounded-2xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{l}</div><div className="mt-1 text-2xl font-black text-primary">{typeof v === 'number' ? fa(v) : v}</div></div>)}
      </div>
      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 font-bold">گزارش اسپانسر — عملکرد کمپین‌ها</h3>
        {data.campaigns.length === 0 ? <p className="text-sm text-muted-foreground">هنوز کمپینی ثبت نشده است.</p> : (
          <>
            <div className="h-56" dir="ltr"><ResponsiveContainer><BarChart data={data.campaigns}><XAxis dataKey="title" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} /><YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="views" name="بازدید" fill="hsl(var(--chart-2))" radius={4} /><Bar dataKey="participations" name="مشارکت" fill="hsl(var(--chart-1))" radius={4} /></BarChart></ResponsiveContainer></div>
            <Table><TableHeader><TableRow><TableHead className="text-right">کمپین</TableHead><TableHead className="text-right">حامی</TableHead><TableHead className="text-right">وضعیت</TableHead><TableHead className="text-right">بازدید</TableHead><TableHead className="text-right">شرکت‌کننده</TableHead><TableHead className="text-right">تبدیل</TableHead><TableHead className="text-right">تکمیل</TableHead></TableRow></TableHeader>
              <TableBody>{data.campaigns.map((c) => <TableRow key={c.id}><TableCell className="font-bold">{c.title}</TableCell><TableCell>{c.brand || '—'}</TableCell><TableCell>{c.status}</TableCell><TableCell>{fa(c.views)}</TableCell><TableCell>{fa(c.participants)}</TableCell><TableCell>{pct(c.participants, c.views)}</TableCell><TableCell>{fa(c.completions)}</TableCell></TableRow>)}</TableBody></Table>
          </>
        )}
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <MiniTable title="پاداش‌های پرطرفدار" head={['پاداش', 'دریافت', 'موجودی']} rows={data.rewards.map((r) => [r.title, fa(r.redeemed), fa(r.stock)])} />
        <MiniTable title="محتوای پرشنونده مرشد" head={['محتوا', 'شنونده', 'ذخیره']} rows={data.audio.map((a) => [a.title, fa(a.listeners), fa(a.saves)])} />
      </div>
    </div>
  );
}

function MiniTable({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4"><h3 className="mb-2 font-bold">{title}</h3>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">داده‌ای ثبت نشده است.</p> : (
        <Table><TableHeader><TableRow>{head.map((h) => <TableHead key={h} className="text-right">{h}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{rows.map((r, i) => <TableRow key={i}>{r.map((c, j) => <TableCell key={j}>{c}</TableCell>)}</TableRow>)}</TableBody></Table>
      )}
    </section>
  );
}
