import { NextResponse } from 'next/server';
import { storeWebhook } from '@/lib/webhooks';
import { getConnector } from '@/lib/integrations';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: { provider: string } }) {
  try {
    const provider = params.provider;
    const connector = getConnector(provider);
    const bodyText = await req.text();
    let payload: any = null;
    try { payload = JSON.parse(bodyText); } catch (e) { payload = bodyText; }

    // Validate signature if present (e.g., Meta webhooks use x-hub-signature-256)
    const sigHeader = (req.headers.get('x-hub-signature-256') || req.headers.get('x-hub-signature') || '');
    if (sigHeader && connector?.oauth?.clientSecretEnv) {
      const secret = process.env[connector.oauth.clientSecretEnv || ''] || '';
      if (secret) {
        const hmac = crypto.createHmac('sha256', secret).update(bodyText).digest('hex');
        const expected = sigHeader.startsWith('sha256=') ? sigHeader.split('=')[1] : sigHeader;
        if (hmac !== expected) {
          return NextResponse.json({ error: 'invalid_signature' }, { status: 403 });
        }
      }
    }

    // Persist webhook
    storeWebhook(provider, payload, Object.fromEntries(req.headers.entries()));

    // For certain providers we might respond 200 OK or 204
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
