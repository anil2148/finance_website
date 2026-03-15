import { NextResponse } from 'next/server';
import { createConfirmationToken } from '@/lib/newsletter/token';
import { sendConfirmationEmail } from '@/lib/newsletter/mailchimp';

type NewsletterPayload = {
  email?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, source } = (await req.json()) as NewsletterPayload;

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const token = createConfirmationToken(email.trim().toLowerCase());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const confirmationLink = `${appUrl}/newsletter/confirm/${token}?source=${encodeURIComponent(source ?? 'website')}`;

    await sendConfirmationEmail(email.trim().toLowerCase(), confirmationLink);

    return NextResponse.json({
      success: true,
      message: 'Check your email to confirm your subscription.'
    });
  } catch (error) {
    console.error('[newsletter-post]', error);
    return NextResponse.json({ error: 'Unable to process your subscription right now.' }, { status: 500 });
  }
}
