import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { inSandbox } from '../chains/canton/sandbox';
import { ApiError, getApi } from '../lib/api';
import { createStore } from '../lib/store';

// The gate is switched on when the app is built (VITE_AUTH=on). While it is off the app is open,
// as it was before accounts existed, and the sign-in screens only lead into it.
export const AUTH_ON = import.meta.env.VITE_AUTH === 'on';

// test marks the shared sandbox account (src/chains/canton/): test assets on Canton, nothing real.
export type User = { email: string; name: string; accountType: 'organization' | 'individual'; organization: string | null; createdAt: string; test?: boolean };
export type Session = { token: string; expiresAt: string; user: User };
export type SignedIn = { session: { token: string; expiresAt: string }; user: User };
export type AuthConfig = { email: boolean; google: { clientId: string } | null };

// Two sessions, kept apart: the app's own, and the sandbox's (everything under /sandbox/). Being
// signed in to one says nothing about the other. Each side of the app sees only its own session, so
// the sandbox asks for its own sign-in even from someone signed in to the app, and the other way round.
type Side = 'live' | 'sandbox';
const KEYS: Record<Side, string> = { live: 'pm-session', sandbox: 'pm-sandbox-session' };
const sideOf = (pathname: string): Side => (inSandbox(pathname) ? 'sandbox' : 'live');
const sideFor = (user: User): Side => (user.test ? 'sandbox' : 'live');

// Before the sandbox had a session of its own, its session was saved as the app's. Move one found there.
try {
  const old = JSON.parse(localStorage.getItem(KEYS.live) || 'null') as Session | null;
  if (old?.user?.test) { localStorage.setItem(KEYS.sandbox, JSON.stringify(old)); localStorage.removeItem(KEYS.live); }
} catch { /* no storage */ }

function read(side: Side): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEYS[side]) || 'null') as Session | null;
    return s && s.token && Date.parse(s.expiresAt) > Date.now() && sideFor(s.user) === side ? s : null;
  } catch { return null; }
}
const stores: Record<Side, ReturnType<typeof createStore<Session | null>>> = { live: createStore<Session | null>(read('live')), sandbox: createStore<Session | null>(read('sandbox')) };
function save(side: Side, s: Session | null) {
  try { if (s) localStorage.setItem(KEYS[side], JSON.stringify(s)); else localStorage.removeItem(KEYS[side]); } catch { /* private window: the session lasts until the tab closes */ }
  stores[side].set(s);
}
// Signing in or out in one tab does the same in the others.
window.addEventListener('storage', (e) => { for (const side of ['live', 'sandbox'] as const) if (e.key === KEYS[side]) stores[side].set(read(side)); });

// The session of the side the reader is on: the sandbox's under /sandbox/, the app's everywhere else.
export function useSession(): Session | null {
  const side = sideOf(useLocation().pathname);
  const live = stores.live.use();
  const sandbox = stores.sandbox.use();
  return side === 'sandbox' ? sandbox : live;
}
// A sign-in is saved on the side its account belongs to, whichever screen it came from.
export const signedIn = (r: SignedIn) => save(sideFor(r.user), { token: r.session.token, expiresAt: r.session.expiresAt, user: r.user });

// Signs out of the side the reader is on, and leaves the other session alone.
export function signOut() {
  const side = sideOf(window.location.pathname);
  const s = stores[side].get();
  save(side, null);
  if (s) getApi('/v1/auth/signout', {}, s.token).catch(() => { /* the session also ends by itself */ });
}

// Where to go once signed in: the screen the person was sent away from, kept across the trip to their inbox.
const RETURN = 'pm-return-to';
export function rememberReturn(path: string) { try { sessionStorage.setItem(RETURN, path); localStorage.setItem(RETURN, path); } catch { /* no storage */ } }
export function takeReturn(): string {
  let path: string | null = null;
  try { path = sessionStorage.getItem(RETURN) || localStorage.getItem(RETURN); sessionStorage.removeItem(RETURN); localStorage.removeItem(RETURN); } catch { /* no storage */ }
  return path && path.startsWith('/') && !path.startsWith('//') && !/^\/(login|signup|auth)\b/.test(path) ? path : '/';
}

export const useAuthConfig = () => useQuery({
  queryKey: ['auth', 'config'], enabled: AUTH_ON, staleTime: 5 * 60_000,
  queryFn: () => getApi<AuthConfig>('/v1/auth/config'),
});

// Asks the API whether the saved session still stands, on arrival and every few minutes.
// A session the API no longer knows is dropped, which sends the person to sign in.
export function useSessionCheck() {
  const side = sideOf(useLocation().pathname);
  const store = stores[side];
  const session = useSession();
  const token = session?.token;
  const q = useQuery({
    queryKey: ['auth', 'session', token], enabled: AUTH_ON && !!token, staleTime: 60_000, refetchInterval: 5 * 60_000, retry: false,
    queryFn: () => getApi<{ user: User }>('/v1/auth/session', undefined, token),
  });
  useEffect(() => {
    if (q.error instanceof ApiError && q.error.status === 401 && store.get()?.token === token) save(side, null);
  }, [q.error, token, side, store]);
  useEffect(() => {
    const s = store.get();
    if (q.data && s && s.token === token && JSON.stringify(s.user) !== JSON.stringify(q.data.user)) save(side, { ...s, user: q.data.user });
  }, [q.data, token, side, store]);
}
