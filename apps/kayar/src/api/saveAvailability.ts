import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { requireApprovedCoach } from '../server/coach';

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export default createEndpoint({
  description: "Replaces the signed-in coach's weekly availability slots",
  authenticated: true,
  inputSchema: z.object({ slots: z.array(z.object({ weekday: z.string(), startTime: time, endTime: time })).max(50) }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    if (input.slots.some((s) => s.endTime <= s.startTime))
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'range', userFacingMessage: 'ساعت پایان باید بعد از ساعت شروع باشد.' });
    const c = await requireApprovedCoach(context.user.id);
    const old = await zite.coachAvailability.findAll({ filters: { coach: c.id }, limit: 200 });
    await Promise.all(old.records.map((r) => zite.coachAvailability.delete({ id: r.id })));
    if (input.slots.length)
      await zite.coachAvailability.bulkCreate({ records: input.slots.map((s) => ({ ...s, coach: c.id, label: `${s.weekday} ${s.startTime}-${s.endTime}` })) as never });
    return { ok: true };
  },
});
