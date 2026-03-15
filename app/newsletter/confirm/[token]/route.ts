import { NextResponse } from 'next/server';
import { subscribeConfirmedEmail } from '@/lib/newsletter/mailchimp';
import { verifyConfirmationToken } from '@/lib/newsletter/token';

type Params = {
  params: {
    token: string;
  };
};

export async function POST(_request: Request, { params }: Params) {
  try {
    const email = verifyConfirmationToken(params.token);
    await subscribeConfirmedEmail(email);

    return NextResponse.json({
      success: true,
      email,
      message: 'Your subscription has been confirmed.'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid or expired token.';
    const status = message.includes('expired') || message.includes('Malformed') || message.includes('Invalid token') ? 400 : 500;

    return NextResponse.json({
      success: false,
      error: message
    }, { status });
  }
}
