import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { useTo } from '../chains/canton/sandbox';

export function Logo({ style }: { style?: CSSProperties }) {
  const to = useTo();
  return (
    <Link to={to('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '44px', textDecoration: 'none', color: 'var(--ink)', ...style }}>
      <svg width="26" height="26" viewBox="0 4 70.3125 70.3125" role="img" aria-label="Promorphic">
        <rect x="0" y="4" width="39.5508" height="24.1699" style={{ fill: 'var(--ink)' }} />
        <rect x="0" y="32.5645" width="70.3125" height="13.1836" style={{ fill: 'var(--brand)' }} />
        <rect x="30.7617" y="50.1426" width="39.5508" height="24.1699" style={{ fill: 'var(--ink)' }} />
      </svg>
      <span style={{ fontSize: '20px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>Promorphic</span>
    </Link>
  );
}
