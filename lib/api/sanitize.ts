/**
 * Sanitize arbitrary user-supplied text for use in server-side processing.
 *
 * - Strips HTML angle brackets to prevent markup injection.
 * - Removes ASCII control characters (except whitespace) that could confuse
 *   LLM tokenisers or act as hidden prompt-injection sequences.
 * - Trims surrounding whitespace.
 * - Enforces a maximum character length.
 */
export function sanitizeText(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    // Remove ASCII control characters (0x00–0x1F) except tab (0x09), LF (0x0A), CR (0x0D)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}
