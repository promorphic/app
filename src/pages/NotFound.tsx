import { Link } from 'react-router';
import { Logo } from '../layout/Logo';
import { eyebrow } from '../layout/styles';

export default function NotFound() {
  return (
    <div className="app-root" style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo />
      </div>
      <main style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', maxWidth: '520px' }}>
        <div style={eyebrow}>404</div>
        <h1 style={{ margin: 0, fontSize: '36px', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.025em', color: 'var(--ink)' }}>This page does not exist.</h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>The link may be old, or the address may be mistyped.</p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '15px', fontWeight: 500, color: 'var(--on-brand)', background: 'var(--brand)', borderRadius: '2px', height: '44px', padding: '0 18px', textDecoration: 'none' }}>Go to assets</Link>
      </main>
    </div>
  );
}
