import { cn } from '@project/components/lib/utils';
import SafeImg from '../SafeImg';
import { Audio } from '../../lib/data';

export const FALLBACK_COVER = 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/xzi7aaogb719ssbKSRudkS/img_vG6Ea8C5fwnM0YqP.jpg';

export default function Cover({ a, className }: { a: Pick<Audio, 'coverUrl' | 'title'>; className?: string }) {
  const cls = cn('object-cover', className);
  return <SafeImg src={a.coverUrl} alt={a.title} className={cls} fallback={<img src={FALLBACK_COVER} alt={a.title} className={cls} />} />;
}
