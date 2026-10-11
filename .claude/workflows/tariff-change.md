---
name: tariff-change
description: Change a tariff rate with source and changelog compliance.
approval: required_for_merge
---

# Tariff change workflow

1. Edit `src/hs-code-data.ts`.
2. Attach `source` and `retrievedAt` to every changed row.
3. Add a `CHANGELOG-tariff.md` entry.
4. Run `pnpm test:tariff`.
5. Run `code-review` in the `regulatory-review` output style.
6. Require human approval before merge.

`guard-push.sh` blocks any push where this sequence is incomplete.
