// backend/src/workflow/seed.service.ts
//
// Seed datasets are the input side of a seed-driven loop. A dataset is an
// ordered, tenant-scoped collection of records; a loop run replays a workflow
// once per record and persists each attempt as a `LoopIteration`.
//
// This service owns dataset + record lifecycle only. Execution lives in
// `loop-execution.service.ts`. Every read and write is tenant-scoped — the
// caller supplies `tenantId` and it is always part of the `where` clause, so a
// record can never be reached across tenants.

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface SeedDatasetSummary {
  id: string;
  name: string;
  description: string | null;
  recordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeedRecordSummary {
  id: string;
  recordId: string;
  status: 'VALID' | 'INVALID' | 'PENDING';
  validationErrors: unknown;
  payload: unknown;
}

export interface CreateDatasetInput {
  name: string;
  description?: string;
  schema?: unknown;
}

export interface AddRecordsInput {
  datasetId: string;
  records: Array<{ recordId: string; payload: unknown }>;
}

const MAX_RECORDS_PER_CALL = 500;
const MAX_PAYLOAD_BYTES = 64 * 1024;

/** Guard against unbounded JSON in a single seed record. */
function assertPayloadSize(payload: unknown, recordId: string): void {
  let serialized: string;
  try {
    serialized = JSON.stringify(payload);
  } catch {
    throw new BadRequestException(`Record ${recordId} payload is not serialisable.`);
  }
  if (serialized.length > MAX_PAYLOAD_BYTES) {
    throw new BadRequestException(
      `Record ${recordId} payload exceeds the ${MAX_PAYLOAD_BYTES} byte limit.`,
    );
  }
}

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  /** List datasets for a tenant, newest first. */
  async listDatasets(tenantId: string, take = 100): Promise<SeedDatasetSummary[]> {
    const rows = await this.prisma.seedDataset.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
      take: Math.min(Math.max(take, 1), 200),
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      recordCount: r.recordCount,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  /**
   * Fetch a dataset plus its records. Scoped by tenantId first, so a
   * cross-tenant id resolves to NOT_FOUND rather than leaking the row.
   */
  async getDataset(tenantId: string, datasetId: string): Promise<{
    id: string;
    name: string;
    description: string | null;
    schema: unknown;
    recordCount: number;
    records: SeedRecordSummary[];
  }> {
    const dataset = await this.prisma.seedDataset.findFirst({
      where: { id: datasetId, tenantId },
      include: {
        records: {
          orderBy: { recordId: 'asc' },
          take: 1000,
          select: {
            id: true,
            recordId: true,
            status: true,
            validationErrors: true,
            payload: true,
          },
        },
      },
    });
    if (!dataset) throw new NotFoundException('Seed dataset not found.');
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      schema: dataset.schema,
      recordCount: dataset.recordCount,
      records: dataset.records.map((r) => ({
        id: r.id,
        recordId: r.recordId,
        status: r.status,
        validationErrors: r.validationErrors,
        payload: r.payload,
      })),
    };
  }

  /** Create an empty dataset. `name` is required and trimmed by the router. */
  async createDataset(tenantId: string, input: CreateDatasetInput): Promise<SeedDatasetSummary> {
    const row = await this.prisma.seedDataset.create({
      data: {
        tenantId,
        name: input.name,
        description: input.description ?? null,
        schema: (input.schema ?? null) as never,
      },
    });
  /**
   * Insert or replace records in a dataset and keep `recordCount` in sync.
   *
   * The whole batch is written in one transaction so a partial import can never
   * leave `recordCount` disagreeing with the actual rows — the loop runner
   * trusts that counter to size `totalIterations`.
   */
  async addRecords(tenantId: string, input: AddRecordsInput): Promise<{
    datasetId: string;
    inserted: number;
    replaced: number;
    recordCount: number;
  }> {
    if (!Array.isArray(input.records) || input.records.length === 0) {
      throw new BadRequestException('Provide at least one record.');
    }
    if (input.records.length > MAX_RECORDS_PER_CALL) {
      throw new BadRequestException(
        `A single import may add at most ${MAX_RECORDS_PER_CALL} records.`,
      );
    }

    const dataset = await this.prisma.seedDataset.findFirst({
      where: { id: input.datasetId, tenantId },
      select: { id: true },
    });
    if (!dataset) throw new NotFoundException('Seed dataset not found.');

    const seen = new Set<string>();
    let inserted = 0;
    let replaced = 0;

    await this.prisma.$transaction(async (tx) => {
      for (const record of input.records) {
        if (!record?.recordId || typeof record.recordId !== 'string') {
          throw new BadRequestException('Every record needs a non-empty recordId.');
        }
        if (seen.has(record.recordId)) {
          throw new BadRequestException(`Duplicate recordId in batch: ${record.recordId}`);
        }
        seen.add(record.recordId);
        assertPayloadSize(record.payload, record.recordId);

        const existing = await tx.seedRecord.findUnique({
          where: { datasetId_recordId: { datasetId: dataset.id, recordId: record.recordId } },
          select: { id: true },
        });

        if (existing) {
          await tx.seedRecord.update({
            where: { id: existing.id },
            data: {
              payload: record.payload as never,
              status: 'PENDING',
              validationErrors: null as never,
            },
          });
          replaced += 1;
        } else {
          await tx.seedRecord.create({
            data: {
              datasetId: dataset.id,
              recordId: record.recordId,
              payload: record.payload as never,
              status: 'PENDING',
            },
          });
          inserted += 1;
        }
      }

      // Recompute from the table rather than incrementing, so a re-import can
      // never drift the counter.
      const count = await tx.seedRecord.count({ where: { datasetId: dataset.id } });
      await tx.seedDataset.update({ where: { id: dataset.id }, data: { recordCount: count } });
    });

    const total = await this.prisma.seedRecord.count({ where: { datasetId: dataset.id } });
    return { datasetId: dataset.id, inserted, replaced, recordCount: total };
  }

  /** Deterministic digest of a dataset's records — used for change detection. */
  async datasetDigest(tenantId: string, datasetId: string): Promise<string> {
    const dataset = await this.prisma.seedDataset.findFirst({
      where: { id: datasetId, tenantId },
      select: { id: true },
    });
    if (!dataset) throw new NotFoundException('Seed dataset not found.');
    const records = await this.prisma.seedRecord.findMany({
      where: { datasetId: dataset.id },
      orderBy: { recordId: 'asc' },
      select: { recordId: true, payload: true },
    });
    const hash = createHash('sha256');
    hash.update(`dataset:${dataset.id}:${records.length}\n`);
    for (const r of records) {
      hash.update(`${r.recordId}=${JSON.stringify(r.payload)}\n`);
    }
    return hash.digest('hex');
  }
}
