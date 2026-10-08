import { ZiteError } from 'zitejs/backend';

/**
 * Provider-agnostic AI contract. Any OpenAI-compatible chat API works
 * (OpenAI, OpenRouter, Together, local gateways). Configure via secrets:
 *   ZITE_AI_API_KEY   (required)
 *   ZITE_AI_BASE_URL  (optional, default https://api.openai.com/v1)
 *   ZITE_AI_MODEL     (optional, default gpt-4o-mini)
 */
export type AiMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export const SAFETY_PROMPT = `تو «بدن‌یار» دستیار ورزشی کایار هستی. به فارسی روان، کوتاه و دلگرم‌کننده پاسخ بده.
قوانین ایمنی: تشخیص پزشکی نده؛ برای درد، آسیب، بیماری قلبی، بارداری یا بیماری مزمن کاربر را به پزشک ارجاع بده؛
رژیم‌های شدید (کمتر از ۱۲۰۰ کالری) یا مکمل/دارو تجویز نکن؛ همیشه گرم کردن و سرد کردن را یادآوری کن.`;

const env = process.env as Record<string, string | undefined>;

export function aiConfigured() {
  return Boolean(env.ZITE_AI_API_KEY);
}

export async function chatCompletion(messages: AiMessage[], json = false): Promise<string> {
  const key = env.ZITE_AI_API_KEY;
  if (!key) {
    throw new ZiteError({
      code: 'BAD_REQUEST',
      message: 'AI provider not configured (ZITE_AI_API_KEY missing)',
      userFacingMessage: 'سرویس هوش مصنوعی هنوز متصل نشده است. به‌زودی فعال می‌شود.',
    });
  }
  const base = env.ZITE_AI_BASE_URL || 'https://api.openai.com/v1';
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.ZITE_AI_MODEL || 'gpt-4o-mini',
      messages,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) {
    console.error('AI error', res.status, await res.text());
    throw new ZiteError({ code: 'INTERNAL_ERROR', message: `AI ${res.status}`, userFacingMessage: 'پاسخ از هوش مصنوعی دریافت نشد. دوباره تلاش کنید.' });
  }
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? '';
}
