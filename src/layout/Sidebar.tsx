import { useState, type MouseEvent } from 'react';
import { Link, NavLink } from 'react-router';
import { AUTH_ON, signOut, useSession } from '../auth/session';
import { useTestAccount } from '../chains/canton/test';
import { Logo } from './Logo';
import { MONO, eyebrow } from './styles';

const GROUPS = [
  { label: 'Markets', links: [['/', 'Assets'], ['/portfolio/', 'Portfolio'], ['/orders/', 'Orders'], ['/activity/', 'Activity']] },
  { label: 'Your agent', links: [['/agent/', 'Agent'], ['/mandates/', 'Mandates'], ['/wallets/', 'Wallets']] },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  // For the test account the card says what its agent can do right now, from the mandate on the ledger.
  const mandate = useTestAccount().data?.mandate;
  const agentLine = !session?.user.test ? 'Running · Copilot' : mandate === undefined ? 'Test agent' : !mandate ? 'No mandate signed' : mandate.paused ? 'Mandate paused' : 'Ready · under mandate';
  // On a phone the menu closes once a screen is chosen, the current one included.
  const closeOnLink = (e: MouseEvent) => { if ((e.target as Element).closest('a')) setOpen(false); };

  return (
    <nav id="side-nav" className={open ? 'side open' : 'side'} aria-label="Primary" onClick={closeOnLink} style={{ flex: '0 0 232px', boxSizing: 'border-box', borderRight: '1px solid var(--hairline)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="side-top">
        <Logo style={{ padding: '0 8px' }} />
        <button className="side-menu-btn" type="button" aria-expanded={open} aria-controls="side-nav" aria-label="Menu" onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 5h14M2 9h14M2 13h14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {GROUPS.map((group) => (
        <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ padding: '0 12px 8px' }}><div style={eyebrow}>{group.label}</div></div>
          {group.links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', minHeight: '44px', padding: '0 12px', borderRadius: '2px', fontSize: '15px', textDecoration: 'none',
                fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--ink)' : 'var(--ink-muted)', background: isActive ? 'var(--surface-2)' : 'transparent',
              })}>
              {label}
            </NavLink>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link to="/agent/" className="agent-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'var(--surface-1)', border: '1px solid var(--hairline)', borderRadius: '2px', textDecoration: 'none' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
            <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--ink)' }} />
            Your agent
          </span>
          <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--ink-muted)' }}>{agentLine}</span>
        </Link>
        <div style={{ borderTop: '1px solid var(--hairline)', padding: '16px 12px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {AUTH_ON && session ? (
            <>
              <div title={session.user.email} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</div>
              <div style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--ink-faint)' }}>
                {session.user.test ? 'Test account' : session.user.accountType === 'organization' ? 'Organization' : 'Individual'} · <button type="button" className="link-button" onClick={signOut}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>abhi@promorphic.xyz</div>
              <div style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--ink-faint)' }}>
                Test account · <Link to="/login/" style={{ textUnderlineOffset: '3px' }}>Sign out</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
