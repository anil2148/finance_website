import { NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/newsletter/mailchimp';
import { generateConfirmationToken } from '@/lib/newsletter/token';

type NewsletterPayload = {
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
}

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as NewsletterPayload;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const token = generateConfirmationToken(normalizedEmail);
    const confirmUrl = `${getAppUrl()}/newsletter/confirm/${encodeURIComponent(token)}`;

    await sendConfirmationEmail(normalizedEmail, confirmUrl);

    return NextResponse.json({
      success: true,
      message: 'Check your email to confirm subscription.'
    });
  } catch (error) {
    console.error('[newsletter-subscribe]', error);
    return NextResponse.json({ error: 'Unable to process subscription right now.' }, { status: 500 });
  }
}
