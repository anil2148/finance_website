function decodeUriComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function fullyDecodeUriComponent(value: string): string {
  let decoded = value;
  let previous = '';
  let iterations = 0;
  const maxIterations = 10;

  while (decoded !== previous && iterations < maxIterations) {
    previous = decoded;
    decoded = decodeUriComponentSafe(decoded);
    iterations += 1;
  }

  return decoded;
}

export function normalizeTag(tag: string) {
  return fullyDecodeUriComponent(tag).trim().toLowerCase();
}

export function slugifyTag(tag: string): string {
  return normalizeTag(tag)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
