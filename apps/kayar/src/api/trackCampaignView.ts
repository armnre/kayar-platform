import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: 'Counts a view of a campaign page for sponsor reporting',
  inputSchema: z.object({ campaignId: z.string() }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input }) => {
    const c = await zite.campaigns.findOne({ id: input.campaignId });
    if (c?.status === 'فعال') await zite.campaigns.update({ id: c.id, record: { views: (c.views ?? 0) + 1 } as never });
    return { ok: true };
  },
});
