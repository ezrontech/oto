import { NextResponse } from 'next/server';
import { readCredentials, saveCredentials } from '@/lib/credentials';
import { getConnector } from '@/lib/integrations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

    const creds = readCredentials(id);
    if (!creds) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const connector = getConnector(creds.provider);
    if (!connector || connector.authType !== 'oauth2' || !connector.oauth) {
      return NextResponse.json({ error: 'invalid_provider' }, { status: 400 });
    }

    const refreshToken = creds.refreshToken;
    if (!refreshToken) return NextResponse.json({ error: 'no_refresh_token' }, { status: 400 });

    const tokenUrl = connector.oauth.tokenUrl;
    const clientId = process.env[connector.oauth.clientIdEnv || ''] || '';
    const clientSecret = process.env[connector.oauth.clientSecretEnv || ''] || '';

    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);
    params.set('client_id', clientId);
    if (clientSecret) params.set('client_secret', clientSecret);

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return NextResponse.json({ error: 'refresh_failed', details: text }, { status: 502 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token || '';
    const newRefresh = tokenData.refresh_token || refreshToken;
    const expiresIn = tokenData.expires_in || undefined;

    // Save updated tokens
    saveCredentials(id, {
      secret: accessToken,
      refreshToken: newRefresh,
      expiresIn,
      refreshedAt: Date.now(),
    });

    return NextResponse.json({ ok: true, accessToken: !!accessToken, refreshToken: !!newRefresh, expiresIn });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
