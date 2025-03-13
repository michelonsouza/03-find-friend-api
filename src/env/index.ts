import { config } from 'dotenv';
import { z } from 'zod';

function getEnv() {
  const envs = {
    test: '.env.test',
    development: undefined,
    production: '.env',
  };

  config({ path: envs[process.env.NODE_ENV as keyof typeof envs] });
}

getEnv();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️ Invalid environment variables:', _env.error.format());

  process.exit(1);
}

export const env = _env.data;
