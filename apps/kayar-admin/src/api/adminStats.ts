import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';

const n = (v: unknown) => Number(v ?? 0);

export default createEndpoint({
  description: 'Campaign, challenge, reward and listening stats for the admin dashboard',
  authenticated: true,
  inputSchema: z.object({}),
  outputSchema: z.any(),
  execute: async () => {
    const [totals, campaigns, rewards, audio] = await Promise.all([
      zite.sql({ query: `SELECT
        (SELECT COUNT(*) FROM "Campaigns" WHERE "status" = 'فعال') AS "activeCampaigns",
        (SELECT COUNT(*) FROM "ChallengeParticipations") AS "participations",
        (SELECT COUNT(*) FROM "ChallengeParticipations" WHERE "completed" = true) AS "completions",
        (SELECT COUNT(DISTINCT "owner"->>0) FROM "ChallengeParticipations") AS "participants",
        (SELECT COUNT(*) FROM "RewardRedemptions") AS "redemptions",
        (SELECT COALESCE(SUM("views"),0) FROM "Campaigns") AS "views",
        (SELECT COUNT(*) FROM "ListeningProgress") AS "listeners"` }),
      zite.sql({ query: `SELECT c.id, c."title", c."brand", c."status", COALESCE(c."views",0) AS "views",
          COUNT(DISTINCT p.id) AS "participations",
          COUNT(DISTINCT p.id) FILTER (WHERE p."completed" = true) AS "completions",
          COUNT(DISTINCT p."owner"->>0) AS "participants"
        FROM "Campaigns" c
        LEFT JOIN "CampaignsChallenges" cc ON cc."campaignsId" = c.id
        LEFT JOIN "ChallengeParticipationsChallenges" pc ON pc."challengesId" = cc."challengesId"
        LEFT JOIN "ChallengeParticipations" p ON p.id = pc."challengeParticipationsId"
        GROUP BY c.id ORDER BY c.created_at DESC` }),
      zite.sql({ query: `SELECT r.id, r."title", COALESCE(r."stock",0) AS "stock", COUNT(l."rewardRedemptionsId") AS "redeemed"
        FROM "Rewards" r LEFT JOIN "RewardRedemptionsRewards" l ON l."rewardsId" = r.id
        GROUP BY r.id ORDER BY COUNT(l."rewardRedemptionsId") DESC LIMIT 10` }),
      zite.sql({ query: `SELECT a.id, a."title", COUNT(l."listeningProgressId") AS "listeners",
          COUNT(lp.id) FILTER (WHERE lp."saved" = true) AS "saves"
        FROM "AudioContents" a
        LEFT JOIN "AudioContentsListeningProgress" l ON l."audioContentsId" = a.id
        LEFT JOIN "ListeningProgress" lp ON lp.id = l."listeningProgressId"
        GROUP BY a.id ORDER BY COUNT(l."listeningProgressId") DESC LIMIT 10` }),
    ]);
    const t = totals.rows[0] ?? {};
    return {
      totals: {
        activeCampaigns: n(t.activeCampaigns), participations: n(t.participations), completions: n(t.completions),
        participants: n(t.participants), redemptions: n(t.redemptions), views: n(t.views), listeners: n(t.listeners),
      },
      campaigns: campaigns.rows.map((r) => ({
        id: String(r.id), title: String(r.title ?? ''), brand: String(r.brand ?? ''), status: String(r.status ?? ''),
        views: n(r.views), participations: n(r.participations), completions: n(r.completions), participants: n(r.participants),
      })),
      rewards: rewards.rows.map((r) => ({ id: String(r.id), title: String(r.title ?? ''), stock: n(r.stock), redeemed: n(r.redeemed) })),
      audio: audio.rows.map((r) => ({ id: String(r.id), title: String(r.title ?? ''), listeners: n(r.listeners), saves: n(r.saves) })),
    } as {
      totals: Record<'activeCampaigns' | 'participations' | 'completions' | 'participants' | 'redemptions' | 'views' | 'listeners', number>;
      campaigns: { id: string; title: string; brand: string; status: string; views: number; participations: number; completions: number; participants: number }[];
      rewards: { id: string; title: string; stock: number; redeemed: number }[];
      audio: { id: string; title: string; listeners: number; saves: number }[];
    };
  },
});
