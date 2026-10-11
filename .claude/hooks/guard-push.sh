#!/usr/bin/env bash
# PreToolUse (git push): refuse a push when tariff changes lack a changelog entry.
set -euo pipefail

if ! git diff --quiet -- src/hs-code-data.ts 2>/dev/null; then
  if [ ! -f CHANGELOG-tariff.md ]; then
    echo "✗ tariff file modified but CHANGELOG-tariff.md is missing" >&2
    exit 2
  fi
  if ! git diff --name-only -- CHANGELOG-tariff.md | grep -q .; then
    echo "✗ tariff changed without a CHANGELOG-tariff.md update" >&2
    exit 2
  fi
fi
exit 0
