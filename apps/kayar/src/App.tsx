import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CoachesPage from './pages/CoachesPage';
import CoachDetailPage from './pages/CoachDetailPage';
import BodyYarPage from './pages/BodyYarPage';
import MorshedPage from './pages/MorshedPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/coaches/:id" element={<CoachDetailPage />} />
          <Route path="/bodyyar" element={<BodyYarPage />} />
          <Route path="/morshed" element={<MorshedPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
