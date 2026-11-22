import type { CSSProperties, ReactNode } from 'react';
import { Logo } from '../layout/Logo';
import { ThemeSwitch } from '../layout/ThemeSwitch';
import { MONO, SANS } from '../layout/styles';

// The frame the sign-in screens share: what Promorphic is on the left, the form on the right.
export function AuthLayout({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="app-root" style={{ boxSizing: 'border-box', background: 'var(--surface-0)', color: 'var(--ink)', fontFamily: SANS, display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}>
      <div className="auth-aside" style={{ flex: '1 1 480px', boxSizing: 'border-box', borderRight: '1px solid var(--hairline)', padding: '32px 48px 40px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo style={{ padding: '0 8px' }} />
          <span style={{ marginLeft: 'auto' }}><ThemeSwitch /></span>
        </div>
        <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '520px' }}>
          <p className="auth-hero" style={{ margin: 0, fontSize: '44px', lineHeight: 1.08, fontWeight: 500, letterSpacing: '-0.025em', color: 'var(--ink)' }}>Hold, trade and manage tokenized assets from one place.</p>
          {aside}
        </div>
        <div style={{ fontFamily: MONO, fontSize: '12px', letterSpacing: '0.02em', color: 'var(--ink-faint)' }}>app.promorphic.xyz</div>
      </div>
      <main className="auth-main" style={{ flex: '1 1 480px', boxSizing: 'border-box', padding: '48px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>{children}</div>
      </main>
    </div>
  );
}

// ---------- the pieces of a form ----------
const button: CSSProperties = { fontFamily: SANS, fontWeight: 500, borderRadius: '2px', padding: '0 16px', cursor: 'pointer', whiteSpace: 'nowrap', width: '100%', minHeight: '48px', fontSize: '15px' };
export const primary: CSSProperties = { ...button, color: 'var(--on-brand)', background: 'var(--brand)', border: 0 };
export const ghost: CSSProperties = { ...button, color: 'var(--ink)', background: 'transparent', border: '1px solid var(--hairline)' };
export const note: CSSProperties = { margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--ink-muted)' };
export const foot: CSSProperties = { margin: 0, paddingTop: '12px', borderTop: '1px solid var(--hairline)', fontSize: '14px', color: 'var(--ink-muted)' };
export const inkLink: CSSProperties = { color: 'var(--ink)', textUnderlineOffset: '3px' };

export function Heading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h1 style={{ margin: 0, fontSize: '32px', lineHeight: 1.1, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{title}</h1>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>{children}</p>
    </div>
  );
}

export function Or() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span aria-hidden="true" style={{ flex: '1 1 0', height: '1px', background: 'var(--hairline)' }} />
      <span style={{ fontFamily: MONO, fontSize: '12px', color: 'var(--ink-muted)' }}>or</span>
      <span aria-hidden="true" style={{ flex: '1 1 0', height: '1px', background: 'var(--hairline)' }} />
    </div>
  );
}

// What went wrong, in words. Ink, not a colour: the brand keeps every word neutral.
export function Problem({ id, children }: { id?: string; children: ReactNode }) {
  if (!children) return null;
  return <p id={id} role="alert" className="auth-problem" style={{ margin: 0, fontSize: '14px', lineHeight: 1.45, color: 'var(--ink)' }}>{children}</p>;
}

export function Field({ id, label, error, ...input }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor={id} style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{label}</label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-problem` : undefined} {...input}
        style={{ height: '48px', boxSizing: 'border-box', background: 'var(--surface-1)', border: `1px solid ${error ? 'var(--ink)' : 'var(--hairline)'}`, borderRadius: '2px', color: 'var(--ink)', fontFamily: SANS, fontSize: '15px', padding: '0 14px' }} />
      <Problem id={`${id}-problem`}>{error}</Problem>
    </div>
  );
}
