#!/usr/bin/env bash
# PostToolUse: format the just-written file. Pure-bash fallback for path extraction.
set -euo pipefail

payload="$(cat)"
extract_path() {
  local p="$1"
  if command -v node >/dev/null 2>&1; then
    printf '%s' "$p" | node -e '
      let s = "";
      process.stdin.on("data", d => s += d);
      process.stdin.on("end", () => {
        try {
          const j = JSON.parse(s);
          process.stdout.write(j?.tool_input?.file_path ?? j?.tool_input?.path ?? "");
        } catch { process.stdout.write(""); }
      });
    '
  else
    printf '%s' "$p" | grep -oE '"file_path"\s*:\s*"[^"]+"' | head -n1 | sed -E 's/.*"([^"]+)".*/\1/'
  fi
}

file="$(extract_path "$payload")"
if [ -z "$file" ] || [ ! -f "$file" ]; then exit 0; fi
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.md|*.yml|*.yaml)
    if command -v pnpm >/dev/null 2>&1; then
      pnpm exec prettier --write "$file" >/dev/null 2>&1 || true
    fi
    ;;
esac
exit 0
