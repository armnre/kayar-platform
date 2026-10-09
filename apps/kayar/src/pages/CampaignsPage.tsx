import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { cn } from '@project/components/lib/utils';
import { useCatalog } from '../lib/data';
import { PageHeader, CardsSkeleton, Empty } from '../components/ui-kit';
import CampaignCard from '../components/campaigns/CampaignCard';
import RewardsPage from './RewardsPage';

export default function CampaignsPage() {
  const { data, isLoading } = useCatalog();
  const [cat, setCat] = useState('همه');
  const all = data?.campaigns ?? [];
  const cats = ['همه', ...new Set(all.map((c) => c.category).filter(Boolean))];
  const order = { live: 0, upcoming: 1, ended: 2 } as const;
  const list = all.filter((c) => cat === 'همه' || c.category === cat).sort((a, b) => order[a.phase ?? 'live'] - order[b.phase ?? 'live']);
  return (
    <div className="space-y-12">
      <div>
        <PageHeader title="کمپین‌های" accent="کایار" sub="با برندهای ورزشی همراه شو، در چالش‌ها شرکت کن و پاداش بگیر." />
        {cats.length > 2 && (
          <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm', cat === c ? 'border-primary bg-primary font-bold text-primary-foreground' : 'border-white/10 text-muted-foreground')}>{c}</button>)}
          </div>
        )}
        {isLoading ? <CardsSkeleton /> : list.length === 0 ? <Empty icon={Megaphone} title="در حال حاضر کمپینی نیست" text="به‌زودی کمپین‌های جدید این‌جا اعلام می‌شوند." /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CampaignCard key={c.id} c={c} />)}</div>
        )}
      </div>
      <RewardsPage embedded />
    </div>
  );
}
