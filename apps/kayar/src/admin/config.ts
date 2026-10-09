export type Field = {
  key: string; label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'bool' | 'select' | 'multi' | 'url' | 'image' | 'audio' | 'link';
  options?: string[]; link?: 'campaigns'; required?: boolean; hint?: string;
};
export type EntityKey = 'audio' | 'campaigns' | 'challenges' | 'rewards';

/** Field configuration per managed type — the admin UI is generated from this. */
export const CONFIG: Record<EntityKey, { title: string; single: string; fields: Field[]; badge?: (r: Record<string, unknown>) => string }> = {
  audio: {
    title: 'محتوای مرشد', single: 'محتوا',
    badge: (r) => (r.published ? 'منتشرشده' : 'پیش‌نویس'),
    fields: [
      { key: 'title', label: 'عنوان', type: 'text', required: true },
      { key: 'category', label: 'دسته‌بندی', type: 'select', options: ['پادکست', 'آموزشی', 'انگیزشی', 'موسیقی تمرین'] },
      { key: 'author', label: 'گوینده / سازنده', type: 'text' },
      { key: 'description', label: 'توضیحات', type: 'textarea' },
      { key: 'audioUrl', label: 'فایل صوتی', type: 'audio' },
      { key: 'coverUrl', label: 'تصویر کاور', type: 'image' },
      { key: 'durationSeconds', label: 'مدت (ثانیه)', type: 'number', hint: 'پس از بارگذاری فایل خودکار پر می‌شود' },
      { key: 'access', label: 'سطح دسترسی', type: 'select', options: ['رایگان', 'فقط اعضا'] },
      { key: 'rightsSource', label: 'منبع و حقوق نشر', type: 'text', hint: 'مثلاً: تولید اختصاصی کایار / با مجوز از …' },
      { key: 'featured', label: 'پیشنهاد ویژه', type: 'bool' },
      { key: 'published', label: 'منتشر شود', type: 'bool' },
    ],
  },
  campaigns: {
    title: 'کمپین‌ها و اسپانسرها', single: 'کمپین',
    badge: (r) => String(r.status ?? 'پیش‌نویس'),
    fields: [
      { key: 'title', label: 'عنوان کمپین', type: 'text', required: true },
      { key: 'status', label: 'وضعیت', type: 'select', options: ['پیش‌نویس', 'فعال', 'پایان یافته'] },
      { key: 'brand', label: 'برند / حامی', type: 'text' },
      { key: 'sponsorLogoUrl', label: 'لوگوی حامی', type: 'image' },
      { key: 'sponsorWebsite', label: 'وب‌سایت حامی', type: 'url' },
      { key: 'category', label: 'دسته‌بندی', type: 'text' },
      { key: 'coverUrl', label: 'تصویر کمپین', type: 'image' },
      { key: 'description', label: 'توضیحات', type: 'textarea' },
      { key: 'terms', label: 'شرایط شرکت', type: 'textarea' },
      { key: 'ctaLabel', label: 'متن دکمه اقدام', type: 'text', hint: 'پیش‌فرض: شرکت در کمپین' },
      { key: 'startsOn', label: 'شروع نمایش', type: 'date', hint: 'قبل از این تاریخ نمایش داده نمی‌شود' },
      { key: 'endsOn', label: 'پایان', type: 'date' },
      { key: 'placement', label: 'جایگاه نمایش', type: 'multi', options: ['صفحه اصلی', 'لندینگ', 'بنر برجسته'] },
    ],
  },
  challenges: {
    title: 'چالش‌ها', single: 'چالش',
    badge: (r) => (r.active ? 'فعال' : 'غیرفعال'),
    fields: [
      { key: 'title', label: 'عنوان چالش', type: 'text', required: true },
      { key: 'campaign', label: 'کمپین مرتبط', type: 'link', link: 'campaigns' },
      { key: 'description', label: 'توضیحات', type: 'textarea' },
      { key: 'target', label: 'هدف', type: 'number' },
      { key: 'unit', label: 'واحد', type: 'text', hint: 'مثلاً: کیلومتر، جلسه، دقیقه' },
      { key: 'points', label: 'امتیاز تکمیل', type: 'number' },
      { key: 'endsOn', label: 'مهلت', type: 'date' },
      { key: 'active', label: 'فعال', type: 'bool' },
    ],
  },
  rewards: {
    title: 'پاداش‌ها', single: 'پاداش',
    badge: (r) => String(r.kind ?? ''),
    fields: [
      { key: 'title', label: 'عنوان پاداش', type: 'text', required: true },
      { key: 'kind', label: 'نوع', type: 'select', options: ['کد تخفیف', 'نشان', 'امتیاز', 'اشتراک', 'لباس'] },
      { key: 'campaign', label: 'کمپین مرتبط', type: 'link', link: 'campaigns' },
      { key: 'description', label: 'توضیحات و قواعد دریافت', type: 'textarea' },
      { key: 'costPoints', label: 'امتیاز لازم', type: 'number' },
      { key: 'stock', label: 'موجودی', type: 'number' },
      { key: 'perUserLimit', label: 'سقف دریافت هر کاربر', type: 'number', hint: '۰ یعنی بدون محدودیت' },
      { key: 'expiresOn', label: 'تاریخ انقضا', type: 'date' },
    ],
  },
};
