import { zite } from 'zitejs/db';

/** Admin-managed tables. Adding a table here (plus a field config in the UI) is all a new content type needs. */
export const TABLES = {
  audio: zite.audioContents,
  campaigns: zite.campaigns,
  challenges: zite.challenges,
  rewards: zite.rewards,
} as const;
export type Entity = keyof typeof TABLES;
export const ENTITIES = ['audio', 'campaigns', 'challenges', 'rewards'] as const;
/** Link fields: stored as id arrays, exposed to the UI as a single id. */
export const LINKS: Record<Entity, string[]> = { audio: [], campaigns: [], challenges: ['campaign'], rewards: ['campaign'] };
/** Read-only/derived fields never written from the admin form. */
export const SKIP = new Set(['id', 'listeningProgress', 'challenges', 'rewards', 'challengeParticipations', 'rewardRedemptions', 'views']);
