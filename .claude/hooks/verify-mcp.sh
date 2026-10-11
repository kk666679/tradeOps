#!/usr/bin/env bash
# SessionStart: warn if any HTTP MCP server is unreachable.
set -euo pipefail

CONFIG="${CLAUDE_PROJECT_DIR:-.}/.claude/.mcp.json"
if [ ! -f "$CONFIG" ]; then exit 0; fi

urls=$(grep -oE '"url"\s*:\s*"[^"]+"' "$CONFIG" | sed -E 's/.*"([^"]+)".*/\1/' || true)
if [ -z "$urls" ]; then exit 0; fi

while IFS= read -r url; do
  [ -z "$url" ] && continue
  base="${url%/mcp}"
  if ! curl -sf -o /dev/null -m 2 "${base}/health" 2>/dev/null; then
    echo "⚠ MCP server not reachable: $url" >&2
  fi
done <<< "$urls"
exit 0
