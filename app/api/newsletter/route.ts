import { NextResponse } from 'next/server';
import { subscribeToBrevo } from '@/lib/newsletter/brevo';
import { isValidEmail, maskEmail, normalizeEmail } from '@/lib/newsletter/validation';
import { appendSignupLog } from '@/lib/newsletter/storage';

type NewsletterPayload = {
  email?: string;
  source?: string;
  persona?: string;
  leadMagnet?: string;
};

type ErrorCode =
  | 'INVALID_CONTENT_TYPE'
  | 'INVALID_JSON'
  | 'INVALID_EMAIL'
  | 'NEWSLETTER_CONFIG_MISSING'
  | 'RATE_LIMITED'
  | 'PROVIDER_ERROR'
  | 'INTERNAL_ERROR';

type NewsletterErrorResponse = {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
};

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

async function parseRequestBody(request: Request): Promise<NewsletterPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error('INVALID_CONTENT_TYPE');
  }

  return request.json() as Promise<NewsletterPayload>;
}

function mapBrevoError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown provider error';

  if (message === 'BREVO_CONFIG_MISSING') {
    return {
      status: 503,
      code: 'NEWSLETTER_CONFIG_MISSING' as const,
      message: 'Newsletter signup is temporarily unavailable. Please try again soon.'
    };
  }

  if (message.includes(':429:')) {
    return {
      status: 429,
      code: 'RATE_LIMITED' as const,
      message: 'Too many signup attempts right now. Please wait a moment and try again.'
    };
  }

  return {
    status: 502,
    code: 'PROVIDER_ERROR' as const,
    message: 'Unable to subscribe right now. Please try again in a moment.'
  };
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

    const source = payload.source ?? 'unknown';
    const persona = payload.persona ?? 'unspecified';
    const leadMagnet = payload.leadMagnet ?? 'none';

    let alreadySubscribed = false;

    try {
      const result = await subscribeToBrevo(normalizedEmail);
      alreadySubscribed = result.alreadySubscribed;
    } catch (error) {
      const mapped = mapBrevoError(error);
      const providerMessage = error instanceof Error ? error.message : 'Unknown provider error';
      console.error('[newsletter-subscribe:provider-error]', {
        email: maskEmail(normalizedEmail),
        code: mapped.code,
        error: providerMessage
      });
      return errorResponse(mapped.status, mapped.code, mapped.message);
    }

    try {
      appendSignupLog({
        email_hash_hint: maskEmail(normalizedEmail),
        source,
        persona,
        lead_magnet: leadMagnet,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to append signup log';
      console.error('[newsletter-subscribe:log-write-error]', {
        email: maskEmail(normalizedEmail),
        source,
        persona,
        error: message
      });
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed,
      message: alreadySubscribed
        ? "You're already subscribed. We'll keep sending future guides and updates."
        : "You're subscribed. Check your inbox for future guides and updates."
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
