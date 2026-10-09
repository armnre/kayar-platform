import { Users } from 'lucide-react';
import { fa, faDate } from '../../lib/data';
import { Empty } from '../ui-kit';

export default function PanelClients({ clients }: { clients: { id: string; name: string; sessions: number; lastAt: string | null }[] }) {
  if (!clients.length) return <Empty icon={Users} title="هنوز شاگردی ندارید" text="با پذیرش اولین رزرو، شاگردان اینجا نمایش داده می‌شوند." />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((c) => (
        <div key={c.id} className="glass flex items-center gap-3 rounded-2xl p-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-black text-primary">{c.name[0]}</div>
          <div className="min-w-0"><div className="truncate font-bold">{c.name}</div><div className="text-xs text-muted-foreground">{fa(c.sessions)} رزرو · آخرین جلسه {faDate(c.lastAt)}</div></div>
        </div>
      ))}
    </div>
  );
}
