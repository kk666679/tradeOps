# .claude/

Claude Code configuration for the TradeOps platform.

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Project memory — loaded on every session. |
| `.mcp.json` | Client-side MCP config for backend-hosted `/api/mcp`. |
| `settings.json` | Shared project settings: permissions, hooks, MCP. |
| `settings.local.json` | Personal overrides, gitignored. |
| `agents/` | Subagent packages (`AGENT.md` + `eval/` + `reference/`). |
| `commands/` | Slash commands — safe entry points. |
| `hooks/` | Deterministic shell hooks bound to tool events. |
| `output-styles/` | Output style profiles. |
| `skills/` | Reusable workflow instruction packages. |
| `workflows/` | Multi-step, cross-agent playbooks. |

Every subagent and skill declares inputs, outputs, tools, and approval.
See `CLAUDE.md` for the non-negotiable rules.

## Verification

From inside Claude Code:

```
/config        # verify outputStyle, model
/mcp           # list MCP servers
/hooks         # list active hooks
/agents        # list loaded subagents
```

From the terminal:

```
claude plugin validate .
claude mcp list
```
