import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, ChevronLeft, Gift, Headphones, MessageCircle, Megaphone, Play, Star, Trophy, Users, Zap } from 'lucide-react';
import { Skeleton } from '@project/components/ui/skeleton';
import SafeImg from '../../../components/SafeImg';
import { CampaignCover, PhaseBadge, SponsorBadge, daysLeft, daysUntil, type Campaign } from '../../../components/campaigns/CampaignCard';
import { Catalog, fa, faDate, mmss, usePlay } from '../../../lib/data';

function Head({ title, to, cta = 'همه' }: { title: string; to?: string; cta?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-black">{title}</h2>
      {to && <Link to={to} className="flex items-center gap-0.5 text-xs font-bold text-primary">{cta}<ChevronLeft className="h-4 w-4" /></Link>}
    </div>
  );
}

function Empty({ icon: I, text, to, cta }: { icon: typeof Megaphone; text: string; to?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-white/10 px-6 py-8 text-center">
      <I className="h-7 w-7 text-muted-foreground" /><p className="text-sm text-muted-foreground">{text}</p>
      {to && <Link to={to} className="text-xs font-bold text-primary">{cta}</Link>}
    </div>
  );
}

/** Featured campaign — the visual anchor of Home. */
export function HomeHero({ c, loading }: { c?: Campaign; loading: boolean }) {
  if (loading) return <Skeleton className="h-[22rem] rounded-[2rem]" />;
  if (!c) return <Empty icon={Megaphone} text="فعلاً کمپین ویژه‌ای در جریان نیست. به‌زودی برمی‌گردیم!" />;
  const d = c.phase === 'live' ? daysLeft(c.endsOn) : c.phase === 'upcoming' ? daysUntil(c.startsOn) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <Link to={`/app/campaigns/${c.id}`} className="group relative block h-[22rem] overflow-hidden rounded-[2rem] border border-white/10">
        <CampaignCover c={c} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-bold text-primary backdrop-blur">کمپین ویژه</span>
          <PhaseBadge c={c} />
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
          <SponsorBadge c={c} />
          <h2 className="text-[1.65rem] font-black leading-tight">{c.title}</h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />{d !== null ? `${fa(d)} روز ${c.phase === 'upcoming' ? 'تا شروع' : 'مانده'}` : c.phase === 'ended' ? 'پایان‌یافته' : 'بدون محدودیت'}
            </span>
            <span className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.8)]">{c.ctaLabel}<ArrowLeft className="h-4 w-4" /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HomeQuickActions() {
  const items = [
    { to: '/app/bodyyar', l: 'بدن‌یار', i: Zap, hi: true },
    { to: '/app/coaches', l: 'مربی‌ها', i: Users },
    { to: '/app/rewards', l: 'جوایز', i: Gift },
    { to: '/app/messages', l: 'پیام‌ها', i: MessageCircle },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((x) => (
        <Link key={x.to} to={x.to} className="flex flex-col items-center gap-2 text-[11px] font-bold">
          <span className={`grid h-14 w-14 place-items-center rounded-2xl border transition active:scale-95 ${x.hi ? 'border-primary/40 bg-primary text-primary-foreground' : 'border-white/10 bg-card'}`}><x.i className="h-6 w-6" /></span>{x.l}
        </Link>
      ))}
    </div>
  );
}

export function HomeCampaignRail({ list, loading }: { list: Campaign[]; loading: boolean }) {
  if (loading) return <Skeleton className="h-40 rounded-3xl" />;
  if (!list.length) return null;
  return (
    <section>
      <Head title="کمپین‌های دیگر" to="/app/campaigns" />
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5">
        {list.map((c) => (
          <Link key={c.id} to={`/app/campaigns/${c.id}`} className={`relative h-40 w-60 shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 ${c.phase === 'ended' ? 'opacity-60' : ''}`}>
            <CampaignCover c={c} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            <PhaseBadge c={c} className="absolute left-3 top-3" />
            <div className="absolute inset-x-0 bottom-0 p-3"><div className="text-[11px] text-primary">{c.brand}</div><div className="font-bold leading-6">{c.title}</div>
              {c.phase === 'upcoming' && c.startsOn && <div className="text-[11px] text-muted-foreground">شروع {faDate(c.startsOn)}</div>}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HomeChallenges({ list }: { list: Catalog['challenges'] }) {
  const play = usePlay();
  const top = list.slice(0, 2);
  return (
    <section>
      <Head title="چالش‌های تو" to="/app/rewards" />
      {top.length === 0 ? <Empty icon={Trophy} text="فعلاً چالش فعالی نیست." /> : (
        <div className="space-y-3">
          {top.map((c) => {
            const p = play.partOf(c.id);
            const pct = p ? Math.round((p.progress / Math.max(1, c.target)) * 100) : 0;
            return (
              <Link key={c.id} to="/app/rewards" className="block rounded-3xl border border-white/10 bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/20"><Trophy className="h-5 w-5 text-accent" /></span>
                  <div className="flex-1"><div className="text-sm font-bold">{c.title}</div><div className="text-[11px] text-muted-foreground">{fa(c.points)} امتیاز · هدف {fa(c.target)} {c.unit}</div></div>
                  <span className="text-xs font-black text-primary">{p ? (p.completed ? 'تکمیل' : `${fa(pct)}٪`) : 'شرکت'}</span>
                </div>
                {p && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function HomeCoaches({ list, loading }: { list: Catalog['coaches']; loading: boolean }) {
  if (loading) return <Skeleton className="h-44 rounded-3xl" />;
  return (
    <section>
      <Head title="مربیان منتخب" to="/app/coaches" />
      {list.length === 0 ? <Empty icon={Users} text="هنوز مربی تأییدشده‌ای نداریم." /> : (
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
          {list.slice(0, 8).map((c) => (
            <Link key={c.id} to={`/app/coaches/${c.id}`} className="w-36 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-card">
              <SafeImg src={c.avatarUrl} alt={c.name} className="h-32 w-full object-cover" fallback={<div className="grid h-32 place-items-center bg-gradient-to-br from-accent/30 to-card text-3xl font-black">{c.name.slice(0, 1)}</div>} />
              <div className="p-3"><div className="truncate text-sm font-bold">{c.name}</div><div className="truncate text-[11px] text-muted-foreground">{c.title}</div>
                {c.rating > 0 && <div className="mt-1 flex items-center gap-1 text-[11px]"><Star className="h-3 w-3 fill-primary text-primary" />{c.rating.toLocaleString('fa-IR')}</div>}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function HomeMorshed({ list }: { list: Catalog['audio'] }) {
  const a = list.find((x) => x.featured) ?? list[0];
  return (
    <section className="pb-2">
      <Head title="مرشد" to="/app/morshed" cta="کتابخانه" />
      {!a ? <Empty icon={Headphones} text="محتوای صوتی هنوز منتشر نشده است." /> : (
        <Link to={`/app/morshed/${a.id}`} className="flex items-center gap-3 rounded-3xl border border-accent/30 bg-gradient-to-l from-accent/20 to-transparent p-4">
          <SafeImg src={a.coverUrl} alt={a.title} className="h-14 w-14 rounded-2xl object-cover" fallback={<span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/30"><Headphones className="h-6 w-6" /></span>} />
          <div className="min-w-0 flex-1"><div className="text-[11px] text-muted-foreground">{a.category} · {mmss(a.durationSeconds)}</div><div className="truncate font-bold">{a.title}</div></div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"><Play className="h-4 w-4" fill="currentColor" /></span>
        </Link>
      )}
    </section>
  );
}
