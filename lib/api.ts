const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const WS_BASE = process.env.NEXT_PUBLIC_WS_URL;

export interface Settings {
  model: string;
  persona: string;
  stt_engine: string;
  tts_engine: string;
  tts_muted: boolean;
  web_search_enabled: boolean;
  [key: string]: unknown;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getHealth(): Promise<{ status: string; model: string; persona: string }> {
  return request('/');
}

export async function getSettings(): Promise<Settings> {
  return request('/settings');
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  await request('/settings', {
    method: 'POST',
    body: JSON.stringify({ updates })
  });
}

export async function getPersonas(): Promise<string[]> {
  const data = await request<{ personas: string[] }>('/personas');
  return data.personas ?? [];
}

export async function getTemplates(): Promise<string[]> {
  const data = await request<{ templates: string[] }>('/templates');
  return data.templates ?? [];
}

export async function ask(prompt: string, persona?: string, template?: string): Promise<string> {
  const data = await request<{ answer: string }>('/ask', {
    method: 'POST',
    body: JSON.stringify({ prompt, persona, template })
  });
  return data.answer ?? '';
}

export async function transcribe(blob: Blob): Promise<{ text: string; heard: boolean }> {
  if (!API_BASE) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return (await response.json()) as { text: string; heard: boolean };
}

export async function clearCache(): Promise<number> {
  if (!API_BASE) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  const response = await fetch(`${API_BASE}/cache`, { method: 'DELETE' });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return response.status;
}

export function createStreamSocket(
  onToken: (token: string) => void,
  onDone: (full: string) => void,
  onError: (msg: string) => void
): WebSocket {
  if (!WS_BASE) {
    throw new Error('Missing NEXT_PUBLIC_WS_URL');
  }

  const socket = new WebSocket(`${WS_BASE}/ask/stream`);
  let full = '';

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(String(event.data)) as { type?: string; text?: string };
      if (data.type === 'token') {
        const token = data.text ?? '';
        full += token;
        onToken(token);
      } else if (data.type === 'done') {
        onDone(full);
      } else if (data.type === 'error') {
        onError(data.text ?? 'Unknown stream error');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Malformed stream message');
    }
  };

  socket.onerror = () => {
    onError('WebSocket error');
  };

  return socket;
}
