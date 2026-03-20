import { isValidEmail, normalizeEmail } from '@/lib/newsletter/validation';

type BrevoConfig = {
  apiKey: string;
  listId?: number;
};

type BrevoSubscribeResult = {
  alreadySubscribed: boolean;
};

const BREVO_BASE_URL = 'https://api.brevo.com/v3';

function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const rawListId = process.env.BREVO_LIST_ID?.trim();

  if (!apiKey) {
    return null;
  }

  if (!rawListId) {
    return { apiKey };
  }

  const listId = Number(rawListId);

  if (!Number.isInteger(listId) || listId <= 0) {
    throw new Error('BREVO_LIST_ID must be a positive integer when set.');
  }

  return { apiKey, listId };
}

async function brevoRequest(path: string, init: RequestInit, apiKey: string) {
  const response = await fetch(`${BREVO_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': apiKey,
      ...(init.headers ?? {})
    },
    cache: 'no-store'
  });

  return response;
}

async function updateExistingContact(email: string, config: BrevoConfig) {
  const body: { listIds?: number[] } = {};

  if (config.listId) {
    body.listIds = [config.listId];
  }

  const response = await brevoRequest(
    `/contacts/${encodeURIComponent(email)}`,
    {
      method: 'PUT',
      body: JSON.stringify(body)
    },
    config.apiKey
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`BREVO_UPDATE_FAILED:${response.status}:${text}`);
  }
}

export async function subscribeToBrevo(email: string): Promise<BrevoSubscribeResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('INVALID_EMAIL');
  }

  const config = getBrevoConfig();

  if (!config) {
    throw new Error('BREVO_CONFIG_MISSING');
  }

  const lookupResponse = await brevoRequest(
    `/contacts/${encodeURIComponent(normalizedEmail)}`,
    { method: 'GET' },
    config.apiKey
  );

  if (lookupResponse.ok) {
    await updateExistingContact(normalizedEmail, config);
    return { alreadySubscribed: true };
  }

  if (lookupResponse.status !== 404) {
    const text = await lookupResponse.text();
    throw new Error(`BREVO_LOOKUP_FAILED:${lookupResponse.status}:${text}`);
  }

  const createBody: {
    email: string;
    listIds?: number[];
    updateEnabled: true;
  } = {
    email: normalizedEmail,
    updateEnabled: true
  };

  if (config.listId) {
    createBody.listIds = [config.listId];
  }

  const createResponse = await brevoRequest(
    '/contacts',
    {
      method: 'POST',
      body: JSON.stringify(createBody)
    },
    config.apiKey
  );

  if (!createResponse.ok) {
    const text = await createResponse.text();
    throw new Error(`BREVO_CREATE_FAILED:${createResponse.status}:${text}`);
  }

  return { alreadySubscribed: false };
}
