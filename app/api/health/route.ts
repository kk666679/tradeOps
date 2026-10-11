import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'cfs-wms',
    time: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.0.0',
  });
}
