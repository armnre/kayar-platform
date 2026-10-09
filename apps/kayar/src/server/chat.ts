import { zite } from 'zitejs/db';
import { ZiteError } from 'zitejs/backend';
import { first } from './util';

export type Role = 'client' | 'coach';

/** Loads a conversation and returns the caller's role in it; throws if they aren't a member. */
export async function requireMember(conversationId: string, uid: string) {
  const conv = await zite.conversations.findOne({ id: conversationId });
  if (!conv) throw new ZiteError({ code: 'NOT_FOUND', message: 'conversation', userFacingMessage: 'گفتگو پیدا نشد.' });
  const role: Role | null = first(conv.client) === uid ? 'client' : first(conv.coachAccount) === uid ? 'coach' : null;
  if (!role) throw new ZiteError({ code: 'FORBIDDEN', message: 'not a member', userFacingMessage: 'به این گفتگو دسترسی ندارید.' });
  return { conv, role };
}
