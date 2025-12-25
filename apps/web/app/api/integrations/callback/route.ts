import { NextResponse } from 'next/server';
import { getConnector } from '@/lib/integrations';
import { saveCredentials } from '@/lib/credentials';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const provider = url.searchParams.get('provider') || '';
    const state = url.searchParams.get('state');

    const connector = getConnector(provider);
    if (!connector || connector.authType !== 'oauth2' || !connector.oauth) {
      return NextResponse.json({ error: 'invalid_provider' }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: 'missing_code' }, { status: 400 });
    }

    // Perform token exchange with provider token endpoint
    const tokenUrl = connector.oauth.tokenUrl;
    const clientId = process.env[connector.oauth.clientIdEnv || ''] || '';
    const clientSecret = process.env[connector.oauth.clientSecretEnv || ''] || '';
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${connector.oauth.redirectPath || '/api/integrations/callback'}?provider=${provider}`;

    const params = new URLSearchParams();
    params.set('code', code);
    params.set('client_id', clientId);
    params.set('client_secret', clientSecret);
    params.set('redirect_uri', redirectUri);
    params.set('grant_type', 'authorization_code');

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return NextResponse.json({ error: 'token_exchange_failed', details: text }, { status: 502 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token || tokenData.accessToken || '';
    const refreshToken = tokenData.refresh_token || tokenData.refreshToken || '';
    const expiresIn = tokenData.expires_in || tokenData.expiresIn || 3600;

    // Optional: verify tokens by calling connector.testEndpoint
    try {
      if (connector.testEndpoint && accessToken) {
        await fetch(connector.testEndpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (e) {
      // ignore verification errors for now
    }

    // Save credentials (encrypted) under an integration id
    const id = `${provider}_${Date.now()}`;
    saveCredentials(id, {
      provider,
      secret: accessToken,
      refreshToken,
      scopes: connector.oauth.scopes,
      obtainedAt: Date.now(),
      expiresIn,
    });

    const redirect = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/labs/integrations`;
    return NextResponse.redirect(redirect);
  } catch (e) {
    return NextResponse.json({ error: 'callback_error', details: String(e) }, { status: 500 });
  }
}
