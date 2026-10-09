import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Send, CheckCheck, Check, Loader2, AlertTriangle, RotateCw } from 'lucide-react';
import { sendMessage, GetMessagesOutputType } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Textarea } from '@project/components/ui/textarea';
import { Skeleton } from '@project/components/ui/skeleton';
import { cn } from '@project/components/lib/utils';
import { useThread, timeFa } from '../../lib/chat';
import { errMsg } from '../../lib/data';
import SafeImg from '../SafeImg';

type Pending = { cid: string; body: string; state: 'sending' | 'failed'; error?: string };

export default function Thread({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useThread(id);
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [pending, setPending] = useState<Pending[]>([]);
  const end = useRef<HTMLDivElement>(null);
  const known = new Set(data?.messages.map((m) => m.clientMessageId));
  const shownPending = pending.filter((p) => !known.has(p.cid));

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [data?.messages.length, shownPending.length]);
  useEffect(() => { qc.invalidateQueries({ queryKey: ['conversations'] }); }, [data?.messages.length, qc]);

  const deliver = async (p: Pending) => {
    setPending((x) => x.map((y) => (y.cid === p.cid ? { ...y, state: 'sending' } : y)));
    try {
      await sendMessage({ conversationId: id, body: p.body, clientMessageId: p.cid });
      await refetch();
      setPending((x) => x.filter((y) => y.cid !== p.cid));
    } catch (e) {
      setPending((x) => x.map((y) => (y.cid === p.cid ? { ...y, state: 'failed', error: errMsg(e) } : y)));
    }
  };
  const submit = () => {
    const body = text.trim();
    if (!body || body.length > 2000) return;
    const p: Pending = { cid: crypto.randomUUID(), body, state: 'sending' };
    setPending((x) => [...x, p]); setText(''); deliver(p);
  };

  if (isLoading) return <div className="space-y-3 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className={cn('h-12 w-2/3 rounded-2xl', i % 2 && 'mr-auto')} />)}</div>;
  if (isError || !data) return <div className="grid h-full place-items-center p-8 text-center text-sm text-muted-foreground"><div><AlertTriangle className="mx-auto mb-2 h-7 w-7 text-destructive" />این گفتگو در دسترس نیست.<div className="mt-3"><Button asChild variant="outline" size="sm"><Link to="/messages">بازگشت</Link></Button></div></div></div>;

  return (
    <div className="flex h-full flex-col">
      <Header d={data} />
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {data.messages.length === 0 && shownPending.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">اولین پیام را بفرستید 👋</p>}
        {data.messages.map((m) => (
          <Bubble key={m.id} mine={m.mine} body={m.body}>
            {timeFa(m.sentAt)}
            {m.mine && (data.otherLastReadAt && data.otherLastReadAt >= m.sentAt ? <CheckCheck className="h-3.5 w-3.5 text-accent" aria-label="خوانده شد" /> : <Check className="h-3.5 w-3.5" aria-label="ارسال شد" />)}
          </Bubble>
        ))}
        {shownPending.map((p) => (
          <Bubble key={p.cid} mine body={p.body} failed={p.state === 'failed'}>
            {p.state === 'sending' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (
              <button onClick={() => deliver(p)} className="flex items-center gap-1 text-destructive"><RotateCw className="h-3 w-3" />{p.error ?? 'ارسال نشد'} — تلاش دوباره</button>
            )}
          </Bubble>
        ))}
        <div ref={end} />
      </div>
      <div className="flex items-end gap-2 border-t border-border p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={1} placeholder="پیام خود را بنویسید…"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          className="max-h-32 min-h-[48px] resize-none rounded-2xl" />
        <Button onClick={submit} disabled={!text.trim()} size="icon" className="h-12 w-12 shrink-0 rounded-2xl" aria-label="ارسال"><Send className="h-5 w-5 -scale-x-100" /></Button>
      </div>
    </div>
  );
}

function Header({ d }: { d: GetMessagesOutputType }) {
  return (
    <div className="flex items-center gap-3 border-b border-border p-3">
      <Link to="/messages" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary md:hidden" aria-label="بازگشت"><ArrowRight className="h-5 w-5" /></Link>
      <div className="h-10 w-10 overflow-hidden rounded-full bg-secondary">
        <SafeImg src={d.otherAvatar} alt={d.otherName} className="h-full w-full object-cover" fallback={<div className="grid h-full place-items-center font-black text-primary">{d.otherName[0]}</div>} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{d.otherName}</div>
        <div className="text-xs text-muted-foreground">{d.role === 'client' ? 'مربی' : 'شاگرد'}</div>
      </div>
      {d.role === 'client' && d.coachId && <Button asChild size="sm" variant="outline" className="rounded-full"><Link to={`/coaches/${d.coachId}`}>پروفایل مربی</Link></Button>}
    </div>
  );
}

function Bubble({ mine, body, failed, children }: { mine: boolean; body: string; failed?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('flex', mine ? 'justify-start' : 'justify-end')}>
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-2.5', mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary', failed && 'opacity-70 ring-1 ring-destructive')}>
        <p className="whitespace-pre-wrap break-words text-sm leading-7">{body}</p>
        <div className={cn('mt-0.5 flex items-center justify-end gap-1 text-[10px]', mine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{children}</div>
      </div>
    </div>
  );
}
