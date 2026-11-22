// The Promorphic API. On localhost it is the backend running beside the app.
export const API = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? 'http://localhost:8787'
  : 'https://promorphic-api-1017392197056.europe-west1.run.app';

// With a body the request is a POST; without one, a GET.
export async function getApi<T>(path: string, send?: unknown): Promise<T> {
  const r = await fetch(API + path, send === undefined ? undefined : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(send) });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body?.error?.message || `The request failed (${r.status}).`);
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
