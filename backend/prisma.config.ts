// backend/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";
// If your Prisma version still resolves @prisma/config, you can keep that import,
// but prefer "prisma/config" — @prisma/config is an internal package and should
// not be installed manually[reference:2].

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});