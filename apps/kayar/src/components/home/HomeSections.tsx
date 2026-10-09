import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, Headphones, Gift, MessagesSquare, Target, Play, Megaphone, ArrowLeft, Coins } from 'lucide-react';
import { Progress } from '@project/components/ui/progress';
import { Catalog, Me, fa, mmss } from '../../lib/data';
import { SectionTitle } from '../ui-kit';
import SafeImg from '../SafeImg';
import CoachCard from '../CoachCard';

const QUICK = [
  { to: '/bodyyar', i: Zap, t: 'بدن‌یار', s: 'برنامه هوشمند', tone: 'bg-primary text-primary-foreground' },
  { to: '/coaches', i: Users, t: 'مربیان', s: 'تأییدشده', tone: 'bg-accent text-accent-foreground' },
  { to: '/morshed', i: Headphones, t: 'مرشد', s: 'پادکست و موزیک', tone: 'bg-secondary text-primary' },
  { to: '/campaigns', i: Megaphone, t: 'کمپین‌ها', s: 'چالش و حامیان', tone: 'bg-secondary text-primary' },
  { to: '/rewards', i: Gift, t: 'پاداش‌ها', s: 'امتیاز خرج کن', tone: 'bg-secondary text-accent' },
  { to: '/messages', i: MessagesSquare, t: 'پیام‌ها', s: 'گفتگو با مربی', tone: 'bg-secondary text-accent' },
];

export function QuickAccess() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:gap-3">
      {QUICK.map((q, i) => (
        <motion.div key={q.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
          <Link to={q.to} className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition hover:-translate-y-0.5 hover:border-primary/40 md:p-4">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${q.tone}`}><q.i className="h-6 w-6" /></span>
            <span className="text-sm font-bold">{q.t}</span><span className="hidden text-[11px] text-muted-foreground sm:block">{q.s}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export function Campaigns({ items }: { items: Catalog['campaigns'] }) {
  // Campaigns with no placement set default to showing on Home.
  const shown = items.filter((c) => !c.placement.length || c.placement.includes('صفحه اصلی') || c.placement.includes('بنر برجسته'));
  if (!shown.length) return null;
  return (
    <section>
      <SectionTitle title="کمپین‌ها" sub="پیشنهادهای ویژه برندها و حامیان کایار" action={<Link to="/campaigns" className="text-sm text-primary">همه</Link>} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {[...shown].sort((a, b) => Number(b.placement.includes('بنر برجسته')) - Number(a.placement.includes('بنر برجسته'))).map((c) => (
          <Link to={`/campaigns/${c.id}`} key={c.id} className="relative aspect-[16/9] w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-border sm:w-[420px]">
            <SafeImg src={c.coverUrl} alt={c.title} className="absolute inset-0 h-full w-full object-cover" fallback={<div className="absolute inset-0 bg-gradient-to-br from-accent/60 to-primary/30" />} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              {c.brand && <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black text-primary-foreground">{c.brand}</span>}
              <div className="mt-2 text-lg font-black text-white">{c.title}</div>
              <div className="line-clamp-1 text-xs text-white/75">{c.description}</div>
              <span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">{c.ctaLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ForYou({ me }: { me?: Me }) {
  const p = me?.profile;
  const ready = p && p.goal && p.level;
  return (
    <Link to="/bodyyar" className="relative block overflow-hidden rounded-3xl bg-gradient-to-l from-accent to-[hsl(254_80%_45%)] p-6 text-accent-foreground">
      <Target className="absolute -left-6 -top-6 h-36 w-36 opacity-15" />
      <div className="relative">
        <div className="text-xs opacity-80">پیشنهاد ورزشی برای تو</div>
        {ready ? (
          <><div className="mt-1 text-xl font-black">برنامه {p.goal} · سطح {p.level}</div>
            <p className="mt-1 text-sm opacity-85">{p.equipment ? `با ${p.equipment}` : ''}{p.age ? ` · مناسب ${fa(p.age)} سالگی` : ''} — بدن‌یار برنامه هفتگی‌ات را می‌سازد.</p></>
        ) : (
          <><div className="mt-1 text-xl font-black">پروفایل بدنی‌ات را کامل کن</div><p className="mt-1 text-sm opacity-85">تا پیشنهادها بر اساس هدف، سطح و شرایط واقعی تو شخصی شوند.</p></>
        )}
        <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{ready ? 'دیدن برنامه' : 'تکمیل پروفایل'}<ArrowLeft className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

export function Challenges({ items, me }: { items: Catalog['challenges']; me?: Me }) {
  if (!items.length) return null;
  return (
    <section>
      <SectionTitle title="چالش‌های فعال" action={<Link to="/campaigns" className="text-sm text-primary">همه</Link>} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((c) => {
          const part = me?.participations.find((x) => x.challengeId === c.id);
          return (
            <Link to={c.campaignId ? `/campaigns/${c.campaignId}` : '/campaigns'} key={c.id} className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
              <div className="flex items-start justify-between gap-2"><div className="font-bold">{c.title}</div><span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">{fa(c.points)}+</span></div>
              <div className="mt-1 text-xs text-muted-foreground">هدف: {fa(c.target)} {c.unit}</div>
              <Progress value={part ? Math.min(100, (part.progress / Math.max(1, c.target)) * 100) : 0} className="mt-3 h-1.5" />
              <div className="mt-1 text-[11px] text-muted-foreground">{part ? (part.completed ? 'تکمیل شد 🎉' : `${fa(part.progress)} از ${fa(c.target)}`) : 'هنوز شرکت نکرده‌ای'}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CoachesRail({ items }: { items: Catalog['coaches'] }) {
  return (
    <section>
      <SectionTitle title="مربیان برتر" sub="مربیان تأییدشده کایار" action={<Link to="/coaches" className="text-sm text-primary">همه مربیان</Link>} />
      {items.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[...items].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4).map((c) => <CoachCard key={c.id} c={c} />)}</div>
        : <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">به‌زودی مربیان تأییدشده اینجا معرفی می‌شوند.</p>}
    </section>
  );
}

export function MorshedRail({ items }: { items: Catalog['audio'] }) {
  if (!items.length) return null;
  return (
    <section>
      <SectionTitle title="مرشد" sub="پادکست، آموزش و موزیک تمرین" action={<Link to="/morshed" className="text-sm text-primary">همه</Link>} />
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
        {items.slice(0, 8).map((a) => (
          <Link to={`/morshed/${a.id}`} key={a.id} className="group w-40 shrink-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              <SafeImg src={a.coverUrl} alt={a.title} className="h-full w-full object-cover" fallback={<div className="grid h-full place-items-center bg-gradient-to-br from-accent/40 to-primary/20"><Headphones className="h-8 w-8 text-primary" /></div>} />
              <span className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground opacity-90 transition group-hover:scale-110"><Play className="h-4 w-4" fill="currentColor" /></span>
            </div>
            <div className="mt-2 line-clamp-1 text-sm font-bold">{a.title}</div>
            <div className="text-[11px] text-muted-foreground">{a.category} · {mmss(a.durationSeconds)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function RewardsStrip({ items, points }: { items: Catalog['rewards']; points?: number }) {
  if (!items.length) return null;
  return (
    <section>
      <SectionTitle title="پاداش‌ها" sub={points !== undefined ? `امتیاز تو: ${fa(points)}` : 'با فعالیت امتیاز بگیر'} action={<Link to="/rewards" className="text-sm text-primary">فروشگاه پاداش</Link>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.slice(0, 4).map((r) => (
          <Link to="/rewards" key={r.id} className="rounded-2xl border border-border bg-card p-4">
            <Gift className="h-6 w-6 text-accent" /><div className="mt-3 line-clamp-1 font-bold">{r.title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-primary"><Coins className="h-3.5 w-3.5" />{fa(r.costPoints)} امتیاز</div>
            {points !== undefined && <Progress value={Math.min(100, (points / Math.max(1, r.costPoints)) * 100)} className="mt-2 h-1" />}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CoachCta() {
  return (
    <Link to="/coach/apply" className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary/25 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.18),transparent_60%)] p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary"><Megaphone className="h-6 w-6" /></span>
        <div><div className="text-lg font-black">مربی هستی؟ به کایار بپیوند</div><div className="text-sm text-muted-foreground">پروفایل حرفه‌ای، رزرو آنلاین و پنل مدیریت شاگردان</div></div></div>
      <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">درخواست همکاری</span>
    </Link>
  );
}
