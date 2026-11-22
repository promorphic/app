import { Link } from 'react-router';
import { qty, short, time, usd, usePositions, useWallet } from './wallet';

function AssetCell({ ticker, name }: { ticker: string; name: string }) {
  return (
    <td>
      <div className="live-asset"><span className="live-ticker">{ticker}</span><span className="live-name">{name}</span></div>
    </td>
  );
}

// Portfolio screen: the set wallet's holdings on Robinhood Chain, read every 30 seconds.
export function LiveHoldings() {
  const wallet = useWallet();
  const { data: p, error } = usePositions(wallet);
  const empty = p && !p.stockTokens.length && !Number(p.cash.usdg);
  return (
    <section className="live-section" aria-label="Live holdings on Robinhood Chain">
      <div className="live-head">
        <h2>Live holdings on Robinhood Chain</h2>
        <span className="live-tag">Live</span>
        <span className="live-meta" title={p?.address}>{wallet && p ? short(p.address) + ' · updated ' + time(p.asOf) : ''}</span>
      </div>
      <div className="live-box">
        {!wallet ? (
          <div className="live-empty">No wallet set. <Link to="/wallets/">Add one on the Wallets page.</Link></div>
        ) : !p ? (
          <div className="live-empty">{error ? error.message : 'Reading balances…'}</div>
        ) : empty ? (
          <div className="live-empty">This wallet holds no Stock Tokens or USDG on Robinhood Chain.</div>
        ) : (
          <table className="live-table">
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col" className="num">Tokens</th>
                <th scope="col" className="num">Shares</th>
                <th scope="col" className="num">Price</th>
                <th scope="col" className="num">Value</th>
              </tr>
            </thead>
            <tbody>
              {p.stockTokens.map((s) => (
                <tr key={s.symbol}>
                  <AssetCell ticker={s.symbol} name={s.name} />
                  <td className="num">{qty(s.tokens)}</td>
                  <td className="num" title={'Tokens × multiplier ' + Number(s.multiplier)}>{qty(s.shares)}</td>
                  <td className="num">{s.halted ? 'Halted' : usd(s.tokenMid)}</td>
                  <td className="num">{usd(s.valueUsd)}</td>
                </tr>
              ))}
              {Number(p.cash.usdg) > 0 && (
                <tr>
                  <AssetCell ticker="USDG" name="Settlement balance" />
                  <td className="num">{qty(p.cash.usdg, 2)}</td>
                  <td className="num">—</td>
                  <td className="num">$1.00</td>
                  <td className="num">{usd(p.cash.usdg)}</td>
                </tr>
              )}
              <tr className="live-total">
                <td colSpan={4}>Total on Robinhood Chain</td>
                <td className="num">{usd(p.totals.withUsdgUsd)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="live-meta">Read from the chain for the wallet set on the Wallets page. Prices are indicative. The figures above and the Holdings table below are sample data.</div>
    </section>
  );
}
