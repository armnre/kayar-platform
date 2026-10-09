import { useState } from 'react';

import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Inbox, Check, X, Loader2 } from 'lucide-react';
import { updateRequestStatus } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Badge } from '@project/components/ui/badge';
import { cn } from '@project/components/lib/utils';
import { PanelRequest } from '../../lib/coach';
import { faDate, errMsg } from '../../lib/data';
import { Empty } from '../ui-kit';

const tone: Record<string, string> = { 'در انتظار': 'bg-accent/15 text-accent', 'پذیرفته شده': 'bg-primary/15 text-primary', 'رد شده': 'bg-destructive/15 text-destructive', 'لغو شده': 'bg-muted text-muted-foreground' };
const FILTERS = ['همه', 'در انتظار', 'پذیرفته شده', 'رد شده', 'لغو شده'];

export default function PanelRequests({ requests }: { requests: PanelRequest[]; coachId: string }) {
  const qc = useQueryClient();
  const [f, setF] = useState('همه');
  const [busy, setBusy] = useState<string>();
  const list = requests.filter((r) => f === 'همه' || r.status === f);
  const act = async (id: string, status: 'پذیرفته شده' | 'رد شده') => {
    setBusy(id);
    try { await updateRequestStatus({ requestId: id, status }); toast.success(status === 'پذیرفته شده' ? 'رزرو پذیرفته شد' : 'رزرو رد شد'); await qc.invalidateQueries({ queryKey: ['coachPanel'] }); }
    catch (e) { toast.error(errMsg(e)); } finally { setBusy(undefined); }
  };
  return (
    <div className="space-y-4">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">{FILTERS.map((x) => <button key={x} onClick={() => setF(x)} className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm', f === x ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-border text-muted-foreground')}>{x}</button>)}</div>
      {list.length === 0 ? <Empty icon={Inbox} title="درخواستی وجود ندارد" /> : list.map((r) => (
        <div key={r.id} className="glass rounded-2xl p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0"><div className="font-bold">{r.clientName}</div><div className="text-xs text-muted-foreground">{r.planName} · جلسه: {faDate(r.sessionAt, true)}</div></div>
            <Badge className={`rounded-full border-0 ${tone[r.status] ?? ''}`}>{r.status}</Badge>
          </div>
          {r.message && <p className="mt-3 rounded-xl bg-secondary/60 p-3 text-sm leading-7">{r.message}</p>}
          {r.status === 'در انتظار' && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" disabled={busy === r.id} onClick={() => act(r.id, 'پذیرفته شده')} className="rounded-full">{busy === r.id ? <Loader2 className="ml-1 h-4 w-4 animate-spin" /> : <Check className="ml-1 h-4 w-4" />}پذیرش</Button>
              <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => act(r.id, 'رد شده')} className="rounded-full"><X className="ml-1 h-4 w-4" />رد</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
