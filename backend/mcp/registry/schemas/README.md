# Schema references

The registry manifests reference `$schema` URLs pointing at
`https://modelcontextprotocol.io/schemas/2026-07-28/*`. These are the
canonical schemas.

For offline or air-gapped deployments, vendor the schemas into this
directory and rewrite the `$schema` fields to relative paths. The schemas
used in this registry are:

| File | Purpose |
|---|---|
| `registry.json` | Root registry manifest |
| `server.json` | Per-server manifest |
| `profile.json` | Deployment profile |
| `extension.json` | Official extension manifest |
| `capability-catalog.json` | Capability catalog |
| `policy-bundle.json` | Policy bundle |
| `auth-provider.json` | Auth provider manifest |
| `transport.json` | Transport binding manifest |
| `tool-signature.json` | Tool signature baseline |
| `tenant.json` | Tenant binding |
