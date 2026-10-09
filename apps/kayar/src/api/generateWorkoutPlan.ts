import { ageFrom } from '../server/util';
import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { chatCompletion, SAFETY_PROMPT } from '../server/ai';

export default createEndpoint({
  description: 'Generates a personalised weekly workout plan with the AI provider and saves it',
  authenticated: true,
  inputSchema: z.object({ daysPerWeek: z.number().min(2).max(6) }),
  outputSchema: z.object({ planId: z.string() }),
  execute: async ({ input, context }) => {
    const profile = await zite.profiles.findOne({ filters: { user: context.user.id } });
    if (!profile?.onboarded) throw new ZiteError({ code: 'BAD_REQUEST', message: 'profile', userFacingMessage: 'ابتدا پروفایل بدنی خود را تکمیل کنید.' });
    const raw = await chatCompletion(
      [
        { role: 'system', content: SAFETY_PROMPT },
        {
          role: 'user',
          content: `یک برنامه تمرینی ${input.daysPerWeek} روزه در هفته بساز برای: هدف ${profile.goal}، سطح ${profile.level}، امکانات ${profile.equipment}، سن ${ageFrom(profile.birthDate) ?? '?'}، وزن ${profile.weightKg}، ملاحظات: ${profile.healthNotes || 'ندارد'}.
فقط JSON با این ساختار برگردان: {"title": string, "days": [{"name": string, "focus": string, "exercises": [{"name": string, "sets": number, "reps": string, "rest": string}]}], "notes": string}`,
        },
      ],
      true,
    );
    let parsed: { title?: string };
    try { parsed = JSON.parse(raw); } catch { throw new ZiteError({ code: 'INTERNAL_ERROR', message: 'bad json', userFacingMessage: 'برنامه تولید نشد، دوباره تلاش کنید.' }); }
    const plan = await zite.workoutPlans.create({
      record: { title: parsed.title || 'برنامه هفتگی بدن‌یار', owner: context.user.id, content: JSON.stringify(parsed), source: 'بدن‌یار', status: 'فعال' } as never,
    });
    return { planId: plan.id };
  },
});
