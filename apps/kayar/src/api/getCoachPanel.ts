import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

import { findMyCoach } from '../server/coach';

type Req = { id: string; title: string; status: string; message: string; sessionAt: string | null; clientId: string; clientName: string; planName: string; created: string };

export default createEndpoint({
  description: "Returns the signed-in coach's application status, profile, plans, schedule, requests and stats",
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const c = await findMyCoach(context.user.id);
    if (!c) return { coach: null } as { coach: null };
    const [plans, slots, reqRows] = await Promise.all([
      zite.coachPlans.findAll({ filters: { coach: c.id }, limit: 200 }),
      zite.coachAvailability.findAll({ filters: { coach: c.id }, limit: 200 }),
      zite.sql({
        query: `SELECT r.id, r."title", r."status", r."message", r."sessionAt", r.created_at AS created, r."client"->>0 AS "clientId",
                  COALESCE(NULLIF(u."name", ''), u."email") AS "clientName",
                  (SELECT p."name" FROM "CoachPlansCoachingRequests" lp JOIN "CoachPlans" p ON p.id = lp."coachPlansId" WHERE lp."coachingRequestsId" = r.id LIMIT 1) AS "planName"
                FROM "CoachingRequests" r
                JOIN "CoachesCoachingRequests" l ON l."coachingRequestsId" = r.id AND l."coachesId" = $1
                LEFT JOIN "ziteUsers" u ON u.id = r."client"->>0
                ORDER BY r.created_at DESC LIMIT 300`,
        params: [c.id],
      }),
    ]);
    const requests: Req[] = reqRows.rows.map((r) => ({
      id: String(r.id), title: String(r.title ?? ''), status: String(r.status ?? ''), message: String(r.message ?? ''),
      sessionAt: r.sessionAt ? String(r.sessionAt) : null, clientId: String(r.clientId ?? ''), clientName: String(r.clientName ?? 'کاربر'),
      planName: String(r.planName ?? ''), created: String(r.created ?? ''),
    }));
    const clients = new Map<string, { id: string; name: string; sessions: number; lastAt: string | null }>();
    for (const r of requests.filter((x) => x.status === 'پذیرفته شده')) {
      const cur = clients.get(r.clientId) ?? { id: r.clientId, name: r.clientName, sessions: 0, lastAt: null };
      cur.sessions++; if (r.sessionAt && (!cur.lastAt || r.sessionAt > cur.lastAt)) cur.lastAt = r.sessionAt;
      clients.set(r.clientId, cur);
    }
    const priceOf = new Map(plans.records.map((p) => [p.name ?? '', p.price ?? 0]));
    return {
      coach: {
        id: c.id, status: c.status ?? '', adminNotes: c.adminNotes ?? '', name: c.name ?? '', title: c.title ?? '', bio: c.bio ?? '',
        avatarUrl: c.avatarUrl ?? '', category: c.category ?? '', sports: c.sports ?? '', city: c.city ?? '', specialties: c.specialties ?? [],
        services: c.services ?? [], levels: c.levelsServed ?? [], acceptingClients: c.acceptingClients !== false, weeklyCapacity: c.weeklyCapacity ?? 0,
        rating: c.rating ?? 0, reviewCount: c.reviewCount ?? 0, yearsExperience: c.yearsExperience ?? 0, certifications: c.certifications ?? '',
      },
      plans: plans.records.map((p) => ({ id: p.id, name: p.name ?? '', sessions: p.sessions ?? 0, durationWeeks: p.durationWeeks ?? 0, price: p.price ?? 0, description: p.description ?? '' })),
      availability: slots.records.map((s) => ({ id: s.id, weekday: s.weekday ?? '', startTime: s.startTime ?? '', endTime: s.endTime ?? '' })),
      requests,
      clients: [...clients.values()],
      stats: {
        pending: requests.filter((r) => r.status === 'در انتظار').length,
        accepted: requests.filter((r) => r.status === 'پذیرفته شده').length,
        upcoming: requests.filter((r) => r.status === 'پذیرفته شده' && r.sessionAt && r.sessionAt > new Date().toISOString()).length,
        revenue: requests.filter((r) => r.status === 'پذیرفته شده').reduce((a, r) => a + (priceOf.get(r.planName) ?? 0), 0),
      },
    } as {
      coach: { id: string; status: string; adminNotes: string; name: string; title: string; bio: string; avatarUrl: string; category: string; sports: string; city: string; specialties: string[]; services: string[]; levels: string[]; acceptingClients: boolean; weeklyCapacity: number; rating: number; reviewCount: number; yearsExperience: number; certifications: string };
      plans: { id: string; name: string; sessions: number; durationWeeks: number; price: number; description: string }[];
      availability: { id: string; weekday: string; startTime: string; endTime: string }[];
      requests: Req[];
      clients: { id: string; name: string; sessions: number; lastAt: string | null }[];
      stats: { pending: number; accepted: number; upcoming: number; revenue: number };
    } | { coach: null };
  },
});
