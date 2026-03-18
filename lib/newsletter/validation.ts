export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return emailPattern.test(normalizeEmail(email));
}

export function maskEmail(email: string) {
  const normalized = normalizeEmail(email);
  const [localPart, domain = ''] = normalized.split('@');

  if (!localPart || !domain) {
    return '***';
  }

  const start = localPart.slice(0, 2);
  const maskedLocal = `${start}${'*'.repeat(Math.max(localPart.length - start.length, 1))}`;

  return `${maskedLocal}@${domain}`;
}
