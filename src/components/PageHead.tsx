import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import { MONO, eyebrow } from '../layout/styles';

// The top of every screen: the small label, the title, a sentence, and actions on the right.
export function PageHead({ title, lead, children }: { title: string; lead: ReactNode; children?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={eyebrow}>{title}</div>
        <h1 style={{ margin: 0, fontSize: '36px', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.025em', color: 'var(--ink)' }}>{title}</h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: 'var(--ink-muted)', maxWidth: '640px' }}>{lead}</p>
      </div>
      {children && <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>{children}</div>}
    </div>
  );
}

const card: CSSProperties = { flex: '1 1 200px', background: 'var(--surface-1)', border: '1px solid var(--hairline)', borderRadius: '2px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' };
// A figure with a line under it.
export function Stat({ value, label }: { value: ReactNode; label: ReactNode }) {
  return (
    <div style={card}>
      <div style={{ fontFamily: MONO, fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: '13px', lineHeight: 1.45, color: 'var(--ink-muted)' }}>{label}</div>
    </div>
  );
}
export const Stats = ({ children }: { children: ReactNode }) => <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>{children}</div>;

// What a screen shows instead of its rows: while loading, when empty, when the API refused, or signed out.
export function Notice({ children }: { children: ReactNode }) {
  return <div className="live-empty" role="status">{children}</div>;
}
export const SignedOut = ({ what }: { what: string }) => <Notice><Link to="/login/">Sign in</Link> to see {what}.</Notice>;
export const Failed = ({ error, what }: { error: unknown; what: string }) => <Notice>{what} could not be loaded. {error instanceof Error ? error.message : ''}</Notice>;
