import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Dialog } from '../../components/Dialog';
import { getApi } from '../../lib/api';
import type { Asset } from '../../assets/types';
import { Eligibility } from './Eligibility';
import { qty, time, usd } from './wallet';

type Side = 'buy' | 'sell';
interface VenueQuote {
  venue: string; error?: string; buyAmount: string; minBuyAmount: string; pricePerToken: string;
  vsReferencePct: string; feeUsd?: string | null; route?: string;
}
interface QuoteResult {
  tradable: boolean; reasons?: string[]; best?: string; quotes?: VenueQuote[]; warnings?: string[]; multiplier: string;
  reference?: { tokenBid: string; tokenAsk: string; at: string };
}

// Assets screen: an indicative quote for a Stock Token, comparing LiFi and 0x, and whether the visitor
// may trade Stock Tokens at all. Nothing is traded.
export function QuoteDialog({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const [side, setSide] = useState<Side>('buy');
  const [amount, setAmount] = useState('100');
  const [invalid, setInvalid] = useState(false);
  const quote = useMutation({
    mutationFn: (v: { side: Side; amount: string }) =>
      getApi<QuoteResult>(`/v1/robinhood/quote?side=${v.side}&symbol=${encodeURIComponent(asset.ticker)}&amount=${encodeURIComponent(v.amount)}`),
  });
  const unit = side === 'buy' ? asset.ticker : 'USDG';

  const choose = (s: Side) => {
    setSide(s);
    setAmount(s === 'buy' ? '100' : '1');
    setInvalid(false);
    quote.reset();
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amt = amount.trim();
    const bad = !/^\d+(\.\d+)?$/.test(amt) || Number(amt) <= 0;
    setInvalid(bad);
    if (bad) { quote.reset(); return; }
    quote.mutate({ side, amount: amt });
  };
  const q = quote.data;
  const venues = q ? [...(q.quotes ?? [])].sort((x, y) => Number(y.venue === q.best) - Number(x.venue === q.best)) : [];

  return (
    <Dialog onClose={onClose}>
      <form onSubmit={submit}>
        <h2>Quote for {asset.ticker}</h2>
        <p>{asset.name}. A Stock Token on Robinhood Chain, traded against USDG.</p>
        <div className="live-row">
          <div className="live-seg" role="group" aria-label="Side">
            <button className="live-btn" type="button" aria-pressed={side === 'buy'} onClick={() => choose('buy')}>Buy</button>
            <button className="live-btn" type="button" aria-pressed={side === 'sell'} onClick={() => choose('sell')}>Sell</button>
          </div>
          <label>
            {side === 'buy' ? 'Amount to spend, in USDG' : `Amount to sell, in ${asset.ticker} tokens`}
            <input className="live-input" type="text" inputMode="decimal" autoComplete="off" autoFocus value={amount}
              onChange={(e) => setAmount(e.target.value)} onFocus={(e) => e.target.select()} />
          </label>
          <button className="live-btn solid" type="submit" disabled={quote.isPending}>Get quote</button>
        </div>
        <div className="live-quotes" aria-live="polite">
          {invalid && <p className="live-error">Enter an amount greater than zero.</p>}
          {quote.isPending && <p>Getting quotes…</p>}
          {quote.isError && <p className="live-error">{quote.error.message}</p>}
          {q && !q.tradable && (
            <p className="live-error">{q.reasons?.length ? 'Not tradable right now: ' + q.reasons.join(', ') + '.' : 'No venue returned a quote for this size.'}</p>
          )}
          {q && venues.map((v) => {
            const best = v.venue === q.best;
            const name = v.venue === 'lifi' ? 'LiFi' : '0x';
            return (
              <div key={v.venue} className={best ? 'live-quote best' : 'live-quote'}>
                <div className="top">
                  <span className="venue">{name}{best ? ' · best' : ''}</span>
                  <span className="amount live-mono">{v.error ? 'No quote' : qty(v.buyAmount) + ' ' + unit}</span>
                </div>
                {v.error ? <div className="live-meta">{v.error}</div> : (
                  <dl>
                    <dt>You receive at least</dt><dd className="live-mono">{qty(v.minBuyAmount)} {unit}</dd>
                    <dt>Price per token</dt><dd className="live-mono">{usd(v.pricePerToken)}</dd>
                    <dt>Against the indicative price</dt>
                    <dd className="live-mono">{Number(v.vsReferencePct) > 0 ? v.vsReferencePct + '% worse' : Math.abs(Number(v.vsReferencePct)).toFixed(2) + '% better'}</dd>
                    <dt>Venue fee</dt><dd className="live-mono">{v.feeUsd == null ? '—' : usd(v.feeUsd)}</dd>
                    <dt>Route</dt><dd className="live-mono">{v.route || '—'}</dd>
                  </dl>
                )}
              </div>
            );
          })}
          {q?.warnings?.map((w) => <p key={w} className="live-error">Warning: {w}.</p>)}
          {q?.reference && (
            <p>Indicative price: bid {usd(q.reference.tokenBid)}, ask {usd(q.reference.tokenAsk)} per token, at {time(q.reference.at)}. One token is {qty(q.multiplier, 6)} shares.</p>
          )}
        </div>
        <p>Quotes are indicative and compare LiFi and 0x.</p>
        <Eligibility />
        <div className="live-foot">
          <button className="live-btn" type="button" onClick={onClose}>Close</button>
        </div>
      </form>
    </Dialog>
  );
}
