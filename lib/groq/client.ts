import Groq from 'groq-sdk';

let _client: Groq | null = null;

/**
 * Returns a singleton Groq client.
 * Throws at runtime if GROQ_API_KEY is not set — never call this on the client side.
 */
export function getGroqClient(): Groq {
  if (_client) return _client;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('[groq/client] GROQ_API_KEY environment variable is not set.');
  }

  _client = new Groq({ apiKey });
  return _client;
}
