# کایار (KAYAR)

کایار یک پلتفرم ورزشی هوشمند و موبایل‌محور (PWA) برای کاربران عمومی است — همراه روزانه در ورزش و سبک زندگی فعال.

**مخاطب:** ورزشکاران و کاربران عادی فارسی‌زبان (اپ عمومی، ورود با ایمیل).

**بخش‌ها:**
- **مربیان:** کشف مربی، مشاهده پلن‌ها، رزرو جلسه و ثبت درخواست همکاری.
- **بدن‌یار:** پروفایل بدنی، گفتگو با دستیار هوشمند، برنامه تمرینی شخصی، ثبت فعالیت و روند وزن.
- **مرشد:** پادکست و محتوای صوتی با ذخیره و ادامه پخش از محل قبلی.
- **چالش و جایزه / کمپین‌ها:** شرکت در چالش، کسب امتیاز و دریافت جایزه.
- **پروفایل:** امتیاز، درخواست‌ها، محتوای ذخیره‌شده و جوایز.

**زیرساخت آماده اتصال (هنوز متصل نیست):**
- هوش مصنوعی: هر سرویس سازگار با OpenAI از طریق رازهای `ZITE_AI_API_KEY` و اختیاری `ZITE_AI_BASE_URL` و `ZITE_AI_MODEL`.
- درگاه پرداخت: پرداخت‌ها با وضعیت «در انتظار درگاه» ثبت می‌شوند؛ هیچ مبلغی جابه‌جا نمی‌شود.

**مراحل بعدی:** پنل مدیریت داخلی (مربیان، محتوا، کمپین‌ها) و پنل مربی به‌صورت اپ جداگانه.

## Coaches & messaging
Coaches apply from the landing page (/coach/apply) with identity, specialties, services, documents and a photo. The Kayar Admin app reviews applications (pending, approved, needs changes, rejected, suspended); only approved coaches appear publicly. Approved coaches get a panel (/coach) for their profile, services, weekly availability, booking requests, clients and notifications. Users and coaches chat through a real, access-controlled messaging system (/messages) with read receipts and unread badges.

Age is always derived from the stored birth date; body data is visible only to the user and Bodyyar.

## Coach portal
Coaches have their own entry at /coach/login, separate from the athlete app: a dedicated sign-in/apply screen, then a coach-only shell for the panel (/coach) and application file (/coach/apply) showing review status.

## Morshed
Audio library with categories, search, featured item, "continue listening", a detail page per episode, and one persistent player (speed, ±15s, next/previous, resume from saved position) that keeps playing while browsing. Members-only items never expose their file to signed-out visitors. Each item records its source/rights.

## Campaigns & rewards
Sponsored campaigns (/campaigns) with sponsor, dates, terms, call to action and linked challenges and rewards. Admins choose where each campaign appears (Home, Landing, featured banner) and schedule it by start/end date — new campaigns need no code changes. Progress, completion points and reward redemption are validated on the server (campaign must be live, per-report caps, one-time awards, stock, expiry and per-user limits).

## BodyYar AI
Uses any OpenAI-compatible provider, keys kept server-side only: set secret ZITE_AI_API_KEY (and optionally ZITE_AI_BASE_URL, ZITE_AI_MODEL) in app Settings → Secrets. Without a key, chat and plan generation are clearly disabled — nothing is simulated. Advice is cautious and never a substitute for medical care.
