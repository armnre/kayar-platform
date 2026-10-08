import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '@project/components/ui/badge';
import { Coach, fa } from '../lib/data';
import SafeImg from './SafeImg';

export default function CoachCard({ c }: { c: Coach }) {
  return (
    <Link to={`/coaches/${c.id}`} className="glass group flex flex-col items-center rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:border-primary/40">
      <div className="relative">
        <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary ring-offset-4 ring-offset-card md:h-24 md:w-24">
          <SafeImg src={c.avatarUrl} alt={c.name} className="h-full w-full object-cover"
            fallback={<div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/25 to-accent/25 text-3xl font-black text-primary">{c.name[0]}</div>} />
        </div>
      </div>
      <div className="mt-4 font-bold">{c.name}</div>
      <div className="line-clamp-1 text-xs text-muted-foreground">{c.title}</div>
      <div className="mt-2 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" />{c.rating.toLocaleString('fa-IR')}
        <span className="text-xs text-muted-foreground">({fa(c.reviewCount)}) · {fa(c.yearsExperience)} سال</span></div>
      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {c.specialties.slice(0, 2).map((s) => <Badge key={s} variant="secondary" className="rounded-full text-[10px]">{s}</Badge>)}
      </div>
      <div className="mt-4 w-full rounded-full bg-primary/10 py-2 text-xs font-bold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">مشاهده پروفایل</div>
    </Link>
  );
}
