import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import MobileApp from './mobile/MobileApp';
import NotFoundPage from './pages/NotFoundPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import RewardsPage from './pages/RewardsPage';
import AdminApp from './admin/AdminApp';
import { PlayerProvider } from './lib/player';
import RouteErrorBoundary from './components/RouteErrorBoundary';

// index.html is platform-owned, so Persian/RTL and full-bleed (safe-area) viewport are applied at startup.
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.documentElement.classList.add('dark');
  if (document.title === 'Zite App') document.title = 'کایار | سوپر اپ ورزشی';
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && !vp.getAttribute('content')?.includes('viewport-fit')) vp.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
  if (!document.querySelector('meta[name="theme-color"]')) {
    const m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#1B1E21'; document.head.appendChild(m);
  }
}

/** Old web URLs → their single home inside /app (kept so bookmarks & shared links keep working). */
const LEGACY: [string, string][] = [
  ['/welcome', '/app'], ['/login', '/app/login'], ['/home', '/app/home'], ['/profile', '/app/profile'],
  ['/coaches', '/app/coaches'], ['/bodyyar', '/app/bodyyar'], ['/morshed', '/app/morshed'],
  ['/messages', '/app/messages'], ['/coach/dashboard', '/app/coach/dashboard'], ['/coach/messages', '/app/coach/messages'],
  ['/coach', '/app/coach'], ['/coach/login', '/app/coach/login'], ['/coach/apply', '/app/coach/apply'],
  ['/app/admin', '/admin'], ['/app/admin/login', '/admin/login'],
];

/** Legacy detail URLs: keep the id (and query string) when moving into /app. */
function WithId({ to }: { to: string }) {
  const { id } = useParams();
  return <Navigate to={`${to}/${encodeURIComponent(id ?? '')}${window.location.search}`} replace />;
}

/**
 * Top-level areas:
 *   /            public landing
 *   /admin/*     admin panel (own username/password login)
 *   /app/*       the app — auth, athlete and coach areas (see mobile/MobileApp.tsx)
 *   /campaigns, /rewards  public web pages for sponsored campaigns
 *   *            404
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <PlayerProvider>
      <RouteErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/app/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="/app/*" element={<MobileApp />} />
        <Route element={<Layout />}>
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
        <Route path="/coaches/:id" element={<WithId to="/app/coaches" />} />
        <Route path="/messages/:id" element={<WithId to="/app/messages" />} />
        <Route path="/morshed/:id" element={<WithId to="/app/morshed" />} />
        {LEGACY.map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </RouteErrorBoundary>
      </PlayerProvider>
    </BrowserRouter>
    </MotionConfig>
  );
}
