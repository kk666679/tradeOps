/**
 * Shared engine for the one-off page-wiring generators.
 * Renders a stub page into the established wired-page pattern:
 *   PageHeader + composition of dedicated @/components/<domain>/<sub>/* components.
 *
 * Idempotent: only rewrites files that still contain the stub marker.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const STUB = 'Wire this page to the';

/**
 * spec = { title, description, components: [{name, path}], layout?, dynamic? }
 * layout: 'grid2' (default when >1) | 'stack' | 'grid3'
 * dynamic: route param name (e.g. 'id') -> async params page (presentational components ignore it).
 */
export function renderPage(spec) {
  const imports = spec.components.map((c) => `import { ${c.name} } from '${c.path}';`).join('\n');
  const tags = spec.components.map((c) => `<${c.name} />`);

  let composed;
  const layout = spec.layout ?? (tags.length > 1 ? 'grid2' : 'stack');
  if (layout !== 'stack' && tags.length > 1) {
    const cols = layout === 'grid3' ? 3 : 2;
    const rows = [];
    for (let i = 0; i < tags.length; i += cols) {
      rows.push(tags.slice(i, i + cols).map((t) => `        ${t}`).join('\n'));
    }
    composed = rows
      .map((r) => `      <div className="grid gap-6 lg:grid-cols-${cols}">\n${r}\n      </div>`)
      .join('\n');
  } else {
    composed = tags.map((t) => `      ${t}`).join('\n');
  }

  const pageFn = spec.dynamic
    ? `export default function Page({ params }: { params: Promise<{ ${spec.dynamic}: string }> }) {\n  void params;\n`
    : `export default function Page() {\n`;

  return `import * as React from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/dashboard/page/PageHeader';
${imports}

export const metadata: Metadata = { title: '${spec.title}' };

${pageFn}  return (
    <div className="space-y-6">
      <PageHeader title="${spec.title}" description="${spec.description}" />
${composed}
    </div>
  );
}
`;
}

/** Write all pages for a domain. baseDir is relative to app/(app)/. Returns {written, skipped, missing}. */
export function writePages(baseDir, entries) {
  let written = 0, skipped = 0;
  const missing = [];
  for (const [rel, spec] of entries) {
    const abs = join(ROOT, 'app', '(app)', baseDir, rel);
    if (!existsSync(abs)) { missing.push(`${baseDir}/${rel}`); continue; }
    const cur = readFileSync(abs, 'utf8');
    if (!cur.includes(STUB)) { skipped++; continue; }
    writeFileSync(abs, renderPage(spec), 'utf8');
    written++;
  }
  return { written, skipped, missing };
}
