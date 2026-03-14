import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  const file = path.join(process.cwd(), 'data/newsletter-signups.json');
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  existing.push({ email, date: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  return NextResponse.json({ success: true });
}
