export const CATEGORIES = ['فیتنس و بدنسازی', 'یوگا و پیلاتس', 'دویدن و کاردیو', 'تغذیه', 'ورزش‌های رزمی', 'حرکات اصلاحی'];
export const SPECIALTIES = ['فیتنس', 'بدنسازی', 'کاردیو', 'یوگا', 'تغذیه', 'اصلاح فرم'];
export const SERVICES = ['جلسه حضوری', 'جلسه آنلاین', 'برنامه تمرینی', 'برنامه غذایی', 'مشاوره چت'];
export const LEVELS = ['مبتدی', 'متوسط', 'پیشرفته'];
export const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export const STATUS_INFO: Record<string, { label: string; tone: string; text: string }> = {
  'در انتظار تایید': { label: 'در حال بررسی', tone: 'bg-accent/15 text-accent', text: 'درخواست شما ثبت شده و تیم کایار در حال بررسی مدارک است.' },
  'تایید شده': { label: 'تأیید شده', tone: 'bg-primary/15 text-primary', text: 'پروفایل شما در بخش مربیان نمایش داده می‌شود.' },
  'نیاز به اصلاح': { label: 'نیاز به اصلاح', tone: 'bg-orange-500/15 text-orange-400', text: 'لطفاً طبق توضیحات ادمین اطلاعات را اصلاح و دوباره ارسال کنید.' },
  'رد شده': { label: 'رد شده', tone: 'bg-destructive/15 text-destructive', text: 'درخواست شما تأیید نشد. می‌توانید با اطلاعات کامل‌تر دوباره درخواست دهید.' },
  'معلق': { label: 'معلق', tone: 'bg-muted text-muted-foreground', text: 'حساب مربیگری شما موقتاً معلق است. با پشتیبانی تماس بگیرید.' },
};

export type PanelPlan = { id: string; name: string; sessions: number; durationWeeks: number; price: number; description: string };
export type PanelSlot = { id?: string; weekday: string; startTime: string; endTime: string };
export type PanelRequest = { id: string; title: string; status: string; message: string; sessionAt: string | null; clientId: string; clientName: string; planName: string; created: string };
export type Panel = {
  coach: { id: string; status: string; adminNotes: string; name: string; title: string; bio: string; avatarUrl: string; category: string; sports: string; city: string; specialties: string[]; services: string[]; levels: string[]; acceptingClients: boolean; weeklyCapacity: number; rating: number; reviewCount: number; yearsExperience: number; certifications: string };
  plans: PanelPlan[]; availability: PanelSlot[]; requests: PanelRequest[];
  clients: { id: string; name: string; sessions: number; lastAt: string | null }[];
  stats: { pending: number; accepted: number; upcoming: number; revenue: number };
};
