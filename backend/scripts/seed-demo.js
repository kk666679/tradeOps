"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient();
async function main() {
    console.log('seed-demo: extend prisma/seed.ts or call it here.');
}
main().finally(() => db.$disconnect());
//# sourceMappingURL=seed-demo.js.map