import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Logo } from '../layout/Logo';
import { eyebrow } from '../layout/styles';
import { getApi } from '../lib/api';

type Access = { allowed: boolean; country: string | null; reason: 'region_blocked' | 'region_unknown' | null; message: string | null };

// Promorphic is for people outside the United States. The API refuses every request from a blocked
// country; this asks it first, so such a visitor sees one plain page instead of a broken app.
// If the question itself cannot be asked, the app carries on: the API still refuses what it must.
export function RegionGate({ children }: { children: ReactNode }) {
  const access = useQuery({ queryKey: ['access'], queryFn: () => getApi<Access>('/v1/access'), staleTime: 10 * 60_000, retry: 1 });
  if (access.data && !access.data.allowed) return <Blocked access={access.data} />;
  return <>{children}</>;
}

function Blocked({ access }: { access: Access }) {
  const unknown = access.reason === 'region_unknown';
  useEffect(() => { document.title = 'Not available · Promorphic'; });
  return (
    <div className="app-root" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo />
      </div>
      <main style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', maxWidth: '560px' }}>
        <div style={eyebrow}>Not available</div>
        <h1 style={{ margin: 0, fontSize: '36px', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
          {unknown ? 'We could not tell where you are connecting from.' : 'Promorphic is not available in your country.'}
        </h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.55, color: 'var(--ink-muted)' }}>
          {unknown
            ? 'Promorphic is offered only outside the United States and certain other countries, so it needs to know the country of your connection. Try again from another network.'
            : 'Promorphic is offered only to people outside the United States, and not in countries under sanctions. We work this out from your connection.'}
        </p>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>
          <Link to="/terms/" style={{ color: 'var(--ink)', textUnderlineOffset: '3px' }}>Terms of Use</Link>
          {' · '}
          <Link to="/privacy/" style={{ color: 'var(--ink)', textUnderlineOffset: '3px' }}>Privacy Policy</Link>
          {' · '}
          <a href="https://db-ip.com" target="_blank" rel="noopener" style={{ textUnderlineOffset: '3px' }}>IP Geolocation by DB-IP</a>
        </p>
      </main>
    </div>
  );
}
