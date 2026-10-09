import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import MobileApp from './mobile/MobileApp';
import NotFoundPage from './pages/NotFoundPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import RewardsPage from './pages/RewardsPage';

/** Old web URLs → their single home inside /app (kept so bookmarks & shared links keep working). */
const LEGACY: [string, string][] = [
  ['/welcome', '/app'], ['/login', '/app/login'], ['/home', '/app/home'], ['/profile', '/app/profile'],
  ['/coaches', '/app/coaches'], ['/bodyyar', '/app/bodyyar'], ['/morshed', '/app/morshed'], ['/morshed/:id', '/app/morshed'],
  ['/messages', '/app/messages'], ['/messages/:id', '/app/messages'], ['/coach/dashboard', '/app/coach/dashboard'], ['/coach/messages', '/app/coach/messages'],
  ['/coach', '/app/coach'], ['/coach/login', '/app/coach/login'], ['/coach/apply', '/app/coach/apply'],
  ['/admin', '/app/admin'], ['/admin/login', '/app/admin/login'],
];

function CoachRedirect() {
  const { id } = useParams();
  return <Navigate to={`/app/coaches/${id}`} replace />;
}

/**
 * Top-level areas:
 *   /            public landing
 *   /app/*       the app — auth, athlete, coach and admin areas (see mobile/MobileApp.tsx)
 *   /campaigns, /rewards  public web pages for sponsored campaigns
 *   *            404
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<MobileApp />} />
        <Route element={<Layout />}>
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
        <Route path="/coaches/:id" element={<CoachRedirect />} />
        {LEGACY.map(([from, to]) => <Route key={from} path={from} element={<Navigate to={to} replace />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
