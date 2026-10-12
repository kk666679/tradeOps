import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    // process.env does NOT throw when unset — allows prisma generate
    // to run during postinstall without a live database URL.
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/cfs_wms',
  },
});