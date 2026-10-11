import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../../../prisma/prisma.service';

export async function requireActiveZone(
  prisma: PrismaService | Prisma.TransactionClient,
  tenantId: string,
  code: string,
) {
  const zone = await prisma.zone.findFirst({
    where: { tenantId, code, status: 'ACTIVE' },
  });
  if (!zone) {
    throw new Error(`active zone ${code} was not found for this tenant`);
  }
  return zone;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
