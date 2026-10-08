import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bell, Bot } from 'lucide-react';
import { Screen } from '../kit';
import { setSession, useSession, toFa, MSession } from '../store';

type B = NonNullable<MSession['body']>;
const bmi = (b: B) => b.weight / (b.height / 100) ** 2;
const kcal = (b: B) => Math.round((10 * b.weight + 6.25 * b.height - 5 * b.age + (b.gender === 'male' ? 5 : -161)) * 1.45 + (b.goal === 'کاهش وزن' ? -400 : b.goal === 'افزایش عضله' ? 300 : 0));

/** Demo replies. When the AI secret is configured, swap for the bodyyarChat endpoint. */
function reply(q: string, b: B) {
  if (q.includes('تغذیه') || q.includes('غذا')) return `برای هدف «${b.goal}» حدود ${toFa(kcal(b))} کالری در روز نیاز داری. وعده پیشنهادی امروز: سینه مرغ گریل، برنج قهوه‌ای و سالاد سبزیجات 🥗`;
  if (q.includes('فردا')) return 'برنامه فردا: ۱۰ دقیقه گرم کردن، ۳ ست اسکوات، ۳ ست شنا سوئدی، ۳ ست پلانک ۴۵ ثانیه‌ای و ۱۰ دقیقه کشش. 💪';
  if (q.includes('تمرین')) return `برنامه امروزت (سطح ${b.level}): ۲۰ دقیقه کاردیو سبک، ۴ ست لانج، ۴ ست زیربغل با کش و ۳ ست کرانچ. استراحت بین ست‌ها ۶۰ ثانیه.`;
  return `سؤال خوبیه! با شاخص توده بدنی ${toFa(bmi(b).toFixed(1))} و هدف «${b.goal}»، پیشنهادم اینه که روی ثبات تمرین و خواب کافی تمرکز کنی. از دکمه‌های پایین برای برنامه دقیق‌تر استفاده کن.`;
}

export default function BodyChat() {
  const s = useSession();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const chat = s.chat ?? [];
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.length, typing]);
  useEffect(() => {
    if (s.body && !chat.length) setSession({ chat: [{ role: 'assistant', text: `سلام ${s.name?.split(' ')[0]}! تحلیلت آماده‌ست: BMI ${toFa(bmi(s.body).toFixed(1))} و نیاز روزانه حدود ${toFa(kcal(s.body))} کالری. این برنامه تمرینی امروز شماست، اگر سؤالی داری در خدمتم.`, at: Date.now() }] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!s.body) return <Navigate to="/app/bodyyar/profile" replace />;

  const send = (q: string) => {
    if (!q.trim() || typing) return;
    setSession((x) => ({ chat: [...(x.chat ?? []), { role: 'user', text: q.trim(), at: Date.now() }] }));
    setText(''); setTyping(true);
    setTimeout(() => { setSession((x) => ({ chat: [...(x.chat ?? []), { role: 'assistant', text: reply(q, s.body!), at: Date.now() }] })); setTyping(false); }, 1100);
  };
  const time = (t: number) => new Date(t).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Screen title={<span className="text-primary">بدن‌یار</span>} back="/app/bodyyar" right={<Bell className="h-5 w-5 text-muted-foreground" />} className="h-[100svh] md:h-[860px]">
      <div className="no-scrollbar -mx-5 flex-1 space-y-4 overflow-y-auto px-5">
        {chat.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/50 text-primary"><Bot className="h-4 w-4" /></span>}
            <div className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm leading-7 ${m.role === 'user' ? 'rounded-bl-md border border-primary/50 bg-primary/10' : 'rounded-br-md border border-white/[0.07] bg-card'}`}>
              {m.text}<div className="mt-1 text-[10px] text-muted-foreground">{time(m.at)}</div>
            </div>
          </motion.div>
        ))}
        {typing && <div className="flex gap-1 px-12">{[0, 1, 2].map((i) => <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} className="h-2 w-2 rounded-full bg-primary" />)}</div>}
        <div ref={end} />
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {['تمرین امروز', 'تغذیه', 'برنامه فردا'].map((q) => <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-primary/50 px-4 py-2 text-xs font-bold text-primary active:bg-primary/10">{q}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 focus-within:border-primary">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="پیام خود را بنویسید…" className="flex-1 bg-transparent px-3 text-sm outline-none" />
        <button disabled={!text.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40" aria-label="ارسال"><Send className="h-4 w-4 -scale-x-100" /></button>
      </form>
    </Screen>
  );
}
