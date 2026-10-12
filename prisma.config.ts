import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // `classic` engine is required in v7 for the Rust schema engine
  datasource: {
    url: env('DATABASE_URL'),
  },
});