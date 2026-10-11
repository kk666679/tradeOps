---
description: Orchestrate a full supply chain review across subagents
allowed-tools: [Task, Read, Glob, Grep]
---

# /orchestrate_supply_chain

1. `cargo-expert` normalizes the cargo tree.
2. `sea-freight-expert` reports vessel and routing status.
3. `inventory-expert` proposes allocation and rebalancing.
4. `order-management-expert` reconciles orders.
5. `forecasting-expert` produces a horizon forecast.
6. Aggregate into a single report with per-agent sections.

Each subagent runs in its own context. The top-level model only aggregates.
