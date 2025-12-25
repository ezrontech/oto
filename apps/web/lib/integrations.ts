export type AuthType = 'oauth2' | 'apikey' | 'webhook' | 'none';

export interface ConnectorConfig {
  key: string;
  name: string;
  authType: AuthType;
  oauth?: {
    authorizeUrl: string;
    tokenUrl: string;
    scopes: string[];
    clientIdEnv?: string; // optional env var holding client id
    clientSecretEnv?: string;
    redirectPath?: string; // path on our app for callback
  };
  testEndpoint?: string;
  description?: string;
  icon?: string;
}

export const CONNECTORS: Record<string, ConnectorConfig> = {
  gmail: {
    key: 'gmail',
    name: 'Gmail',
    authType: 'oauth2',
    oauth: {
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'openid', 'email', 'profile'],
      clientIdEnv: 'GMAIL_CLIENT_ID',
      clientSecretEnv: 'GMAIL_CLIENT_SECRET',
      redirectPath: '/api/integrations/callback',
    },
    testEndpoint: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
    description: 'Connect Gmail to ingest and send messages for Conversations.',
  },

  whatsapp: {
    key: 'whatsapp',
    name: 'WhatsApp (Business API)',
    authType: 'apikey',
    testEndpoint: 'https://graph.facebook.com/v17.0/me/messages',
    description: 'Connect a WhatsApp Business API token or provider to handle messages.',
  },

  social: {
    key: 'social',
    name: 'Social (Meta / X / Instagram)',
    authType: 'oauth2',
    oauth: {
      authorizeUrl: 'https://www.facebook.com/v17.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v17.0/oauth/access_token',
      scopes: ['pages_read_engagement', 'pages_manage_metadata', 'pages_read_user_content'],
      clientIdEnv: 'META_CLIENT_ID',
      clientSecretEnv: 'META_CLIENT_SECRET',
      redirectPath: '/api/integrations/callback',
    },
    testEndpoint: 'https://graph.facebook.com/me',
    description: 'Connect social accounts (Meta / Instagram / X) to surface messages into Conversations.',
  },
};

export function getConnector(key: string) {
  return CONNECTORS[key];
}
