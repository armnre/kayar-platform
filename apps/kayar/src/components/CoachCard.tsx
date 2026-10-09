import { Link } from 'react-router-dom';
import { Star, MapPin, Sparkles } from 'lucide-react';
import { Coach, fa } from '../lib/data';
import SafeImg from './SafeImg';

export function RatingBadge({ c }: { c: Pick<Coach, 'rating' | 'reviewCount'> }) {
  return c.reviewCount > 0
    ? <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{c.rating.toLocaleString('fa-IR')}<span className="text-muted-foreground">({fa(c.reviewCount)})</span></span>
    : <span className="flex items-center gap-1 text-accent"><Sparkles className="h-3.5 w-3.5" />مربی جدید</span>;
}

export default function CoachCard({ c }: { c: Coach }) {
  return (
    <Link to={`/coaches/${c.id}`} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_60px_-28px_hsl(var(--primary)/0.6)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          fallback={<div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/25 text-5xl font-black text-primary">{c.name[0]}</div>} />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur ${c.acceptingClients ? 'bg-primary/90 text-primary-foreground' : 'bg-background/70 text-muted-foreground'}`}>{c.acceptingClients ? 'پذیرش شاگرد' : 'تکمیل ظرفیت'}</span>
        {c.category && <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-1 text-[10px] backdrop-blur">{c.category}</span>}
      </div>
      <div className="-mt-10 relative flex flex-1 flex-col p-4">
        <div className="text-base font-black">{c.name}</div>
        <div className="line-clamp-1 text-xs text-muted-foreground">{c.title}</div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <RatingBadge c={c} />
          <span className="text-muted-foreground">{fa(c.yearsExperience)} سال سابقه</span>
          {c.city && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{c.city}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">{c.services.slice(0, 2).map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>)}</div>
      </div>
    </Link>
  );
}
