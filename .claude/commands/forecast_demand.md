---
description: Produce a cargo-volume forecast for a tenant
allowed-tools: [Task, "mcp__ai-layer__forecast.predict", "mcp__tradeops-core__inventory.query"]
argument-hint: "<tenantId> <horizonWeeks>"
---

# /forecast_demand $1 $2

Delegate to `forecasting-expert`. Require:

- Training window and last data point.
- Confidence intervals.
- Caveats.

Never label the forecast as a commitment.
