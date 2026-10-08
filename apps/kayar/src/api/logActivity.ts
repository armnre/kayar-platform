import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids } from '../server/util';

export default createEndpoint({
  description: 'Logs a workout/activity for the signed-in user, or deletes one',
  authenticated: true,
  inputSchema: z.object({
    deleteId: z.string().optional(),
    title: z.string().max(80).optional(),
    date: z.string().optional(),
    durationMinutes: z.number().min(0).max(600).optional(),
    calories: z.number().min(0).max(5000).optional(),
    weightKg: z.number().min(30).max(300).nullable().optional(),
    notes: z.string().max(500).optional(),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    if (input.deleteId) {
      const a = await zite.activityLogs.findOne({ id: input.deleteId });
      if (!a || !ids(a.owner).includes(context.user.id)) throw new ZiteError({ code: 'NOT_FOUND', message: 'log', userFacingMessage: 'رکورد پیدا نشد.' });
      await zite.activityLogs.delete({ id: a.id });
      return { ok: true };
    }
    if (!input.title || !input.date) throw new ZiteError({ code: 'BAD_REQUEST', message: 'fields', userFacingMessage: 'عنوان و تاریخ الزامی است.' });
    await zite.activityLogs.create({
      record: { owner: context.user.id, title: input.title, date: input.date, durationMinutes: input.durationMinutes ?? 0, calories: input.calories ?? 0, weightKg: input.weightKg ?? null, notes: input.notes ?? '' } as never,
    });
    if (input.weightKg) {
      const p = await zite.profiles.findOne({ filters: { user: context.user.id } });
      if (p) await zite.profiles.update({ id: p.id, record: { weightKg: input.weightKg } as never });
    }
    return { ok: true };
  },
});
