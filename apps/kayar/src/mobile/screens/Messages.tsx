import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import { Screen } from '../kit';
import { sendDemoMsg, useDemo, DemoConv } from '../../lib/demo';
import { relFa, timeFa } from '../../lib/chat';
import { useSession } from '../store';
import NotFound from './NotFound';

type Side = 'user' | 'coach';
const base = (side: Side) => (side === 'user' ? '/app/messages' : '/app/coach/messages');

/** Test-mode inbox. Athletes see their own chats; the test coach panel sees every chat on this device. */
export function Inbox({ side }: { side: Side }) {
  const s = useSession();
  const all = Object.values(useDemo().convs);
  const list = (side === 'user' ? all.filter((c) => c.userPhone === s.phone) : all)
    .sort((a, b) => (b.messages.at(-1)?.at ?? '').localeCompare(a.messages.at(-1)?.at ?? ''));
  const body = (
    <div className="space-y-2">
      {list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
          <MessageCircle className="mx-auto mb-2 h-8 w-8" />
          {side === 'user' ? <>هنوز گفتگویی ندارید. از <Link to="/app/coaches" className="text-primary">صفحه مربیان</Link> پیام بدهید.</> : 'هنوز پیامی از شاگردان نرسیده است.'}
        </div>
      )}
      {list.map((c) => <Row key={c.id} c={c} side={side} />)}
    </div>
  );
  return side === 'user' ? <Screen back="/app/home" title="پیام‌ها">{body}</Screen> : <div className="px-5 py-5"><h1 className="mb-4 text-xl font-black">پیام‌ها</h1>{body}</div>;
}

function Row({ c, side }: { c: DemoConv; side: Side }) {
  const last = c.messages.at(-1);
  return (
    <Link to={`${base(side)}/${c.id}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/80 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 font-black text-primary">{(side === 'user' ? c.coachName : c.userName || '؟')[0]}</span>
      <div className="min-w-0 flex-1">
        <div className="font-bold">{side === 'user' ? c.coachName : c.userName || 'ورزشکار'}</div>
        <div className="truncate text-xs text-muted-foreground">{last?.text}</div>
      </div>
      <span className="text-[11px] text-muted-foreground">{relFa(last?.at ?? null)}</span>
    </Link>
  );
}

export function Thread({ side }: { side: Side }) {
  const { id } = useParams();
  const c = useDemo().convs[id ?? ''];
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [c?.messages.length]);
  if (!c) return <NotFound />;
  const send = () => { sendDemoMsg(c.id, side, text); setText(''); };
  return (
    <Screen back={base(side)} title={side === 'user' ? c.coachName : c.userName || 'ورزشکار'}>
      <p className="mb-3 rounded-xl bg-white/[0.04] p-2 text-center text-[11px] text-muted-foreground">گفتگوی آزمایشی — پیام‌ها روی همین دستگاه ذخیره می‌شوند و در پنل مربی هم دیده می‌شوند.</p>
      <div className="flex-1 space-y-2">
        {c.messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.from === side ? 'mr-auto bg-primary text-primary-foreground' : 'ml-auto bg-card'}`}>
            {m.text}<div className="mt-1 text-[10px] opacity-60">{timeFa(m.at)}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="sticky bottom-0 mt-4 flex gap-2 bg-background pt-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="پیام خود را بنویسید…" aria-label="پیام"
          className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 outline-none focus:border-primary" />
        <button type="submit" disabled={!text.trim()} aria-label="ارسال" className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-40"><Send className="h-5 w-5" /></button>
      </form>
    </Screen>
  );
}
