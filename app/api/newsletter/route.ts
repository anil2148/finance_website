import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, leadMagnet, source } = await req.json();

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { leadMagnet, source },
      create: { email, leadMagnet, source }
    });

    return NextResponse.json({ success: true, storage: 'database' });
  } catch {
    const file = path.join(process.cwd(), 'data/newsletter-signups.json');
    const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
    if (!existing.some((entry: { email: string }) => entry.email === email)) {
      existing.push({ email, leadMagnet, source, date: new Date().toISOString() });
      fs.writeFileSync(file, JSON.stringify(existing, null, 2));
    }
    return NextResponse.json({ success: true, storage: 'file' });
  }
}
