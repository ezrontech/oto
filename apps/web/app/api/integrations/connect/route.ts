import { NextResponse } from 'next/server';
import { getConnector } from '@/lib/integrations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provider = body?.provider;
    const connector = getConnector(provider);
    if (!connector) return NextResponse.json({ error: 'unknown_provider' }, { status: 400 });

    if (connector.authType === 'oauth2' && connector.oauth) {
      const clientId = process.env[connector.oauth.clientIdEnv || ''] || '';
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${connector.oauth.redirectPath || '/api/integrations/callback'}?provider=${provider}`;
      const state = Math.random().toString(36).slice(2);
      const url = new URL(connector.oauth.authorizeUrl);
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', connector.oauth.scopes.join(' '));
      url.searchParams.set('state', state);

      // store state in memory or DB in production; returning it for UI to hold
      return NextResponse.json({ authorizeUrl: url.toString(), state });
    }

    return NextResponse.json({ error: 'not_oauth_provider' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
