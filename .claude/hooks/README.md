# Hooks

Deterministic shell hooks bound to tool events via `settings.json` and
`hooks.json`.

| Hook | Event | Purpose |
|---|---|---|
| `format-changed.sh` | PostToolUse (Write/Edit) | Run Prettier on the just-changed file. |
| `guard-push.sh` | PreToolUse (git push) | Refuse a push when tariff changes lack a changelog entry. |
| `verify-mcp.sh` | SessionStart | Warn if any HTTP MCP server is unreachable. |
| `claude-md-size.sh` | SessionStart | Warn if CLAUDE.md exceeds 500 lines. |

Hooks receive the tool call as JSON on stdin. Exit `0` to proceed, `2` to
block with a message on stderr.
