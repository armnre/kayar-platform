import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { requireMember } from '../server/chat';

const LIMIT_PER_MINUTE = 20;

export default createEndpoint({
  description: 'Sends a chat message in a conversation the signed-in user belongs to (idempotent, rate limited)',
  authenticated: true,
  inputSchema: z.object({ conversationId: z.string(), body: z.string(), clientMessageId: z.string().min(8).max(64) }),
  outputSchema: z.object({ id: z.string(), sentAt: z.string() }),
  execute: async ({ input, context }) => {
    const uid = context.user.id;
    const body = input.body.trim();
    if (!body || body.length > 2000)
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'length', userFacingMessage: 'متن پیام باید بین ۱ تا ۲۰۰۰ کاراکتر باشد.' });
    const { conv, role } = await requireMember(input.conversationId, uid);

    // Idempotency: a retried send with the same client id returns the original message.
    const dup = await zite.chatMessages.findOne({ filters: { clientMessageId: input.clientMessageId, sender: uid } });
    if (dup) return { id: dup.id, sentAt: dup.sentAt ?? new Date().toISOString() };

    const recent = await zite.sql({
      query: `SELECT COUNT(*) AS n FROM "ChatMessages" WHERE "sender"->>0 = $1 AND created_at > now() - interval '1 minute'`,
      params: [uid],
    });
    if (Number(recent.rows[0]?.n ?? 0) >= LIMIT_PER_MINUTE)
      throw new ZiteError({ code: 'RATE_LIMITED', message: 'rate', userFacingMessage: 'تعداد پیام‌ها زیاد است؛ کمی صبر کنید و دوباره بفرستید.' });

    const now = new Date().toISOString();
    const msg = await zite.chatMessages.create({
      record: { body, conversation: conv.id, sender: uid, senderRole: role, clientMessageId: input.clientMessageId } as never,
    });
    await zite.conversations.update({
      id: conv.id,
      record: { lastMessageAt: now, lastMessagePreview: body.slice(0, 120), ...(role === 'client' ? { clientLastReadAt: now } : { coachLastReadAt: now }) } as never,
    });
    return { id: msg.id, sentAt: msg.sentAt ?? now };
  },
});
