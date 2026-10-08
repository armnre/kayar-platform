import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@project/components/ui/sonner';
import { useSession, isLoggedIn } from './store';
import BottomNav from './BottomNav';
import SplashScreen from './screens/SplashScreen';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Verify from './screens/Verify';
import CompleteProfile from './screens/CompleteProfile';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';
import Notifications from './screens/Notifications';
import NotFound from './screens/NotFound';
import Offline from './screens/Offline';
import BodyYarEntry from './screens/BodyYarEntry';
import QrScan from './screens/QrScan';
import Activation from './screens/Activation';
import BodyWizard from './screens/BodyWizard';
import Analysis from './screens/Analysis';
import BodyChat from './screens/BodyChat';
import Explore from './screens/Explore';

function Guard({ children }: { children: JSX.Element }) {
  const s = useSession();
  if (!isLoggedIn(s)) return <Navigate to="/app/login" replace />;
  if (!s.name) return <Navigate to="/app/complete-profile" replace />;
  return children;
}

const TABS = ['/app/home', '/app/profile', '/app/morshed', '/app/coaches', '/app/bodyyar'];

export default function MobileApp() {
  const loc = useLocation();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  const showNav = TABS.includes(loc.pathname);

  return (
    <div dir="rtl" className="min-h-screen bg-[#050505] md:grid md:place-items-center md:py-8">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-background md:min-h-[860px] md:rounded-[2.75rem] md:border md:border-white/10 md:shadow-[0_40px_120px_-30px_hsl(var(--primary)/0.25)]">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <div className={`relative flex-1 overflow-y-auto ${showNav ? 'pb-28' : ''}`}>
          {!online ? <Offline onRetry={() => setOnline(navigator.onLine)} /> : (
            <AnimatePresence mode="wait">
              <Routes location={loc} key={loc.pathname}>
                <Route index element={<SplashScreen />} />
                <Route path="welcome" element={<Onboarding />} />
                <Route path="login" element={<Login />} />
                <Route path="verify" element={<Verify />} />
                <Route path="complete-profile" element={<CompleteProfile />} />
                <Route path="home" element={<Guard><Dashboard /></Guard>} />
                <Route path="profile" element={<Guard><Profile /></Guard>} />
                <Route path="notifications" element={<Guard><Notifications /></Guard>} />
                <Route path="morshed" element={<Guard><Explore kind="morshed" /></Guard>} />
                <Route path="coaches" element={<Guard><Explore kind="coaches" /></Guard>} />
                <Route path="bodyyar" element={<Guard><BodyYarEntry /></Guard>} />
                <Route path="bodyyar/scan" element={<Guard><QrScan /></Guard>} />
                <Route path="bodyyar/activate" element={<Guard><Activation /></Guard>} />
                <Route path="bodyyar/profile" element={<Guard><BodyWizard /></Guard>} />
                <Route path="bodyyar/analysis" element={<Guard><Analysis /></Guard>} />
                <Route path="bodyyar/chat" element={<Guard><BodyChat /></Guard>} />
                <Route path="offline" element={<Offline onRetry={() => history.back()} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          )}
        </div>
        {showNav && online && <BottomNav />}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
