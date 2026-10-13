import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JkdmService } from './jkdm.service';
import { SAMPLE_K1 } from './fixtures/sample-k1';
import type { PrismaService } from '../../prisma/prisma.service';

/**
 * Builds an in-memory Prisma double covering only the models JkdmService
 * touches: jkdmOperation, jkdmManualResponse, auditLog.
 */
function makePrisma() {
  const operations = new Map<string, any>();
  const manualResponses = new Map<string, any>();
  const auditLogs: any[] = [];

  const prisma: any = {
    jkdmOperation: {
      findUnique: jest.fn(async ({ where }: any) => {
        const key = `${where.tenantId_idempotencyKey.tenantId}::${where.tenantId_idempotencyKey.idempotencyKey}`;
        return operations.get(key) ?? null;
      }),
      create: jest.fn(async ({ data }: any) => {
        const key = `${data.tenantId}::${data.idempotencyKey}`;
        const row = { id: `op-${operations.size + 1}`, ...data };
        operations.set(key, row);
        return row;
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const row = [...operations.values()].find((o) => o.id === where.id);
        if (!row) throw new Error('not found');
        Object.assign(row, data);
        return row;
      }),
      findMany: jest.fn(async ({ where }: any) =>
        [...operations.values()].filter((o) => o.tenantId === where.tenantId),
      ),
    },
    jkdmManualResponse: {
      create: jest.fn(async ({ data }: any) => {
        const row = { id: `mr-${manualResponses.size + 1}`, ...data };
        manualResponses.set(row.id, row);
        return row;
      }),
      findFirst: jest.fn(async ({ where }: any) =>
        [...manualResponses.values()].find((m) => m.id === where.id && m.tenantId === where.tenantId) ?? null,
      ),
      update: jest.fn(async ({ where, data }: any) => {
        const row = manualResponses.get(where.id);
        if (!row) throw new Error('not found');
        Object.assign(row, data);
        return { id: row.id, reviewStatus: row.reviewStatus };
      }),
      findMany: jest.fn(async ({ where }: any) =>
        [...manualResponses.values()].filter((m) => m.tenantId === where.tenantId),
      ),
    },
    auditLog: {
      findFirst: jest.fn(async () => auditLogs[auditLogs.length - 1] ?? null),
      create: jest.fn(async ({ data }: any) => {
        auditLogs.push(data);
        return data;
      }),
    },
  };
  prisma.__auditLogs = auditLogs;
  return prisma as PrismaService & { __auditLogs: any[] };
}

const CLEAN_VARS = [
  'JKDM_ENDPOINT', 'JKDM_CLIENT_CERT', 'JKDM_CERT_PASSPHRASE', 'JKDM_BROKER_CODE',
  'JKDM_PRODUCTION_ENABLED', 'JKDM_TRANSPORT_VERIFIED', 'JKDM_DEV_ADAPTER',
];

describe('JkdmService', () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    for (const k of CLEAN_VARS) delete process.env[k];
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  describe('capabilities — fail closed', () => {
    it('reports manual mode with no submission capability by default', () => {
      const svc = new JkdmService(makePrisma());
      const caps = svc.capabilities();
      expect(caps.mode).toBe('manual');
      expect(caps.submitDeclaration).toBe(false);
      expect(caps.requiresManualRecording).toBe(true);
      expect(caps.missingConfig).toEqual(
        expect.arrayContaining(['JKDM_ENDPOINT', 'JKDM_CLIENT_CERT', 'JKDM_BROKER_CODE']),
      );
    });

    it('does NOT report submit capability in production until the transport is verified', () => {
      process.env.JKDM_ENDPOINT = 'https://myuc.customs.gov.my';
      process.env.JKDM_CLIENT_CERT = '/etc/jkdm/client.pem';
      process.env.JKDM_BROKER_CODE = 'EK/PPG/2026/00001';
      process.env.JKDM_PRODUCTION_ENABLED = 'true';
      process.env.JKDM_TRANSPORT_VERIFIED = 'true';
      const svc = new JkdmService(makePrisma());
      const caps = svc.capabilities();
      expect(caps.mode).toBe('production');
      // The prod adapter exposes no capabilities until the transport is implemented.
      expect(caps.submitDeclaration).toBe(false);
      expect(caps.queryDeclarationStatus).toBe(false);
      expect(caps.requiresManualRecording).toBe(true);
      expect(caps.endpointHost).toBe('myuc.customs.gov.my');
    });
  });

  describe('submitDeclaration — persistent idempotency', () => {
    it('persists a failed operation and refuses to duplicate it', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);
      const args = {
        idempotencyKey: 'idem-key-0000000001',
        submission: { ...SAMPLE_K1, tenantId: 't1' },
      };

      // Manual adapter: submission throws, but the operation row is still
      // persisted (as failed). That is enough to prove idempotency bookkeeping.
      await expect(svc.submitDeclaration('t1', 'user-1', args)).rejects.toBeInstanceOf(Error);

      // A retry with the same key must NOT create a second operation row.
      const createdBefore = prisma.jkdmOperation.create.mock.calls.length;
      await expect(svc.submitDeclaration('t1', 'user-1', args)).rejects.toBeInstanceOf(Error);
      expect(prisma.jkdmOperation.create.mock.calls.length).toBe(createdBefore);
    });

    it('returns the stored result for a completed operation (no second external call)', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);

      const stored = {
        provenance: 'production_api',
        synthetic: false,
        acknowledged: true,
        externalRef: 'JKDM/PG/2026/0000123',
        submittedAt: '2026-01-16T01:15:00.000Z',
        correlationId: 'corr-1',
      };
      await prisma.jkdmOperation.create({
        data: {
          tenantId: 't1',
          kind: 'submit_declaration',
          status: 'succeeded',
          idempotencyKey: 'done-key-00000001',
          provenance: 'production_api',
          result: stored,
          attemptNumber: 1,
        },
      });

      const out = await svc.submitDeclaration('t1', 'user-1', {
        idempotencyKey: 'done-key-00000001',
        submission: { ...SAMPLE_K1, tenantId: 't1' },
      });

      expect(out.duplicate).toBe(true);
      expect(out.result).toEqual(stored);
      // The adapter must never be invoked again for a completed operation.
      expect(prisma.jkdmOperation.update).not.toHaveBeenCalled();
    });

    it('refuses to blind-retry an ambiguous operation', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);
      await prisma.jkdmOperation.create({
        data: {
          tenantId: 't1',
          kind: 'submit_declaration',
          status: 'ambiguous',
          idempotencyKey: 'ambig-key-00000001',
          provenance: 'production_api',
          attemptNumber: 1,
        },
      });

      await expect(
        svc.submitDeclaration('t1', 'user-1', {
          idempotencyKey: 'ambig-key-00000001',
          submission: { ...SAMPLE_K1, tenantId: 't1' },
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('development adapter — synthetic is never authoritative', () => {
    beforeEach(() => {
      process.env.JKDM_DEV_ADAPTER = 'true';
      process.env.NODE_ENV = 'development';
    });

    it('marks every submission result synthetic and records synthetic provenance', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);
      const { result } = await svc.submitDeclaration('t1', 'user-1', {
        idempotencyKey: 'dev-key-0000000001',
        submission: { ...SAMPLE_K1, tenantId: 't1' },
      });
      expect(result.synthetic).toBe(true);
      expect(result.provenance).toBe('synthetic');
      const row = await prisma.jkdmOperation.findUnique({
        where: { tenantId_idempotencyKey: { tenantId: 't1', idempotencyKey: 'dev-key-0000000001' } },
      });
      expect(row.provenance).toBe('synthetic');
    });
  });

  describe('recordManualResponse — evidence + review', () => {
    it('requires evidence or an exception', async () => {
      const svc = new JkdmService(makePrisma());
      await expect(
        svc.recordManualResponse('t1', 'broker-1', {
          draftRef: 'D',
          idempotencyKey: 'k'.repeat(16),
          tenantId: 't1',
          recordedBy: 'broker-1',
          outcome: 'released',
          observedAt: '2026-01-16T09:15:00+08:00',
        } as any),
      ).rejects.toBeInstanceOf(Error);
    });

    it('persists a pending_review record with evidence refs and audits it', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);
      const record = await svc.recordManualResponse('t1', 'broker-1', {
        draftRef: 'D',
        idempotencyKey: 'k'.repeat(16),
        tenantId: 't1',
        recordedBy: 'broker-1',
        outcome: 'released',
        externalRef: 'JKDM/PG/2026/0000123',
        observedAt: '2026-01-16T09:15:00+08:00',
        evidenceRef: 'doc://release-order/1.pdf',
        additionalEvidenceRefs: ['doc://release-order/2.pdf'],
      } as any);

      expect(record.reviewStatus).toBe('pending_review');
      const rows = await prisma.jkdmManualResponse.findMany({ where: { tenantId: 't1' } });
      expect(rows).toHaveLength(1);
      expect(rows[0].additionalEvidenceRefs).toEqual(['doc://release-order/2.pdf']);
      expect(prisma.__auditLogs.length).toBeGreaterThan(0);
    });
  });

  describe('reviewManualResponse', () => {
    it('transitions a pending record and rejects a second review', async () => {
      const prisma = makePrisma();
      const svc = new JkdmService(prisma);
      const rec = await svc.recordManualResponse('t1', 'broker-1', {
        draftRef: 'D',
        idempotencyKey: 'k'.repeat(16),
        tenantId: 't1',
        recordedBy: 'broker-1',
        outcome: 'released',
        externalRef: 'JKDM/PG/2026/0000123',
        observedAt: '2026-01-16T09:15:00+08:00',
        evidenceRef: 'doc://x',
      } as any);

      const reviewed = await svc.reviewManualResponse('t1', 'reviewer-1', rec.recordId, 'reviewed');
      expect(reviewed.reviewStatus).toBe('reviewed');

      await expect(
        svc.reviewManualResponse('t1', 'reviewer-2', rec.recordId, 'rejected'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('throws NotFound for a record in another tenant', async () => {
      const svc = new JkdmService(makePrisma());
      await expect(
        svc.reviewManualResponse('other-tenant', 'reviewer-1', 'mr-1', 'reviewed'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

