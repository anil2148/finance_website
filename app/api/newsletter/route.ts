import { NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/newsletter/mailchimp';
import { generateConfirmationToken } from '@/lib/newsletter/token';
import { isValidEmail, maskEmail, normalizeEmail } from '@/lib/newsletter/validation';

type NewsletterPayload = {
  email?: string;
};

type ErrorCode =
  | 'INVALID_CONTENT_TYPE'
  | 'INVALID_JSON'
  | 'INVALID_EMAIL'
  | 'TOKEN_CONFIG_ERROR'
  | 'EMAIL_PROVIDER_ERROR'
  | 'INTERNAL_ERROR';

type NewsletterErrorResponse = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? 'http://localhost:3000';
}

function errorResponse(status: number, code: ErrorCode, message: string) {
  return NextResponse.json<NewsletterErrorResponse>(
    {
      success: false,
      error: {
        code,
        message
      }
    },
    { status }
  );
}

function parseRequestBody(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error('INVALID_CONTENT_TYPE');
  }

  return request.json() as Promise<NewsletterPayload>;
}

export async function POST(request: Request) {
  let normalizedEmail = '';

  try {
    let payload: NewsletterPayload;

    try {
      payload = await parseRequestBody(request);
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CONTENT_TYPE') {
        return errorResponse(415, 'INVALID_CONTENT_TYPE', 'Content-Type must be application/json.');
      }

      return errorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON.');
    }

    normalizedEmail = normalizeEmail(payload.email ?? '');

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return errorResponse(400, 'INVALID_EMAIL', 'Please enter a valid email address.');
    }

    let token: string;

    try {
      token = generateConfirmationToken(normalizedEmail);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token generation failed.';
      console.error('[newsletter-subscribe:token-config]', {
        email: maskEmail(normalizedEmail),
        error: message
      });
      return errorResponse(500, 'TOKEN_CONFIG_ERROR', 'Newsletter subscription is not configured correctly.');
    }

    const confirmUrl = `${getAppUrl()}/newsletter/confirm/${encodeURIComponent(token)}`;

    try {
      await sendConfirmationEmail(normalizedEmail, confirmUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email provider error';
      console.error('[newsletter-subscribe:provider-error]', {
        email: maskEmail(normalizedEmail),
        error: message
      });
      return errorResponse(502, 'EMAIL_PROVIDER_ERROR', 'Unable to send confirmation email right now. Please try again.');
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email to confirm subscription.'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[newsletter-subscribe:unexpected]', {
      email: normalizedEmail ? maskEmail(normalizedEmail) : undefined,
      error: message
    });
    return errorResponse(500, 'INTERNAL_ERROR', 'Unable to process subscription right now.');
  }
}
