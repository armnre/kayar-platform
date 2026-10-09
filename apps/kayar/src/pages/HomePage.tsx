import { AlertTriangle } from 'lucide-react';
import { Button } from '@project/components/ui/button';
import { useAuth } from 'zitejs/auth';
import { useCatalog, useMe } from '../lib/data';
import { CardsSkeleton, Empty } from '../components/ui-kit';
import HomeHero from '../components/home/HomeHero';
import { QuickAccess, Campaigns, ForYou, Challenges, CoachesRail, MorshedRail, RewardsStrip, CoachCta } from '../components/home/HomeSections';

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useCatalog();
  const me = useMe();
  return (
    <div className="space-y-10">
      <HomeHero />
      <QuickAccess />
      {isLoading ? <CardsSkeleton n={4} /> : isError || !data ? (
        <Empty icon={AlertTriangle} title="بارگذاری محتوا ناموفق بود" action={<Button variant="outline" onClick={() => refetch()}>تلاش دوباره</Button>} />
      ) : (
        <>
          <Campaigns items={data.campaigns} />
          {user && <ForYou me={me.data} />}
          <Challenges items={data.challenges} me={me.data} />
          <CoachesRail items={data.coaches} />
          <MorshedRail items={data.audio} />
          <RewardsStrip items={data.rewards} points={me.data?.profile.points} />
        </>
      )}
      <CoachCta />
    </div>
  );
}
