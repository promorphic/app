import { useEffect, type ReactElement } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { RequireAuth, SignedOutOnly } from './auth/RequireAuth';
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
const clean = (path: string) => path.replace(/\/+$/, '') || '/';

export function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screen = [...APP, ...AUTH, ...OPEN, VERIFY].find((s) => s.path === clean(pathname));

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
        <Route element={<RequireAuth />}>
          <Route element={<AppShell page={screen?.id ?? ''} />}>
            {APP.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
          </Route>
        </Route>
        <Route element={<SignedOutOnly />}>
          {AUTH.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
        </Route>
        <Route path={VERIFY.path} element={VERIFY.element} />
        {OPEN.map((s) => <Route key={s.id} path={s.path} element={s.element} />)}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toast />
    </>
  );
}
