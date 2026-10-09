import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids } from '../server/util';
import { requireApprovedCoach } from '../server/coach';

export default createEndpoint({
  description: 'Lets a coach accept or reject a booking request addressed to them',
  authenticated: true,
  inputSchema: z.object({ requestId: z.string(), status: z.enum(['پذیرفته شده', 'رد شده']) }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const c = await requireApprovedCoach(context.user.id);
    const r = await zite.coachingRequests.findOne({ id: input.requestId });
    if (!r || !ids(r.coach).includes(c.id)) throw new ZiteError({ code: 'FORBIDDEN', message: 'request', userFacingMessage: 'این درخواست متعلق به شما نیست.' });
    if (r.status !== 'در انتظار') throw new ZiteError({ code: 'BAD_REQUEST', message: 'state', userFacingMessage: 'وضعیت این درخواست قبلاً تعیین شده است.' });
    await zite.coachingRequests.update({ id: r.id, record: { status: input.status } as never });
    return { ok: true };
  },
});
