# Subagents

Each subagent is a **package**: an `AGENT.md` profile plus optional
`eval/` and `reference/`.

## Layout

```
agents/<name>/
├── AGENT.md          # profile (YAML frontmatter + instructions)
├── eval/             # optional — evaluation cases
│   └── eval.json
└── reference/        # optional — golden outputs
    └── golden.jsonl
```

## Registry

| Agent | Domain |
|---|---|
| `cargo-expert` | Cargo lifecycle |
| `forecasting-expert` | Demand / capacity |
| `inventory-expert` | Inventory, slots |
| `order-management-expert` | Orders, shipments |
| `sea-freight-expert` | Vessels, ports |
| `vector-analyst` | RAG, embeddings |
| `digital-twin-engineer` | Zone simulation |
| `network-designer` | Network design |
| `procurement-negotiator` | Quotes, terms |
| `wms-implementer` | Schema, migrations |

The frontmatter `tools` allowlist and `disallowedTools` denylist are
authoritative. A subagent may not call a tool outside its allowlist, and
may never call a denylisted tool, regardless of the prompt.
