import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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

const KEY = 'pm-session';
function read(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null') as Session | null;
    return s && s.token && Date.parse(s.expiresAt) > Date.now() ? s : null;
  } catch { return null; }
}
const store = createStore<Session | null>(read());
function save(s: Session | null) {
  try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch { /* private window: the session lasts until the tab closes */ }
  store.set(s);
}
// Signing in or out in one tab does the same in the others.
window.addEventListener('storage', (e) => { if (e.key === KEY) store.set(read()); });

export const useSession = store.use;
export const signedIn = (r: SignedIn) => save({ token: r.session.token, expiresAt: r.session.expiresAt, user: r.user });

export function signOut() {
  const s = store.get();
  save(null);
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
  const session = useSession();
  const token = session?.token;
  const q = useQuery({
    queryKey: ['auth', 'session', token], enabled: AUTH_ON && !!token, staleTime: 60_000, refetchInterval: 5 * 60_000, retry: false,
    queryFn: () => getApi<{ user: User }>('/v1/auth/session', undefined, token),
  });
  useEffect(() => {
    if (q.error instanceof ApiError && q.error.status === 401 && store.get()?.token === token) save(null);
  }, [q.error, token]);
  useEffect(() => {
    const s = store.get();
    if (q.data && s && s.token === token && JSON.stringify(s.user) !== JSON.stringify(q.data.user)) save({ ...s, user: q.data.user });
  }, [q.data, token]);
}
