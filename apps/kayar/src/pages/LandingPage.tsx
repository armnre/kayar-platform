import { motion, useScroll, useSpring } from 'framer-motion';
import InstallSection from '../components/landing/InstallSection';
import LandingHero, { LandingNav } from '../components/landing/LandingHero';
import HowItWorks from '../components/landing/HowItWorks';
import MorshedSection from '../components/landing/MorshedSection';
import ShopSection from '../components/landing/ShopSection';
import MiniPlayer from '../components/morshed/MiniPlayer';
import { BodyYarSection, CoachesSection, FinalCta, Footer, CampaignsSection } from '../components/landing/LandingSections';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div dir="rtl" className="relative min-h-[100dvh] overflow-x-clip">
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-right bg-primary" />
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[50rem]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[140px]" />
      <LandingNav />
      <main className="relative space-y-8 px-3 md:space-y-12 md:px-4">
        <LandingHero />
        <HowItWorks />
        <BodyYarSection />
        <CoachesSection />
        <MorshedSection />
        <CampaignsSection />
        <ShopSection />
        <InstallSection />
        <FinalCta />
      </main>
      <Footer />
      <MiniPlayer className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] md:left-auto md:right-4 md:w-[400px]" />
    </div>
  );
}
