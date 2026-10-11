import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const BACKEND = resolve(ROOT, 'backend');
const OUT = resolve(ROOT, 'server', 'trpc', 'router.ts');

function run(cmd: string, args: string[], cwd: string) {
  return spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/cfs_wms' },
  });
}

function main() {
  // 1. Regenerate the Prisma client so backend types reflect the schema.
  run('npx', ['prisma', 'generate'], resolve(BACKEND, 'prisma'));

  // 2. Compile the backend (build config excludes tests/scripts) so the
  //    emitted AppRouter type declaration is fresh.
  const build = run('npx', ['tsc', '-p', 'tsconfig.build.json'], BACKEND);
  if (build.status !== 0) {
    console.error('Backend tsc failed; refusing to overwrite router.ts');
    process.exit(build.status ?? 1);
  }

  // 3. Re-export the emitted `appRouter` getter type as the frontend's
  //    `AppRouter` type so the Next.js app receives end-to-end procedure
  //    types without a duplicate router definition.
  const dist = resolve(BACKEND, 'dist', 'trpc', 'trpc.router.d.ts');
  if (!existsSync(dist)) {
    console.error('Missing emitted router declaration at', dist);
    process.exit(1);
  }
  const decl = readFileSync(dist, 'utf8');

  // The emitted declaration declares `get appRouter(): <type>;` inside the
  // `TrpcRouter` class, followed by
  // `export type AppRouter = TrpcRouter['appRouter'];`. The type expression
  // itself contains semicolons, so we capture from the getter's colon (the
  // first `:` outside strings/comments) up to the last `;` before the
  // `export type AppRouter` line.
  const marker = 'get appRouter():';
  const markerIdx = decl.indexOf(marker);
  if (markerIdx === -1) {
    console.error('Could not find appRouter getter in emitted declaration');
    process.exit(1);
  }
  // The marker already ends with `:`, so the type expression begins at the
  // first non-whitespace char after the marker.
  let exprStart = markerIdx + marker.length;
  while (exprStart < decl.length && /\s/.test(decl[exprStart])) exprStart++;
  const exportIdx = decl.indexOf('export type AppRouter');
  if (exportIdx === -1) {
    console.error('Could not find AppRouter export in emitted declaration');
    process.exit(1);
  }
  const slice = decl.slice(exprStart, exportIdx);
  const lastSemicolon = slice.lastIndexOf(';');
  if (lastSemicolon === -1) {
    console.error('Could not find terminating semicolon for appRouter type');
    process.exit(1);
  }
  const typeExpr = slice.slice(0, lastSemicolon).trim();

  mkdirSync(resolve(ROOT, 'server', 'trpc'), { recursive: true });
  writeFileSync(
    OUT,
    `/**
 * Auto-generated frontend-facing tRPC router type.
 *
 * Re-exported from the compiled Nest backend (\`backend/src/trpc/trpc.router.ts\`)
 * so the Next.js app gets end-to-end types for every procedure without a
 * duplicate router definition. Regenerate with: \`npm run trpc:types\`.
 */
export type AppRouter = ${typeExpr};
`,
  );
  console.log('Wrote', resolve(ROOT, 'server/trpc/router.ts'));
}

main();