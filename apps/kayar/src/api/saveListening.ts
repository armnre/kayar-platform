import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first } from '../server/util';

export default createEndpoint({
  description: 'Saves listening position and/or bookmark for an audio item',
  authenticated: true,
  inputSchema: z.object({ contentId: z.string(), positionSeconds: z.number().min(0).optional(), saved: z.boolean().optional() }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input, context }) => {
    const mine = await zite.listeningProgress.findAll({ filters: { owner: context.user.id }, limit: 1000 });
    const existing = mine.records.find((r) => first(r.content) === input.contentId);
    const patch: Record<string, unknown> = {};
    if (input.positionSeconds !== undefined) patch.positionSeconds = Math.floor(input.positionSeconds);
    if (input.saved !== undefined) patch.saved = input.saved;
    if (existing) await zite.listeningProgress.update({ id: existing.id, record: patch as never });
    else await zite.listeningProgress.create({ record: { label: input.contentId, owner: context.user.id, content: input.contentId, positionSeconds: 0, saved: false, ...patch } as never });
    return { ok: true };
  },
});
