import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCatalog, getMe, challengeProgress, redeemReward, GetCatalogOutputType, GetMeOutputType } from 'zitejs/api';
import { useAuth } from 'zitejs/auth';
import { withDemo } from './demoCatalog';
import { demoChallenge, demoId, demoRedeem, pointsOf, useDemo } from './demo';
import { useSession } from '../mobile/store';

export type Catalog = GetCatalogOutputType;
export type Me = GetMeOutputType;
export type Coach = Catalog['coaches'][number];
export type Audio = Catalog['audio'][number];

/** Catalog from the database; empty sections (or a failed request) fall back to sample content so the UI stays testable. */
export const useCatalog = () => useQuery({
  queryKey: ['catalog'],
  queryFn: async () => { try { return withDemo(await getCatalog({})); } catch { return withDemo(undefined); } },
  staleTime: 60_000,
});

export function useMe() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['me', user?.id], queryFn: () => getMe({}), enabled: !!user });
}

export function useRefresh() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

type Ch = Catalog['challenges'][number];
type Rw = Catalog['rewards'][number];

/**
 * Points / challenge / reward actions. With a real account they hit the server;
 * otherwise (test mode) they run against the local demo store — never a redirect to sign-in.
 */
export function usePlay() {
  const { user } = useAuth();
  const me = useMe();
  const s = useSession();
  const demo = useDemo();
  const refresh = useRefresh();
  const who = demoId(s.phone);
  const real = !!user && !!me.data;
  const isDemoItem = (id: string) => id.startsWith('demo-');
  return {
    mode: real ? ('real' as const) : ('demo' as const),
    points: real ? me.data!.profile.points : pointsOf(demo, who),
    partOf: (id: string) => (real && !isDemoItem(id) ? me.data!.participations.find((p) => p.challengeId === id) : demo.parts[who]?.[id]),
    join: async (c: Ch, add?: number) => {
      const r = real && !isDemoItem(c.id) ? await challengeProgress({ challengeId: c.id, add }) : demoChallenge(who, c, add);
      if (r.awarded) toast.success(`تبریک! ${fa(r.awarded)} امتیاز گرفتی 🎉`); else toast.success(add ? 'پیشرفت ثبت شد' : 'به چالش پیوستی');
      if (real) refresh();
    },
    redeem: async (r: Rw) => {
      const { code } = real && !isDemoItem(r.id) ? await redeemReward({ rewardId: r.id }) : demoRedeem(who, r);
      toast.success('جایزه دریافت شد', { description: `کد شما: ${code}` });
      if (real) refresh();
    },
  };
}

export const fa = (n: number) => Math.round(n).toLocaleString('fa-IR');
export const toman = (n: number) => `${fa(n)} تومان`;
export const faDate = (iso: string | null | undefined, time = false) =>
  iso ? new Date(iso).toLocaleString('fa-IR', time ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }) : '—';
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function errMsg(e: unknown) {
  const x = e as { userFacingMessage?: string; message?: string };
  return x?.userFacingMessage || x?.message || 'خطایی رخ داد.';
}
