import { z } from 'zod';
import { createEndpoint, ZiteError } from 'zitejs/backend';
import { checkCredentials, issueToken } from '../server/adminAuth';

export default createEndpoint({
  description: 'Signs in to the admin panel with username and password (test mode)',
  inputSchema: z.object({ username: z.string(), password: z.string() }),
  outputSchema: z.object({ token: z.string(), expiresAt: z.number() }),
  execute: async ({ input }) => {
    if (!(await checkCredentials(input.username, input.password)))
      throw new ZiteError({ code: 'UNAUTHORIZED', message: 'bad credentials', userFacingMessage: 'نام کاربری یا رمز عبور اشتباه است.' });
    return issueToken();
  },
});
