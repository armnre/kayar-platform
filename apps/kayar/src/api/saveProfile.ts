import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: "Updates the signed-in user's profile",
  authenticated: true,
  inputSchema: z.object({
    displayName: z.string().min(1).max(80),
    phone: z.string().max(20).optional(),
    heightCm: z.number().min(100).max(250).nullable(),
    weightKg: z.number().min(30).max(300).nullable(),
    age: z.number().min(12).max(100).nullable(),
    gender: z.string(),
    goal: z.string(),
    level: z.string(),
    equipment: z.string(),
    healthNotes: z.string().max(1000),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const p = await zite.profiles.findOne({ filters: { user: context.user.id } });
    const record = { ...input, phone: input.phone ?? null, gender: input.gender || null, goal: input.goal || null, level: input.level || null, equipment: input.equipment || null, onboarded: true };
    if (p) await zite.profiles.update({ id: p.id, record: record as never });
    else await zite.profiles.create({ record: { ...record, user: context.user.id, points: 0 } as never });
    return { ok: true };
  },
});
