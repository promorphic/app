import { useEffect, type ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, Outlet } from 'react-router';
import { RegionGate } from './access/RegionGate';
import { RequireAuth, SignedOutOnly } from './auth/RequireAuth';
import { useSession, useSessionCheck } from './auth/session';
import TestAgent from './chains/canton/TestAgent';
import TestAssets from './chains/canton/TestAssets';
import TestLogin from './chains/canton/TestLogin';
import TestMandates from './chains/canton/TestMandates';
import TestPortfolio from './chains/canton/TestPortfolio';
import TestWallets from './chains/canton/TestWallets';
import { inSandbox, SANDBOX, sandboxPath } from './chains/canton/sandbox';
import { useTest } from './chains/canton/test';
import { AppShell } from './layout/AppShell';
import { notYet, Toast } from './lib/toast';
import Activity from './pages/Activity';
import Agent from './pages/Agent';
import Assets from './pages/Assets';
import { Privacy, Terms } from './pages/Legal';
import Login from './pages/Login';
import Mandates from './pages/Mandates';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import Portfolio from './pages/Portfolio';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Wallets from './pages/Wallets';

type Screen = { path: string; id: string; title: string; element: ReactElement };

const APP: Screen[] = [
  { path: '/', id: 'assets', title: 'Assets', element: <Assets /> },
  { path: '/portfolio', id: 'portfolio', title: 'Portfolio', element: <Portfolio /> },
  { path: '/orders', id: 'orders', title: 'Orders', element: <Orders /> },
  { path: '/activity', id: 'activity', title: 'Activity', element: <Activity /> },
  { path: '/agent', id: 'agent', title: 'Your agent', element: <Agent /> },
  { path: '/mandates', id: 'mandates', title: 'Mandates', element: <Mandates /> },
  { path: '/wallets', id: 'wallets', title: 'Wallets', element: <Wallets /> },
];
const AUTH: Screen[] = [
  { path: '/login', id: 'login', title: 'Sign in', element: <Login /> },
  { path: '/signup', id: 'signup', title: 'Sign up', element: <Signup /> },
];
// Open to everyone, signed in or not.
const OPEN: Screen[] = [
  { path: '/terms', id: 'terms', title: 'Terms of Use', element: <Terms /> },
  { path: '/privacy', id: 'privacy', title: 'Privacy Policy', element: <Privacy /> },
];
const VERIFY: Screen = { path: '/auth/verify', id: 'verify', title: 'Signing in', element: <Verify /> };
// The sandbox (src/chains/canton/) is the same set of screens under /sandbox/, for the sandbox account
// only: its own version of each screen that would otherwise show real assets, with Orders and Activity
// shared. /sandbox/ itself is the sign-in until someone is signed in, and the Assets list after.
const TEST: Record<string, ReactElement> = { assets: <TestAssets />, portfolio: <TestPortfolio />, agent: <TestAgent />, mandates: <TestMandates />, wallets: <TestWallets /> };
const SANDBOX_APP: Screen[] = APP.map((s) => ({ ...s, path: s.path === '/' ? SANDBOX : SANDBOX + s.path, element: TEST[s.id] ?? s.element }));
const clean = (path: string) => path.replace(/\/+$/, '') || '/';
const withSlash = (path: string) => (path.endsWith('/') ? path : path + '/');

// The app's own screens are not for the sandbox account: it is sent to the same screen in the sandbox.
function LiveOnly() {
  const { test } = useTest();
  const { pathname } = useLocation();
  return test ? <Navigate to={withSlash(sandboxPath(clean(pathname) === '/' ? '' : clean(pathname)))} replace /> : <Outlet />;
}

// The sandbox's screens are for the sandbox account only. Signed out, /sandbox/ is the sign-in and the
// rest lead to it; any other account is sent back to the app. The sign-in sits outside the region
// gate, because the API takes it from the United States; the screens ask the gate with the session.
function SandboxOnly() {
  const session = useSession();
  const { pathname } = useLocation();
  useSessionCheck();
  if (!session) return clean(pathname) === SANDBOX ? <TestLogin /> : <Navigate to={SANDBOX + '/'} replace />;
  if (!session.user.test) return <Navigate to="/" replace />;
  return <RegionGate><Outlet /></RegionGate>;
}

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { test } = useTest();
  const sandbox = inSandbox(clean(pathname));
  const screen = [...APP, ...AUTH, ...OPEN, VERIFY, ...SANDBOX_APP].find((s) => s.path === clean(pathname));
  // /sandbox/ is the sign-in until the sandbox account is signed in.
  const title = sandbox && !test ? (clean(pathname) === SANDBOX ? 'Sign in' : '') : screen ? screen.title : 'Not found';

  // Each screen starts at the top and names itself in the tab.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = [title, sandbox ? 'Promorphic Sandbox' : 'Promorphic'].filter(Boolean).join(' · ');
  }, [title, sandbox, pathname]);

  // Buttons in the sample screens say what they do through an attribute:
  // data-go leads to another screen; data-soon has nothing behind it yet and says so.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const button = el?.closest('button');
      if (button?.dataset.go) navigate(button.dataset.go);
      else if (button && 'soon' in button.dataset) notYet();
      else if (el?.closest('a[href="#"]')) e.preventDefault();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route element={<RegionGate><Outlet /></RegionGate>}>
          <Route element={<RequireAuth />}>
            <Route element={<LiveOnly />}>
              <Route element={<AppShell page={screen?.id ?? ''} />}>
                {APP.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
              </Route>
            </Route>
          </Route>
          <Route element={<SignedOutOnly />}>
            {AUTH.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
          </Route>
          <Route path={VERIFY.path} element={VERIFY.element} />
        </Route>
        {OPEN.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
        <Route element={<SandboxOnly />}>
          <Route element={<AppShell page={screen?.id ?? ''} />}>
            {SANDBOX_APP.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
          </Route>
        </Route>
        {/* The sandbox's first address, kept so that links already given out still open it. */}
        <Route path="/test" element={<Navigate to="/sandbox/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toast />
    </>
  );
}
