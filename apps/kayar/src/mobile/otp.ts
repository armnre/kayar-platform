/**
 * OTP provider. DEMO mode accepts the fixed code below for any number.
 * To go live: implement `liveProvider` by calling backend endpoints
 * (e.g. sendOtp / verifyOtp backed by an SMS gateway such as Kavenegar / SMS.ir)
 * and switch `OTP_MODE` to 'live'.
 */
export const OTP_MODE: 'demo' | 'live' = 'demo';
export const DEMO_CODE = '123456';
export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 45;

export interface OtpProvider {
  send(phone: string): Promise<void>;
  verify(phone: string, code: string): Promise<boolean>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const demoProvider: OtpProvider = {
  async send() { await wait(700); },
  async verify(_p, code) { await wait(600); return code === DEMO_CODE; },
};

const liveProvider: OtpProvider = {
  async send() { throw new Error('سرویس پیامک هنوز متصل نشده است.'); },
  async verify() { throw new Error('سرویس پیامک هنوز متصل نشده است.'); },
};

export const otp: OtpProvider = OTP_MODE === 'demo' ? demoProvider : liveProvider;

export const isValidIrMobile = (p: string) => /^9\d{9}$/.test(p.replace(/^0/, ''));
export const normalizePhone = (p: string) => p.replace(/\D/g, '').replace(/^98/, '').replace(/^0/, '');
