import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: "Lists the signed-in user's conversations (as client or coach) with unread counts",
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalUnread: z.number(),
    conversations: z.array(z.object({
      id: z.string(), role: z.enum(['client', 'coach']), otherName: z.string(), otherAvatar: z.string(), coachId: z.string(),
      lastMessageAt: z.string().nullable(), lastMessagePreview: z.string(), unread: z.number(),
    })),
  }),
  execute: async ({ context }) => {
    const { rows } = await zite.sql({
      query: `
        WITH mine AS (
          SELECT c.id, c."lastMessageAt", c."lastMessagePreview", c."clientLastReadAt", c."coachLastReadAt", c."client"->>0 AS "clientId",
                 CASE WHEN c."client"->>0 = $1 THEN 'client' ELSE 'coach' END AS role,
                 (SELECT l."coachesId" FROM "CoachesConversations" l WHERE l."conversationsId" = c.id LIMIT 1) AS "coachId"
          FROM "Conversations" c
          WHERE c."client"->>0 = $1 OR c."coachAccount"->>0 = $1
        )
        SELECT m.id, m.role, m."lastMessageAt", m."lastMessagePreview", m."coachId",
               CASE WHEN m.role = 'client' THEN co."name" ELSE COALESCE(NULLIF(u."name", ''), u."email") END AS "otherName",
               CASE WHEN m.role = 'client' THEN co."avatarUrl" ELSE u."image" END AS "otherAvatar",
               (SELECT COUNT(*) FROM "ChatMessagesConversations" lm JOIN "ChatMessages" msg ON msg.id = lm."chatMessagesId"
                 WHERE lm."conversationsId" = m.id AND msg."sender"->>0 <> $1
                   AND (CASE WHEN m.role = 'client' THEN m."clientLastReadAt" ELSE m."coachLastReadAt" END IS NULL
                        OR msg.created_at > CASE WHEN m.role = 'client' THEN m."clientLastReadAt" ELSE m."coachLastReadAt" END)) AS unread
        FROM mine m
        LEFT JOIN "Coaches" co ON co.id = m."coachId"
        LEFT JOIN "ziteUsers" u ON u.id = m."clientId"
        ORDER BY m."lastMessageAt" DESC NULLS LAST
        LIMIT 200`,
      params: [context.user.id],
    });
    const conversations = rows.map((r) => ({
      id: String(r.id), role: (r.role === 'coach' ? 'coach' : 'client') as 'client' | 'coach', otherName: String(r.otherName ?? 'کاربر'),
      otherAvatar: String(r.otherAvatar ?? ''), coachId: String(r.coachId ?? ''), lastMessageAt: r.lastMessageAt ? String(r.lastMessageAt) : null,
      lastMessagePreview: String(r.lastMessagePreview ?? ''), unread: Number(r.unread ?? 0),
    }));
    return { conversations, totalUnread: conversations.reduce((a, c) => a + c.unread, 0) };
  },
});
