// components/workflow-studio/lib/expression.ts
import type { ParsedExpression } from "../types/workflow";

const EXPR_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;

export function parseExpressions(input: string): ParsedExpression[] {
  const out: ParsedExpression[] = [];
  let m: RegExpExecArray | null;
  while ((m = EXPR_RE.exec(input)) !== null) {
    const body = m[1]!;
    out.push({ body, path: splitPath(body), start: m.index, end: m.index + m[0].length });
  }
  return out;
}

export function splitPath(body: string): string[] {
  const parts: string[] = [];
  let buf = "";
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]!;
    if (ch === ".") { if (buf) { parts.push(buf); buf = ""; } continue; }
    if (ch === "[") {
      if (buf) { parts.push(buf); buf = ""; }
      const close = body.indexOf("]", i);
      if (close === -1) throw new Error(`unclosed [ at ${i}`);
      parts.push(body.slice(i + 1, close));
      i = close; continue;
    }
    buf += ch;
  }
  if (buf) parts.push(buf);
  return parts;
}

export function resolvePath(path: string[], scope: unknown): unknown {
  let cur: unknown = scope;
  for (const seg of path) {
    if (cur == null) throw new Error(`missing reference: ${path.join(".")}`);
    if (Array.isArray(cur)) { cur = cur[Number(seg)]; continue; }
    if (typeof cur === "object") { cur = (cur as Record<string, unknown>)[seg]; continue; }
    throw new Error(`cannot read "${seg}" from ${typeof cur}`);
  }
  return cur;
}

export function resolveTemplate(template: string, scope: unknown): unknown {
  const parsed = parseExpressions(template);
  if (parsed.length === 0) return template;
  if (parsed.length === 1 && parsed[0]!.start === 0 && parsed[0]!.end === template.length) {
    return resolvePath(parsed[0]!.path, scope);
  }
  let out = "";
  let cursor = 0;
  for (const p of parsed) {
    out += template.slice(cursor, p.start);
    const v = resolvePath(p.path, scope);
    out += typeof v === "string" ? v : JSON.stringify(v);
    cursor = p.end;
  }
  out += template.slice(cursor);
  return out;
}
