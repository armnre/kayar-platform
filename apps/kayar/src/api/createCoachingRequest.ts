import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { ids } from '../server/util';
import { getGateway, newReference } from '../server/payments';

export default createEndpoint({
  description: 'Creates a coaching request (and a pending payment) for the signed-in user',
  authenticated: true,
  inputSchema: z.object({
    coachId: z.string(),
    planId: z.string(),
    sessionAt: z.string(),
    message: z.string().max(1000),
  }),
  outputSchema: z.object({ requestId: z.string(), reference: z.string(), gatewayConnected: z.boolean() }),
  execute: async ({ input, context }) => {
    const [coach, plan] = await Promise.all([
      zite.coaches.findOne({ id: input.coachId }),
      zite.coachPlans.findOne({ id: input.planId }),
    ]);
    if (!coach || coach.status !== 'تایید شده') throw new ZiteError({ code: 'NOT_FOUND', message: 'coach', userFacingMessage: 'مربی پیدا نشد.' });
    if (!plan || !ids(plan.coach).includes(coach.id)) throw new ZiteError({ code: 'BAD_REQUEST', message: 'plan', userFacingMessage: 'پلن انتخاب‌شده معتبر نیست.' });
    if (new Date(input.sessionAt).getTime() < Date.now()) throw new ZiteError({ code: 'BAD_REQUEST', message: 'past', userFacingMessage: 'زمان جلسه باید در آینده باشد.' });

    const req = await zite.coachingRequests.create({
      record: { title: `${plan.name} — ${coach.name}`, client: context.user.id, coach: coach.id, plan: plan.id, status: 'در انتظار', message: input.message, sessionAt: input.sessionAt } as never,
    });
    const reference = newReference();
    const gateway = getGateway();
    await zite.payments.create({
      record: { reference, payer: context.user.id, amount: plan.price ?? 0, status: 'در انتظار درگاه', provider: gateway?.name ?? 'not-connected', request: req.id } as never,
    });
    return { requestId: req.id, reference, gatewayConnected: !!gateway };
  },
});
