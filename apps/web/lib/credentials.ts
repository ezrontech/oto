import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_PATH = path.join(process.cwd(), 'apps', 'web', '.data');
const STORE_FILE = path.join(DATA_PATH, 'integrations.json');

const ALGO = 'aes-256-gcm';
const SECRET = process.env.INTEGRATIONS_SECRET || '';

function ensureDir() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
}

function encrypt(plain: string) {
  if (!SECRET) return plain;
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash('sha256').update(SECRET).digest();
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decrypt(enc: string) {
  if (!SECRET) return enc;
  try {
    const data = Buffer.from(enc, 'base64');
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const encrypted = data.slice(28);
    const key = crypto.createHash('sha256').update(SECRET).digest();
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return plain.toString('utf8');
  } catch (e) {
    return '';
  }
}

export function saveCredentials(id: string, payload: any) {
  ensureDir();
  const store = readStore();
  store[id] = { ...(store[id] || {}), ...payload };
  // encrypt secret fields if present
  if (store[id].secret) store[id].secret = encrypt(store[id].secret);
  if (store[id].refreshToken) store[id].refreshToken = encrypt(store[id].refreshToken);
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
}

export function readCredentials(id: string) {
  const store = readStore();
  const entry = store[id];
  if (!entry) return null;
  const out = { ...entry };
  if (out.secret) out.secret = decrypt(out.secret);
  if (out.refreshToken) out.refreshToken = decrypt(out.refreshToken);
  return out;
}

export function listCredentials() {
  return readStore();
}

export function deleteCredentials(id: string) {
  ensureDir();
  const store = readStore();
  if (store[id]) {
    delete store[id];
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
    return true;
  }
  return false;
}

function readStore() {
  try {
    if (!fs.existsSync(STORE_FILE)) return {};
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}
