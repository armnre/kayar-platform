import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first, ids } from '../server/util';

export default createEndpoint({
  description: 'Returns the public catalog: coaches, audio, campaigns, challenges and rewards',
  inputSchema: z.object({}),
  outputSchema: z.any(),
  execute: async () => {
    const [coaches, plans, audio, campaigns, challenges, rewards] = await Promise.all([
      zite.coaches.findAll({ filters: { status: 'تایید شده' }, limit: 500 }),
      zite.coachPlans.findAll({ limit: 2000 }),
      zite.audioContents.findAll({ filters: { published: true }, limit: 500 }),
      zite.campaigns.findAll({ filters: { status: 'فعال' }, limit: 100 }),
      zite.challenges.findAll({ filters: { active: true }, limit: 200 }),
      zite.rewards.findAll({ limit: 200 }),
    ]);
    return {
      coaches: coaches.records.map((c) => ({
        id: c.id,
        name: c.name ?? '',
        title: c.title ?? '',
        specialties: c.specialties ?? [],
        bio: c.bio ?? '',
        avatarUrl: c.avatarUrl ?? '',
        yearsExperience: c.yearsExperience ?? 0,
        rating: c.rating ?? 0,
        reviewCount: c.reviewCount ?? 0,
        certifications: c.certifications ?? '',
        plans: plans.records
          .filter((p) => ids(p.coach).includes(c.id))
          .map((p) => ({ id: p.id, name: p.name ?? '', sessions: p.sessions ?? 0, durationWeeks: p.durationWeeks ?? 0, price: p.price ?? 0, description: p.description ?? '' })),
      })),
      audio: audio.records.map((a) => ({
        id: a.id, title: a.title ?? '', category: a.category ?? '', description: a.description ?? '',
        audioUrl: a.audioUrl ?? '', coverUrl: a.coverUrl ?? '', durationSeconds: a.durationSeconds ?? 0, author: a.author ?? '',
      })),
      campaigns: campaigns.records.map((c) => ({
        id: c.id, title: c.title ?? '', brand: c.brand ?? '', description: c.description ?? '', coverUrl: c.coverUrl ?? '', endsOn: c.endsOn ?? null,
      })),
      challenges: challenges.records.map((c) => ({
        id: c.id, title: c.title ?? '', description: c.description ?? '', target: c.target ?? 1, unit: c.unit ?? '', points: c.points ?? 0, endsOn: c.endsOn ?? null, campaignId: first(c.campaign) ?? null,
      })),
      rewards: rewards.records.map((r) => ({
        id: r.id, title: r.title ?? '', description: r.description ?? '', costPoints: r.costPoints ?? 0, kind: r.kind ?? '', stock: r.stock ?? 0,
      })),
    } as {
      coaches: { id: string; name: string; title: string; specialties: string[]; bio: string; avatarUrl: string; yearsExperience: number; rating: number; reviewCount: number; certifications: string; plans: { id: string; name: string; sessions: number; durationWeeks: number; price: number; description: string }[] }[];
      audio: { id: string; title: string; category: string; description: string; audioUrl: string; coverUrl: string; durationSeconds: number; author: string }[];
      campaigns: { id: string; title: string; brand: string; description: string; coverUrl: string; endsOn: string | null }[];
      challenges: { id: string; title: string; description: string; target: number; unit: string; points: number; endsOn: string | null; campaignId: string | null }[];
      rewards: { id: string; title: string; description: string; costPoints: number; kind: string; stock: number }[];
    };
  },
});
