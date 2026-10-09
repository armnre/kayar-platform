import { Navigate, useLocation } from 'react-router-dom';
import { CoachApp, CoachStatus, MSession, Role, coachStatusOf, isLoggedIn, roleOf, useCoachApps, useSession } from './store';

/**
 * Single source of truth for routing decisions.
 * Role comes from the session (`roleOf`), coach status from the shared applications store (`coachStatusOf`).
 * Every guard below reads only these two, so they can never disagree.
 */
export const LOGIN_FOR: Record<Role, string> = { user: '/app/login', coach: '/app/coach/login', admin: '/app/admin/login' };

export type CoachPage = 'dashboard' | 'apply' | 'status' | 'messages';
/** Which coach pages each status may open. The FIRST entry is that status's home. */
export const COACH_PAGES: Record<CoachStatus, CoachPage[]> = {
  none: ['apply'],
  changes: ['apply'],
  pending: ['status', 'apply'],
  rejected: ['status', 'apply'],
  suspended: ['status'],
  approved: ['dashboard', 'messages'],
};
export const coachHome = (status: CoachStatus) => `/app/coach/${COACH_PAGES[status][0]}`;

export function homeFor(s: MSession, apps: Record<string, CoachApp>): string {
  if (!isLoggedIn(s)) return s.onboarded ? '/app/login' : '/app/welcome';
  const role = roleOf(s);
  if (role === 'admin') return '/app/admin';
  if (role === 'coach') return coachHome(coachStatusOf(s.phone, apps));
  return s.name ? '/app/home' : '/app/complete-profile';
}

const AUTH_SCREENS = /^\/app\/(login|verify|welcome|coach\/login|admin\/login)(\/|\?|$)/;
/** Only internal /app paths of the same role are allowed as post-login targets (blocks open redirects + loops to auth screens). */
export function safeNext(next: string | null, role: Role): string | null {
  if (!next || !next.startsWith('/app/') || next.startsWith('//') || AUTH_SCREENS.test(next)) return null;
  const area: Role = /^\/app\/coach(\/|$)/.test(next) ? 'coach' : /^\/app\/admin(\/|$)/.test(next) ? 'admin' : 'user';
  return area === role ? next : null;
}

/**
 * Route guard: renders children only for the given role.
 * - signed out → that role's own login, remembering where they were going
 * - signed in with another role → their own home (never another panel)
 */
export function RequireRole({ role, children, needsName = false }: { role: Role; children: JSX.Element; needsName?: boolean }) {
  const s = useSession();
  const apps = useCoachApps();
  const loc = useLocation();
  if (!isLoggedIn(s)) return <Navigate to={`${LOGIN_FOR[role]}?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  if (roleOf(s) !== role) return <Navigate to={homeFor(s, apps)} replace />;
  if (needsName && !s.name) return <Navigate to="/app/complete-profile" replace />;
  return children;
}

/** Coach sub-pages: a page the current status may not open → that status's home (always an allowed page, so no loops). */
export function RequireCoachPage({ page, children }: { page: CoachPage; children: JSX.Element }) {
  const s = useSession();
  const apps = useCoachApps();
  const status = coachStatusOf(s.phone, apps);
  if (!COACH_PAGES[status].includes(page)) return <Navigate to={coachHome(status)} replace />;
  return children;
}

/**
 * For login screens. Signed in with the SAME role → straight to their home.
 * Signed in with a different role → show the form so they can switch accounts (signing in replaces the session).
 */
export function RedirectIfSignedIn({ role, children }: { role: Role; children: JSX.Element }) {
  const s = useSession();
  const apps = useCoachApps();
  const loc = useLocation();
  if (isLoggedIn(s) && roleOf(s) === role) {
    const next = role === 'user' && !s.name ? null : safeNext(new URLSearchParams(loc.search).get('next'), role);
    return <Navigate to={next ?? homeFor(s, apps)} replace />;
  }
  return children;
}
