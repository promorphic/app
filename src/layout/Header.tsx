import { useLocation, useNavigate } from 'react-router';
import { setSearch, useSearch } from '../lib/search';
import { notYet } from '../lib/toast';
import { MONO, SANS, visuallyHidden } from './styles';
import { ThemeSwitch } from './ThemeSwitch';

export function Header() {
  const q = useSearch();
  const navigate = useNavigate();
  const onAssets = useLocation().pathname === '/';
  return (
    <header className="app-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', padding: '14px 32px', borderBottom: '1px solid var(--hairline)' }}>
      <label htmlFor="q" style={visuallyHidden}>Search assets</label>
      <input id="q" className="search" type="search" name="q" autoComplete="off" placeholder="Search assets, tickers, issuers"
        value={q}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !onAssets && q.trim()) navigate('/'); }}
        style={{ flex: '1 1 280px', maxWidth: '480px', height: '44px', boxSizing: 'border-box', background: 'var(--surface-1)', border: '1px solid var(--hairline)', borderRadius: '2px', color: 'var(--ink)', fontFamily: SANS, fontSize: '15px', padding: '0 14px' }} />
      <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: '12px', letterSpacing: '0.02em', color: 'var(--ink-muted)', border: '1px solid var(--hairline)', borderRadius: '999px', padding: '6px 12px' }}>Sandbox</span>
      <ThemeSwitch />
      <button className="btn btn-primary" type="button" onClick={notYet} style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: 'var(--on-brand)', background: 'var(--brand)', border: 0, borderRadius: '2px', height: '44px', padding: '0 18px', cursor: 'pointer' }}>New order</button>
    </header>
  );
}
