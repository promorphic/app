import { useState } from 'react';
import { useTest } from '../chains/canton/test';
import { txUrl } from '../chains/robinhood/evm';
import { qty, short, usd } from '../chains/robinhood/wallet';
import { Failed, Notice, PageHead, SignedOut } from '../components/PageHead';
import { Segmented } from '../components/Segmented';
import { CHAIN_NAMES, STATUS_NAMES, shortId, useOrders, useToken, when, type Order, type OrderFilter } from '../lib/account';

const venueName = (v: string) => (v === 'lifi' ? 'LiFi' : v === '0x' ? '0x' : v);
// A Canton order (the test account's) is counted in its settlement instrument, not in dollars, and
// an order the ledger would not let the agent make is refused, not failed.
const onCanton = (o: Order) => o.chain === 'canton';
const cash = (o: Order) => (o.side === 'buy' ? o.sell.symbol : o.buy.symbol);
const money = (o: Order, v: string | null) => (onCanton(o) ? (v == null ? '—' : `${qty(v)} ${cash(o)}`) : usd(v));
const shortParty = (id: string) => { const [hint, key = ''] = id.split('::'); return `${hint}::${key.slice(0, 6)}…`; };

function StatusPill({ o }: { o: Order }) {
  const open = o.status === 'accepted' || o.status === 'approving' || o.status === 'sent';
  const cls = o.status === 'settled' ? 'acct-pill' : open ? 'acct-pill dot' : 'acct-pill quiet';
  return <span className={cls} title={o.reason || undefined}>{onCanton(o) && o.status === 'failed' ? 'Refused' : STATUS_NAMES[o.status]}</span>;
}

export default function Orders() {
  const token = useToken();
  const { test } = useTest(); // the test account's orders are its agent's, on Canton
  const [filter, setFilter] = useState<OrderFilter>('all');
  const q = useOrders(filter);
  const pages = q.data?.pages || [];
  const counts = pages[0]?.counts;
  const rows = pages.flatMap((p) => p.orders);
  const label = (name: string, n?: number) => (n == null ? name : `${name} ${n}`);

  let body;
  if (!token) body = <SignedOut what="your orders" />;
  else if (q.isPending) body = <Notice>Loading your orders…</Notice>;
  else if (q.isError) body = <Failed error={q.error} what="Your orders" />;
  else if (!rows.length) body = <Notice>{filter !== 'all' ? 'No orders match this filter.' : test ? 'No orders yet. Everything you ask the agent to trade is recorded here, whether the ledger settled it or refused it.' : 'No orders yet. Trades you make from the Assets screen are recorded here, from the quote you accept to the transaction settling on chain.'}</Notice>;
  else {
    body = (
      <>
        <table className="live-table" style={{ minWidth: '1040px' }}>
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Placed</th>
              <th scope="col">Side</th>
              <th scope="col">Asset</th>
              <th scope="col" className="num">Amount</th>
              <th scope="col" className="num">Price</th>
              <th scope="col">Venue</th>
              <th scope="col">Chain</th>
              <th scope="col">Placed by</th>
              <th scope="col">Status</th>
              <th scope="col"><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Transaction</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td className="live-mono" style={{ color: 'var(--ink)', whiteSpace: 'nowrap' }} title={o.id}>{shortId(o.id)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{when(o.createdAt)}</td>
                <td style={{ color: 'var(--ink)' }}>{o.side === 'buy' ? 'Buy' : 'Sell'}</td>
                <td>
                  <span className="live-ticker">{o.symbol}</span>
                  {o.assetName && <span className="acct-cell-sub">{o.assetName}</span>}
                </td>
                <td className="num" title={o.side === 'buy' ? `${qty(o.sell.amount)} ${o.sell.symbol} for about ${qty(o.buy.expected)} ${o.buy.symbol}` : `${qty(o.sell.amount)} ${o.sell.symbol} for about ${qty(o.buy.expected)} ${o.buy.symbol}`}>
                  {money(o, o.valueUsd)}
                  <span className="acct-cell-sub">{o.side === 'buy' ? `≈ ${qty(o.buy.expected)} ${o.symbol}` : `${qty(o.sell.amount)} ${o.symbol}`}</span>
                </td>
                <td className="num">{money(o, o.pricePerToken)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{venueName(o.venue)}{o.route ? <span className="acct-cell-sub">{o.route}</span> : null}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{CHAIN_NAMES[o.chain]}<span className="acct-cell-sub live-mono" title={o.wallet}>{onCanton(o) ? shortParty(o.wallet) : short(o.wallet)}</span></td>
                <td><span className="acct-pill">{o.placedBy === 'you' ? 'You' : 'Agent'}</span></td>
                <td><StatusPill o={o} />{onCanton(o) && o.reason && <span className="acct-cell-sub" style={{ maxWidth: '260px', whiteSpace: 'normal' }}>{o.reason}</span>}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{!o.txHash ? null : onCanton(o) ? <span className="live-mono" title={`Ledger update ${o.txHash}`}>{o.txHash.slice(0, 10)}…</span> : <a className="acct-link" href={txUrl(o.txHash)} target="_blank" rel="noopener">View</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="acct-table-note">
          <span>{rows.length} shown{counts ? ` of ${filter === 'all' ? counts.all : counts[filter]}` : ''}. {test ? 'A settled order names its ledger update. A refused one was stopped by the ledger before any asset moved.' : 'Status is read from the chain; an accepted quote with no transaction after an hour is cancelled.'}</span>
          {q.hasNextPage && <button className="live-btn acct-more" type="button" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>{q.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>}
        </div>
      </>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Orders" lead={test ? 'Every trade your agent tried under your mandate: settled on the ledger, or refused by it.' : 'Every trade you make from this app, from the quote you accept to the transaction settling on chain.'} />
      {token && (
        <div role="group" aria-label="Filters" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <Segmented<OrderFilter> label="Status" value={filter} onChange={setFilter} options={[
            { value: 'all', label: label('All', counts?.all) },
            { value: 'open', label: label('Open', counts?.open) },
            { value: 'settled', label: label('Settled', counts?.settled) },
            { value: 'failed', label: label(test ? 'Refused' : 'Failed', counts?.failed) },
            { value: 'cancelled', label: label('Cancelled', counts?.cancelled) },
          ]} />
        </div>
      )}
      <section aria-label="Orders" style={{ minWidth: 0 }}>
        <div className="live-box">{body}</div>
      </section>
    </main>
  );
}
