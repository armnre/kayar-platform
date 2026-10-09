import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { TABLES, ENTITIES, LINKS } from '../server/entities';

export default createEndpoint({
  description: 'Lists all records of a managed content type (audio, campaigns, challenges, rewards)',
  authenticated: true,
  inputSchema: z.object({ entity: z.enum(ENTITIES) }),
  outputSchema: z.object({ records: z.array(z.record(z.any())) }),
  execute: async ({ input }) => {
    const { records } = await (TABLES[input.entity] as typeof TABLES.audio).findAll({ limit: 2000 });
    return {
      records: records.map((r) => {
        const out: Record<string, unknown> = { ...r };
        for (const k of LINKS[input.entity]) out[k] = [out[k]].flat().filter(Boolean)[0] ?? '';
        return out;
      }),
    };
  },
});
