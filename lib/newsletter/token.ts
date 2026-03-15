import crypto from 'node:crypto';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

function getSecret() {
  const secret = process.env.NEWSLETTER_TOKEN_SECRET;

  if (!secret) {
    throw new Error('NEWSLETTER_TOKEN_SECRET is not set.');
  }

  return secret;
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createConfirmationToken(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + TOKEN_TTL_MS
    })
  ).toString('base64url');

  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function readConfirmationToken(token: string) {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    throw new Error('Malformed token.');
  }

  const expected = sign(payload);

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('Invalid token signature.');
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; exp?: number };

  if (!decoded.email || !decoded.exp) {
    throw new Error('Token payload is invalid.');
  }

  if (Date.now() > decoded.exp) {
    throw new Error('Token expired.');
  }

  return decoded.email;
}
