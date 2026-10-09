import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@project/components/ui/sonner';
import { RequireRole, RedirectIfSignedIn, RequireCoachPage } from './auth';
import type { Role } from './store';
import { toFa } from './store';
import BottomNav from './BottomNav';
import SplashScreen from './screens/SplashScreen';
import Onboarding from './screens/Onboarding';
import Login from './screens/Login';
import Verify from './screens/Verify';
import RoleLogin from './screens/RoleLogin';
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
import MorshedScreen from './screens/MorshedScreen';
import CoachesScreen from './screens/CoachesScreen';
import CoachDetail from './screens/CoachDetail';
import CoachShell, { CoachIndex } from './screens/coach/CoachShell';
import { Inbox, Thread } from './screens/Messages';
import CoachApply from './screens/coach/CoachApply';
import CoachStatusScreen from './screens/coach/CoachStatusScreen';
import CoachDashboard from './screens/coach/CoachDashboard';
import AdminHome from './screens/admin/AdminHome';

/** Test admin account. Only this number can open the admin area. */
export const TEST_ADMIN_PHONE = '9120000000';

const TABS = ['/app/home', '/app/profile', '/app/morshed', '/app/coaches', '/app/bodyyar'];
const U = (el: JSX.Element) => <RequireRole role="user" needsName>{el}</RequireRole>;
const Guest = (el: JSX.Element, role: Role = 'user') => <RedirectIfSignedIn role={role}>{el}</RedirectIfSignedIn>;

/**
 * Route map (all under /app):
 *   index ............ splash → resolves session + role → home of that role
 *   public/auth ...... welcome, login, verify, coach/login, admin/login, offline
 *   user ............. complete-profile, home, profile, notifications, morshed, coaches[/:id], bodyyar/*
 *   coach ............ coach (→ by status), coach/dashboard, coach/apply, coach/status, coach/messages[/:id]
 *   (user also) ....... messages[/:id]
 *   admin ............ admin
 *   * ................ 404
 */
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
                <Route path="offline" element={<Offline onRetry={() => history.back()} />} />

                {/* auth */}
                <Route path="welcome" element={Guest(<Onboarding />)} />
                <Route path="login" element={Guest(<Login />)} />
                <Route path="verify" element={Guest(<Verify />)} />
                <Route path="coach/login" element={Guest(
                  <RoleLogin role="coach" badge="پرتال مربیان" title="ورود مربیان کایار"
                    intro="با شماره موبایل وارد شوید. اگر هنوز پرونده ندارید، پس از ورود فرم همکاری را می‌بینید." />, 'coach')} />
                <Route path="admin/login" element={Guest(
                  <RoleLogin role="admin" badge="مدیریت" title="ورود ادمین"
                    intro="فقط برای تیم کایار." allowPhone={(p) => p === TEST_ADMIN_PHONE}
                    footer={<div>حساب تست ادمین: <b dir="ltr">0{toFa(TEST_ADMIN_PHONE)}</b></div>} />, 'admin')} />

                {/* athlete */}
                <Route path="complete-profile" element={<RequireRole role="user"><CompleteProfile /></RequireRole>} />
                <Route path="home" element={U(<Dashboard />)} />
                <Route path="profile" element={U(<Profile />)} />
                <Route path="notifications" element={U(<Notifications />)} />
                <Route path="morshed" element={U(<MorshedScreen />)} />
                <Route path="morshed/:id" element={U(<MorshedScreen />)} />
                <Route path="coaches" element={U(<CoachesScreen />)} />
                <Route path="coaches/:id" element={U(<CoachDetail />)} />
                <Route path="bodyyar" element={U(<BodyYarEntry />)} />
                <Route path="bodyyar/scan" element={U(<QrScan />)} />
                <Route path="bodyyar/activate" element={U(<Activation />)} />
                <Route path="bodyyar/profile" element={U(<BodyWizard />)} />
                <Route path="bodyyar/analysis" element={U(<Analysis />)} />
                <Route path="bodyyar/chat" element={U(<BodyChat />)} />
                <Route path="messages" element={U(<Inbox side="user" />)} />
                <Route path="messages/:id" element={U(<Thread side="user" />)} />

                {/* coach */}
                <Route path="coach" element={<RequireRole role="coach"><CoachShell /></RequireRole>}>
                  <Route index element={<CoachIndex />} />
                  <Route path="dashboard" element={<RequireCoachPage page="dashboard"><CoachDashboard /></RequireCoachPage>} />
                  <Route path="apply" element={<RequireCoachPage page="apply"><CoachApply /></RequireCoachPage>} />
                  <Route path="status" element={<RequireCoachPage page="status"><CoachStatusScreen /></RequireCoachPage>} />
                  <Route path="messages" element={<RequireCoachPage page="messages"><Inbox side="coach" /></RequireCoachPage>} />
                  <Route path="messages/:id" element={<RequireCoachPage page="messages"><Thread side="coach" /></RequireCoachPage>} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* admin */}
                <Route path="admin" element={<RequireRole role="admin"><AdminHome /></RequireRole>} />

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
