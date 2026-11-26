import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Dialog } from '../../components/Dialog';
import { useToken } from '../../lib/account';
import { useEmbeddedWallet, WALLET_KEY, type SigningRequest } from '../../wallet/api';
import { SignPanel, type Wording } from '../../wallet/SignPanel';
import { getQuote, prepareActivation, prepareOrder, units, useTradeAccount, useTradeAssets, type Placed, type Quote, type Side, type TradeAsset } from './trade';

type Amounts = { sell?: Quote['sell']; buy?: Quote['buy']; pricePerToken?: string; route?: string; opensTrustline?: boolean; feePaidBy?: string; from?: string };
const shortAddr = (a: string) => a.slice(0, 6) + '…' + a.slice(-6);

// What the person checks before signing a trade: the amounts the API prepared it with, which may
// differ a little from the quote shown before, because the API quotes again when it prepares.
const tradeRows = (side: Side, cash: string): Wording['rows'] => (r) => {
  const d = (r.details || {}) as Amounts;
  const rows: [string, string, boolean?][] = [];
  if (d.from) rows.push(['From', shortAddr(d.from), true]);
  if (d.sell) rows.push([side === 'buy' ? 'You spend' : 'You sell', `${units(d.sell.amount)} ${d.sell.symbol}`, true]);
  if (d.buy) rows.push(['You receive about', `${units(d.buy.expected)} ${d.buy.symbol}`, true], ['And at least', `${units(d.buy.min)} ${d.buy.symbol}`, true]);
  if (d.pricePerToken) rows.push(['Price per token', `${units(d.pricePerToken)} ${cash}`, true]);
  if (d.route) rows.push(['Route', d.route, true]);
  if (d.opensTrustline && d.buy) rows.push([`Lets your account hold ${d.buy.symbol}`, 'Yes']);
  if (d.feePaidBy) rows.push(['Network fee paid by', d.feePaidBy === 'you' ? 'You, in XLM' : d.feePaidBy]);
  return rows;
};
// Stellar's own codes for the two refusals a person can do something about.
const tradeFailed = (error: string | null) =>
  /op_under_dest_min|op_too_few_offers/.test(error || '') ? 'The price moved past your limit before the trade settled. Nothing was traded.'
    : /tx_bad_seq/.test(error || '') ? 'Another request from this wallet was signed first, so this one could not be sent. Nothing was traded.'
    : `Stellar refused the trade. Nothing was traded.${error ? ' ' + error : ''}`;

export const activationWording: Wording = {
  done: 'Account active', notDone: 'Not activated',
  rows: (r) => {
    const d = (r.details || {}) as { address?: string; cash?: string; createsAccount?: boolean; reservePaidBy?: string; feePaidBy?: string };
    const who = (p?: string) => (p === 'you' ? 'You, in XLM' : p || '—');
    return [
      ...(d.address ? [['Account', shortAddr(d.address), true] as [string, string, boolean]] : []),
      ['Creates the account', d.createsAccount ? 'Yes' : 'No, it exists'],
      ...(d.cash ? [['Lets it hold', d.cash.split(':')[0]] as [string, string]] : []),
      ['Reserve paid by', who(d.reservePaidBy)],
      ['Network fee paid by', who(d.feePaidBy)],
    ];
  },
  failed: (error) => (/tx_bad_seq/.test(error || '') ? 'Another request was signed first, so this one could not be sent. Nothing changed.' : `Stellar refused it. Nothing changed.${error ? ' ' + error : ''}`),
};

// Buy or sell one Stellar asset from the Promorphic wallet: a quote with the API's checks, then the
// prepared trade to review and sign. One request at a time: two prepared together cannot both settle.
export function TradeDialog({ asset, side: first = 'buy', onClose }: { asset: TradeAsset; side?: Side; onClose: () => void }) {
  const token = useToken();
  const client = useQueryClient();
  const w = useEmbeddedWallet();
  const wallet = w.state?.wallet || null;
  const provider = w.state?.provider ?? null;
  const market = useTradeAssets().data;
  const account = useTradeAccount(!!wallet);
  const cash = market?.cash?.code || 'cash';
  const testnet = market?.network === 'testnet';

  const [side, setSide] = useState<Side>(first);
  const [amount, setAmount] = useState(first === 'buy' ? '100' : '1');
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [signing, setSigning] = useState<{ request: SigningRequest; what: 'activate' | 'trade'; placed?: Placed } | null>(null);
  const quote = useMutation({ mutationFn: (v: { side: Side; amount: string }) => getQuote({ ...v, asset: asset.id }, token) });

  const choose = (s: Side) => { setSide(s); setAmount(s === 'buy' ? '100' : '1'); setInvalid(false); setError(''); quote.reset(); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amt = amount.trim();
    const bad = !/^\d+(\.\d{1,7})?$/.test(amt) || Number(amt) <= 0;
    setInvalid(bad); setError('');
    if (bad) { quote.reset(); return; }
    quote.mutate({ side, amount: amt });
  };
  const asked = quote.variables;
  const q = quote.data;
  const active = account.data?.active;

  const run = async (what: string, fn: () => Promise<void>) => {
    setBusy(what); setError('');
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };
  const activate = () => run('activate', async () => {
    const r = await prepareActivation(token!);
    if (r.request) setSigning({ request: r.request, what: 'activate' });
    else await client.invalidateQueries({ queryKey: WALLET_KEY });
  });
  const prepare = () => asked && run('order', async () => {
    const placed = await prepareOrder(token!, { side: asked.side, asset: asset.id, amount: asked.amount });
    setSigning({ request: placed.request, what: 'trade', placed });
    client.invalidateQueries({ queryKey: ['account', 'orders'] });
  });
  // Back from signing: the form again, with a fresh look at the account and no stale quote.
  const back = () => { setSigning(null); quote.reset(); client.invalidateQueries({ queryKey: ['account'] }); };

  if (signing) {
    const trade = signing.what === 'trade';
    const bought = signing.placed?.quote.buy.symbol !== cash;
    return (
      <Dialog onClose={onClose}>
        <SignPanel key={signing.request.id} initial={signing.request} provider={provider} title={trade ? 'Review and sign' : 'Sign to activate'}
          wording={trade ? { done: bought ? 'Bought' : 'Sold', notDone: 'Not traded', rows: tradeRows(bought ? 'buy' : 'sell', cash), failed: tradeFailed, after: <>The order is on the <Link to="/orders/" onClick={onClose}>Orders screen</Link>, with what the ledger delivered.</> } : activationWording}
          onRetry={back} onClose={trade ? onClose : back} />
      </Dialog>
    );
  }

  const failed = q ? q.checks.filter((c) => !c.ok && !(c.id === 'account' && active === false)) : [];
  let step;
  if (!token) step = <p><Link to="/login/" onClick={onClose}>Sign in</Link> to trade from your Promorphic wallet.</p>;
  else if (w.isPending || (wallet && account.isPending)) step = <p>Reading your wallet…</p>;
  else if (!wallet) step = <p>Trading on Stellar uses your Promorphic wallet. <Link to="/wallets/" onClick={onClose}>Create it on the Wallets screen</Link>, then come back.</p>;
  else if (account.isError) step = <p className="live-error">Your Stellar account could not be read. {account.error.message}</p>;
  else if (!active) {
    step = (
      <>
        <p>Your Stellar account needs activating once before its first trade. You sign it yourself{account.data?.sponsored ? ', and Promorphic pays the network fee and the reserve, so you need no XLM' : ''}.</p>
        <button className="live-btn solid" type="button" disabled={!!busy} onClick={activate}>{busy === 'activate' ? 'Preparing…' : 'Activate account'}</button>
      </>
    );
  } else if (q?.tradable && asked) {
    step = (
      <>
        <p>
          {asked.side === 'buy' ? `Buy ${asset.symbol} with ${units(asked.amount)} ${cash}` : `Sell ${units(asked.amount)} ${asset.symbol} for ${cash}`} from your Promorphic wallet.
          {' '}The price is read again when the trade is prepared, and you check the final amounts before you sign.
          {account.data?.sponsored ? ' Promorphic pays the network fee, so you need no XLM.' : ' The network fee is paid from your XLM.'}
        </p>
        <button className="live-btn solid" type="button" disabled={!!busy} onClick={prepare}>{busy === 'order' ? 'Preparing…' : 'Review and sign'}</button>
      </>
    );
  } else {
    const held = account.data!.holdings.find((x) => x.id === asset.id);
    step = <p>Your wallet holds {units(account.data!.cashBalance)} {cash}{held ? ` and ${units(held.balance)} ${asset.symbol}` : ''}.{q ? '' : ' Get a quote to trade.'}</p>;
  }

  return (
    <Dialog onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <h2>Trade {asset.symbol}</h2>
        <p>
          {asset.name}, issued by {asset.issuer}. Traded against {cash} on Stellar's built-in exchange.
          {testnet ? ' This is Stellar\'s test network: these assets have no value.' : ''}
        </p>
        <div className="live-row">
          <div className="live-seg" role="group" aria-label="Side">
            <button className="live-btn" type="button" aria-pressed={side === 'buy'} disabled={!!busy} onClick={() => choose('buy')}>Buy</button>
            <button className="live-btn" type="button" aria-pressed={side === 'sell'} disabled={!!busy} onClick={() => choose('sell')}>Sell</button>
          </div>
          <label>
            {side === 'buy' ? `Amount to spend, in ${cash}` : `Amount to sell, in ${asset.symbol}`}
            <input className="live-input" type="text" inputMode="decimal" autoComplete="off" autoFocus value={amount}
              onChange={(e) => setAmount(e.target.value)} onFocus={(e) => e.target.select()} />
          </label>
          <button className="live-btn solid" type="submit" disabled={quote.isPending || !!busy}>Get quote</button>
        </div>
        <div className="live-quotes" aria-live="polite">
          {invalid && <p className="live-error">Enter an amount above zero, with at most 7 decimal places.</p>}
          {quote.isPending && <p>Getting a quote…</p>}
          {quote.isError && <p className="live-error">{quote.error.message}</p>}
          {q?.quote && (
            <div className={q.tradable ? 'live-quote best' : 'live-quote'}>
              <div className="top">
                <span className="venue">You receive about</span>
                <span className="amount live-mono">{units(q.quote.buy.expected)} {q.quote.buy.symbol}</span>
              </div>
              <dl>
                <dt>{asked?.side === 'sell' ? 'You sell' : 'You spend'}</dt><dd className="live-mono">{units(q.quote.sell.amount)} {q.quote.sell.symbol}</dd>
                <dt>You receive at least</dt><dd className="live-mono">{units(q.quote.buy.min)} {q.quote.buy.symbol}</dd>
                <dt>Price per token</dt><dd className="live-mono">{units(q.quote.pricePerToken)} {cash}</dd>
                <dt>Issuer's net asset value</dt><dd className="live-mono">{q.quote.nav == null ? 'Not published' : `${units(q.quote.nav)} ${cash}`}</dd>
                <dt>Route</dt><dd className="live-mono">{q.quote.route}</dd>
              </dl>
            </div>
          )}
          {q && !q.tradable && failed.map((c) => <p key={c.id} className="live-error">{c.detail}</p>)}
          {q?.quote && <p>The quote is a snapshot of the exchange. The least you receive allows for the price moving {(q.quote.slippageBps / 100).toFixed(1)}% before the trade settles.</p>}
        </div>
        <div className="live-trade" aria-live="polite">
          <h3>Trade</h3>
          {step}
          {error && <p className="live-error">{error}</p>}
        </div>
        <div className="live-foot">
          <button className="live-btn" type="button" onClick={onClose}>Close</button>
        </div>
      </form>
    </Dialog>
  );
}
