import { useSyncExternalStore } from 'react';

/** Admin session (test mode): server-signed token kept in localStorage so refresh keeps you signed in. */
const KEY = 'kayar.admin.session.v1';
type S = { token: string; expiresAt: number } | null;

const read = (): S => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null') as S;
    return s && s.expiresAt > Date.now() ? s : null;
  } catch { return null; }
};
let cur: S = read();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export const adminToken = () => cur?.token ?? '';
export function setAdminSession(s: S) {
  cur = s;
  if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
  emit();
}
export function useAdminSession() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => cur);
}
/** Called when the server rejects the token. */
export function isAuthError(e: unknown) {
  return /UNAUTHORIZED|منقضی/.test(String((e as { message?: string })?.message ?? e));
}
