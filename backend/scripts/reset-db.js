"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient();
async function main() {
    await db.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('reset-db done');
}
main().finally(() => db.$disconnect());
//# sourceMappingURL=reset-db.js.map