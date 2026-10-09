import { useSyncExternalStore } from 'react';

/**
 * Local (test-mode) session for the whole /app experience.
 * One session = one role. Real auth can replace this later without touching routes:
 * every route decision goes through `homeFor()` in ./auth.ts.
 */
export type Role = 'user' | 'coach' | 'admin';
export type CoachStatus = 'none' | 'pending' | 'approved' | 'changes' | 'rejected' | 'suspended';

export type CoachApp = {
  phone: string;
  name: string;
  category: string;
  city: string;
  bio: string;
  status: CoachStatus;
  adminNote?: string;
  updatedAt: number;
};

export type MSession = {
  role?: Role;
  phone?: string;
  verified?: boolean;
  name?: string;
  gender?: 'male' | 'female';
  birth?: string;
  goals?: string[];
  onboarded?: boolean; // saw intro slides
  bodyyarActive?: boolean;
  body?: { height: number; weight: number; age: number; gender: 'male' | 'female'; level: string; goal: string };
  chat?: { role: 'user' | 'assistant'; text: string; at: number }[];
  readNotifs?: string[];
  liked?: string[];
};

const KEY = 'kayar.mobile.v1';
const APPS_KEY = 'kayar.demo.coachApps.v1';
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const read = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') ?? d; } catch { return d; } };

let state: MSession = read<MSession>(KEY, {});
let apps: Record<string, CoachApp> = read<Record<string, CoachApp>>(APPS_KEY, {});

// Keep tabs in sync (e.g. admin approves in one tab, coach sees it in another).
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) state = read<MSession>(KEY, {});
    else if (e.key === APPS_KEY) apps = read<Record<string, CoachApp>>(APPS_KEY, {});
    else return;
    emit();
  });
}

export function setSession(patch: Partial<MSession> | ((s: MSession) => Partial<MSession>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
}
/**
 * Begin a session for one role. Switching role (or phone) starts clean so data from the
 * previous identity never leaks; the same athlete signing back in keeps their profile.
 */
export function startSession(role: Role, phone: string, verified: boolean) {
  const keep = roleOf(state) === role && state.phone === phone && role === 'user';
  state = keep ? { ...state, role, phone, verified } : { onboarded: true, role, phone, verified };
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
}
/** Sign out: the session is no longer verified (profile kept so the same person can sign back in; another phone/role starts clean via startSession). */
export function resetSession() {
  state = { ...state, verified: false, onboarded: true };
  localStorage.setItem(KEY, JSON.stringify(state));
  emit();
}
export function useSession() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);
}
export const isLoggedIn = (s: MSession) => !!s.verified;
/** Sessions created before roles existed are athletes. */
export const roleOf = (s: MSession): Role => s.role ?? 'user';

/* ---------- demo coach applications (shared by coach + admin on this device) ---------- */
export function useCoachApps() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => apps);
}
export function saveCoachApp(app: Omit<CoachApp, 'updatedAt'>) {
  apps = { ...apps, [app.phone]: { ...app, updatedAt: Date.now() } };
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  emit();
}
export function setCoachStatus(phone: string, status: CoachStatus, adminNote?: string) {
  const a = apps[phone];
  if (!a) return;
  saveCoachApp({ ...a, status, adminNote });
}
export const coachStatusOf = (phone: string | undefined, list: Record<string, CoachApp>): CoachStatus =>
  (phone && list[phone]?.status) || 'none';

export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
export const toEn = (v: string) => v.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
