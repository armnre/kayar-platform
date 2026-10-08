import { ReactNode, useState } from 'react';

/** Image that swaps to a themed fallback when the URL is empty or fails to load. */
export default function SafeImg({ src, alt, className, fallback }: { src?: string; alt: string; className?: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}
