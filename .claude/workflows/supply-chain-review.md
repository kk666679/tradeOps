---
name: supply-chain-review
description: Full cross-agent supply chain review.
agents: [cargo-expert, sea-freight-expert, inventory-expert, order-management-expert, forecasting-expert]
approval: none
---

# Supply chain review workflow

1. `cargo-expert` — tree.
2. `sea-freight-expert` — vessel and routing.
3. `inventory-expert` — allocation.
4. `order-management-expert` — reconciliation.
5. `forecasting-expert` — horizon forecast.
6. Aggregate into a single report.

Each agent runs in its own context. The top-level model only aggregates.
