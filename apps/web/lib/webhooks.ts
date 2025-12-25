import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'apps', 'web', '.data');
const FILE = path.join(DATA_PATH, 'webhooks.json');

function ensureDir() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
}

export function storeWebhook(provider: string, payload: any, headers: Record<string, string | string[] | undefined>) {
  ensureDir();
  const existing = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8') || '[]') : [];
  existing.push({ id: `${provider}_${Date.now()}`, provider, payload, headers, receivedAt: Date.now() });
  fs.writeFileSync(FILE, JSON.stringify(existing, null, 2));
}

export function listWebhooks() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8') || '[]');
}
