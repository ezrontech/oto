import { NextResponse } from 'next/server';
import { deleteCredentials } from '@/lib/credentials';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });
    const ok = deleteCredentials(id);
    if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
