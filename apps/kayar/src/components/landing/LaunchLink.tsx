import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/** Link into the app that plays a short "app opening" animation before navigating. */
export default function LaunchLink({ to = '/app', className, children }: { to?: string; className?: string; children: ReactNode }) {
  const nav = useNavigate();
  const [go, setGo] = useState(false);
  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    if (go) return;
    setGo(true);
    setTimeout(() => nav(to), 900);
  };
  return (
    <>
      <a href={to} onClick={open} className={className}>{children}</a>
      {createPortal(
        <AnimatePresence>
          {go && (
            <motion.div initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(150% at 50% 50%)' }} transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
              className="fixed inset-0 z-[100] grid place-items-center bg-[#050505]">
              <motion.div animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute h-40 w-40 rounded-full border-2 border-primary" />
              <svg viewBox="0 0 100 160" className="relative h-24 w-16">
                <motion.path d="M60 2 L18 88 L46 88 L32 158 L84 62 L54 62 L72 2 Z" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinejoin="round"
                  initial={{ pathLength: 0, fill: 'hsl(var(--primary) / 0)' }} animate={{ pathLength: 1, fill: 'hsl(var(--primary) / 1)' }}
                  transition={{ pathLength: { duration: 0.6, delay: 0.2 }, fill: { delay: 0.7, duration: 0.2 } }} style={{ filter: 'drop-shadow(0 0 16px hsl(var(--primary)))' }} />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
