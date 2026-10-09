import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first } from '../server/util';
import { requireMember } from '../server/chat';

export default createEndpoint({
  description: 'Returns messages of a conversation the signed-in user belongs to and marks them read',
  authenticated: true,
  inputSchema: z.object({ conversationId: z.string(), markRead: z.boolean().optional() }),
  outputSchema: z.object({
    role: z.enum(['client', 'coach']),
    otherName: z.string(),
    otherAvatar: z.string(),
    coachId: z.string(),
    otherLastReadAt: z.string().nullable(),
    messages: z.array(z.object({ id: z.string(), body: z.string(), mine: z.boolean(), sentAt: z.string(), clientMessageId: z.string() })),
  }),
  execute: async ({ input, context }) => {
    const uid = context.user.id;
    const { conv, role } = await requireMember(input.conversationId, uid);
    const coachId = first(conv.coach) ?? '';
    const [msgs, coach, other] = await Promise.all([
      zite.sql({
        query: `SELECT m.id, m."body", m."sender"->>0 AS sender, m."clientMessageId", m.created_at AS "sentAt"
                FROM "ChatMessages" m JOIN "ChatMessagesConversations" l ON l."chatMessagesId" = m.id
                WHERE l."conversationsId" = $1 ORDER BY m.created_at ASC LIMIT 1000`,
        params: [conv.id],
      }),
      coachId ? zite.coaches.findOne({ id: coachId }) : Promise.resolve(undefined),
      role === 'coach' ? zite.sql({ query: `SELECT "name", "email", "image" FROM "ziteUsers" WHERE id = $1`, params: [first(conv.client) ?? ''] }) : Promise.resolve(null),
    ]);
    if (input.markRead !== false) {
      await zite.conversations.update({ id: conv.id, record: (role === 'client' ? { clientLastReadAt: new Date().toISOString() } : { coachLastReadAt: new Date().toISOString() }) as never });
    }
    const u = other?.rows[0];
    return {
      role, coachId,
      otherName: role === 'client' ? coach?.name ?? 'مربی' : String(u?.name || u?.email || 'کاربر'),
      otherAvatar: role === 'client' ? coach?.avatarUrl ?? '' : String(u?.image ?? ''),
      otherLastReadAt: (role === 'client' ? conv.coachLastReadAt : conv.clientLastReadAt) ?? null,
      messages: msgs.rows.map((m) => ({ id: String(m.id), body: String(m.body ?? ''), mine: m.sender === uid, sentAt: String(m.sentAt), clientMessageId: String(m.clientMessageId ?? '') })),
    };
  },
});
