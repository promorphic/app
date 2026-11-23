import type { CSSProperties, ReactNode } from 'react';
import { Logo } from '../layout/Logo';
import { ThemeSwitch } from '../layout/ThemeSwitch';
import { eyebrow, MONO, SANS } from '../layout/styles';
import { useTheme } from '../lib/theme';

// The frame the sign-in screens share: the Financial District at dusk across the whole page, what
// Promorphic does as the header, and the form in a card in the middle. The page around the card is
// dark in both themes, so the photograph is shown as it was taken; the card follows the chosen theme.
export function AuthLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <div className="app-root auth-page" data-theme="dark">
      <div className="auth-skyline" aria-hidden="true">
        {/* Lower Manhattan's Financial District at dusk. Photo by Zoshua Colah on Unsplash (unsplash.com/photos/y1SqWgcU8g0), Unsplash licence. */}
        <img src="/financial-district-2400.jpg" srcSet="/financial-district-1200.jpg 1200w, /financial-district-2400.jpg 2400w" sizes="(max-width: 700px) 250vw, 110vw" width={2400} height={1351} alt="" decoding="async" />
      </div>
      <div className="auth-top">
        <Logo style={{ padding: '0 8px' }} />
        <span style={{ marginLeft: 'auto' }}><ThemeSwitch /></span>
      </div>
      <div className="auth-body">
        <header className="auth-header">
          <div style={eyebrow}>Institutional access</div>
          <p className="auth-hero">Hold, trade and manage tokenized assets from one place.</p>
        </header>
        <main className="auth-card" data-theme={theme}>{children}</main>
      </div>
      <div className="auth-foot" style={{ fontFamily: MONO }}>app.promorphic.xyz</div>
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
      <h1 style={{ margin: 0, fontSize: '32px', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{title}</h1>
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
