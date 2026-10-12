# JKDM integration

Malaysia customs integration for the TradeOps brokerage platform. Handles
declaration submission, status query, and manual response recording for
JKDM (Royal Malaysian Customs Department).

## Guiding principle: fail-closed

No submission capability is enabled unless **all** of the following hold:

1. Every credential is present (`JKDM_ENDPOINT`, `JKDM_CLIENT_CERT`, `JKDM_BROKER_CODE`).
2. `JKDM_PRODUCTION_ENABLED=true` — an operator has explicitly confirmed
   production is intended.
3. `JKDM_TRANSPORT_VERIFIED=true` — an engineer has confirmed the transport
   has been implemented and tested against official JKDM documentation.

Configuration is **not** proof of a working integration. Env vars alone
never enable production. This prevents the common failure mode where a
misconfigured environment silently starts submitting.

## Three adapters

| Mode | When | Behaviour |
|---|---|---|
| `production` | All creds + both flags | Real transport (currently unimplemented; capabilities disabled) |
| `development` | `NODE_ENV !== production` + `JKDM_DEV_ADAPTER=true` | Synthetic responses, `synthetic: true`, refuses production |
| `manual` | Otherwise (the default) | Records out-of-band responses; no submission |

Every result carries a `provenance` field: `production_api`,
`manual_observation`, or `synthetic`. Nothing in the platform may present
a synthetic or manual result as a verified JKDM response.

## Environment variables

| Variable | Purpose | Required for |
|---|---|---|
| `JKDM_ENDPOINT` | uCustoms endpoint | production |
| `JKDM_CLIENT_CERT` | Path to client certificate (PEM) | production |
| `JKDM_CERT_PASSPHRASE` | Certificate passphrase | production, if encrypted |
| `JKDM_BROKER_CODE` | JKDM-assigned agent code | production |
| `JKDM_PRODUCTION_ENABLED` | Explicit production enablement | production |
| `JKDM_TRANSPORT_VERIFIED` | Confirm transport is implemented | production |
| `JKDM_DEV_ADAPTER` | `true` enables the dev adapter | development only |
| `JKDM_CONNECT_TIMEOUT_MS` | Connection timeout | optional |
| `JKDM_REQUEST_TIMEOUT_MS` | Request timeout | optional |
| `JKDM_MAX_RETRIES` | Retry cap | optional |

## Acquiring production access

JKDM does **not** provide a public sandbox or documented third-party API.
The realistic path is:

1. Register as an **Ejen Kastam** under Section 90 of the Customs Act 1967.
2. Apply for uCustoms trader access through JKDM.
3. Obtain the JKDM-assigned agent code (`EK/PPG/<year>/<number>`).
4. Receive a client certificate and endpoint URL.
5. Draft the transport against **official** JKDM technical documentation.
6. Flip `JKDM_TRANSPORT_VERIFIED=true` only after the transport passes
   integration tests against the authorised environment.

Contact: the uCustoms team. Named contacts are listed in the uCustoms
operational guide.

## Manual recording

When no integration exists, the broker submits out-of-band (through the
JKDM portal directly or their existing agent software) and calls
`recordManualResponse`. Required:

- `outcome` — `query`, `inspection`, `released`, `rejected`, `amended`
- `observedAt` — when JKDM communicated the outcome
- Either `evidenceRef` **or** `exceptionReason` (documented reason)
- Either `externalRef` **or** `exceptionReason`

Optional but valuable: `officerName`, `officerId`, `notes`, additional
evidence references.

Every manual record starts in `pending_review` status. A second user must
review before the platform treats the declaration as authoritative.

## Declaration lifecycle

Internal states are distinct from JKDM statuses:
draft → validation_failed → ready_for_review → pending_approval
→ approved_for_submission → submission_pending
→ submitted_unconfirmed → acknowledged → accepted → released

text

External-facing states (`acknowledged`, `accepted`, `rejected`, `released`,
`inspection_required`, `additional_information_required`) require either a
verified production response or a reviewed manual observation. No other
path reaches them.

## What is not implemented

- **Production transport.** Intentionally unimplemented. The adapter
  exposes no capabilities until official documentation and credentials
  are available.
- **Manifest submission.** JKDM does not publish a manifest schema.
- **Real-time webhooks from JKDM.** Responses are polled or recorded manually.
- **Automatic retries across the network boundary.** Retries belong in
  the workflow engine, gated by idempotency keys.

## Tests
backend/test/integrations/
jkdm.contract.spec.ts # config, adapters, state machine, schemas
jkdm.audit.spec.ts # audit event emission

text

Run:

```bash
cd backend
npm test -- jkdm
The tests assert:

The resolver never enters production without creds + both flags.

The resolver never enters development when NODE_ENV=production.

The manual adapter refuses submission and requires evidence or exception.

The dev adapter marks every response synthetic: true.

The prod adapter exposes zero capabilities and refuses submission with
INTEGRATION_UNAVAILABLE.

The state machine rejects invalid transitions.

The schemas reject malformed input.

The audit sink receives the correct events with correct provenance.
