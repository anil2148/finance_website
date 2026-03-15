import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

type NewsletterPayload = {
  email: string;
  leadMagnet?: string;
  source?: string;
};

function saveToFile({ email, leadMagnet, source }: NewsletterPayload) {
  const file = path.join(process.cwd(), 'data/newsletter-signups.json');
  const existing = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];

  if (!existing.some((entry: { email: string }) => entry.email === email)) {
    existing.push({ email, leadMagnet, source, date: new Date().toISOString() });
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
  }
}

async function saveToDatabase(payload: NewsletterPayload) {
  try {
    const runtimeRequire = eval('require') as NodeRequire;
    const { PrismaClient } = runtimeRequire('@prisma/client') as {
      PrismaClient: new (options?: { log?: string[] }) => {
        newsletterSubscriber: {
          upsert: (args: {
            where: { email: string };
            update: { leadMagnet?: string; source?: string };
            create: { email: string; leadMagnet?: string; source?: string };
          }) => Promise<void>;
        };
      };
    };

    const globalForPrisma = globalThis as { prisma?: InstanceType<typeof PrismaClient> };
    const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: payload.email },
      update: { leadMagnet: payload.leadMagnet, source: payload.source },
      create: {
        email: payload.email,
        leadMagnet: payload.leadMagnet,
        source: payload.source
      }
    });

    return true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const { email, leadMagnet, source } = (await req.json()) as NewsletterPayload;

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const savedInDatabase = await saveToDatabase({ email, leadMagnet, source });

  if (savedInDatabase) {
    return NextResponse.json({ success: true, storage: 'database' });
  }

  saveToFile({ email, leadMagnet, source });
  return NextResponse.json({ success: true, storage: 'file' });
}
