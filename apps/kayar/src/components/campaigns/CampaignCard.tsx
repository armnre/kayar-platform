import { Link } from 'react-router-dom';
import { CalendarDays, Megaphone } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import SafeImg from '../SafeImg';
import { Catalog, faDate } from '../../lib/data';

export type Campaign = Catalog['campaigns'][number];

export const daysLeft = (end: string | null) => (end ? Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000)) : null);

export function CampaignCover({ c, className }: { c: Campaign; className?: string }) {
  return <SafeImg src={c.coverUrl} alt={c.title} className={cn('object-cover', className)}
    fallback={<div className={cn('grid place-items-center bg-gradient-to-br from-primary/30 via-card to-accent/30', className)}><Megaphone className="h-10 w-10 text-primary" /></div>} />;
}

export function SponsorBadge({ c }: { c: Campaign }) {
  if (!c.brand) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] backdrop-blur">
      {c.sponsorLogoUrl && <img src={c.sponsorLogoUrl} alt="" className="h-4 w-4 rounded-full object-cover" />}با حمایت {c.brand}
    </span>
  );
}

export default function CampaignCard({ c, wide }: { c: Campaign; wide?: boolean }) {
  const d = daysLeft(c.endsOn);
  return (
    <Link to={`/campaigns/${c.id}`} className={cn('glass group block overflow-hidden rounded-2xl transition hover:border-primary/50', wide && 'w-72 shrink-0 snap-start md:w-80')}>
      <div className="relative">
        <CampaignCover c={c} className="h-36 w-full transition group-hover:scale-105" />
        <div className="absolute right-2 top-2"><SponsorBadge c={c} /></div>
      </div>
      <div className="p-4">
        {c.category && <div className="text-[11px] font-bold text-primary">{c.category}</div>}
        <div className="font-bold">{c.title}</div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{c.endsOn ? `تا ${faDate(c.endsOn)}` : 'بدون محدودیت زمانی'}</span>
          {d !== null && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-bold text-accent">{d.toLocaleString('fa-IR')} روز مانده</span>}
        </div>
      </div>
    </Link>
  );
}
