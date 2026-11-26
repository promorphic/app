import { useState } from 'react';
import { Dialog } from '../../components/Dialog';
import { Failed, Notice } from '../../components/PageHead';
import { useToken } from '../../lib/account';
import { toast } from '../../lib/toast';
import { useEmbeddedWallet, type SigningRequest } from '../../wallet/api';
import { SignPanel } from '../../wallet/SignPanel';
import { activationWording, TradeDialog } from './TradeDialog';
import { prepareActivation, units, useFaucet, useTradeAccount, useTradeAssets, type Side, type TradeAsset } from './trade';

// Wallets screen, under the Promorphic wallet: the wallet's Stellar account and what it can trade.
// The account is activated once, by signing; after that each asset has Buy and Sell. Shown only
// where the API trades on Stellar and the account has a Promorphic wallet.
export function StellarTrading() {
  const token = useToken();
  const wallet = useEmbeddedWallet();
  const has = !!wallet.state?.wallet;
  const provider = wallet.state?.provider ?? null;
  const market = useTradeAssets().data;
  const account = useTradeAccount(has && !!market);
  const faucet = useFaucet();
  const [busy, setBusy] = useState(false);
  const [activating, setActivating] = useState<SigningRequest | null>(null);
  const [trading, setTrading] = useState<{ asset: TradeAsset; side: Side } | null>(null);

  if (!token || !has || !market?.cash) return null;
  const cash = market.cash.code;
  const a = account.data;

  const activate = () => {
    setBusy(true);
    prepareActivation(token)
      .then((r) => { if (r.request) setActivating(r.request); else account.refetch(); })
      .catch((e: Error) => toast(e.message))
      .finally(() => setBusy(false));
  };
  const drip = () => faucet.mutate(undefined, {
    onSuccess: (r) => toast(`${units(r.amount)} test ${r.symbol} sent to your Stellar account.`),
    onError: (e) => toast(e.message),
  });
  const pays = market.sponsored ? 'Promorphic pays the network fees, so you need no XLM.' : 'Network fees are paid from your XLM.';

  let body;
  if (account.isPending) body = <div className="live-box"><Notice>Reading your Stellar account…</Notice></div>;
  else if (account.isError) body = <div className="live-box"><Failed error={account.error} what="Your Stellar account" /></div>;
  else if (!a!.active) {
    body = (
      <div className="live-card">
        <div className="grow">
          <span className="addr">Your Stellar account is not active yet.</span>
          <span className="live-meta">
            Activating it {a!.exists ? '' : 'creates the account and '}lets it hold {cash}, the asset trades are paid in. You sign once.
            {market.sponsored ? ' Promorphic pays the reserve and the fee, so you need no XLM.' : ' It takes 0.5 XLM free in the account.'}
          </span>
        </div>
        <div className="live-actions">
          <button className="live-btn solid" type="button" disabled={busy} onClick={activate}>{busy ? 'Preparing…' : 'Activate account'}</button>
        </div>
      </div>
    );
  } else {
    const heldOf = (x: TradeAsset) => a!.holdings.find((h) => h.id === x.id);
    body = (
      <>
        <div className="live-card">
          <div className="grow">
            <span className="addr">Cash to trade with: <span className="live-mono">{units(a!.cashBalance)} {cash}</span></span>
            <span className="live-meta">
              {a!.faucet ? `${cash} is a test dollar with no value. ` : ''}Buying spends it and selling returns it. {pays}
            </span>
          </div>
          <div className="live-actions">
            {a!.faucet && <button className="live-btn" type="button" disabled={faucet.isPending} onClick={drip}>{faucet.isPending ? 'Sending…' : `Get 1,000 test ${cash}`}</button>}
            <a className="live-btn quiet" href={a!.explorer} target="_blank" rel="noopener noreferrer">Explorer</a>
          </div>
        </div>
        <div className="live-box">
          <table className="live-table wallet-table wraps" style={{ minWidth: '760px' }}>
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Terms</th>
                <th scope="col" className="num">You hold</th>
                <th scope="col" className="num"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {market.assets.map((x) => {
                const h = heldOf(x);
                return (
                  <tr key={x.id}>
                    <td><div className="live-asset"><span className="live-ticker">{x.symbol}</span><span className="live-name">{x.name}</span></div></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {x.access === 'Open' ? 'Open to any account' : x.access}
                      <span className="acct-cell-sub">{x.nav == null ? 'No net asset value published' : `Net asset value ${units(x.nav)} ${cash}`}</span>
                    </td>
                    <td className="num">{h ? units(h.balance) : '—'}{h && !h.approvedByIssuer && <span className="acct-cell-sub">Not approved by the issuer</span>}</td>
                    <td className="num">
                      <span className="wallet-actions">
                        {x.tradable ? (
                          <>
                            <button className="live-btn" type="button" onClick={() => setTrading({ asset: x, side: 'buy' })} aria-label={`Buy ${x.symbol}`}>Buy</button>
                            {h && Number(h.balance) > 0 && <button className="live-btn" type="button" onClick={() => setTrading({ asset: x, side: 'sell' })} aria-label={`Sell ${x.symbol}`}>Sell</button>}
                          </>
                        ) : <span style={{ color: 'var(--ink-muted)' }} title="Only accounts the issuer has approved can hold this asset, so it cannot be traded from here yet.">Needs the issuer's approval</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <section className="live-section" aria-label="Stellar trading">
      <div className="live-head">
        <h2>Trade on Stellar</h2>
        {market.network === 'testnet' && <span className="live-tag">Testnet</span>}
        <span className="live-meta">Buy and sell Stellar assets from your Promorphic wallet, on Stellar's built-in exchange. You check and sign each trade.</span>
      </div>
      {body}
      {activating && (
        <Dialog onClose={() => setActivating(null)}>
          <SignPanel initial={activating} provider={provider} title="Sign to activate" wording={activationWording} onRetry={() => { setActivating(null); activate(); }} onClose={() => setActivating(null)} />
        </Dialog>
      )}
      {trading && <TradeDialog asset={trading.asset} side={trading.side} onClose={() => setTrading(null)} />}
    </section>
  );
}
