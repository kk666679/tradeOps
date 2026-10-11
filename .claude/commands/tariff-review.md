---
description: Review tariff changes for source and changelog compliance
allowed-tools: [Read, Glob, Grep, "Bash(git diff:*)"]
---

# /tariff-review

1. Diff `src/hs-code-data.ts`.
2. For every changed rate, assert a `source` and `retrievedAt`.
3. Assert a corresponding `CHANGELOG-tariff.md` entry.
4. Report findings in the `regulatory-review` output style.

If everything passes: `CLEAR — no findings`.
