import { useSyncExternalStore } from 'react';

/**
 * Test-mode backend for features that normally need a real signed-in account
 * (challenges, rewards, chat). Everything lives in localStorage so it survives refresh
 * and is shared between tabs, and it's keyed by the test session phone so each test
 * account has its own points / progress / messages.
 */
export type DemoMsg = { id: string; from: 'user' | 'coach'; text: string; at: string };
export type DemoConv = { id: string; coachId: string; coachName: string; userPhone: string; userName: string; messages: DemoMsg[] };
type DemoState = {
  points: Record<string, number>;
  parts: Record<string, Record<string, { progress: number; completed: boolean }>>;
  redemptions: Record<string, { rewardId: string; code: string; at: string }[]>;
  convs: Record<string, DemoConv>;
};

const KEY = 'kayar.demo.data.v1';
export const START_POINTS = 500;
const empty: DemoState = { points: {}, parts: {}, redemptions: {}, convs: {} };
const load = (): DemoState => { try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return empty; } };
let st = load();
const ls = new Set<() => void>();
const save = (next: DemoState) => { st = next; localStorage.setItem(KEY, JSON.stringify(st)); ls.forEach((l) => l()); };
if (typeof window !== 'undefined') window.addEventListener('storage', (e) => { if (e.key === KEY) { st = load(); ls.forEach((l) => l()); } });

export const useDemo = () => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, () => st);
export const demoId = (phone?: string) => phone || 'guest';
export const pointsOf = (s: DemoState, who: string) => s.points[who] ?? START_POINTS;

export function demoChallenge(who: string, c: { id: string; target: number; points: number }, add?: number) {
  const cur = st.parts[who]?.[c.id];
  if (cur?.completed) return { awarded: 0 };
  const progress = Math.min(c.target, (cur?.progress ?? 0) + (add ?? 0));
  const completed = progress >= c.target;
  save({
    ...st,
    parts: { ...st.parts, [who]: { ...st.parts[who], [c.id]: { progress, completed } } },
    points: completed ? { ...st.points, [who]: pointsOf(st, who) + c.points } : st.points,
  });
  return { awarded: completed ? c.points : 0 };
}

export function demoRedeem(who: string, r: { id: string; costPoints: number; perUserLimit: number }) {
  const mine = (st.redemptions[who] ?? []).filter((x) => x.rewardId === r.id).length;
  if (r.perUserLimit > 0 && mine >= r.perUserLimit) throw new Error('سقف دریافت این جایزه برای شما پر شده است.');
  if (pointsOf(st, who) < r.costPoints) throw new Error('امتیاز کافی ندارید.');
  const code = `KY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  save({
    ...st,
    points: { ...st.points, [who]: pointsOf(st, who) - r.costPoints },
    redemptions: { ...st.redemptions, [who]: [...(st.redemptions[who] ?? []), { rewardId: r.id, code, at: new Date().toISOString() }] },
  });
  return { code };
}

/* ---------- chat ---------- */
const mid = () => Math.random().toString(36).slice(2, 10);
export function openConv(coach: { id: string; name: string }, user: { phone: string; name: string }) {
  const id = `${coach.id}__${user.phone}`;
  if (!st.convs[id]) {
    save({ ...st, convs: { ...st.convs, [id]: { id, coachId: coach.id, coachName: coach.name, userPhone: user.phone, userName: user.name, messages: [
      { id: mid(), from: 'coach', text: `سلام ${user.name || ''}! من ${coach.name} هستم. چطور می‌تونم کمکت کنم؟`, at: new Date().toISOString() },
    ] } } });
  }
  return id;
}
export function sendDemoMsg(convId: string, from: 'user' | 'coach', text: string) {
  const c = st.convs[convId];
  if (!c || !text.trim()) return;
  const m: DemoMsg = { id: mid(), from, text: text.trim(), at: new Date().toISOString() };
  save({ ...st, convs: { ...st.convs, [convId]: { ...c, messages: [...c.messages, m] } } });
}
