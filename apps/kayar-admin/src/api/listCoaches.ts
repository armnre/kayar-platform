import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

const coach = z.object({
  id: z.string(), name: z.string(), title: z.string(), status: z.string(), category: z.string(), email: z.string(), phone: z.string(), city: z.string(),
  specialties: z.array(z.string()), services: z.array(z.string()), levels: z.array(z.string()), sports: z.string(), bio: z.string(), avatarUrl: z.string(),
  yearsExperience: z.number(), certifications: z.string(), adminNotes: z.string(), rating: z.number(), reviewCount: z.number(),
  documents: z.array(z.object({ url: z.string(), filename: z.string() })), submittedAt: z.string().nullable(),
});

export default createEndpoint({
  description: 'Lists all coaches and coach applications for review',
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.object({ coaches: z.array(coach) }),
  execute: async () => {
    const { records } = await zite.coaches.findAll({ limit: 2000 });
    return {
      coaches: records.map((c) => ({
        id: c.id, name: c.name ?? '', title: c.title ?? '', status: c.status ?? 'در انتظار تایید', category: c.category ?? '', email: c.email ?? '', phone: c.phone ?? '', city: c.city ?? '',
        specialties: c.specialties ?? [], services: c.services ?? [], levels: c.levelsServed ?? [], sports: c.sports ?? '', bio: c.bio ?? '', avatarUrl: c.avatarUrl ?? '',
        yearsExperience: c.yearsExperience ?? 0, certifications: c.certifications ?? '', adminNotes: c.adminNotes ?? '', rating: c.rating ?? 0, reviewCount: c.reviewCount ?? 0,
        documents: (c.documents ?? []).map((d) => ({ url: d.url, filename: d.filename ?? 'file' })), submittedAt: c.submittedAt ?? null,
      })).sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? '')),
    };
  },
});
