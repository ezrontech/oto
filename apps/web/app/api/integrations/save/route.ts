import { NextResponse } from 'next/server';
import { saveCredentials } from '@/lib/credentials';
import { getConnector } from '@/lib/integrations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, name, apiKey } = body || {};
    const connector = getConnector(provider);
    if (!connector) return NextResponse.json({ error: 'unknown_provider' }, { status: 400 });

    if (connector.authType !== 'apikey') {
      return NextResponse.json({ error: 'invalid_auth_type' }, { status: 400 });
    }

    // In a production flow we'd validate the key by calling connector.testEndpoint
    const id = `${provider}_${Date.now()}`;
    saveCredentials(id, { provider, name: name || provider, secret: apiKey, obtainedAt: Date.now() });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
