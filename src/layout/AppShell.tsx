import { Outlet } from 'react-router';
import { SANS } from './styles';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

// The frame every signed-in screen shares. Only the part inside <Outlet /> changes between screens.
export function AppShell({ page }: { page: string }) {
  return (
    <div className="app-root" data-page={page} style={{ boxSizing: 'border-box', background: 'var(--surface-0)', color: 'var(--ink)', fontFamily: SANS, display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
      <Sidebar />
      <div style={{ flex: '1 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
