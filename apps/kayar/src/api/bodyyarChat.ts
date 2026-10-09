import { ageFrom } from '../server/util';
import { z } from 'zod';
import { createEndpoint } from 'zitejs/backend';
import { zite } from 'zitejs/db';
import { chatCompletion, SAFETY_PROMPT } from '../server/ai';

export default createEndpoint({
  description: 'Sends a message to the BodyYar AI assistant and stores the conversation',
  authenticated: true,
  inputSchema: z.object({ message: z.string().min(1).max(2000) }),
  outputSchema: z.object({ reply: z.string() }),
  execute: async ({ input, context }) => {
    const uid = context.user.id;
    const [profile, history] = await Promise.all([
      zite.profiles.findOne({ filters: { user: uid } }),
      zite.bodyyarMessages.findAll({ filters: { owner: uid }, limit: 500 }),
    ]);
    const recent = history.records.sort((a, b) => (a.created ?? '').localeCompare(b.created ?? '')).slice(-12);
    const about = profile
      ? `پروفایل کاربر: قد ${profile.heightCm ?? '?'}، وزن ${profile.weightKg ?? '?'}، سن ${ageFrom(profile.birthDate) ?? '?'}، جنسیت ${profile.gender ?? '?'}، هدف ${profile.goal ?? '?'}، سطح ${profile.level ?? '?'}، امکانات ${profile.equipment ?? '?'}، ملاحظات سلامتی: ${profile.healthNotes || 'ندارد'}`
      : '';
    const reply = await chatCompletion([
      { role: 'system', content: `${SAFETY_PROMPT}\n${about}` },
      ...recent.map((m) => ({ role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user', content: m.content ?? '' })),
      { role: 'user', content: input.message },
    ]);
    await zite.bodyyarMessages.bulkCreate({
      records: [
        { owner: uid, role: 'user', content: input.message },
        { owner: uid, role: 'assistant', content: reply },
      ] as never,
    });
    return { reply };
  },
});
