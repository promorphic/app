import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getApi } from '../../lib/api';
import { useEligibility } from './Eligibility';
import { allowance, approve, balanceOf, browserWallet, confirmed, connect, send, txUrl, walletMessage } from './evm';
import { qty, short, usd, useWallet } from './wallet';

type Side = 'buy' | 'sell';
interface FirmVenue {
  venue: string; error?: string; route?: string | null; buyAmount: string; minBuyAmount: string; minBuyAmountRaw: string;
  pricePerToken: string; vsReferencePct: string | null; withinBand: boolean | null; feeUsd?: string | null;
  spender: string | null; transaction: { to: string; data: string; value?: string | null } | null;
}
interface FirmQuote {
  tradable: boolean; reasons?: string[]; best: string | null; quotes: FirmVenue[];
  sell: { symbol: string; address: string; amount: string; amountRaw: string };
  buy: { symbol: string };
}
interface Review { quote: FirmQuote; venue: FirmVenue; needsApproval: boolean; at: number; note?: string }
type Step =
  | { at: 'idle' }
  | { at: 'working'; text: string; hash?: string }
  | { at: 'review'; review: Review }
  | { at: 'done'; review: Review; hash: string }
  | { at: 'failed'; text: string; hash?: string };

const venueName = (v: string) => (v === 'lifi' ? 'LiFi' : '0x');
const FRESH_MS = 25_000;   // a firm quote is good for 30 seconds
const MAX_SLIP = 995n;     // a refreshed quote may be at most 0.5% below the one reviewed

// Assets screen, inside the quote dialog: trade the quoted amount at the best venue.
// The API only gives a firm quote to an eligible visitor; the browser wallet signs each step.
export function Trade({ symbol, side, amount, onBusy }: { symbol: string; side: Side; amount: string; onBusy: (busy: boolean) => void }) {
  const wallet = useWallet();
  const eligibility = useEligibility(wallet);
  const client = useQueryClient();
  const [step, setStep] = useState<Step>({ at: 'idle' });
  const run = useRef(0); // a later action, or closing the dialog, abandons an earlier one's updates
  useEffect(() => () => { run.current++; }, []);
  useEffect(() => { run.current++; setStep({ at: 'idle' }); }, [symbol, side, amount, wallet]);
  const busy = step.at === 'working';
  useEffect(() => { onBusy(busy); }, [busy, onBusy]);

  if (!wallet || !eligibility.data?.eligible) return null;
  if (!browserWallet()) {
    return <div className="live-trade"><h3>Trade</h3><p>To trade, open this page in a browser with a wallet extension that holds {short(wallet)}.</p></div>;
  }

  const firm = async (): Promise<Review> => {
    const provider = await connect(wallet); // first, so a wrong account or chain costs no quote
    const quote = await getApi<FirmQuote>(`/v1/robinhood/quote?side=${side}&symbol=${encodeURIComponent(symbol)}&amount=${encodeURIComponent(amount)}&taker=${wallet}`);
    if (!quote.tradable) throw new Error(quote.reasons?.length ? 'Not tradable right now: ' + quote.reasons.join(', ') + '.' : 'No venue returned a quote for this size.');
    const venue = quote.quotes.find((v) => v.venue === quote.best);
    if (!venue || venue.error || !venue.transaction || !venue.spender) throw new Error('The quote came back without a transaction. Try again.');
    if (venue.withinBand === false) throw new Error(`The best quote is ${venue.vsReferencePct}% worse than the indicative price, which is too far to trade here. Try a smaller amount, or try again later.`);
    const need = BigInt(quote.sell.amountRaw);
    if ((await balanceOf(provider, quote.sell.address, wallet)) < need) throw new Error(`This wallet does not hold ${qty(quote.sell.amount)} ${quote.sell.symbol} on Robinhood Chain.`);
    const needsApproval = (await allowance(provider, quote.sell.address, wallet, venue.spender)) < need;
    return { quote, venue, needsApproval, at: Date.now() };
  };

  const review = () => {
    const mine = ++run.current, live = () => run.current === mine;
    setStep({ at: 'working', text: 'Getting a firm quote…' });
    firm().then((r) => { if (live()) setStep({ at: 'review', review: r }); })
      .catch((e) => { if (live()) setStep({ at: 'failed', text: walletMessage(e) }); });
  };

  const confirm = (reviewed: Review) => {
    let hashSeen: string | undefined;
    const mine = ++run.current, live = () => run.current === mine;
    (async () => {
      let r = reviewed;
      const provider = await connect(wallet);
      const floor = BigInt(reviewed.venue.minBuyAmountRaw) * MAX_SLIP / 1000n;
      if (r.needsApproval) {
        setStep({ at: 'working', text: `Step 1 of 2. Confirm in your wallet: allow ${venueName(r.venue.venue)} to spend exactly ${qty(r.quote.sell.amount)} ${r.quote.sell.symbol}.` });
        hashSeen = await approve(provider, wallet, r.quote.sell.address, r.venue.spender!, BigInt(r.quote.sell.amountRaw));
        if (!live()) return;
        setStep({ at: 'working', text: 'Step 1 of 2. Waiting for the approval to confirm…', hash: hashSeen });
        await confirmed(provider, hashSeen);
        hashSeen = undefined;
      }
      // The quote reviewed is stale after an approval, or after a slow read: take a fresh one.
      if (r.needsApproval || Date.now() - r.at > FRESH_MS) {
        if (!live()) return;
        setStep({ at: 'working', text: 'Refreshing the quote…' });
        r = await firm();
        if (r.needsApproval) throw new Error('The approval did not cover the best venue any more. Review the trade again.');
        if (BigInt(r.venue.minBuyAmountRaw) < floor) {
          if (live()) setStep({ at: 'review', review: { ...r, note: 'The price moved while you were confirming. This is the new quote.' } });
          return;
        }
      }
      if (!live()) return;
      const n = reviewed.needsApproval ? 'Step 2 of 2. ' : '';
      setStep({ at: 'working', text: `${n}Confirm the ${side} in your wallet.` });
      hashSeen = await send(provider, { from: wallet, ...r.venue.transaction! });
      if (live()) setStep({ at: 'working', text: `${n}Waiting for the trade to confirm…`, hash: hashSeen });
      await confirmed(provider, hashSeen);
      client.invalidateQueries({ queryKey: ['robinhood', 'positions'] });
      if (live()) setStep({ at: 'done', review: r, hash: hashSeen });
    })().catch((e) => { if (live()) setStep({ at: 'failed', text: walletMessage(e), hash: hashSeen }); });
  };

  const link = (hash?: string) => hash && <a href={txUrl(hash)} target="_blank" rel="noopener">View the transaction</a>;
  const what = side === 'buy' ? `Buy ${symbol} with ${qty(amount)} USDG` : `Sell ${qty(amount)} ${symbol} for USDG`;

  return (
    <div className="live-trade" aria-live="polite">
      <h3>Trade</h3>
      {step.at === 'idle' && (
        <>
          <p>{what} at the best venue, from wallet {short(wallet)}. You review a firm quote first, and your wallet asks you to confirm before anything is sent.</p>
          <button className="live-btn solid" type="button" onClick={review}>Review trade</button>
        </>
      )}
      {step.at === 'working' && <p>{step.text} {link(step.hash)}</p>}
      {step.at === 'failed' && (
        <>
          <p className="live-error">{step.text} {link(step.hash)}</p>
          <button className="live-btn" type="button" onClick={review}>Review trade again</button>
        </>
      )}
      {step.at === 'review' && (() => {
        const { quote, venue, needsApproval, note } = step.review;
        return (
          <>
            {note && <p className="live-error">{note}</p>}
            <dl>
              <dt>You spend</dt><dd className="live-mono">{qty(quote.sell.amount)} {quote.sell.symbol}</dd>
              <dt>You receive about</dt><dd className="live-mono">{qty(venue.buyAmount)} {quote.buy.symbol}</dd>
              <dt>And at least</dt><dd className="live-mono">{qty(venue.minBuyAmount)} {quote.buy.symbol}</dd>
              <dt>Price per token</dt><dd className="live-mono">{usd(venue.pricePerToken)}</dd>
              <dt>Venue</dt><dd className="live-mono">{venueName(venue.venue)}{venue.route ? ' · ' + venue.route : ''}</dd>
              <dt>Venue fee</dt><dd className="live-mono">{venue.feeUsd == null ? '—' : usd(venue.feeUsd)}</dd>
            </dl>
            <p>
              {needsApproval
                ? `Your wallet will ask twice: first to allow ${venueName(venue.venue)} to spend exactly ${qty(quote.sell.amount)} ${quote.sell.symbol}, then for the trade itself.`
                : 'Your wallet will ask once, for the trade itself.'}
              {' '}You also pay network gas in ETH. A trade cannot be undone once it confirms.
            </p>
            <div className="live-actions">
              <button className="live-btn solid" type="button" onClick={() => confirm(step.review)}>Confirm in wallet</button>
              <button className="live-btn" type="button" onClick={() => { run.current++; setStep({ at: 'idle' }); }}>Cancel</button>
            </div>
          </>
        );
      })()}
      {step.at === 'done' && (
        <>
          <p>
            Done. You spent {qty(step.review.quote.sell.amount)} {step.review.quote.sell.symbol} and received at least {qty(step.review.venue.minBuyAmount)} {step.review.quote.buy.symbol}. {link(step.hash)}
          </p>
          <button className="live-btn" type="button" onClick={() => setStep({ at: 'idle' })}>Trade again</button>
        </>
      )}
    </div>
  );
}
