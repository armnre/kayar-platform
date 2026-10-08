import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first } from '../server/util';

export default createEndpoint({
  description: 'Joins a challenge or records progress on it; awards points on completion',
  authenticated: true,
  inputSchema: z.object({ challengeId: z.string(), add: z.number().min(0).max(100000).optional() }),
  outputSchema: z.object({ progress: z.number(), completed: z.boolean(), awarded: z.number() }),
  execute: async ({ input, context }) => {
    const uid = context.user.id;
    const ch = await zite.challenges.findOne({ id: input.challengeId });
    if (!ch?.active) throw new ZiteError({ code: 'NOT_FOUND', message: 'challenge', userFacingMessage: 'این چالش فعال نیست.' });
    const mine = await zite.challengeParticipations.findAll({ filters: { owner: uid }, limit: 500 });
    let part = mine.records.find((p) => first(p.challenge) === ch.id);
    if (!part) {
      part = await zite.challengeParticipations.create({ record: { label: ch.title, owner: uid, challenge: ch.id, progress: 0, completed: false } as never });
    }
    if (part.completed || !input.add) return { progress: part.progress ?? 0, completed: !!part.completed, awarded: 0 };
    const target = ch.target ?? 1;
    const progress = Math.min(target, (part.progress ?? 0) + input.add);
    const completed = progress >= target;
    await zite.challengeParticipations.update({ id: part.id, record: { progress, completed } as never });
    let awarded = 0;
    if (completed) {
      awarded = ch.points ?? 0;
      const p = await zite.profiles.findOne({ filters: { user: uid } });
      if (p) await zite.profiles.update({ id: p.id, record: { points: (p.points ?? 0) + awarded } as never });
    }
    return { progress, completed, awarded };
  },
});
