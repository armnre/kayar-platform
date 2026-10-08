import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids } from '../server/util';

export default createEndpoint({
  description: 'Cancels one of the signed-in user’s pending coaching requests',
  authenticated: true,
  inputSchema: z.object({ requestId: z.string() }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const r = await zite.coachingRequests.findOne({ id: input.requestId });
    if (!r || !ids(r.client).includes(context.user.id)) throw new ZiteError({ code: 'NOT_FOUND', message: 'request', userFacingMessage: 'درخواست پیدا نشد.' });
    if (r.status !== 'در انتظار') throw new ZiteError({ code: 'BAD_REQUEST', message: 'state', userFacingMessage: 'فقط درخواست‌های در انتظار قابل لغو هستند.' });
    await zite.coachingRequests.update({ id: r.id, record: { status: 'لغو شده' } as never });
    return { ok: true };
  },
});
