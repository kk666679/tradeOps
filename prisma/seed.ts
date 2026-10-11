import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { HS_CODES } from '../components/trade-ops/hs-classification/hs-code-data';
const db = new PrismaClient();

async function main() {
  const tenant = await db.tenant.upsert({ where: { slug: 'demo' }, update: {}, create: { name: 'Demo CFS', slug: 'demo' } });
  const password = await bcrypt.hash('changeme123', 12);
  await db.user.upsert({
    where: { email: 'admin@demo.local' },
    update: {},
    create: { email: 'admin@demo.local', password, role: 'SUPER_ADMIN', tenantId: tenant.id, name: 'Demo Admin' },
  });

  // Seed real-world HS codes (WCO HS 2022 reference dataset)
  let seeded = 0;
  for (const h of HS_CODES) {
    const existing = await db.hsCode.findFirst({ where: { code: h.code } });
    if (!existing) {
      await db.hsCode.create({
        data: {
          code: h.code,
          description: h.description,
          chapter: h.chapter,
          heading: h.heading,
          subheading: h.code,
          kind: h.kind,
          status: 'ACTIVE',
          dutyRate: h.dutyRate,
          salesTaxRate: h.salesTaxRate,
          exciseRate: h.exciseRate,
          uom: h.uom,
          controlled: h.controlled,
          importQuota: h.importQuota,
          hazardous: h.hazardous,
          metadata: { keywords: h.keywords, source: 'WCO HS 2022' },
        },
      });
      seeded++;
    }
  }
  console.log(`seeded tenant=demo user=admin@demo.local`);
  console.log(`seeded hs_codes=${seeded}`);
}
main().finally(() => db.$disconnect());
