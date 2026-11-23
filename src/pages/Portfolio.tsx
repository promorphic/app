import { Link } from 'react-router';
import { qty, short, time, usd } from '../chains/robinhood/wallet';
import { Failed, Notice, PageHead, SignedOut, Stat, Stats } from '../components/PageHead';
import { CHAIN_NAMES, useHistory, usePortfolio, useToken, type Holding, type Snapshot } from '../lib/account';

const SWATCHES = ['var(--ink)', 'var(--brand)', 'var(--ink-muted)', 'var(--ink-faint)', 'var(--hairline)'];
const DUST = 0.01; // holdings below this are counted but not listed

// Value by day, as a line. Needs at least two days to draw anything.
function ValueChart({ points }: { points: Snapshot[] }) {
  if (points.length < 2) {
    return <p className="live-meta" style={{ margin: 0 }}>{points.length ? 'One day recorded so far. ' : ''}A value is recorded each day you open the app; the line appears once there are two.</p>;
  }
  const W = 600, H = 140, pad = 6;
  const vals = points.map((p) => Number(p.totalUsd));
  const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
  const x = (i: number) => pad + (i / (points.length - 1)) * (W - 2 * pad);
  const y = (v: number) => H - pad - ((v - lo) / span) * (H - 2 * pad);
  const line = vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = vals.length - 1;
  return (
    <>
      <svg className="acct-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Portfolio value from ${usd(vals[0])} on ${points[0].date} to ${usd(vals[last])} on ${points[last].date}`}>
        <path className="area" d={`${line} L${x(last).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`} />
        <path className="line" d={line} vectorEffect="non-scaling-stroke" />
        <circle className="dot" cx={x(last)} cy={y(vals[last])} r="3" />
      </svg>
      <div className="acct-chart-foot"><span>{points[0].date} · {usd(vals[0])}</span><span>{points[last].date} · {usd(vals[last])}</span></div>
    </>
  );
}

function Allocation({ holdings, cash, total }: { holdings: Holding[]; cash: number; total: number }) {
  const top = holdings.slice(0, 4);
  const other = holdings.slice(4).reduce((s, h) => s + Number(h.valueUsd), 0);
  const parts = [...top.map((h) => ({ name: h.symbol, value: Number(h.valueUsd) })), ...(other > 0 ? [{ name: 'Other Stock Tokens', value: other }] : []), ...(cash > 0 ? [{ name: 'Cash (USDG)', value: cash }] : [])];
  if (!total) return <p className="live-meta" style={{ margin: 0 }}>Nothing held yet.</p>;
  return (
    <>
      <div className="acct-bar" role="img" aria-label="Allocation by holding">
        {parts.map((p, i) => <span key={p.name} style={{ width: `${(p.value / total) * 100}%`, background: SWATCHES[i % SWATCHES.length] }} />)}
      </div>
      <div className="acct-legend">
        {parts.map((p, i) => (
          <div key={p.name}>
            <span className="swatch" style={{ background: SWATCHES[i % SWATCHES.length] }} aria-hidden="true" />
            <span className="name">{p.name}</span>
            <span className="val">{usd(p.value)}</span>
            <span className="pct">{((p.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Portfolio() {
  const token = useToken();
  const q = usePortfolio();
  const history = useHistory(90);
  const p = q.data;
  const listed = p ? p.holdings.filter((h) => Number(h.valueUsd) >= DUST) : [];
  const dust = p ? p.holdings.length - listed.length : 0;
  const failed = p ? p.wallets.filter((w) => w.error) : [];

  let table;
  if (!token) table = <SignedOut what="your portfolio" />;
  else if (q.isPending) table = <Notice>Reading your wallets…</Notice>;
  else if (q.isError) table = <Failed error={q.error} what="Your portfolio" />;
  else if (!p!.wallets.length) table = <Notice>No wallet linked yet. <Link to="/wallets/">Link one on the Wallets screen</Link> to see what it holds.</Notice>;
  else if (!listed.length && !Number(p!.totals.cashUsd)) table = <Notice>Your linked wallets hold no Stock Tokens or USDG on Robinhood Chain.</Notice>;
  else {
    table = (
      <>
        <table className="live-table" style={{ minWidth: '900px' }}>
          <thead>
            <tr>
              <th scope="col">Asset</th>
              <th scope="col">Chain</th>
              <th scope="col" className="num">Tokens</th>
              <th scope="col" className="num">Shares</th>
              <th scope="col" className="num">Price</th>
              <th scope="col" className="num">Value</th>
              <th scope="col" className="num">Share</th>
            </tr>
          </thead>
          <tbody>
            {listed.map((h) => (
              <tr key={h.symbol}>
                <td><div className="live-asset"><span className="live-ticker">{h.symbol}</span><span className="live-name">{h.name.replace(/\s*•\s*Robinhood Token$/, '')}</span></div></td>
                <td style={{ whiteSpace: 'nowrap' }}>{CHAIN_NAMES[h.chain]}{h.wallets.length > 1 && <span className="acct-cell-sub">{h.wallets.length} wallets</span>}</td>
                <td className="num">{qty(h.tokens)}</td>
                <td className="num">{qty(h.shares)}</td>
                <td className="num">{h.halted ? 'Halted' : usd(h.tokenMid)}</td>
                <td className="num">{usd(h.valueUsd)}</td>
                <td className="num">{h.share.toFixed(1)}%</td>
              </tr>
            ))}
            {Number(p!.totals.cashUsd) > 0 && (
              <tr>
                <td><div className="live-asset"><span className="live-ticker">USDG</span><span className="live-name">Settlement balance</span></div></td>
                <td>{CHAIN_NAMES.robinhood}</td>
                <td className="num">{qty(p!.totals.cashUsd, 2)}</td>
                <td className="num">—</td>
                <td className="num">$1.00</td>
                <td className="num">{usd(p!.totals.cashUsd)}</td>
                <td className="num">{Number(p!.totals.usd) ? ((Number(p!.totals.cashUsd) / Number(p!.totals.usd)) * 100).toFixed(1) : '0.0'}%</td>
              </tr>
            )}
            <tr className="live-total">
              <td colSpan={5}>Total across {p!.wallets.length === 1 ? 'one wallet' : `${p!.wallets.length} wallets`}</td>
              <td className="num">{usd(p!.totals.usd)}</td>
              <td className="num">100%</td>
            </tr>
          </tbody>
        </table>
        <div className="acct-table-note">
          <span>Read from the chain for the wallets linked to your account · updated {time(p!.asOf)}. Prices are indicative.{dust > 0 && ` ${dust} holding${dust === 1 ? '' : 's'} below $0.01 not listed.`}</span>
        </div>
      </>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Portfolio" lead="Everything you hold across your linked wallets, in one place." />
      <Stats>
        <Stat value={p ? usd(p.totals.usd) : '—'} label={p && !p.complete ? 'Total value, some balances unavailable' : 'Total value, indicative'} />
        <Stat value={p ? usd(p.totals.stockTokensUsd) : '—'} label={p ? `In ${listed.length} Stock Token${listed.length === 1 ? '' : 's'}` : 'In Stock Tokens'} />
        <Stat value={p ? usd(p.totals.cashUsd) : '—'} label="Cash, in USDG" />
        <Stat value={p ? p.wallets.length : '—'} label={p?.wallets.length === 1 ? 'Wallet linked' : 'Wallets linked'} />
      </Stats>
      {failed.map((w) => <Notice key={w.id}>Balances for {w.label || short(w.address)} could not be read: {w.error}</Notice>)}
      {token && (
        <div className="acct-panels">
          <section className="acct-panel" aria-label="Value over time">
            <h2>Value over time</h2>
            {history.isError ? <p className="live-meta" style={{ margin: 0 }}>History could not be loaded.</p> : <ValueChart points={history.data || []} />}
          </section>
          <section className="acct-panel" aria-label="Allocation">
            <h2>Allocation</h2>
            {p ? <Allocation holdings={p.holdings} cash={Number(p.totals.cashUsd)} total={Number(p.totals.usd)} /> : <p className="live-meta" style={{ margin: 0 }}>{q.isError ? 'Unavailable.' : 'Reading…'}</p>}
          </section>
        </div>
      )}
      <section aria-label="Holdings" style={{ minWidth: 0 }}>
        <div className="live-box">{table}</div>
      </section>
    </main>
  );
}
