import type { GetCatalogOutputType } from 'zitejs/api';

type C = GetCatalogOutputType;
const iso = (days: number) => new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);

/** Sample content used in test mode whenever the database has none (or can't be reached). Ids start with `demo-`. */
export const DEMO_CATALOG: C = {
  coaches: [
    { id: 'demo-coach-1', name: 'سارا محمدی', title: 'مربی فیتنس و TRX', specialties: ['کاهش وزن', 'TRX'], bio: 'ده سال سابقه مربیگری فیتنس بانوان و طراحی برنامه کاهش وزن.', avatarUrl: '', yearsExperience: 10, rating: 4.9, reviewCount: 128, certifications: 'مربی درجه ۱ فدراسیون', category: 'فیتنس و بدنسازی', sports: 'فیتنس', services: ['آنلاین', 'حضوری'], levels: ['مبتدی', 'متوسط'], city: 'تهران', acceptingClients: true,
      availability: [{ id: 'demo-a1', weekday: 'شنبه', startTime: '09:00', endTime: '12:00' }],
      plans: [{ id: 'demo-p1', name: 'برنامه ۴ هفته‌ای', sessions: 12, durationWeeks: 4, price: 1200000, description: 'برنامه تمرینی + پیگیری هفتگی' }] },
    { id: 'demo-coach-2', name: 'علی رضایی', title: 'مربی دویدن و استقامت', specialties: ['دویدن', 'استقامت'], bio: 'دونده ماراتن و مربی تیم‌های دو استقامت.', avatarUrl: '', yearsExperience: 7, rating: 4.7, reviewCount: 64, certifications: 'مربی دو و میدانی', category: 'دویدن و کاردیو', sports: 'دو', services: ['آنلاین'], levels: ['متوسط', 'پیشرفته'], city: 'اصفهان', acceptingClients: true,
      availability: [], plans: [{ id: 'demo-p2', name: 'آمادگی ۱۰ کیلومتر', sessions: 16, durationWeeks: 8, price: 1800000, description: 'برنامه گام‌به‌گام تا ۱۰ کیلومتر' }] },
  ],
  audio: [
    { id: 'demo-audio-1', title: 'انگیزه برای ادامه', category: 'پادکست', description: 'قسمت نمونه مرشد.', audioUrl: '', locked: false, membersOnly: false, featured: true, rightsSource: 'نمونه آزمایشی', coverUrl: '', durationSeconds: 420, author: 'کایار' },
    { id: 'demo-audio-2', title: 'پلی‌لیست دویدن', category: 'موزیک', description: 'موزیک نمونه.', audioUrl: '', locked: false, membersOnly: false, featured: false, rightsSource: 'نمونه آزمایشی', coverUrl: '', durationSeconds: 1800, author: 'کایار' },
  ],
  campaigns: [
    { id: 'demo-campaign-1', title: 'چالش پاییز فعال', brand: 'کایوش', description: 'یک ماه فعال بمان، قدم بزن و جایزه بگیر.', coverUrl: '', startsOn: iso(-5), endsOn: iso(25), sponsorLogoUrl: '', sponsorWebsite: '', category: 'پیاده‌روی', placement: [], terms: 'ثبت فعالیت روزانه در چالش‌های کمپین.', ctaLabel: 'شرکت در کمپین' },
  ],
  challenges: [
    { id: 'demo-ch-1', title: '۵۰ هزار قدم در هفته', description: 'قدم‌های روزانه‌ات را ثبت کن.', target: 50000, unit: 'قدم', points: 150, endsOn: iso(25), campaignId: 'demo-campaign-1' },
    { id: 'demo-ch-2', title: '۱۰ جلسه تمرین', description: 'هر جلسه تمرین را ثبت کن.', target: 10, unit: 'جلسه', points: 100, endsOn: null, campaignId: null },
  ],
  rewards: [
    { id: 'demo-rw-1', title: 'کد تخفیف ۲۰٪ کایوش', description: 'روی همه محصولات ورزشی کایوش.', costPoints: 200, kind: 'کد تخفیف', stock: 50, expiresOn: iso(30), perUserLimit: 1, campaignId: 'demo-campaign-1' },
    { id: 'demo-rw-2', title: 'بطری آب ورزشی', description: 'هدیه فیزیکی کایار.', costPoints: 400, kind: 'هدیه', stock: 10, expiresOn: null, perUserLimit: 1, campaignId: null },
  ],
};

/** Fill empty sections with sample content so every screen stays testable. */
export function withDemo(c: C | undefined): C {
  if (!c) return DEMO_CATALOG;
  const pick = <K extends keyof C>(k: K) => ((c[k] as unknown[])?.length ? c[k] : DEMO_CATALOG[k]);
  return { ...c, coaches: pick('coaches'), campaigns: pick('campaigns'), challenges: pick('challenges'), rewards: pick('rewards'), audio: pick('audio') };
}
