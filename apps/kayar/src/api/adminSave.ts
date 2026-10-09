import { requireAdmin } from '../server/adminAuth';
import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { TABLES, ENTITIES, SKIP } from '../server/entities';

export default createEndpoint({
  description: 'Creates, updates or deletes a managed content record',
  inputSchema: z.object({ token: z.string(),
    entity: z.enum(ENTITIES),
    id: z.string().optional(),
    record: z.record(z.any()).optional(),
    remove: z.boolean().optional(),
  }),
  outputSchema: z.object({ id: z.string() }),
  execute: async ({ input }) => {
    await requireAdmin(input.token);
    const table = TABLES[input.entity] as typeof TABLES.audio;
    if (input.remove) {
      if (!input.id) throw new ZiteError({ code: 'BAD_REQUEST', message: 'id', userFacingMessage: 'شناسه رکورد مشخص نیست.' });
      await table.delete({ id: input.id });
      return { id: input.id };
    }
    const rec: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input.record ?? {})) if (!SKIP.has(k)) rec[k] = v === '' ? null : v;
    if (!rec.title) throw new ZiteError({ code: 'BAD_REQUEST', message: 'title', userFacingMessage: 'عنوان الزامی است.' });
    if (input.id) { await table.update({ id: input.id, record: rec as never }); return { id: input.id }; }
    const created = await table.create({ record: rec as never });
    return { id: created.id };
  },
});
