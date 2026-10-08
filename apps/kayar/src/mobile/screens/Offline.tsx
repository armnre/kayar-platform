import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { Lime } from '../kit';

export default function Offline({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[90svh] flex-col items-center justify-center px-6 text-center">
      <div className="relative grid h-40 w-40 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="absolute inset-0 rounded-full border border-accent/40" animate={{ scale: [0.6, 1.3], opacity: [0.8, 0] }} transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity }} />
        ))}
        <span className="grid h-24 w-24 place-items-center rounded-full bg-accent/15 text-accent shadow-[0_0_50px_hsl(var(--accent)/0.5)]"><WifiOff className="h-10 w-10" /></span>
      </div>
      <h1 className="mt-6 text-2xl font-black">اتصال اینترنت قطع است</h1>
      <p className="mt-3 text-sm text-muted-foreground">برای ادامه کار، به اینترنت متصل شوید.</p>
      <Lime onClick={onRetry} className="mt-8 max-w-xs">تلاش مجدد</Lime>
      <p className="mt-3 text-xs text-muted-foreground">لطفاً بعداً دوباره امتحان کنید</p>
    </div>
  );
}
