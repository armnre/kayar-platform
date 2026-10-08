import { useSyncExternalStore } from 'react';

/** Local session for the /app mobile experience (demo mode). */
export type MSession = {
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
};

const KEY = 'kayar.mobile.v1';
const listeners = new Set<() => void>();
let state: MSession = (() => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
})();

export function setSession(patch: Partial<MSession> | ((s: MSession) => Partial<MSession>)) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...p };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
export function resetSession() {
  state = { onboarded: true };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
export function useSession() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);
}
export const isLoggedIn = (s: MSession) => !!s.verified;

export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
export const toEn = (v: string) => v.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
