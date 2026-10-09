import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Apple, CheckCircle2, Download, MoreVertical, PlusSquare, Share, Smartphone } from 'lucide-react';
import { usePwa } from '../../lib/pwa';

const IOS_STEPS = [
  { i: Share, t: 'در Safari دکمه «اشتراک‌گذاری» پایین صفحه را بزنید' },
  { i: PlusSquare, t: 'گزینه «Add to Home Screen» را انتخاب کنید' },
  { i: CheckCircle2, t: '«Add» را بزنید؛ آیکن کایار روی صفحه اصلی می‌آید' },
];
const ANDROID_STEPS = [
  { i: Download, t: 'دکمه «نصب اپ» را بزنید و تأیید کنید' },
  { i: MoreVertical, t: 'اگر دکمه فعال نبود: منوی ⋮ کروم ← «Install app» یا «Add to Home screen»' },
  { i: CheckCircle2, t: 'کایار مثل یک اپ کامل از صفحه اصلی باز می‌شود' },
];

/** Landing section: install KAYAR as an app on Android (real browser prompt) or iPhone (Add to Home Screen steps). */
export default function InstallSection() {
  const pwa = usePwa();
  const [tab, setTab] = useState<'android' | 'ios'>(pwa.platform === 'ios' ? 'ios' : 'android');
  const steps = tab === 'ios' ? IOS_STEPS : ANDROID_STEPS;
  const install = async () => {
    if (await pwa.install()) toast.success('کایار نصب شد');
  };
  return (
    <motion.section id="install" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto max-w-7xl scroll-mt-20 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-accent/25 via-card to-card p-6 md:p-10">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
      <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary"><Smartphone className="h-4 w-4" />بدون نیاز به استور</span>
          <h2 className="text-3xl font-black leading-tight md:text-4xl">کایار را روی گوشی‌ات <span className="text-primary">نصب کن</span></h2>
          <p className="leading-8 text-muted-foreground">تمام صفحه، سریع و همیشه یک لمس فاصله. روی اندروید و آیفون، مستقیم از مرورگر.</p>
          {pwa.isInstalled ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/15 px-5 py-3 font-bold text-primary"><CheckCircle2 className="h-5 w-5" />کایار روی این دستگاه نصب است</div>
          ) : tab === 'android' && pwa.canPrompt ? (
            <button onClick={install} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-black text-primary-foreground shadow-[0_10px_40px_-8px_hsl(var(--primary))] transition hover:scale-105">
              <Download className="h-5 w-5" />نصب اپ
            </button>
          ) : null}
        </div>
        <div className="rounded-3xl border border-white/10 bg-background/60 p-5 backdrop-blur">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl bg-white/5 p-1">
            {(['android', 'ios'] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${tab === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                {k === 'ios' ? <><Apple className="h-4 w-4" />آیفون</> : <><Smartphone className="h-4 w-4" />اندروید</>}
              </button>
            ))}
          </div>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s.t} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-card/60 p-3.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/25 text-sm font-black">{(i + 1).toLocaleString('fa-IR')}</span>
                <span className="flex-1 pt-1 text-sm leading-6">{s.t}</span>
                <s.i className="mt-1 h-5 w-5 shrink-0 text-primary" />
              </li>
            ))}
          </ol>
          {tab === 'ios' && pwa.platform !== 'ios' && <p className="mt-3 text-[11px] text-muted-foreground">این مراحل را روی آیفون و در مرورگر Safari انجام دهید.</p>}
          {tab === 'android' && !pwa.canPrompt && !pwa.isInstalled && <p className="mt-3 text-[11px] text-muted-foreground">نصب مستقیم در کروم اندروید پس از انتشار اپ در دسترس است؛ تا آن زمان از منوی مرورگر استفاده کنید.</p>}
        </div>
      </div>
    </motion.section>
  );
}
