import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessagesSquare, Search, AlertTriangle } from 'lucide-react';
import { Input } from '@project/components/ui/input';
import { Skeleton } from '@project/components/ui/skeleton';
import { Button } from '@project/components/ui/button';
import { cn } from '@project/components/lib/utils';
import { useConversations, relFa } from '../../lib/chat';
import { fa } from '../../lib/data';
import SafeImg from '../SafeImg';

export default function ConversationList({ activeId }: { activeId?: string }) {
  const { data, isLoading, isError, refetch } = useConversations();
  const [q, setQ] = useState('');
  const list = useMemo(() => (data?.conversations ?? []).filter((c) => c.otherName.includes(q.trim())), [data, q]);
  return (
    <div className="flex h-full flex-col">
      <div className="relative p-3">
        <Search className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی گفتگو…" className="h-11 rounded-xl pr-10" />
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
          : isError ? <div className="p-6 text-center text-sm text-muted-foreground"><AlertTriangle className="mx-auto mb-2 h-6 w-6 text-destructive" />بارگذاری گفتگوها ناموفق بود.<Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>تلاش دوباره</Button></div>
          : list.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground"><MessagesSquare className="mx-auto mb-3 h-8 w-8 text-primary" />{q ? 'گفتگویی با این نام نیست.' : 'هنوز گفتگویی نداری. از صفحه هر مربی می‌توانی گفتگو را شروع کنی.'}</div>
          : list.map((c) => (
            <Link key={c.id} to={`/messages/${c.id}`} className={cn('flex items-center gap-3 rounded-xl p-3 transition hover:bg-secondary/60', activeId === c.id && 'bg-secondary')}>
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-secondary">
                <SafeImg src={c.otherAvatar} alt={c.otherName} className="h-full w-full object-cover" fallback={<div className="grid h-full place-items-center font-black text-primary">{c.otherName[0]}</div>} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-bold">{c.otherName}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{relFa(c.lastMessageAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">{c.role === 'coach' && <span className="text-accent">شاگرد · </span>}{c.lastMessagePreview || 'گفتگو را شروع کنید'}</span>
                  {c.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-black text-primary-foreground">{fa(c.unread)}</span>}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
