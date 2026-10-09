import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { findMyCoach } from '../server/coach';

export default createEndpoint({
  description: 'Submits (or resubmits) a coach membership application for the signed-in user',
  authenticated: true,
  inputSchema: z.object({
    name: z.string().trim().min(2).max(80),
    phone: z.string().trim().min(8).max(20),
    email: z.string().email(),
    city: z.string().trim().max(60),
    title: z.string().trim().min(2).max(100),
    category: z.string().min(1),
    specialties: z.array(z.string()).min(1),
    services: z.array(z.string()).min(1),
    levels: z.array(z.string()).min(1),
    sports: z.string().trim().max(200),
    yearsExperience: z.number().min(0).max(60),
    certifications: z.string().trim().max(300),
    bio: z.string().trim().min(30).max(2000),
    avatarUrl: z.string().url(),
    documents: z.array(z.object({ url: z.string().url(), filename: z.string() })).min(1).max(10),
  }),
  outputSchema: z.object({ id: z.string(), status: z.string() }),
  execute: async ({ input, context }) => {
    const existing = await findMyCoach(context.user.id);
    if (existing && ['در انتظار تایید', 'تایید شده', 'معلق'].includes(existing.status ?? ''))
      throw new ZiteError({ code: 'BAD_REQUEST', message: 'already applied', userFacingMessage: 'درخواست شما قبلاً ثبت شده است.' });
    const { levels, documents, ...rest } = input;
    const record = { ...rest, levelsServed: levels, documents, status: 'در انتظار تایید', user: context.user.id };
    const row = existing
      ? await zite.coaches.update({ id: existing.id, record: record as never })
      : await zite.coaches.create({ record: { ...record, rating: 0, reviewCount: 0, acceptingClients: true, weeklyCapacity: 10 } as never });
    return { id: row.id, status: 'در انتظار تایید' };
  },
});
