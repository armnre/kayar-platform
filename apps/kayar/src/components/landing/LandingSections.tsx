import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Dumbbell, Salad, LineChart, MessageCircle, QrCode, UserCog, Activity, Star, Play, SkipBack, SkipForward, Heart, Gift, Tag, Shirt, Crown, Users, Smile, Target, ChevronLeft } from 'lucide-react';
import { useCatalog } from '../../lib/data';
import SafeImg from '../SafeImg';

const rv = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } };
const Panel = ({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) => (
  <motion.section id={id} {...rv} className={`border-gradient relative mx-auto max-w-7xl scroll-mt-20 overflow-hidden rounded-[2rem] bg-card/50 p-5 backdrop-blur md:p-8 ${className}`}>{children}</motion.section>
);
const Head = ({ t, s, cta }: { t: string; s: string; cta?: string }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div><h2 className="text-3xl font-black text-primary md:text-4xl">{t}</h2><p className="mt-1 text-sm text-muted-foreground">{s}</p></div>
    {cta && <Link to="/app" className="flex shrink-0 items-center gap-1 text-sm font-bold text-primary">{cta}<ChevronLeft className="h-4 w-4" /></Link>}
  </div>
);

function PhoneMock() {
  const bars = [40, 65, 50, 80, 55, 90, 70, 60, 85, 75];
  return (
    <div className="relative mx-auto w-[250px] rotate-[-6deg] rounded-[2.5rem] border-[6px] border-zinc-800 bg-background p-3 shadow-[0_40px_80px_-20px_hsl(var(--primary)/0.4)]">
      <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-zinc-800" />
      <div className="mb-3 flex items-center justify-between text-[10px]"><span className="font-black text-primary">بدن‌یار</span><span className="text-muted-foreground">امروز</span></div>
      <div className="rounded-2xl border border-white/10 bg-card p-3">
        <div className="mb-2 text-[10px] text-muted-foreground">فعالیت هفتگی</div>
        <div className="flex h-24 items-end gap-1">{bars.map((b, i) => <motion.span key={i} initial={{ height: 0 }} whileInView={{ height: `${b}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex-1 rounded-t bg-primary" />)}</div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-card p-2 text-center"><div className="text-sm font-black text-primary">۲۳۰۰</div><div className="text-[9px] text-muted-foreground">کالری</div></div>
        <div className="rounded-xl border border-white/10 bg-card p-2 text-center"><div className="text-sm font-black">۷۰</div><div className="text-[9px] text-muted-foreground">کیلوگرم</div></div>
      </div>
      <div className="mt-2 rounded-xl bg-primary/10 p-2 text-[10px] leading-5">سلام! برنامه تمرین امروزت آماده‌ست 💪</div>
    </div>
  );
}

export function BodyYarSection() {
  const steps = ['اطلاعات بدنی‌ات رو بده', 'برنامه تمرینی و غذایی بگیر', 'بدنت حرکت می‌کنه', 'پیشرفتت رو ببین'];
  const feats = [[UserCog, 'پروفایل کامل'], [Activity, 'تحلیل هوشمند'], [Dumbbell, 'برنامه تمرین'], [Salad, 'برنامه تغذیه'], [LineChart, 'پیشرفت وزن'], [MessageCircle, 'چت با دستیار']] as const;
  return (
    <Panel id="bodyyar">
      <Head t="بدن‌یار" s="هوش مصنوعی، مربی شخصی تو" cta="شروع با بدن‌یار" />
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="relative py-6"><div className="absolute inset-10 rounded-full bg-primary/20 blur-3xl" /><PhoneMock /></div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s} {...rv} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-white/10 bg-background/50 p-4 text-center">
                <span className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{(i + 1).toLocaleString('fa-IR')}</span>
                <div className="text-xs font-bold leading-6">{s}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="grid grid-cols-3 gap-2">
              {feats.map(([I, l]) => <div key={l} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-background/50 p-3 text-center text-[11px]"><I className="h-6 w-6 text-primary" />{l}</div>)}
            </div>
            <Link to="/app" className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-5">
              <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/5r5WxH9dp5LQqPmDEqAiTM/img_MvvdgHC972HOQBye.jpg" alt="" className="absolute -bottom-6 -left-6 h-40 w-40 rounded-3xl object-cover opacity-70 transition group-hover:scale-110" />
              <div className="relative max-w-[60%]">
                <div className="font-black text-primary">لباس کایوش داری؟</div>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">کد QR داخل لباست رو اسکن کن و بدن‌یار رو رایگان فعال کن.</p>
              </div>
              <span className="absolute bottom-4 right-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary))]"><QrCode className="h-7 w-7" /></span>
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}

const FALLBACK = [
  { n: 'علی رضایی', t: 'بدنسازی و فیتنس', img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/nVSWyE8R48NoVgsYBHj2Mo/img_69MKiepZigEQperd.jpg', y: 9, r: 4.8 },
  { n: 'سارا محمدی', t: 'تناسب اندام', img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/ooQzqi9uPmNbvvTsEW8Dpt/img_gvH9vmNRPg7xjZ_B.jpg', y: 7, r: 4.9 },
  { n: 'مهدی کاظمی', t: 'فیتنس و هوازی', img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/teRZy9FtA6SAmLQ8Z5BY6e/img_y_vNAiVjDxgXvYxI.jpg', y: 6, r: 4.7 },
  { n: 'نرگس جعفری', t: 'یوگا و انعطاف', img: 'https://images.fillout.com/886713/3qilvz8bzw/generated-images/pn6SgYk3HaG93vLJHa9EXA/img_vvnAcROtXE2J1mi_.jpg', y: 4, r: 4.9 },
];

export function CoachesSection() {
  const { data } = useCatalog();
  const real = (data?.coaches ?? []).slice(0, 4).map((c, i) => ({ n: c.name, t: c.title, img: c.avatarUrl || FALLBACK[i % 4].img, y: c.yearsExperience, r: c.rating }));
  const list = real.length >= 2 ? real : FALLBACK;
  return (
    <Panel id="coaches">
      <Head t="مربیان کایار" s="با بهترین‌ها تمرین کن" cta="همه مربیان" />
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {list.map((c) => (
            <motion.div key={c.n} whileHover={{ y: -6 }} className="w-52 shrink-0 snap-start rounded-3xl border border-white/10 bg-background/60 p-5 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent p-[3px]"><SafeImg src={c.img} alt={c.n} className="h-full w-full rounded-full object-cover" fallback={<div className="h-full w-full rounded-full bg-card" />} /></div>
              <div className="mt-3 font-black">{c.n}</div>
              <div className="text-xs text-muted-foreground">{c.t}</div>
              <div className="mt-2 flex justify-center gap-3 text-xs"><span>{c.y.toLocaleString('fa-IR')} سال تجربه</span><span className="flex items-center gap-1 text-primary"><Star className="h-3 w-3" fill="currentColor" />{c.r.toLocaleString('fa-IR')}</span></div>
              <Link to="/app" className="mt-4 block rounded-full bg-primary py-2 text-xs font-black text-primary-foreground">مشاهده پروفایل</Link>
            </motion.div>
          ))}
        </div>
        <div className="rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/20 to-transparent p-6">
          <Crown className="h-8 w-8 text-accent" />
          <div className="mt-3 text-xl font-black">مربی هستی؟ به کایار بپیوند</div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">پروفایلت رو بساز، شاگرد جذب کن و برنامه‌هات رو بفروش. (تأیید توسط تیم کایار)</p>
          <Link to="/app" className="mt-5 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground">ثبت‌نام به عنوان مربی</Link>
        </div>
      </div>
    </Panel>
  );
}

const PODS = [['سبک زندگی سالم', 'from-amber-500/60'], ['اعتماد به نفس', 'from-fuchsia-500/60'], ['مدیریت استرس', 'from-cyan-500/60'], ['انگیزه و استمرار', 'from-lime-500/60']];
const LISTS = [['تمرکز', 'from-lime-400/70'], ['ریکاوری', 'from-sky-500/70'], ['کاردیو', 'from-violet-500/70'], ['شروع قدرتی', 'from-red-500/70']];

export function MorshedSection() {
  return (
    <Panel id="morshed">
      <Head t="مرشد" s="پادکست‌ها و پلی‌لیست‌های اختصاصی برای ذهن و بدن" cta="گوش بده" />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-background/60 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground"><Target className="h-8 w-8" /></div>
            <div><div className="font-black">قدرت ذهن</div><div className="text-xs text-muted-foreground">قسمت ۱۲ — عادت‌های موفقیت</div></div>
          </div>
          <div className="mt-5 flex h-10 items-center gap-[3px]">{Array.from({ length: 40 }).map((_, i) => <motion.span key={i} animate={{ height: [6, 8 + ((i * 7) % 28), 6] }} transition={{ duration: 1.2, delay: i * 0.03, repeat: Infinity }} className={`w-1 rounded-full ${i < 16 ? 'bg-primary' : 'bg-white/20'}`} />)}</div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>۴۵:۰۰</span><span>۱۲:۳۴</span></div>
          <div className="mt-3 flex items-center justify-center gap-5">
            <SkipForward className="h-5 w-5 text-muted-foreground" />
            <Link to="/app" className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.6)]"><Play className="h-6 w-6" fill="currentColor" /></Link>
            <SkipBack className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-5">
          {[['پادکست‌های توسعه فردی', PODS], ['پلی‌لیست‌های موسیقی باشگاه', LISTS]].map(([title, items]) => (
            <div key={title as string}>
              <div className="mb-3 text-sm font-bold">{title as string}</div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(items as string[][]).map(([t, g]) => (
                  <Link to="/app" key={t} className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${g} to-card p-3`}>
                    <Heart className="absolute left-3 top-3 h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                    <div className="absolute bottom-3 right-3 font-black">{t}</div>
                    <span className="absolute bottom-3 left-3 grid h-8 w-8 scale-0 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:scale-100"><Play className="h-3 w-3" fill="currentColor" /></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function GamesSection() {
  const board = [['علی', '۳۱۵۰'], ['سارا', '۳۱۲۰'], ['مهدی', '۲۹۸۰']];
  const prizes = [[Gift, 'جوایز ویژه'], [Tag, 'کد تخفیف'], [Crown, 'اشتراک رایگان'], [Shirt, 'تخفیف لباس']] as const;
  return (
    <Panel id="games">
      <Head t="بازی و جایزه" s="چالش کن، امتیاز بگیر، جایزه ببر" cta="شروع چالش" />
      <div className="grid items-center gap-6 md:grid-cols-3">
        <div className="relative mx-auto aspect-square w-56">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-primary bg-[conic-gradient(hsl(var(--primary))_0_45deg,hsl(var(--card))_45deg_90deg,hsl(var(--primary))_90deg_135deg,hsl(var(--card))_135deg_180deg,hsl(var(--primary))_180deg_225deg,hsl(var(--card))_225deg_270deg,hsl(var(--primary))_270deg_315deg,hsl(var(--card))_315deg)] shadow-[0_0_60px_hsl(var(--primary)/0.4)]" />
          <Link to="/app" className="absolute inset-[35%] grid place-items-center rounded-full bg-background text-xs font-black text-primary ring-4 ring-primary">بچرخون</Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-background/60 p-5">
          <div className="mb-3 font-black">جدول رتبه‌بندی</div>
          {board.map(([n, p], i) => (
            <div key={n} className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0">
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-white/10'}`}>{(i + 1).toLocaleString('fa-IR')}</span>
              <span className="flex-1">{n}</span><span className="font-black text-primary">{p}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {prizes.map(([I, l]) => <div key={l} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-background/60 p-4 text-xs"><I className="h-7 w-7 text-primary" />{l}</div>)}
        </div>
      </div>
    </Panel>
  );
}

export function ShopSection() {
  return (
    <Panel id="shop" className="grid items-center gap-6 md:grid-cols-2">
      <div>
        <div className="text-3xl font-black">کایوش</div>
        <p className="mt-1 text-sm text-muted-foreground">فروشگاه لباس ورزشی — هر لباس، یک بدن‌یار رایگان</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/app" className="rounded-full bg-primary px-6 py-3 text-sm font-black text-primary-foreground">فعال‌سازی با کد لباس</Link>
          <Link to="/app" className="rounded-full border border-white/15 px-6 py-3 text-sm">مشاهده همه محصولات</Link>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-background/60 p-4">
        <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/5r5WxH9dp5LQqPmDEqAiTM/img_MvvdgHC972HOQBye.jpg" alt="تیشرت تمرین کایوش" className="h-32 w-32 rounded-2xl object-cover" />
        <div className="flex-1">
          <div className="font-black">تیشرت تمرین کایوش</div>
          <div className="mt-1 text-lg font-black text-primary">۱٬۱۹۰٬۰۰۰ تومان</div>
          <div className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary">دارای کد فعال‌سازی بدن‌یار</div>
        </div>
      </div>
    </Panel>
  );
}

export function StatsStrip() {
  const s = [[Users, '+۵۰٬۰۰۰', 'کاربر فعال'], [Smile, '+۹۶٪', 'رضایت کاربران'], [Dumbbell, '+۳۰٬۰۰۰', 'برنامه ساخته‌شده'], [Bot, '+۱۲۰٬۰۰۰', 'گفتگو با بدن‌یار']] as const;
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
      {s.map(([I, v, l], i) => (
        <motion.div key={l} {...rv} transition={{ delay: i * 0.08 }} className="rounded-3xl border border-white/10 bg-card/50 p-6 text-center">
          <I className="mx-auto h-7 w-7 text-primary" /><div className="mt-2 text-3xl font-black">{v}</div><div className="text-xs text-muted-foreground">{l}</div>
        </motion.div>
      ))}
    </section>
  );
}

export function FinalCta() {
  return (
    <motion.section {...rv} className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-l from-primary/20 via-card to-card">
      <img src="https://images.fillout.com/886713/3qilvz8bzw/generated-images/pn6SgYk3HaG93vLJHa9EXA/img_vvnAcROtXE2J1mi_.jpg" alt="" className="absolute left-0 top-0 h-full w-1/2 object-cover opacity-60 [mask-image:linear-gradient(to_right,black,transparent)]" />
      <div className="relative max-w-xl p-8 md:p-12">
        <h2 className="text-3xl font-black md:text-4xl">آماده‌ای برای <span className="text-primary">نسخه‌ی بهتر خودت؟</span></h2>
        <p className="mt-3 text-muted-foreground">با کایار، قدم‌به‌قدم به سمت سلامتی، قدرت و اعتمادبه‌نفس.</p>
        <Link to="/app" className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 font-black text-primary-foreground shadow-[0_10px_40px_-8px_hsl(var(--primary))]">برنامه‌ام رو بساز</Link>
      </div>
    </motion.section>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" />کلیه حقوق مادی و معنوی متعلق به کایوش و کایار است.</div>
        <nav className="flex gap-5">{[['درباره ما', '#'], ['تماس با ما', 'mailto:support@kayar.app'], ['قوانین', '#'], ['ورود به اپ', '/app']].map(([l, h]) => h.startsWith('/') ? <Link key={l} to={h} className="hover:text-primary">{l}</Link> : <a key={l} href={h} className="hover:text-primary">{l}</a>)}</nav>
      </div>
    </footer>
  );
}
