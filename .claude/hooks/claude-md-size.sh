#!/usr/bin/env bash
# SessionStart: warn if CLAUDE.md exceeds the recommended 500-line ceiling.
set -euo pipefail

CLAUDE_MD="${CLAUDE_PROJECT_DIR:-.}/.claude/CLAUDE.md"
if [ ! -f "$CLAUDE_MD" ]; then exit 0; fi

lines=$(wc -l < "$CLAUDE_MD" | tr -d ' ')
if [ "$lines" -gt 500 ]; then
  echo "⚠ CLAUDE.md is $lines lines — recommended maximum is 500." >&2
  echo "  Move detail into .claude/skills/*/references/ and link from CLAUDE.md." >&2
fi
exit 0
