import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'apps', 'web', '.data');
const FILE = path.join(DATA_PATH, 'custom_connectors.json');

function ensureDir() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const manifest = body?.manifest;
    if (!manifest) return NextResponse.json({ error: 'missing_manifest' }, { status: 400 });

    ensureDir();
    const existing = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8') || '[]') : [];
    existing.push({ id: `custom_${Date.now()}`, manifest, createdAt: Date.now() });
    fs.writeFileSync(FILE, JSON.stringify(existing, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'server_error', details: String(e) }, { status: 500 });
  }
}
