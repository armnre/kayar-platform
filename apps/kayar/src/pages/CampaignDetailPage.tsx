import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, ExternalLink, Gift, Megaphone, Trophy } from 'lucide-react';
import { trackCampaignView } from 'zitejs/api';
import { Button } from '@project/components/ui/button';
import { Skeleton } from '@project/components/ui/skeleton';
import { useCatalog, usePlay, faDate } from '../lib/data';
import { Empty, SectionTitle } from '../components/ui-kit';
import { CampaignCover, SponsorBadge, PhaseBadge, daysLeft } from '../components/campaigns/CampaignCard';
import { useBase } from '../lib/base';
import { ChallengeCard, RewardCard } from './RewardsPage';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useCatalog();
  const play = usePlay();
  const base = useBase();
  useEffect(() => { if (id && !id.startsWith('demo-')) trackCampaignView({ campaignId: id }).catch(() => {}); }, [id]);
  if (isLoading) return <Skeleton className="h-[30rem] rounded-3xl" />;
  const c = data?.campaigns.find((x) => x.id === id);
  if (!c) return <Empty icon={Megaphone} title="این کمپین فعال نیست یا پیدا نشد" action={<Button asChild variant="outline"><Link to={`${base}/campaigns`}>همه کمپین‌ها</Link></Button>} />;
  const challenges = data!.challenges.filter((x) => x.campaignId === c.id);
  const rewards = data!.rewards.filter((r) => r.campaignId === c.id);
  const d = daysLeft(c.endsOn);
  const points = play.points;

  return (
    <div className="space-y-10">
      <Link to={`${base}/campaigns`} className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowRight className="h-4 w-4" />کمپین‌ها</Link>
      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <CampaignCover c={c} className="h-72 w-full md:h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <SponsorBadge c={c} />
          <h1 className="mt-3 text-3xl font-black md:text-4xl">{c.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{c.startsOn ? faDate(c.startsOn) : 'هم‌اکنون'} تا {c.endsOn ? faDate(c.endsOn) : 'اطلاع ثانوی'}</span>
            {c.phase === 'live' && d !== null && <span className="rounded-full bg-accent/20 px-2 py-0.5 font-bold text-accent">{d.toLocaleString('fa-IR')} روز مانده</span>}
            <PhaseBadge c={c} />
          </div>
          {c.phase === 'live' ? <Button asChild className="mt-5 rounded-full px-8 font-bold"><a href="#join">{c.ctaLabel}</a></Button>
            : <p className="mt-5 text-sm text-muted-foreground">{c.phase === 'upcoming' ? `این کمپین از ${faDate(c.startsOn)} شروع می‌شود.` : 'این کمپین به پایان رسیده است.'}</p>}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <p className="whitespace-pre-line leading-8 text-muted-foreground">{c.description}</p>
        <aside className="glass h-fit space-y-3 rounded-2xl p-5 text-sm">
          <div className="font-bold">شرایط شرکت</div>
          <p className="whitespace-pre-line text-xs leading-6 text-muted-foreground">{c.terms || 'عضویت در کایار و ثبت فعالیت در چالش‌های کمپین.'}</p>
          {c.sponsorWebsite && <a href={c.sponsorWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary">وب‌سایت حامی<ExternalLink className="h-3 w-3" /></a>}
        </aside>
      </div>
      <section id="join">
        <SectionTitle title="چالش‌های کمپین" sub="پیشرفتت در سرور ثبت و بررسی می‌شود؛ امتیاز فقط یک‌بار پس از تکمیل داده می‌شود." />
        {c.phase !== 'live' ? <Empty icon={Trophy} title={c.phase === 'upcoming' ? 'چالش‌ها با شروع کمپین فعال می‌شوند' : 'شرکت در این کمپین بسته شده است'} /> : challenges.length === 0 ? <Empty icon={Trophy} title="چالشی برای این کمپین تعریف نشده" /> : (
          <div className="grid gap-3 md:grid-cols-2">{challenges.map((x) => <ChallengeCard key={x.id} c={x} part={play.partOf(x.id)} />)}</div>
        )}
      </section>
      {rewards.length > 0 && (
        <section>
          <SectionTitle title="پاداش‌های کمپین" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{rewards.map((r) => <RewardCard key={r.id} r={r} points={points} />)}</div>
        </section>
      )}
      {rewards.length === 0 && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Gift className="h-4 w-4" />امتیازهای این کمپین را می‌توانی در <Link to={`${base}/campaigns`} className="text-primary">فروشگاه جوایز</Link> خرج کنی.</p>}
    </div>
  );
}
