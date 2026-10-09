import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { requireApprovedCoach } from '../server/coach';

export default createEndpoint({
  description: "Updates the signed-in coach's public profile and availability settings",
  authenticated: true,
  inputSchema: z.object({
    title: z.string().trim().min(2).max(100),
    bio: z.string().trim().min(30).max(2000),
    avatarUrl: z.string().url().or(z.literal('')),
    sports: z.string().trim().max(200),
    city: z.string().trim().max(60),
    specialties: z.array(z.string()).min(1),
    services: z.array(z.string()).min(1),
    levels: z.array(z.string()).min(1),
    acceptingClients: z.boolean(),
    weeklyCapacity: z.number().int().min(0).max(200),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const c = await requireApprovedCoach(context.user.id);
    const { levels, ...rest } = input;
    await zite.coaches.update({ id: c.id, record: { ...rest, levelsServed: levels, avatarUrl: input.avatarUrl || null } as never });
    return { ok: true };
  },
});
