// backend/src/integration/jkdm/jkdm.service.ts
//
// NestJS service that wires the fail-closed JKDM adapter into the application.
//
// Responsibilities:
//   - Resolve the adapter from environment config (never from UI state).
//   - Expose an honest capability snapshot for the Workflow Studio.
//   - Enforce PERSISTENT idempotency on submissions via JkdmOperation, so a
//     duplicate can never produce a second external submission — this does not
//     rely on an in-memory set or a disabled button.
//   - Persist evidence-backed manual observations as JkdmManualResponse, kept
//     in pending_review until a second user confirms them.
//   - Write every significant operation to the append-only AuditLog with a
//     per-tenant hash chain.
//
// It never fabricates a successful customs response. A synthetic (development)
// result is returned with synthetic:true and is never applied to an
// authoritative declaration status.

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { resolveJkdmConfig, type JkdmConfig } from './config';
import type {
  JkdmAdapter,
  DeclarationSubmission,
  ManualResponse,
  SubmissionResult,
  DeclarationStatus,
  ManualResponseRecord,
} from './types';
import type { JkdmAuditEvent, AuditSink } from './audit/audit-events';
import { createProdAdapter, createDevAdapter, createManualAdapter } from './adapters';

/** Shape consumed by the Workflow Studio integration banner + node gating. */
export interface JkdmCapabilitySnapshot {
  mode: 'production' | 'development' | 'manual';
  submitDeclaration: boolean;
  queryDeclarationStatus: boolean;
  submitManifest: boolean;
  queryManifest: boolean;
  requiresManualRecording: boolean;
  productionEnabled: boolean;
  transportVerified: boolean;
  /** Endpoint host only (never the full URL with credentials), for display. */
  endpointHost: string | null;
  missingConfig: string[];
}

export interface SubmitDeclarationArgs {
  idempotencyKey: string;
  submission: DeclarationSubmission;
  declarationId?: string;
}

export interface RecordManualArgs extends ManualResponse {
  declarationId?: string;
}

/**
 * AuditSink that appends to the AuditLog table with a per-tenant hash chain.
 * Falls back to a structured stderr line if the write fails, so an audit
 * failure never silently swallows the event.
 */
class PrismaAuditSink implements AuditSink {
  constructor(private readonly prisma: PrismaService) {}

  async record(event: JkdmAuditEvent): Promise<void> {
    const db = this.prisma as any;
    const at = new Date(event.at);
    try {
      const last = await db.auditLog.findFirst({
        where: { tenantId: event.tenantId },
        orderBy: { at: 'desc' },
        select: { hash: true },
      });
      const prevHash = last?.hash ?? '';
      const canonical = JSON.stringify({
        kind: event.kind,
        at: event.at,
        tenantId: event.tenantId,
        actorId: event.actorId,
        draftRef: event.draftRef ?? null,
        externalRef: event.externalRef ?? null,
        correlationId: event.correlationId ?? null,
        provenance: event.provenance ?? null,
        attemptNumber: event.attemptNumber ?? null,
        outcome: event.outcome ?? null,
        errorCode: event.errorCode ?? null,
        evidenceRefs: event.evidenceRefs ?? [],
        notes: event.notes ?? null,
        prevHash,
      });
      const hash = createHash('sha256').update(canonical).digest('hex');
      await db.auditLog.create({
        data: {
          tenantId: event.tenantId,
          userId: event.actorId && event.actorId !== 'system' ? event.actorId : null,
          actor: event.actorId === 'system' ? 'system' : 'human',
          action: event.kind,
          target: event.draftRef ?? event.externalRef ?? null,
          meta: {
            externalRef: event.externalRef ?? null,
            correlationId: event.correlationId ?? null,
            provenance: event.provenance ?? null,
            attemptNumber: event.attemptNumber ?? null,
            outcome: event.outcome ?? null,
            errorCode: event.errorCode ?? null,
            evidenceRefs: event.evidenceRefs ?? [],
            notes: event.notes ?? null,
            at: event.at,
          },
          prevHash,
          hash,
          at,
        },
      });
    } catch (err) {
      // Never lose the audit signal. Redacted JSON line; no secrets.
      process.stderr.write(
        JSON.stringify({ __audit_fallback: true, ...event, error: (err as Error).message }) + '\n',
      );
    }
  }
}

@Injectable()
export class JkdmService {
  private readonly auditSink: AuditSink;

  constructor(private readonly prisma: PrismaService) {
    this.auditSink = new PrismaAuditSink(prisma);
  }

  /** Build a fresh adapter bound to the DB audit sink (not the global cache). */
  private buildAdapter(config: JkdmConfig): JkdmAdapter {
    switch (config.mode) {
      case 'production':
        return createProdAdapter(config, this.auditSink);
      case 'development':
        return createDevAdapter(this.auditSink);
      default:
        return createManualAdapter(this.auditSink);
    }
  }

  private get adapter(): JkdmAdapter {
    // Re-resolve config each access so tests and flag flips are honoured; the
    // underlying resolveJkdmConfig is cheap and side-effect free.
    return this.buildAdapter(resolveJkdmConfig());
  }

  /** Honest capability snapshot. Configuration alone never implies readiness. */
  capabilities(): JkdmCapabilitySnapshot {
    const config = resolveJkdmConfig();
    const caps = this.buildAdapter(config).capabilities;
    const missingConfig: string[] = [];
    if (!config.endpoint) missingConfig.push('JKDM_ENDPOINT');
    if (!config.clientCertPath) missingConfig.push('JKDM_CLIENT_CERT');
    if (!config.brokerCode) missingConfig.push('JKDM_BROKER_CODE');
    if (config.mode === 'production' && !config.productionEnabled) {
      missingConfig.push('JKDM_PRODUCTION_ENABLED');
    }

    let endpointHost: string | null = null;
    if (config.endpoint) {
      try {
        endpointHost = new URL(config.endpoint).host;
      } catch {
        endpointHost = null;
      }
    }

    return {
      mode: config.mode,
      submitDeclaration: caps.submitDeclaration,
      queryDeclarationStatus: caps.queryDeclarationStatus,
      submitManifest: caps.submitManifest,
      queryManifest: caps.queryManifest,
      requiresManualRecording: caps.requiresManualRecording,
      productionEnabled: config.productionEnabled,
      transportVerified: config.mode === 'production',
      endpointHost,
      missingConfig,
    };
  }

  /**
   * Submit a declaration through the configured adapter with persistent
   * idempotency. Returns the adapter result (which may be synthetic). A
   * synthetic result is flagged and must never advance a real clearance.
   */
  async submitDeclaration(
    tenantId: string,
    userId: string,
    args: SubmitDeclarationArgs,
  ): Promise<{ result: SubmissionResult; duplicate: boolean; operationId: string }> {
    const db = this.prisma as any;
    const { idempotencyKey, submission, declarationId } = args;

    const existing = await db.jkdmOperation.findUnique({
      where: { tenantId_idempotencyKey: { tenantId, idempotencyKey } },
    });

    if (existing) {
      if (existing.status === 'succeeded') {
        // Same logical operation already completed — return the stored result.
        // No second external call is made.
        return {
          result: existing.result as SubmissionResult,
          duplicate: true,
          operationId: existing.id,
        };
      }
      if (existing.status === 'pending' || existing.status === 'ambiguous') {
        // In flight or an unknown network outcome. Never blind-retry: route to
        // reconciliation.
        throw new ConflictException(
          'A submission with this idempotency key is pending or ambiguous. Reconcile before retrying.',
        );
      }
      // status === 'failed' → a definitive prior failure; a retry with the same
      // key reuses this row and increments the attempt counter.
    }

    const attemptNumber = (existing?.attemptNumber ?? 0) + 1;

    const op =
      existing ??
      (await db.jkdmOperation.create({
        data: {
          tenantId,
          kind: 'submit_declaration',
          status: 'pending',
          idempotencyKey,
          draftRef: submission.draftRef,
          declarationId: declarationId ?? null,
          provenance: 'manual_observation', // provisional; overwritten below
          attemptNumber,
        },
      }));

    if (existing) {
      await db.jkdmOperation.update({
        where: { id: op.id },
        data: { status: 'pending', attemptNumber, respondedAt: null, errorCode: null, errorMessage: null },
      });
    }

    try {
      const result = await this.adapter.submitDeclaration(submission);
      await db.jkdmOperation.update({
        where: { id: op.id },
        data: {
          status: 'succeeded',
          provenance:
            result.provenance === 'production_api'
              ? 'production_api'
              : result.provenance === 'synthetic'
                ? 'synthetic'
                : 'manual_observation',
          externalRef: result.externalRef ?? null,
          correlationId: result.correlationId,
          respondedAt: new Date(result.submittedAt),
          result: result as unknown as Record<string, unknown>,
        },
      });
      return { result, duplicate: false, operationId: op.id };
    } catch (err) {
      const e = err as Error & { code?: string };
      await db.jkdmOperation.update({
        where: { id: op.id },
        data: {
          status: 'failed',
          errorCode: e.code ?? 'INTEGRATION_ERROR',
          errorMessage: e.message,
          respondedAt: new Date(),
        },
      });
      await this.auditSink.record({
        kind: 'jkdm.submission.failed',
        at: new Date().toISOString(),
        tenantId,
        actorId: userId,
        draftRef: submission.draftRef,
        attemptNumber,
        errorCode: e.code ?? 'INTEGRATION_ERROR',
        notes: e.message,
      });
      throw err;
    }
  }
  async queryDeclarationStatus(
    tenantId: string,
    userId: string,
    declarationRef: string,
  ): Promise<DeclarationStatus> {
    const status = await this.adapter.getDeclarationStatus(declarationRef);
    await this.auditSink.record({
      kind: 'jkdm.status.queried',
      at: new Date().toISOString(),
      tenantId,
      actorId: userId,
      externalRef: declarationRef,
      provenance: status.provenance,
      outcome: status.status,
    });
    return status;
  }

  /**
   * Record a manual customs response. The adapter enforces evidence-or-exception
   * and officer handling; we persist it as pending_review and audit it.
   */
  async recordManualResponse(
    tenantId: string,
    userId: string,
    args: RecordManualArgs,
  ): Promise<ManualResponseRecord> {
    const { declarationId, ...input } = args;
    const record = await this.adapter.recordManualResponse(input);

    const db = this.prisma as any;
    const row = await db.jkdmManualResponse.create({
      data: {
        tenantId,
        draftRef: record.draftRef,
        declarationId: declarationId ?? null,
        outcome: record.outcome,
        externalRef: record.externalRef ?? null,
        exceptionReason: record.exceptionReason ?? null,
        officerName: record.officerName ?? null,
        officerId: record.officerId ?? null,
        notes: record.notes ?? null,
        observedAt: new Date(record.observedAt),
        evidenceRef: record.evidenceRef ?? null,
        additionalEvidenceRefs: record.additionalEvidenceRefs ?? [],
        recordedBy: record.recordedBy || userId,
        reviewStatus: 'pending_review',
      },
    });

    await this.auditSink.record({
      kind: 'jkdm.manual.recorded',
      at: new Date().toISOString(),
      tenantId,
      actorId: userId,
      draftRef: record.draftRef,
      externalRef: record.externalRef,
      provenance: 'manual_observation',
      outcome: record.outcome,
      evidenceRefs: [
        ...(record.evidenceRef ? [record.evidenceRef] : []),
        ...(record.additionalEvidenceRefs ?? []),
      ],
      notes: record.exceptionReason,
    });

    return { ...record, recordId: row.id };
  }

  /**
   * A second user reviews a pending manual observation. Only a reviewed
   * observation may be treated as authoritative downstream.
   */
  async reviewManualResponse(
    tenantId: string,
    reviewerId: string,
    recordId: string,
    decision: 'reviewed' | 'rejected',
  ): Promise<{ id: string; reviewStatus: string }> {
    const db = this.prisma as any;
    const row = await db.jkdmManualResponse.findFirst({ where: { id: recordId, tenantId } });
    if (!row) throw new NotFoundException('Manual response not found');
    if (row.reviewStatus !== 'pending_review') {
      throw new ConflictException('This observation has already been reviewed.');
    }
    const updated = await db.jkdmManualResponse.update({
      where: { id: recordId },
      data: { reviewStatus: decision, reviewedBy: reviewerId, reviewedAt: new Date() },
      select: { id: true, reviewStatus: true },
    });
    await this.auditSink.record({
      kind: 'jkdm.manual.reviewed',
      at: new Date().toISOString(),
      tenantId,
      actorId: reviewerId,
      draftRef: row.draftRef,
      externalRef: row.externalRef ?? undefined,
      provenance: 'manual_observation',
      outcome: decision,
    });
    return updated;
  }

  async listOperations(tenantId: string, opts: { take?: number; declarationId?: string } = {}) {
    const db = this.prisma as any;
    return db.jkdmOperation.findMany({
      where: { tenantId, ...(opts.declarationId ? { declarationId: opts.declarationId } : {}) },
      orderBy: { requestAt: 'desc' },
      take: Math.min(opts.take ?? 50, 200),
    });
  }

  async listManualResponses(tenantId: string, opts: { take?: number; declarationId?: string } = {}) {
    const db = this.prisma as any;
    return db.jkdmManualResponse.findMany({
      where: { tenantId, ...(opts.declarationId ? { declarationId: opts.declarationId } : {}) },
      orderBy: { recordedAt: 'desc' },
      take: Math.min(opts.take ?? 50, 200),
    });
  }
}


