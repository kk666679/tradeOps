---
description: Bootstrap a fresh local environment
allowed-tools: [Read, Write, "Bash(docker compose:*)", "Bash(pnpm install)", "Bash(pnpm prisma:*)"]
disable-model-invocation: true
---

# /bootstrap

1. Verify prerequisites: Node 20+, pnpm 9+, Docker.
2. `pnpm install`.
3. Copy `.env.example` → `.env` if missing (do not overwrite).
4. `docker compose up -d`.
5. `pnpm prisma migrate dev`.
6. `pnpm prisma db seed`.
7. Print the demo tenant slug and admin credentials to stdout.

Never run in production. Never overwrite an existing `.env`.
