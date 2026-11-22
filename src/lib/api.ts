// The Promorphic API. On localhost it is the backend running beside the app.
export const API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? 'http://localhost:8787'
  : 'https://promorphic-api-1017392197056.europe-west1.run.app';

// A refusal from the API: its status, the code the API gave it, and a sentence a person can read.
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

// With a body the request is a POST; without one, a GET. A session token, when given, says who is asking.
export async function getApi<T>(path: string, send?: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (send !== undefined) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;
  const r = await fetch(API + path, { method: send === undefined ? 'GET' : 'POST', headers, body: send === undefined ? undefined : JSON.stringify(send) });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, body?.error?.code || 'failed', body?.error?.message || `The request failed (${r.status}).`);
  return body as T;
}

export async function getJSON<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<T>;
}

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<T>;
}
