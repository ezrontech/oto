import { NextResponse } from 'next/server';
import { listCredentials } from '@/lib/credentials';

export async function GET() {
  try {
    const store = listCredentials();
    return NextResponse.json({ integrations: store });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
