import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCatalog, getMe, GetCatalogOutputType, GetMeOutputType } from 'zitejs/api';
import { useAuth } from 'zitejs/auth';

export type Catalog = GetCatalogOutputType;
export type Me = GetMeOutputType;
export type Coach = Catalog['coaches'][number];
export type Audio = Catalog['audio'][number];

export const useCatalog = () => useQuery({ queryKey: ['catalog'], queryFn: () => getCatalog({}), staleTime: 60_000 });

export function useMe() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['me', user?.id], queryFn: () => getMe({}), enabled: !!user });
}

export function useRefresh() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
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
