import { motion, useScroll, useSpring } from 'framer-motion';
import InstallSection from '../components/landing/InstallSection';
import LandingHero, { LandingNav, ModuleCards } from '../components/landing/LandingHero';
import { BodyYarSection, CoachesSection, MorshedSection, ShopSection, FinalCta, Footer, CampaignsSection } from '../components/landing/LandingSections';

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
        <ModuleCards />
        <BodyYarSection />
        <CoachesSection />
        <CampaignsSection />
        <MorshedSection />
        <InstallSection />
        <ShopSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
