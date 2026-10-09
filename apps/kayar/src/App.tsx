import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import WelcomePage from './pages/WelcomePage';
import MobileApp from './mobile/MobileApp';
import HomePage from './pages/HomePage';
import CoachesPage from './pages/CoachesPage';
import CoachDetailPage from './pages/CoachDetailPage';
import BodyYarPage from './pages/BodyYarPage';
import MorshedPage from './pages/MorshedPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import MessagesPage from './pages/MessagesPage';
import CoachApplyPage from './pages/CoachApplyPage';
import CoachPanelPage from './pages/CoachPanelPage';
import CoachLoginPage from './pages/CoachLoginPage';
import CoachLayout from './components/coach/CoachLayout';
import MorshedDetailPage from './pages/MorshedDetailPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/app/*" element={<MobileApp />} />
        <Route path="/coach/login" element={<CoachLoginPage />} />
        <Route element={<CoachLayout />}>
          <Route path="/coach" element={<CoachPanelPage />} />
          <Route path="/coach/apply" element={<CoachApplyPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/coaches/:id" element={<CoachDetailPage />} />
          <Route path="/bodyyar" element={<BodyYarPage />} />
          <Route path="/morshed" element={<MorshedPage />} />
          <Route path="/morshed/:id" element={<MorshedDetailPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:id" element={<MessagesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
