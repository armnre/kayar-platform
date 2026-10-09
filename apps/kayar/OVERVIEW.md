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

**پنل مدیریت:** در همین اپ و زیر مسیر `/admin` (قبلاً اپ جداگانه kayar-admin بود).

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

## Routing & roles (test mode)
Athletes and coaches live under /app with one test session (phone + code 123456). Athletes sign in at /app/login, coaches at /app/coach/login (then land on apply / status / dashboard depending on approval). Campaigns and rewards also open inside the app at /app/campaigns, /app/campaigns/:id and /app/rewards so users never drop out to the public site. Each area is closed to the other roles. The public site is / plus /campaigns and /rewards; old web URLs redirect into /app.

## Admin panel (/admin)
The former Kayar Admin app now lives at /admin: dashboard (real DB stats), coach review, test coach files, Morshed content, campaigns & sponsors, challenges and rewards. It has its own username/password login at /admin/login, separate from athletes and coaches.
- **Test account:** username `admin`, password `kayar-test-1234`. This is a TEST login, not production security. To change it, set the secret `ZITE_ADMIN_PASSWORD` (and optionally `ZITE_ADMIN_SECRET` for token signing); the test password then stops working.
- Every admin endpoint verifies a server-signed, 12-hour token — hiding the UI is not the only protection.
- "Test coach files" changes the status of coach applications stored in the current browser (test mode).

## Test-mode data: local storage only
In test mode the session, coach applications, chat, challenge progress, points and reward codes are stored in the browser's localStorage (`kayar.mobile.v1`, `kayar.demo.coachApps.v1`, `kayar.demo.data.v1`). That means:
- Data lives on one browser profile only. It is **not** shared between different browsers, devices, incognito windows or users — e.g. an admin approving a coach in another browser is not seen by that coach.
- Tabs of the same browser profile do sync (via the `storage` event), so admin and coach can be tested side by side in two tabs, but only one role is signed in per profile at a time.
- Clearing site data resets everything. Sample content (ids starting with `demo-`) fills empty catalog sections.
No real SMS, payment, AI or server-side sync is connected; real services can replace these stores later without changing routes.

## Workspace migration (Oct 2026)
Restored from GitHub `main` (PRs #1–#4 all merged; PR #4 moved the admin panel to /admin) into a fresh Zite workspace. The 18 database tables were recreated from `zite.schema.json` with identical names. The separate Kayar Admin app was also restored. Bottom nav: Home · Morshed · BodyYar · Coaches · Challenges (profile lives behind the settings icon on Home). Landing shop section links to the Kapoosh store (kapoosh.ir).

E2E: `npm run test:e2e:ci` (build + preview + browser tests; first run `npx playwright install chromium`). Any failing test exits with code 1.

## Oct 2026 — music, landing, stability
- **Morshed music:** live Jamendo catalog (search, genre filter, infinite paging) via server endpoint `jamendoTracks`; only `ZITE_JAMENDO_CLIENT_ID` is used (server-side, never the client secret). Tracks are stream-only under Creative Commons with attribution. A clearly labelled dev Mock is available with `?mock=jamendo` (off with `?mock=off`).
- **One global player** at the app root (single audio element): play/pause/next/prev, progress, error + retry, survives route changes; mini player on landing, public pages and in-app.
- **Kapoosh:** latest products, prices and links come live from kapoosh.ir's public WooCommerce Store API (`kapooshProducts`).
- **Landing:** newcomer "how it works" section; no fake stats/points; BodyYar clothing/QR card removed; coaches shown only from real data.
- `node tests/check-effects.cjs` fails if any effect returns a non-function (guards against "n is not a function").
