import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ageFrom } from '../server/util';

export default createEndpoint({
  description: "Updates the signed-in user's profile and body information",
  authenticated: true,
  inputSchema: z.object({
    displayName: z.string().trim().min(1).max(80),
    phone: z.string().max(20).optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    heightCm: z.number().min(100).max(250).nullable(),
    weightKg: z.number().min(30).max(300).nullable(),
    gender: z.string(),
    goal: z.string(),
    level: z.string(),
    activityLevel: z.string(),
    equipment: z.string(),
    healthNotes: z.string().max(1000),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    if (input.birthDate) {
      const age = ageFrom(input.birthDate);
      if (age === null || age < 12 || age > 100)
        throw new ZiteError({ code: 'BAD_REQUEST', message: 'invalid birth date', userFacingMessage: 'تاریخ تولد معتبر نیست (سن باید بین ۱۲ تا ۱۰۰ سال باشد).' });
    }
    const p = await zite.profiles.findOne({ filters: { user: context.user.id } });
    const record = {
      displayName: input.displayName, phone: input.phone || null, birthDate: input.birthDate, age: null,
      heightCm: input.heightCm, weightKg: input.weightKg, healthNotes: input.healthNotes,
      gender: input.gender || null, goal: input.goal || null, level: input.level || null,
      activityLevel: input.activityLevel || null, equipment: input.equipment || null, onboarded: true,
    };
    if (p) await zite.profiles.update({ id: p.id, record: record as never });
    else await zite.profiles.create({ record: { ...record, user: context.user.id, points: 0 } as never });
    return { ok: true };
  },
});
