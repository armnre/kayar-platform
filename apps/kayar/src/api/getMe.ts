import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { first, ageFrom } from '../server/util';
import { findMyCoach } from '../server/coach';
import { aiConfigured } from '../server/ai';

export default createEndpoint({
  description: "Returns the signed-in user's profile and all of their personal data",
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const uid = context.user.id;
    let profile = await zite.profiles.findOne({ filters: { user: uid } });
    if (!profile) {
      profile = await zite.profiles.create({
        record: { user: uid, displayName: [context.user.firstName, context.user.lastName].filter(Boolean).join(' ') || context.user.email.split('@')[0], points: 0, onboarded: false } as never,
      });
    }
    const [requests, plans, activity, messages, parts, redemptions, progress, coaches] = await Promise.all([
      zite.coachingRequests.findAll({ filters: { client: uid }, limit: 200 }),
      zite.workoutPlans.findAll({ filters: { owner: uid }, limit: 100 }),
      zite.activityLogs.findAll({ filters: { owner: uid }, limit: 500 }),
      zite.bodyyarMessages.findAll({ filters: { owner: uid }, limit: 500 }),
      zite.challengeParticipations.findAll({ filters: { owner: uid }, limit: 200 }),
      zite.rewardRedemptions.findAll({ filters: { owner: uid }, limit: 200 }),
      zite.listeningProgress.findAll({ filters: { owner: uid }, limit: 500 }),
      zite.coaches.findAll({ limit: 500, fields: ['name'] as never }),
    ]);
    const myCoach = await findMyCoach(uid);
    const coachName = new Map(coaches.records.map((c) => [c.id, c.name ?? '']));
    const p = profile!;
    return {
      aiReady: aiConfigured(),
      coach: myCoach ? { id: myCoach.id, status: myCoach.status ?? '', name: myCoach.name ?? '' } : null,
      profile: {
        id: p.id, displayName: p.displayName ?? '', phone: p.phone ?? '', heightCm: p.heightCm ?? null, weightKg: p.weightKg ?? null,
        birthDate: p.birthDate ? p.birthDate.slice(0, 10) : null, age: ageFrom(p.birthDate), activityLevel: p.activityLevel ?? '', gender: p.gender ?? '', goal: p.goal ?? '', level: p.level ?? '', equipment: p.equipment ?? '',
        healthNotes: p.healthNotes ?? '', points: p.points ?? 0, onboarded: !!p.onboarded,
      },
      requests: requests.records
        .map((r) => ({ id: r.id, title: r.title ?? '', status: r.status ?? '', message: r.message ?? '', sessionAt: r.sessionAt ?? null, coachId: first(r.coach) ?? '', coachName: coachName.get(first(r.coach) ?? '') ?? '' }))
        .reverse(),
      plans: plans.records.map((w) => ({ id: w.id, title: w.title ?? '', content: w.content ?? '', source: w.source ?? '', status: w.status ?? '' })).reverse(),
      activity: activity.records
        .map((a) => ({ id: a.id, title: a.title ?? '', date: a.date ?? '', durationMinutes: a.durationMinutes ?? 0, calories: a.calories ?? 0, weightKg: a.weightKg ?? null, notes: a.notes ?? '' }))
        .sort((a, b) => b.date.localeCompare(a.date)),
      messages: messages.records
        .map((m) => ({ id: m.id, role: m.role ?? 'user', content: m.content ?? '', created: m.created ?? '' }))
        .sort((a, b) => a.created.localeCompare(b.created)),
      participations: parts.records.map((x) => ({ id: x.id, challengeId: first(x.challenge) ?? '', progress: x.progress ?? 0, completed: !!x.completed })),
      redemptions: redemptions.records.map((x) => ({ id: x.id, code: x.code ?? '', rewardId: first(x.reward) ?? '' })),
      listening: progress.records.map((x) => ({ id: x.id, contentId: first(x.content) ?? '', positionSeconds: x.positionSeconds ?? 0, saved: !!x.saved })),
    } as {
      aiReady: boolean;
      coach: { id: string; status: string; name: string } | null;
      profile: { id: string; displayName: string; phone: string; heightCm: number | null; weightKg: number | null; birthDate: string | null; age: number | null; activityLevel: string; gender: string; goal: string; level: string; equipment: string; healthNotes: string; points: number; onboarded: boolean };
      requests: { id: string; title: string; status: string; message: string; sessionAt: string | null; coachId: string; coachName: string }[];
      plans: { id: string; title: string; content: string; source: string; status: string }[];
      activity: { id: string; title: string; date: string; durationMinutes: number; calories: number; weightKg: number | null; notes: string }[];
      messages: { id: string; role: string; content: string; created: string }[];
      participations: { id: string; challengeId: string; progress: number; completed: boolean }[];
      redemptions: { id: string; code: string; rewardId: string }[];
      listening: { id: string; contentId: string; positionSeconds: number; saved: boolean }[];
    };
  },
});
