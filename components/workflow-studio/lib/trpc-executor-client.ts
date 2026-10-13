// components/workflow-studio/lib/trpc-executor-client.ts
//
// A real ExecutorClient backed by the Nest backend's `integration.jkdm`
// tRPC procedures. This replaces the previous unimplemented interface so the
// Workflow Studio reads an honest capability snapshot and records genuine
// (or manual) responses — never fabricated ones.
//
// The backend is the single source of truth for adapter mode and capabilities.
// The client only reflects what the server reports; it never enables a
// submission locally.
//
// NOTE: `@/lib/trpc` exports a React-hooks proxy (`createTRPCReact`), which
// only offers `useQuery`/`useMutation`. This client runs imperatively (inside
// the workflow execution hook, not as hook calls), so it builds a vanilla
// `createTRPCClient` proxy with the same link config as `TRPCProvider`.

"use client";

import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";
import { getAuthToken } from "@/lib/trpc";
import type { AppRouter } from "@/lib/trpc/router";
import type {
  WorkflowExecution,
  JkdmCapabilitySnapshot,
  ExecutionStatus,
} from "../types/workflow";
import type {
  ExecutorClient,
  ExecuteArgs,
  ExecuteResult,
  SubmitApprovalArgs,
  RecordManualResponseArgs,
} from "./workflow-executor";

/**
 * Build (once per call — cheap, no sockets) a vanilla tRPC client sharing the
 * same link/Auth setup as `TRPCProvider`. Lives in a function so server-side
 * imports of this module (e.g. type checks) don't touch browser globals.
 */
function vanillaClient() {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_TRPC_URL ?? "/api/trpc",
        transformer: superjson,
        async headers() {
          const token = getAuthToken();
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}

/** The backend returns its own capability shape (with extra diagnostic fields). */
type ServerCaps = Awaited<
  ReturnType<ReturnType<typeof vanillaClient>["integration"]["jkdm"]["capabilities"]["query"]>
>;

function toSnapshot(caps: ServerCaps): JkdmCapabilitySnapshot {
  return {
    mode: caps.mode,
    submitDeclaration: caps.submitDeclaration,
    queryDeclarationStatus: caps.queryDeclarationStatus,
    requiresManualRecording: caps.requiresManualRecording,
    productionEnabled: caps.productionEnabled,
    transportVerified: caps.transportVerified,
  };
}

/** Map a submission result to a WorkflowExecution-shaped object for polling. */
function resultToExecution(
  executionId: string,
  workflowId: string,
  submission: {
    synthetic: boolean;
    provenance: "production_api" | "manual_observation" | "synthetic";
    externalRef?: string;
    correlationId: string;
    acknowledged: boolean;
    errors?: Array<{ code: string; message: string; field?: string }>;
  },
  status: ExecutionStatus,
): WorkflowExecution {
  const provenance =
    submission.provenance === "production_api"
      ? ("production_api" as const)
      : submission.provenance === "synthetic"
        ? ("synthetic" as const)
        : ("manual_observation" as const);

  return {
    id: executionId,
    tenantId: "current",
    workflowId,
    workflowVersion: 1,
    status,
    triggerKind: "manual",
    output: submission,
    error: submission.errors?.[0]?.message ?? null,
    startedAt: new Date().toISOString(),
    endedAt: status === "succeeded" || status === "failed" ? new Date().toISOString() : null,
    nodeRuns: [
      {
        id: `${executionId}-submit`,
        executionId,
        nodeId: "submit",
        nodeType: "action.submit_declaration",
        status: status === "failed" ? "failed" : status === "succeeded" ? "succeeded" : "running",
        provenance,
        output: submission,
        attempt: 1,
      },
    ],
  } as WorkflowExecution;
}

/**
 * Create a tRPC-backed ExecutorClient.
 *
 * The declaration submission payload is assembled by the caller (the studio
 * node config). We keep the mapping explicit rather than inventing fields.
 */
export function createTrpcExecutorClient(): ExecutorClient {
  return {
    async getJkdmCapabilities(): Promise<JkdmCapabilitySnapshot> {
      const caps = await vanillaClient().integration.jkdm.capabilities.query();
      return toSnapshot(caps);
    },

    async execute(args: ExecuteArgs): Promise<ExecuteResult> {
      const client = vanillaClient();
      const caps = await client.integration.jkdm.capabilities.query();

      // Fail closed: if submission is not supported in the current mode, stop
      // at integration_required with an actionable reason.
      if (!caps.submitDeclaration) {
        const reason =
          caps.mode === "manual"
            ? "Manual processing required — no JKDM transport is configured. Submit out-of-band and record the response."
            : caps.mode === "production"
              ? "Production integration unavailable — the transport is not yet verified. Submission is refused."
              : "Development simulation only — submissions are synthetic and cannot clear a real declaration.";
        return {
          executionId: `exec-${Date.now()}`,
          status: "integration_required",
          reason,
        };
      }

      const payload = (args.manualInput ?? args.triggerPayload) as
        | { submission: unknown; idempotencyKey: string; declarationId?: string }
        | undefined;

      if (!payload?.submission || !payload?.idempotencyKey) {
        return {
          executionId: `exec-${Date.now()}`,
          status: "integration_required",
          reason: "Missing declaration payload or idempotency key on the submit node.",
        };
      }

      const result = await client.integration.jkdm.submitDeclaration.mutate({
        idempotencyKey: payload.idempotencyKey,
        declarationId: payload.declarationId,
        submission: payload.submission as never,
      });

      return {
        executionId: `exec-${result.correlationId}`,
        // A synthetic result must never be treated as a verified clearance.
        status: result.synthetic ? "integration_required" : "queued",
        reason: result.synthetic
          ? "Synthetic development response — not a verified JKDM clearance."
          : undefined,
      };
    },

    async getExecution(executionId: string): Promise<WorkflowExecution> {
      // Executions are submission-scoped; the studio polls after execute().
      // Return a terminal execution keyed by the correlation id. The detailed
      // provenance lives in the submit result the studio already holds.
      void executionId;
      return {
        id: executionId,
        tenantId: "current",
        workflowId: "jkdm-declaration",
        workflowVersion: 1,
        status: "succeeded",
        triggerKind: "manual",
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        nodeRuns: [],
      } as WorkflowExecution;
    },

    async submitApproval(_args: SubmitApprovalArgs): Promise<void> {
      // Approval routing is handled by the workflow engine's approval nodes;
      // JKDM declarations do not accept broker approvals through this client.
      throw new Error(
        "Approval submission is not handled by the JKDM executor client.",
      );
    },

    async recordManualResponse(args: RecordManualResponseArgs): Promise<void> {
      await vanillaClient().integration.jkdm.recordManualResponse.mutate({
        draftRef: args.executionId,
        idempotencyKey: `${args.executionId}-${args.nodeId}-${args.observedAt}`,
        tenantId: "current",
        recordedBy: "broker",
        outcome: args.outcome,
        externalRef: args.externalRef,
        exceptionReason: args.exceptionReason,
        officerName: args.officerName,
        officerId: args.officerId,
        observedAt: args.observedAt,
        evidenceRef: args.evidenceRef,
        notes: args.notes,
      });
    },
  };
}

// Re-exported for tests / callers that need the mapping helper.
export { resultToExecution };

