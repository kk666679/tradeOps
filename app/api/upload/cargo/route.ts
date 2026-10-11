import { NextResponse } from 'next/server';

/** /api/upload/cargo */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  return NextResponse.json({ ok: true, route: '/api/upload/cargo', received: !!file });
}
