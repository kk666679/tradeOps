---
description: Implement a WMS schema change with a migration
allowed-tools: [Task, Read, Glob, Grep, Edit, Write, Bash]
argument-hint: "<change description>"
---

# /implement_wms $ARGUMENTS

Delegate to `wms-implementer`. Require:

- Prisma schema diff.
- Migration SQL.
- Backward-compatibility note.
- Scratch-database test evidence.
