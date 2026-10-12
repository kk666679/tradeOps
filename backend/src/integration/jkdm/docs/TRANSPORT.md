
Implementing the production transport
This file describes what to write, in order, once official JKDM technical
documentation and credentials are available. Do not flip
JKDM_TRANSPORT_VERIFIED=true before every section is complete.

1. Document what JKDM provides
Before writing code, write a short memo in this repo:

The exact endpoint URL(s).

The authentication mechanism (mTLS certificate? OAuth? Signed payloads?).

The request envelope schema — the actual JKDM schema, not a guess.

The response envelope schema, including every error code.

Whether submission is synchronous, asynchronous, or webhook-driven.

The declared idempotency semantics.

Rate limits and concurrency limits.

If any of these is unknown, stop. Guessing a transport is worse than
leaving it unimplemented.

2. Implement the transport
Replace the transportNotImplemented() throw in adapters/prod-adapter.ts
with an HTTPS call using node:https:

ts
const req = httpsRequest({
  method: "POST",
  hostname: url.hostname,
  port: Number(url.port || 443),
  path: url.pathname,
  headers: {
    "content-type": "application/json",
    "idempotency-key": input.idempotencyKey,
    "x-jkdm-broker-code": config.brokerCode,
  },
  key: readFileSync(config.clientCertPath),
  passphrase: config.clientCertPassphrase ?? undefined,
}, (res) => { /* handle response */ });
Requirements for the call:

Pin the endpoint. Never accept a user-supplied URL.

Enforce config.requestTimeoutMs.

Send idempotencyKey in a header.

Never log the raw request or response bodies.

Validate the response schema with Zod before returning.

3. Enable capabilities
Only the capabilities confirmed by JKDM may be enabled:

ts
const CAPABILITIES: JkdmCapabilities = {
  submitDeclaration: true,   // only if JKDM supports it and you tested it
  queryDeclarationStatus: true,
  submitManifest: false,
  queryManifest: false,
  requiresManualRecording: false,
};
4. Handle ambiguous outcomes
If the network fails mid-submission, the outcome is unknown. Do not
retry blindly. Instead:

Record the attempt in the audit trail.

Transition the declaration to integration_error.

Queue a reconciliation job that queries JKDM status by draftRef.

The reconciliation job runs the same idempotency check as the original
attempt, so a retry cannot produce a duplicate submission.

5. Test against the authorised environment
Write integration tests in backend/test/integrations/jkdm.prod.e2e.spec.ts
gated by an env var (JKDM_E2E=1). Run them only against the authorised
JKDM environment. Never against production. Never with real shipment data.

6. Flip the verification flag
When every section above is complete and the tests pass:

bash
JKDM_TRANSPORT_VERIFIED=true
Document the flag flip in CHANGELOG.md. Include the test run that
validated it.

7. Rollback plan
Keep the manual adapter available at all times. If the transport must be
disabled, set JKDM_TRANSPORT_VERIFIED=false — the resolver falls back
to manual, and brokers continue recording responses by hand. Zero downtime,
zero data loss.
