import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Redeems a reward with the signed-in user’s points',
  authenticated: true,
  inputSchema: z.object({ rewardId: z.string() }),
  outputSchema: z.object({ code: z.string() }),
  execute: async ({ input, context }) => {
    const [reward, profile] = await Promise.all([
      zite.rewards.findOne({ id: input.rewardId }),
      zite.profiles.findOne({ filters: { user: context.user.id } }),
    ]);
    if (!reward) throw new ZiteError({ code: 'NOT_FOUND', message: 'reward', userFacingMessage: 'جایزه پیدا نشد.' });
    if ((reward.stock ?? 0) <= 0) throw new ZiteError({ code: 'BAD_REQUEST', message: 'stock', userFacingMessage: 'موجودی این جایزه تمام شده است.' });
    const cost = reward.costPoints ?? 0;
    if (!profile || (profile.points ?? 0) < cost) throw new ZiteError({ code: 'BAD_REQUEST', message: 'points', userFacingMessage: 'امتیاز شما کافی نیست.' });
    const code = 'KAYAR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    await zite.profiles.update({ id: profile.id, record: { points: (profile.points ?? 0) - cost } as never });
    await zite.rewards.update({ id: reward.id, record: { stock: (reward.stock ?? 0) - 1 } as never });
    await zite.rewardRedemptions.create({ record: { code, owner: context.user.id, reward: reward.id } as never });
    return { code };
  },
});
