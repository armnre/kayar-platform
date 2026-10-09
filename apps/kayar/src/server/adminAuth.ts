import { ZiteError } from 'zitejs/backend';

/**
 * TEST-MODE admin login (not production auth).
 * Username: admin. Password: secret ZITE_ADMIN_PASSWORD if set, otherwise the documented
 * test password below. Tokens are HMAC-signed and expire after 12 hours; every admin
 * endpoint verifies them on the server.
 */
export const ADMIN_USER = 'admin';
const TEST_PASSWORD = 'kayar-test-1234';
const TTL_MS = 12 * 60 * 60 * 1000;

const env = process.env as Record<string, string | undefined>;
const password = () => env.ZITE_ADMIN_PASSWORD || TEST_PASSWORD;
const signingKey = () => env.ZITE_ADMIN_SECRET || `kayar-admin:${password()}`;

async function hmac(data: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(signingKey()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function checkCredentials(username: string, pass: string) {
  return username.trim().toLowerCase() === ADMIN_USER && pass === password();
}

export async function issueToken() {
  const exp = Date.now() + TTL_MS;
  return { token: `${exp}.${await hmac(`admin.${exp}`)}`, expiresAt: exp };
}

export async function requireAdmin(token: string | undefined) {
  const [exp, sig] = (token ?? '').split('.');
  const ok = !!exp && !!sig && Number(exp) > Date.now() && sig === (await hmac(`admin.${exp}`));
  if (!ok) throw new ZiteError({ code: 'UNAUTHORIZED', message: 'admin token invalid', userFacingMessage: 'نشست مدیریت منقضی شده است. دوباره وارد شوید.' });
}
