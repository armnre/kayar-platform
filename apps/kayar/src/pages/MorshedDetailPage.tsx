import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Bookmark, BookmarkCheck, Headphones, Lock, Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward } from 'lucide-react';
import { loginWithRedirect } from 'zitejs/auth';
import { Slider } from '@project/components/ui/slider';
import { Skeleton } from '@project/components/ui/skeleton';
import { Button } from '@project/components/ui/button';
import { cn } from '@project/components/lib/utils';
import { useCatalog, mmss } from '../lib/data';
import { usePlayer } from '../lib/player';
import { Empty } from '../components/ui-kit';
import Cover from '../components/morshed/Cover';
import { useSaved } from './MorshedPage';

const RATES = [0.75, 1, 1.25, 1.5, 2];

export default function MorshedDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useCatalog();
  const p = usePlayer();
  const { isSaved, toggle, progress } = useSaved();
  if (isLoading) return <Skeleton className="h-[32rem] rounded-3xl" />;
  const a = data?.audio.find((x) => x.id === id);
  if (!a) return <Empty icon={Headphones} title="این محتوا پیدا نشد" action={<Button asChild variant="outline"><Link to="/morshed">بازگشت به مرشد</Link></Button>} />;
  const related = (data?.audio ?? []).filter((x) => x.category === a.category);
  const isCur = p.current?.id === a.id;
  const t = isCur ? p.t : progress.get(a.id)?.positionSeconds ?? 0;
  const dur = isCur ? p.dur : a.durationSeconds;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link to="/morshed" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowRight className="h-4 w-4" />مرشد</Link>
      <div className="grid gap-8 md:grid-cols-[320px_1fr] md:items-center">
        <Cover a={a} className="mx-auto aspect-square w-full max-w-xs rounded-3xl shadow-2xl" />
        <div>
          <span className="text-xs font-bold text-primary">{a.category}{a.membersOnly && ' · ویژه اعضا'}</span>
          <h1 className="mt-1 text-3xl font-black">{a.title}</h1>
          <p className="mt-1 text-muted-foreground">{a.author}</p>
          {a.locked ? (
            <div className="glass mt-6 rounded-2xl p-5 text-center"><Lock className="mx-auto h-8 w-8 text-primary" /><p className="mt-2 text-sm">این محتوا مخصوص اعضای کایار است.</p>
              <Button className="mt-4 rounded-full px-8" onClick={() => loginWithRedirect()}>ورود / ثبت‌نام</Button></div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground" dir="ltr">
                <span className="w-10">{mmss(t)}</span>
                <Slider value={[t]} max={dur || 1} step={1} disabled={!isCur} onValueChange={([v]) => p.seekTo(v)} className="flex-1" />
                <span className="w-10 text-right">{mmss(dur)}</span>
              </div>
              <div className="flex items-center justify-center gap-5" dir="ltr">
                <button onClick={p.prev} disabled={!isCur} aria-label="قبلی" className="text-muted-foreground disabled:opacity-40"><SkipBack className="h-6 w-6" /></button>
                <button onClick={() => p.skip(-15)} disabled={!isCur} aria-label="۱۵ ثانیه عقب" className="text-muted-foreground disabled:opacity-40"><RotateCcw className="h-6 w-6" /></button>
                <button onClick={() => p.play(a, related)} aria-label="پخش" className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground glow">
                  {isCur && p.playing ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="h-7 w-7" fill="currentColor" />}
                </button>
                <button onClick={() => p.skip(15)} disabled={!isCur} aria-label="۱۵ ثانیه جلو" className="text-muted-foreground disabled:opacity-40"><RotateCw className="h-6 w-6" /></button>
                <button onClick={p.next} disabled={!isCur} aria-label="بعدی" className="text-muted-foreground disabled:opacity-40"><SkipForward className="h-6 w-6" /></button>
              </div>
              <div className="flex items-center justify-center gap-2">
                {RATES.map((r) => <button key={r} onClick={() => p.setRate(r)} className={cn('rounded-full px-2.5 py-1 text-xs', p.rate === r ? 'bg-primary/20 font-bold text-primary' : 'text-muted-foreground')}>{r}×</button>)}
                <button onClick={() => toggle(a)} className="mr-3 flex items-center gap-1 text-xs text-muted-foreground">{isSaved(a.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}ذخیره</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {a.description && <section className="glass rounded-2xl p-5"><h2 className="mb-2 font-bold">درباره این قسمت</h2><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{a.description}</p>
        {a.rightsSource && <p className="mt-4 text-[11px] text-muted-foreground">منبع و حقوق: {a.rightsSource}</p>}</section>}
      {related.length > 1 && (
        <section><h2 className="mb-3 font-bold">در همین دسته</h2>
          <div className="space-y-2">{related.map((r, i) => (
            <Link key={r.id} to={`/morshed/${r.id}`} className={cn('glass flex items-center gap-3 rounded-xl p-2', r.id === a.id && 'border-primary')}>
              <span className="w-6 text-center text-xs text-muted-foreground">{(i + 1).toLocaleString('fa-IR')}</span>
              <Cover a={r} className="h-10 w-10 rounded-lg" />
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{r.title}</div><div className="text-[11px] text-muted-foreground">{r.author}</div></div>
              <span className="text-[11px] text-muted-foreground" dir="ltr">{mmss(r.durationSeconds)}</span>
            </Link>))}</div>
        </section>
      )}
    </div>
  );
}
