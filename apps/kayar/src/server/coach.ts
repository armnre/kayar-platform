import { zite } from 'zitejs/db';
import { ZiteError } from 'zitejs/backend';

export const APPROVED = 'تایید شده';

/** The coach row owned by this user (any status), if any. */
export const findMyCoach = (uid: string) => zite.coaches.findOne({ filters: { user: uid } });

/** The approved coach owned by this user, or throws 403. */
export async function requireApprovedCoach(uid: string) {
  const c = await findMyCoach(uid);
  if (!c || c.status !== APPROVED) throw new ZiteError({ code: 'FORBIDDEN', message: 'not an approved coach', userFacingMessage: 'این بخش فقط برای مربیان تأییدشده است.' });
  return c;
}
