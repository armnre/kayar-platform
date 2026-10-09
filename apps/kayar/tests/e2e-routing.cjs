// Browser E2E for /app routing (coach/admin/user, status transitions, mock chat/rewards).
// Run: npx vite build && npx vite preview --port 4173 & then: node tests/e2e-routing.cjs (needs 'playwright' + chromium).
const { chromium } = require('playwright');
const B = 'http://localhost:4173';
const results = []; const errors = [];
const ok = (name, cond, extra='') => { results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`); };
const path = (p) => new URL(p.url()).pathname;
const wait = (ms) => new Promise(r => setTimeout(r, ms));
async function settle(p, ms = 1200) { await wait(ms); }
async function blank(p) { return (await p.evaluate(() => document.querySelector('#root')?.innerText.trim().length || 0)) === 0; }
async function roleLogin(p, url, phone) {
  await p.goto(B + url); await settle(p);
  await p.fill('input[aria-label="شماره موبایل"]', phone); await p.click('button[type=submit]');
  await p.waitForSelector('input[aria-label="کد تأیید"]', { timeout: 5000 });
  await p.fill('input[aria-label="کد تأیید"]', '123456'); await p.click('button[type=submit]');
  await settle(p, 1800);
}
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 400, height: 860 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push('pageerror ' + path(p) + ': ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|\/api\/|fetch|401|404|NetworkError|ERR_/.test(m.text())) errors.push('console ' + path(p) + ': ' + m.text().slice(0, 200)); });
  let navCount = 0; p.on('framenavigated', f => { if (f === p.mainFrame()) navCount++; });

  // Guards while signed out
  for (const [u, exp] of [['/app/coach/dashboard', '/app/coach/login'], ['/app/admin', '/app/admin/login'], ['/app/home', '/app/welcome|/app/login'], ['/app/messages', '/app/login']]) {
    await p.goto(B + u); await settle(p);
    ok(`signed-out ${u} → ${exp}`, new RegExp('^(' + exp + ')$').test(path(p)), path(p) + new URL(p.url()).search);
  }
  // Coach login, next= preserved, status none → apply
  await roleLogin(p, '/app/coach/login?next=%2Fapp%2Fcoach%2Fdashboard', '9121111111');
  ok('coach (no file) after login → /app/coach/apply', path(p) === '/app/coach/apply', path(p));
  ok('coach login never shows email/Google page', !(await p.content()).includes('Continue with Google'));
  await p.fill('label:has-text("نام و نام خانوادگی") input', 'مربی تست');
  await p.click('button:has-text("فیتنس و بدنسازی")');
  await p.fill('label:has-text("شهر") input', 'تهران');
  await p.fill('label:has-text("سوابق") textarea', 'ده سال سابقه مربیگری فیتنس و بدنسازی در باشگاه‌های تهران');
  await p.click('button:has-text("ارسال برای بررسی")'); await settle(p);
  ok('coach submit → pending → /app/coach/status', path(p) === '/app/coach/status', path(p));
  await p.goto(B + '/app/coach/dashboard'); await settle(p);
  ok('pending coach cannot open dashboard (→ status)', path(p) === '/app/coach/status', path(p));
  await p.reload(); await settle(p);
  ok('refresh keeps pending coach on status', path(p) === '/app/coach/status', path(p));

  // Admin in a second tab
  const a = await ctx.newPage();
  a.on('pageerror', e => errors.push('pageerror(admin) ' + e.message));
  await a.goto(B + '/app/admin/login'); await wait(1000);
  // signed in as coach in same browser -> login form shown for switching? Admin uses separate localStorage session, so use a separate context instead
  await a.close();
  const actx = await br.newContext({ viewport: { width: 400, height: 860 } });
  // share coach applications: copy apps store into admin context
  const appsJson = await p.evaluate(() => localStorage.getItem('kayar.demo.coachApps.v1'));
  const ap = await actx.newPage(); ap.on('pageerror', e => errors.push('pageerror(admin) ' + e.message));
  await ap.goto(B + '/app'); await ap.evaluate(v => localStorage.setItem('kayar.demo.coachApps.v1', v), appsJson);
  await roleLogin(ap, '/app/admin/login', '9120000000');
  ok('admin login → /app/admin', path(ap) === '/app/admin', path(ap));
  ok('admin sees coach request', (await ap.content()).includes('مربی تست'));
  await ap.reload(); await settle(ap);
  ok('refresh keeps admin on /app/admin', path(ap) === '/app/admin', path(ap));

  // status transitions driven by admin (apply admin's store to coach's browser each time)
  const sync = async () => { const v = await ap.evaluate(() => localStorage.getItem('kayar.demo.coachApps.v1')); await p.evaluate(v => localStorage.setItem('kayar.demo.coachApps.v1', v), v); await p.goto(B + '/app/coach'); await settle(p); };
  const trans = [['نیاز به اصلاح', '/app/coach/apply'], ['رد', '/app/coach/status'], ['تعلیق', '/app/coach/status'], ['تأیید', '/app/coach/dashboard']];
  for (const [btn, exp] of trans) {
    await ap.click(`button:text-is("${btn}")`); await settle(ap, 500); await sync();
    ok(`admin "${btn}" → coach lands on ${exp}`, path(p) === exp, path(p));
  }
  await p.goto(B + '/app/coach/apply'); await settle(p);
  ok('approved coach /apply → dashboard', path(p) === '/app/coach/dashboard', path(p));
  await p.goto(B + '/app/coach/status'); await settle(p);
  ok('approved coach /status → dashboard', path(p) === '/app/coach/dashboard', path(p));
  await p.reload(); await settle(p);
  ok('refresh keeps approved coach on dashboard', path(p) === '/app/coach/dashboard', path(p));
  await p.goto(B + '/app/home'); await settle(p);
  ok('coach opening user area → own home', path(p) === '/app/coach/dashboard', path(p));
  await p.goto(B + '/app/admin'); await settle(p);
  ok('coach opening admin → own home', path(p) === '/app/coach/dashboard', path(p));
  // changes -> resubmit -> pending
  await ap.click('button:text-is("نیاز به اصلاح")'); await settle(ap, 400); await sync();
  await p.click('button:has-text("ارسال برای بررسی")'); await settle(p);
  ok('needs-correction coach resubmits → status (pending)', path(p) === '/app/coach/status' && (await p.content()).includes('در انتظار تأیید'), path(p));
  // coach logout
  await p.click('button[aria-label="خروج"]'); await settle(p);
  ok('coach logout → /app/coach/login', path(p) === '/app/coach/login', path(p));
  await p.goto(B + '/app/coach/dashboard'); await settle(p);
  ok('after logout dashboard is guarded', path(p) === '/app/coach/login', path(p));
  // admin logout
  await ap.click('button[aria-label="خروج"]'); await settle(ap);
  ok('admin logout → /app/admin/login', path(ap) === '/app/admin/login', path(ap));
  await ap.fill('input[aria-label="شماره موبایل"]', '9121111111'); await ap.click('button[type=submit]'); await settle(ap, 800);
  ok('non-admin phone rejected on admin login', path(ap) === '/app/admin/login' && (await ap.content()).includes('دسترسی به این بخش ندارد') && (await ap.locator('input[aria-label="کد تأیید"]').count()) === 0, path(ap));

  // user flow with return-after-login
  const u = await (await br.newContext({ viewport: { width: 400, height: 860 } })).newPage();
  u.on('pageerror', e => errors.push('pageerror(user) ' + path(u) + ': ' + e.message));
  u.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|\/api\/|401|404|ERR_/.test(m.text())) errors.push('console(user) ' + path(u) + ': ' + m.text().slice(0, 200)); });
  await u.goto(B + '/app'); await settle(u, 4000);
  ok('fresh visitor splash → /app/welcome', path(u) === '/app/welcome', path(u));
  await u.evaluate(() => localStorage.setItem('kayar.mobile.v1', JSON.stringify({ onboarded: true })));
  await u.goto(B + '/app/messages'); await settle(u);
  ok('signed-out /app/messages → /app/login?next=', path(u) === '/app/login' && u.url().includes('next='), u.url().replace(B, ''));
  await u.fill('input[inputmode=numeric]', '9123334444'); await u.click('button[type=submit]'); await settle(u, 1500);
  ok('user phone → /app/verify', path(u) === '/app/verify', path(u));
  await u.fill('input >> nth=0', '123456'); await settle(u, 2000);
  ok('new user after OTP → complete-profile', path(u) === '/app/complete-profile', path(u));
  await u.fill('input[placeholder="مثلاً علی محمدی"]', 'کاربر تست');
  await u.click('button:text-is("مرد")'); await u.locator('button:has-text("کاهش وزن"), button:has-text("سلامتی"), button:has-text("تناسب")').first().click().catch(()=>{});
  await u.click('button:has-text("ثبت و ادامه")'); await settle(u, 900);
  await u.locator('[role=dialog] button, .fixed button').last().click().catch(()=>{}); await settle(u, 1200);
  ok('complete profile → /app/home', path(u) === '/app/home', path(u));
  await u.reload(); await settle(u);
  ok('refresh keeps user on /app/home', path(u) === '/app/home', path(u));
  // return after login: logout then deep link
  await u.evaluate(() => { const s = JSON.parse(localStorage.getItem('kayar.mobile.v1')); s.verified = false; localStorage.setItem('kayar.mobile.v1', JSON.stringify(s)); });
  await u.goto(B + '/app/coaches'); await settle(u);
  await u.fill('input[inputmode=numeric]', '9123334444'); await u.click('button[type=submit]'); await settle(u, 1500);
  await u.fill('input >> nth=0', '123456'); await settle(u, 2000);
  ok('returning user lands back on deep link /app/coaches', path(u) === '/app/coaches', path(u));
  // coach detail + chat (mock)
  await u.goto(B + '/app/coaches/demo-coach-1'); await settle(u);
  ok('coach detail renders (demo coach)', (await u.content()).includes('سارا محمدی'));
  await u.click('button[aria-label="پیام به مربی"]'); await settle(u);
  ok('message coach → /app/messages/:id', /^\/app\/messages\/.+/.test(path(u)), path(u));
  await u.fill('input[aria-label="پیام"]', 'سلام تست'); await u.click('button[aria-label="ارسال"]'); await settle(u, 500);
  await u.reload(); await settle(u);
  ok('chat message persists after refresh', (await u.content()).includes('سلام تست'));
  // rewards/challenges without real account
  await u.goto(B + '/rewards'); await settle(u, 2500);
  ok('/rewards stays (no redirect to login)', path(u) === '/rewards', path(u));
  const joinBtn = u.locator('button:has-text("شرکت در چالش")').first();
  ok('challenge join button enabled', await joinBtn.count() > 0 && await joinBtn.isEnabled());
  if (await joinBtn.count()) { await joinBtn.click(); await settle(u); }
  ok('join challenge works in test mode (no login redirect)', path(u) === '/rewards' && (await u.locator('input[type=number]').count()) > 0, path(u));
  const red = u.locator('button:has-text("۲۰۰ امتیاز")').first();
  if (await red.count()) { await red.click(); await settle(u); }
  ok('redeem reward works in test mode', (await u.content()).includes('جایزه دریافت شد'));
  await u.goto(B + '/campaigns'); await settle(u, 2000);
  ok('/campaigns renders', path(u) === '/campaigns' && !(await blank(u)));
  await u.goto(B + '/campaigns/demo-campaign-1'); await settle(u, 2000);
  ok('campaign detail renders', (await u.content()).includes('چالش پاییز فعال'));
  // role switch: user → coach login form is shown (not bounced to user home)
  await u.goto(B + '/app/coach/login'); await settle(u);
  ok('signed-in user can open coach login to switch role', path(u) === '/app/coach/login', path(u));
  // legacy URLs
  for (const [l, exp] of [['/messages', '/app/messages'], ['/coach/login', '/app/coach/login'], ['/coaches/demo-coach-2', '/app/coaches/demo-coach-2'], ['/home', '/app/home']]) {
    await u.goto(B + l); await settle(u);
    ok(`legacy ${l} → ${exp}`, path(u) === exp, path(u));
  }
  await u.goto(B + '/'); await settle(u, 1500);
  ok('landing / renders', !(await blank(u)));
  await u.goto(B + '/app/does-not-exist'); await settle(u);
  ok('unknown /app route shows 404 screen (no white page)', !(await blank(u)));
  ok('no redirect loop (navigation count sane)', navCount < 200, String(navCount));
  console.log(results.join('\n')); console.log('\nERRORS:', errors.length ? '\n' + [...new Set(errors)].join('\n') : 'none');
  await br.close();
})().catch(e => { console.log(results.join('\n')); console.log('CRASH', e.message); process.exit(1); });
