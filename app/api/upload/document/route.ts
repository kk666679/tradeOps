import { NextResponse } from 'next/server';

/** /api/upload/document */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  return NextResponse.json({ ok: true, route: '/api/upload/document', received: !!file });
}
