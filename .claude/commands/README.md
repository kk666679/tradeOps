# Slash commands

| Command | Purpose |
|---|---|
| `/review` | Review the staged diff. |
| `/deploy` | Deploy to staging or production. |
| `/test-all` | Run the full test suite. |
| `/bootstrap` | Bootstrap a fresh local environment. |
| `/orchestrate_supply_chain` | Multi-agent supply chain review. |
| `/forecast_demand` | Cargo-volume forecast. |
| `/analyze_vector` | RAG over cargo documents. |
| `/implement_wms` | WMS schema change + migration. |
| `/design_network` | Network design proposal. |
| `/build_digital_twin` | What-if scenario on the twin. |
| `/negotiate_procurement` | Draft negotiation position. |
| `/tariff-review` | Tariff-change compliance review. |
| `/regulatory-gate` | Run the regulatory gate on a declaration. |

Commands with `disable-model-invocation: true` can only be invoked by the
human, not loaded automatically by the model.
