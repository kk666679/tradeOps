// Storage helper for upload routes.
//
// Kept in its own module so the route handlers never statically reference
// process.cwd()/join with dynamic paths. Turbopack would otherwise trace the
// entire project into the server bundle at build time (see the
// "Dynamic filesystem access" warning), ballooning memory until the build
// is OOM-killed on this 2-CPU / 7.8 GB box.
//
// createRequire escapes Turbopack's static analysis entirely, so the path
// resolution happens at runtime with no build-time cost.

import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';

const require = createRequire(import.meta.url);
const fs = require('node:fs/promises') as typeof import('node:fs/promises');
const path = require('node:path') as typeof import('node:path');

export function saveUpload(file: File, subdir: 'documents' | 'cargo'): Promise<string> {
  return file.arrayBuffer().then(async (bytes) => {
    const ext = file.name.split('.').pop() ?? 'bin';
    const id = randomUUID();
    const filename = `${id}.${ext}`;
    const dir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads', subdir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(bytes));
    return `/uploads/${subdir}/${filename}`;
  });
}