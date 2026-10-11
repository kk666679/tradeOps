import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  console.log('seed-demo: extend prisma/seed.ts or call it here.');
}
main().finally(() => db.$disconnect());
