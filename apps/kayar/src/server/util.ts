export const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
export const ids = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);

/** Full years between a YYYY-MM-DD birth date and today (calendar-independent, UTC date parts). */
export function ageFrom(birth?: string | null, now = new Date()): number | null {
  if (!birth) return null;
  const b = new Date(birth.slice(0, 10) + 'T00:00:00Z');
  if (Number.isNaN(b.getTime())) return null;
  let a = now.getUTCFullYear() - b.getUTCFullYear();
  const m = now.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) a--;
  return a;
}
