import { useNavigate } from 'react-router';
import { qty, usd, usePositions, useWallet } from './wallet';

// Wallets screen: the wallet set for Robinhood Chain and what it holds, read from the chain.
export function WalletCard({ onEdit }: { onEdit: () => void }) {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { data: p, error } = usePositions(wallet);
  const figures: [string, string][] = p ? [
    [usd(p.totals.withUsdgUsd), 'total'],
    [usd(p.totals.stockTokensUsd), 'in ' + p.stockTokens.length + (p.stockTokens.length === 1 ? ' Stock Token' : ' Stock Tokens')],
    [qty(p.cash.usdg, 2), 'USDG'],
    [qty(p.cash.eth, 5), 'ETH for gas'],
  ] : [];
  return (
    <section className="live-section" aria-label="Live wallet on Robinhood Chain">
      <div className="live-head">
        <h2>Robinhood Chain wallet</h2>
        <span className="live-tag">Live</span>
        <span className="live-meta">Read from the chain. The table below is sample data.</span>
      </div>
      <div className="live-card">
        <div className="grow">
          {!wallet && <div className="live-meta">No wallet set. Add an address to see its live balances here and on the Portfolio page.</div>}
          {wallet && <div className="addr live-mono">{wallet}</div>}
          {wallet && (
            <div className="figs live-meta">
              {p ? figures.map(([value, label]) => (
                <span key={label}><span className="live-mono" style={{ color: 'var(--ink)' }}>{value}</span> {label}</span>
              )) : error ? error.message : 'Reading balances…'}
            </div>
          )}
        </div>
        <div className="live-actions">
          <button className={wallet ? 'live-btn' : 'live-btn solid'} type="button" onClick={onEdit}>{wallet ? 'Change' : 'Add wallet'}</button>
          {wallet && <button className="live-btn" type="button" onClick={() => navigate('/portfolio/')}>View holdings</button>}
        </div>
      </div>
    </section>
  );
}
