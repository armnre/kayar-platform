import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useAuth, loginWithRedirect } from 'zitejs/auth';
import { Button } from '@project/components/ui/button';
import Logo from '../components/Logo';
import LandingHero from '../components/landing/LandingHero';
import { Marquee, Features, Steps, FinalCta } from '../components/landing/LandingSections';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const start = () => navigate('/app');
  void user; void loginWithRedirect;

  return (
    <div dir="rtl" className="grain relative min-h-screen overflow-x-hidden">
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-right bg-gradient-to-l from-primary to-accent" />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[50rem]" />
      <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity }}
        className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-primary/15 blur-[140px]" />
      <motion.div animate={{ x: [0, -60, 0], y: [0, 60, 0] }} transition={{ duration: 22, repeat: Infinity }}
        className="pointer-events-none absolute left-0 top-60 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[140px]" />

      <header className="relative z-10 mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Logo />
        <Button onClick={start} className="rounded-full px-6 font-bold">{user ? 'ورود به اپ' : 'ورود / ثبت‌نام'}</Button>
      </header>
      <main className="relative z-10">
        <LandingHero onStart={start} />
        <Marquee />
        <Features />
        <Steps />
        <FinalCta onStart={start} />
      </main>
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false })} کایار — همراه ورزشی تو
      </footer>
    </div>
  );
}
