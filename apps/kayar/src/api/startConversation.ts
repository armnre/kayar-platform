import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first } from '../server/util';
import { APPROVED } from '../server/coach';

export default createEndpoint({
  description: 'Opens (or reuses) a conversation between the signed-in user and an approved coach',
  authenticated: true,
  inputSchema: z.object({ coachId: z.string(), requestId: z.string().optional() }),
  outputSchema: z.object({ id: z.string() }),
  execute: async ({ input, context }) => {
    const coach = await zite.coaches.findOne({ id: input.coachId });
    const coachUser = first(coach?.user);
    if (!coach || coach.status !== APPROVED || !coachUser) throw new ZiteError({ code: 'NOT_FOUND', message: 'coach', userFacingMessage: 'این مربی فعلاً امکان گفتگو ندارد.' });
    if (coachUser === context.user.id) throw new ZiteError({ code: 'BAD_REQUEST', message: 'self', userFacingMessage: 'نمی‌توانید با خودتان گفتگو کنید.' });
    const existing = await zite.conversations.findOne({ filters: { client: context.user.id, coach: coach.id } });
    if (existing) return { id: existing.id };
    const conv = await zite.conversations.create({
      record: { title: `${coach.name} ↔ ${context.user.email}`, client: context.user.id, coachAccount: coachUser, coach: coach.id, request: input.requestId ?? null } as never,
    });
    return { id: conv.id };
  },
});
