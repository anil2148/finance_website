import crypto from 'node:crypto';

const TOKEN_TTL_SECONDS = 60 * 60;

type NewsletterTokenPayload = {
  email: string;
  exp: number;
};

function getTokenSecret() {
  const secret = process.env.NEWSLETTER_TOKEN_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('NEWSLETTER_TOKEN_SECRET must be set and at least 32 characters long.');
  }

  return secret;
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
}

export function generateConfirmationToken(email: string, ttlSeconds = TOKEN_TTL_SECONDS) {
  const normalizedEmail = email.trim().toLowerCase();
  const tokenPayload: NewsletterTokenPayload = {
    email: normalizedEmail,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds
  };

  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyConfirmationToken(token: string) {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    throw new Error('Malformed token.');
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    throw new Error('Invalid token signature.');
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as Partial<NewsletterTokenPayload>;

  if (!payload.email || !payload.exp) {
    throw new Error('Token payload is invalid.');
  }

  if (Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired.');
  }

  return payload.email;
}
