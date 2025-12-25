import { NextResponse } from 'next/server';
import { readCredentials } from '@/lib/credentials';
import { getConnector } from '@/lib/integrations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

    const creds = readCredentials(id);
    if (!creds) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const connector = getConnector(creds.provider);
    if (!connector) return NextResponse.json({ error: 'unknown_provider' }, { status: 400 });

    // Perform a test call depending on auth type
    let ok = false;
    let details: any = null;

    try {
      if (connector.authType === 'oauth2' || connector.authType === 'apikey') {
        const token = creds.secret;
        const res = await fetch(connector.testEndpoint || '', {
          headers: { Authorization: `Bearer ${token}` },
        });
        ok = res.ok;
        details = await res.text();
      } else {
        ok = true;
      }
    } catch (e) {
      details = String(e);
    }

    return NextResponse.json({ ok, details });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
