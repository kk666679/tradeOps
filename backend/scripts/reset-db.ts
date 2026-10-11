import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
  await db.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  console.log('reset-db done');
}
main().finally(() => db.$disconnect());
