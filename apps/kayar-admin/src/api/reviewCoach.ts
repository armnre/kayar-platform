import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';

export default createEndpoint({
  description: "Updates a coach's review status, category, notes and public info",
  authenticated: true,
  inputSchema: z.object({
    id: z.string(),
    status: z.enum(['در انتظار تایید', 'تایید شده', 'نیاز به اصلاح', 'رد شده', 'معلق']),
    category: z.string(),
    adminNotes: z.string().max(2000),
    title: z.string().trim().min(2).max(100),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().int().min(0),
  }),
  outputSchema: z.object({ ok: z.boolean() }),
  execute: async ({ input }) => {
    const c = await zite.coaches.findOne({ id: input.id });
    if (!c) throw new ZiteError({ code: 'NOT_FOUND', message: 'coach', userFacingMessage: 'مربی پیدا نشد.' });
    if (input.status === 'تایید شده' && !input.category)
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'category', userFacingMessage: 'برای تأیید، دسته‌بندی مربی را مشخص کنید.' });
    if ((input.status === 'نیاز به اصلاح' || input.status === 'رد شده') && !input.adminNotes.trim())
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'notes', userFacingMessage: 'برای رد یا درخواست اصلاح، توضیح ادمین را بنویسید.' });
    const { id, ...record } = input;
    await zite.coaches.update({ id, record: { ...record, category: record.category || null } as never });
    return { ok: true };
  },
});
