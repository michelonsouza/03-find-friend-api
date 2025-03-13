import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

export const prisma = new PrismaClient({
  /* v8 ignore next 1 */
  log: env.NODE_ENV === 'development' ? ['query'] : [],
});
