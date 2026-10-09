import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids } from '../server/util';
import { requireApprovedCoach } from '../server/coach';

export default createEndpoint({
  description: 'Creates, updates or deletes a service plan owned by the signed-in coach',
  authenticated: true,
  inputSchema: z.object({
    id: z.string().optional(),
    remove: z.boolean().optional(),
    name: z.string().trim().min(2).max(100),
    sessions: z.number().int().min(1).max(200),
    durationWeeks: z.number().int().min(1).max(104),
    price: z.number().min(0).max(1_000_000_000),
    description: z.string().trim().max(1000),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const c = await requireApprovedCoach(context.user.id);
    const { id, remove, ...record } = input;
    if (id) {
      const plan = await zite.coachPlans.findOne({ id });
      if (!plan || !ids(plan.coach).includes(c.id)) throw new ZiteError({ code: 'FORBIDDEN', message: 'plan', userFacingMessage: 'این خدمت متعلق به شما نیست.' });
      if (remove) await zite.coachPlans.delete({ id });
      else await zite.coachPlans.update({ id, record: record as never });
    } else {
      await zite.coachPlans.create({ record: { ...record, coach: c.id } as never });
    }
    return { ok: true };
  },
});
