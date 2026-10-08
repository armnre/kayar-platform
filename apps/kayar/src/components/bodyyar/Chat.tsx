import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Send, Zap, Loader2 } from 'lucide-react';
import { bodyyarChat } from 'zitejs/api';
import { Input } from '@project/components/ui/input';
import { Button } from '@project/components/ui/button';
import { Markdown } from '@project/components/markdown';
import { cn } from '@project/components/lib/utils';
import { Me, errMsg, useRefresh } from '../../lib/data';

const SUGGEST = ['تمرین امروز چی باشه؟', 'یک وعده سالم پیشنهاد بده', 'چطور انگیزه‌ام رو حفظ کنم؟'];

export default function Chat({ messages, aiReady }: { messages: Me['messages']; aiReady: boolean }) {
  const refresh = useRefresh();
  const [local, setLocal] = useState<{ role: string; content: string }[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const all = [...messages, ...local];
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [all.length, busy]);

  const send = async (msg: string) => {
    if (!msg.trim() || busy) return;
    setText(''); setBusy(true);
    setLocal((l) => [...l, { role: 'user', content: msg }]);
    try { await bodyyarChat({ message: msg }); await refresh(); setLocal([]); }
    catch (e) { toast.error(errMsg(e)); setLocal([]); setText(msg); } finally { setBusy(false); }
  };

  return (
    <div className="glass flex h-[65vh] flex-col rounded-3xl">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {all.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground glow"><Zap className="h-8 w-8" fill="currentColor" /></div>
            <div className="font-bold">سلام! من بدن‌یار هستم</div>
            <p className="mt-1 text-sm text-muted-foreground">درباره تمرین، تغذیه یا انگیزه ازم بپرس.</p>
          </div>
        )}
        {all.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-start' : 'justify-end')}>
            <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-7', m.role === 'user' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-secondary')}>
              {m.role === 'user' ? m.content : <Markdown className="prose-sm prose-invert">{m.content}</Markdown>}
            </div>
          </div>
        ))}
        {busy && <div className="flex justify-end"><div className="rounded-2xl bg-secondary px-4 py-3"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div></div>}
        <div ref={end} />
      </div>
      <div className="border-t border-white/5 p-3">
        <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
          {SUGGEST.map((s) => <button key={s} disabled={!aiReady || busy} onClick={() => send(s)} className="shrink-0 rounded-full border border-primary/30 px-3 py-1 text-xs text-primary disabled:opacity-40">{s}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
          <Input disabled={!aiReady} value={text} onChange={(e) => setText(e.target.value)} placeholder={aiReady ? 'پیام خود را بنویسید…' : 'هوش مصنوعی هنوز متصل نشده'} className="h-12 rounded-xl" />
          <Button disabled={!aiReady || busy || !text.trim()} size="icon" className="h-12 w-12 shrink-0 rounded-xl"><Send className="h-5 w-5 -scale-x-100" /></Button>
        </form>
      </div>
    </div>
  );
}
