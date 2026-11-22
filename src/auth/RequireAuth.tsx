import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AUTH_ON, rememberReturn, useSession, useSessionCheck } from './session';

// Everything inside is for signed-in people. Anyone else is sent to sign in, and brought back afterwards.
export function RequireAuth() {
  const session = useSession();
  const { pathname, search } = useLocation();
  useSessionCheck();
  const out = AUTH_ON && !session;
  useEffect(() => { if (out) rememberReturn(pathname + search); }, [out, pathname, search]);
  return out ? <Navigate to="/login/" replace /> : <Outlet />;
}

// The sign-in screens are for signed-out people; someone already signed in goes straight to the app.
export function SignedOutOnly() {
  const session = useSession();
  return AUTH_ON && session ? <Navigate to="/" replace /> : <Outlet />;
}
