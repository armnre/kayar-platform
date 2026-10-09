import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Music, RefreshCw, ChevronLeft } from 'lucide-react';
import { useJamendo } from '../../lib/jamendo';
import { TrackRow, TrackRowsSkeleton } from '../morshed/TrackRow';

/** Landing Morshed: real Jamendo tracks (playable through the global player) + CTA into the app. */
export default function MorshedSection() {
  const j = useJamendo('', '');
  const tracks = j.tracks.slice(0, 6);
  return (
    <motion.section id="morshed" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      className="relative mx-auto max-w-7xl scroll-mt-20 overflow-hidden rounded-[2rem] border border-white/10 bg-card/60">
      <div className="grid lg:grid-cols-[1fr_1.25fr]">
        <div className="relative min-h-[260px] overflow-hidden">
          <img src="https://images.fillout.com/886978/vxifokrwnr/generated-images/cbdB6kJHZ9StPpLHYzZmd8/img_tqRVkqrDXZUKNjNp.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-accent/20 lg:bg-gradient-to-l" />
          <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Headphones className="h-6 w-6" /></span>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">مرشد</h2>
            <p className="mt-2 max-w-sm text-sm leading-7 text-white/75">تجربه شنیداری کایار: موزیک‌های مجاز از کاتالوگ Jamendo برای تمرین، و پادکست‌های کایار برای ذهن و انگیزه.</p>
            <Link to="/app/morshed" className="mt-5 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground">ورود به مرشد<ChevronLeft className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="p-4 md:p-8">
          <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>پرطرفدارهای این ماه</span><span className="text-[11px] font-normal text-muted-foreground">از Jamendo · Creative Commons</span></div>
          {j.isLoading ? <TrackRowsSkeleton n={5} />
            : j.isError && !tracks.length ? (
              <div className="grid min-h-[220px] place-items-center text-center">
                <div><Music className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /><p className="text-sm">فهرست موزیک فعلاً در دسترس نیست.</p>
                  <button onClick={() => j.refetch()} className="mx-auto mt-3 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold"><RefreshCw className="h-3.5 w-3.5" />تلاش مجدد</button></div>
              </div>
            ) : !tracks.length ? <p className="py-16 text-center text-sm text-muted-foreground">آهنگی برای نمایش پیدا نشد.</p>
            : <div className="space-y-1">{tracks.map((t, i) => <TrackRow key={t.id} t={t} queue={tracks} index={i} />)}</div>}
        </div>
      </div>
    </motion.section>
  );
}
