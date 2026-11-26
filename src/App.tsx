import { useEffect, type ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, Outlet } from 'react-router';
import { RegionGate } from './access/RegionGate';
import { RequireAuth, SignedOutOnly } from './auth/RequireAuth';
import TestAgent from './chains/canton/TestAgent';
import TestAssets from './chains/canton/TestAssets';
import TestLogin from './chains/canton/TestLogin';
import TestMandates from './chains/canton/TestMandates';
import TestPortfolio from './chains/canton/TestPortfolio';
import TestWallets from './chains/canton/TestWallets';
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
// The sandbox account (src/chains/canton/): its own sign-in, which the API also takes from the United States, and its own
// version of each screen that would otherwise show real assets. Orders and Activity are shared.
const TEST_LOGIN: Screen = { path: '/sandbox', id: 'test', title: 'Sandbox', element: <TestLogin /> };
const TEST: Record<string, ReactElement> = { assets: <TestAssets />, portfolio: <TestPortfolio />, agent: <TestAgent />, mandates: <TestMandates />, wallets: <TestWallets /> };
const clean = (path: string) => path.replace(/\/+$/, '') || '/';

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { test } = useTest();
  const screen = [...APP, ...AUTH, ...OPEN, VERIFY, TEST_LOGIN].find((s) => s.path === clean(pathname));

  // Each screen starts at the top and names itself in the tab.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${screen ? screen.title : 'Not found'} · Promorphic`;
  }, [screen]);

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
            <Route element={<AppShell page={screen?.id ?? ''} />}>
              {APP.map((s) => <Route key={s.id} path={s.path} element={(test && TEST[s.id]) || s.element} />)}
            </Route>
          </Route>
          <Route element={<SignedOutOnly />}>
            {AUTH.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
          </Route>
          <Route path={VERIFY.path} element={VERIFY.element} />
        </Route>
        {OPEN.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
        <Route path={TEST_LOGIN.path} element={TEST_LOGIN.element} />
        {/* The sandbox's first address, kept so that links already given out still open it. */}
        <Route path="/test" element={<Navigate to="/sandbox/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toast />
    </>
  );
}
