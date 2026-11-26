import { Link } from 'react-router';
import { Failed, Notice, PageHead, Stat, Stats } from '../../components/PageHead';
import { amount, useTestAccount } from './test';

// The Portfolio screen for the sandbox account: what its Canton party holds, read from the ledger.
export default function TestPortfolio() {
  const q = useTestAccount();
  const a = q.data;
  const cash = a?.holdings.find((h) => h.instrument === a.cash);
  const locked = a ? a.holdings.reduce((s, h) => s + h.locked * h.price, 0) : 0;

  let table;
  if (q.isPending) table = <Notice>Reading the ledger…</Notice>;
  else if (q.isError) table = <Failed error={q.error} what="The sandbox account's holdings" />;
  else if (!a!.holdings.length) table = <Notice>The party holds nothing. <Link to="/wallets/">Reset the sandbox account</Link> to start again with 10,000 {a!.cash}.</Notice>;
  else {
    table = (
      <>
        <table className="live-table" style={{ minWidth: '820px' }}>
          <thead>
            <tr>
              <th scope="col">Asset</th>
              <th scope="col">Chain</th>
              <th scope="col" className="num">Available</th>
              <th scope="col" className="num">Locked to a settlement</th>
              <th scope="col" className="num">Price</th>
              <th scope="col" className="num">Value</th>
              <th scope="col" className="num">Share</th>
            </tr>
          </thead>
          <tbody>
            {a!.holdings.map((h) => (
              <tr key={h.instrument}>
                <td><div className="live-asset"><span className="live-ticker">{h.instrument}</span><span className="live-name">{h.name}</span></div></td>
                <td style={{ whiteSpace: 'nowrap' }}>Canton</td>
                <td className="num">{amount(h.available)}</td>
                <td className="num">{h.locked ? amount(h.locked) : '—'}</td>
                <td className="num">{amount(h.price)} {a!.cash}</td>
                <td className="num">{amount(h.value, 2)} {a!.cash}</td>
                <td className="num">{a!.totalValue ? ((h.value / a!.totalValue) * 100).toFixed(1) : '0.0'}%</td>
              </tr>
            ))}
            <tr className="live-total">
              <td colSpan={5}>Total</td>
              <td className="num">{amount(a!.totalValue, 2)} {a!.cash}</td>
              <td className="num">100%</td>
            </tr>
          </tbody>
        </table>
        <div className="acct-table-note">
          <span>Read from {a!.network} for the sandbox account's party. These are test instruments with fixed test prices: they have no value and cannot be redeemed for anything.</span>
        </div>
      </>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Portfolio" lead="What the sandbox account's Canton party holds, read from the ledger." />
      <Stats>
        <Stat value={a ? amount(a.totalValue, 2) : '—'} label={a ? `Total, in ${a.cash}` : 'Total'} />
        <Stat value={a ? amount(cash?.available ?? 0, 2) : '—'} label={a ? `${a.cash} available to trade` : 'Available to trade'} />
        <Stat value={a ? a.holdings.filter((h) => h.instrument !== a.cash).length : '—'} label="Test instruments held" />
        <Stat value={a ? amount(locked, 2) : '—'} label="Locked to an open settlement" />
      </Stats>
      <section aria-label="Holdings" style={{ minWidth: 0 }}>
        <div className="live-box">{table}</div>
      </section>
    </main>
  );
}
