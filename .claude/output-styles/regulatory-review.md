---
name: regulatory-review
description: Formal report for tariff, control, and compliance reviews
keep-coding-instructions: true
---

# Regulatory review output style

Output is a report, not a conversation.

## Format

For each finding:

```
[SEVERITY] <one-line title>
  Location: <file>:<line>
  Rule: <the rule, cited>
  Source: <primary source, retrievedAt>
  Impact: <what could go wrong>
  Fix: <the concrete change>
```

Severity is `BLOCK`, `WARN`, or `INFO`.

If everything passes, output a single line: `CLEAR — no findings`.
