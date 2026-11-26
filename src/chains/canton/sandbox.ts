import { useCallback } from 'react';
import { useLocation } from 'react-router';

// The sandbox lives under /sandbox/, apart from the app's own screens: /sandbox/ is its sign-in and,
// once signed in, its Assets list; /sandbox/portfolio/ and the rest follow. Nothing of the sandbox is
// shown at an ordinary address, and nothing real is shown under /sandbox/.
export const SANDBOX = '/sandbox';
export const inSandbox = (pathname: string) => pathname === SANDBOX || pathname.startsWith(SANDBOX + '/');
export const sandboxPath = (path: string) => SANDBOX + path;

// For links in the parts both sides share (the shell, Orders, Activity): the same screen on the side
// the reader is on. to('/orders/') is /sandbox/orders/ inside the sandbox and /orders/ outside it.
export function useTo() {
  const on = inSandbox(useLocation().pathname);
  return useCallback((path: string) => (on ? sandboxPath(path) : path), [on]);
}
