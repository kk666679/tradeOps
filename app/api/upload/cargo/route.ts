import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads', 'cargo');
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
]);

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid multipart form.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file provided.' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'File exceeds 50 MB limit.' }, { status: 413 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ ok: false, error: `File type ${file.type} is not permitted.` }, { status: 415 });
  }

  const ext = file.name.split('.').pop() ?? 'bin';
  const id = randomUUID();
  const filename = `${id}.${ext}`;

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(/*turbopackIgnore: true*/ join(UPLOAD_DIR, filename), Buffer.from(bytes));
  } catch (err) {
    console.error('[upload/cargo] write failed', err);
    return NextResponse.json({ ok: false, error: 'Storage error. Please try again.' }, { status: 500 });
  }

  const url = `/uploads/cargo/${filename}`;
  const tenantId = form.get('tenantId') as string | null;
  const cargoId = form.get('cargoId') as string | null;

  if (tenantId) {
    try {
      await db.tradeDocument.create({
        data: {
          tenantId,
          kind: 'OTHER',
          title: file.name,
          url,
          mimeType: file.type,
          sizeBytes: file.size,
          ...(cargoId ? { cargoId } : {}),
        },
      });
    } catch {
      console.error('[upload/cargo] db persist failed');
    }
  }

  return NextResponse.json({ ok: true, url, name: file.name, size: file.size });
}
