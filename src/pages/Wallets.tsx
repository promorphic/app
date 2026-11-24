import { useState } from 'react';
import { WalletDialog } from '../chains/robinhood/WalletDialog';
import { setWallet, short, usd, useWallet } from '../chains/robinhood/wallet';
import { useViaWalletConnect, wcDisconnect } from '../chains/robinhood/walletconnect';
import { Failed, Notice, PageHead, SignedOut, Stat, Stats } from '../components/PageHead';
import { PromorphicWallet } from '../wallet/PromorphicWallet';
import { CHAIN_NAMES, VIA_NAMES, usePortfolio, useRemoveWallet, useToken, useWallets, type LinkedWallet } from '../lib/account';

const ghost = 'live-btn';

export default function Wallets() {
  const token = useToken();
  const wallets = useWallets();
  const portfolio = usePortfolio();
  const remove = useRemoveWallet();
  const active = useWallet();
  const pairedHere = useViaWalletConnect();
  const [dialog, setDialog] = useState<null | 'new' | LinkedWallet>(null);

  const list = wallets.data || [];
  const valueOf = (w: LinkedWallet) => portfolio.data?.wallets.find((p) => p.id === w.id);
  const isActive = (w: LinkedWallet) => !!active && active.toLowerCase() === w.address.toLowerCase();
  const activeLinked = !active || list.some(isActive);

  const use = (w: LinkedWallet) => setWallet(w.address, null);
  const unlink = (w: LinkedWallet) => {
    if (!confirm(`Remove ${w.label || short(w.address)} from your account? Its balances stop showing here. Nothing changes in the wallet itself.`)) return;
    if (isActive(w)) { if (pairedHere) void wcDisconnect(); setWallet(null); }
    remove.mutate(w.id);
  };

  let body;
  if (!token) body = <SignedOut what="the wallets linked to your account" />;
  else if (wallets.isPending) body = <Notice>Loading your wallets…</Notice>;
  else if (wallets.isError) body = <Failed error={wallets.error} what="Your wallets" />;
  else if (!list.length) body = <Notice>No wallet linked yet. Link one to see its holdings on the Portfolio screen and trade from it.</Notice>;
  else {
    body = (
      <table className="live-table" style={{ minWidth: '820px' }}>
        <thead>
          <tr>
            <th scope="col">Wallet</th>
            <th scope="col">Chain</th>
            <th scope="col">Address</th>
            <th scope="col">Added as</th>
            <th scope="col">Trades</th>
            <th scope="col" className="num">Value</th>
            <th scope="col" className="num"><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {list.map((w) => {
            const v = valueOf(w);
            return (
              <tr key={w.id}>
                <td><span className="acct-cell-main">{w.label || 'Unnamed wallet'}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{CHAIN_NAMES[w.chain]}</td>
                <td className="live-mono" style={{ whiteSpace: 'nowrap', color: 'var(--ink)' }} title={w.address}>{short(w.address)}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{VIA_NAMES[w.via]}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {w.via === 'promorphic' ? <span className="acct-pill quiet">Send from the card above</span> : isActive(w) ? <span className="acct-pill solid">{pairedHere ? 'Signs from your phone' : 'Signs here'}</span> : <button className={ghost} type="button" onClick={() => use(w)}>Use for trading</button>}
                </td>
                <td className="num">{v ? (v.error ? <span title={v.error} style={{ color: 'var(--ink-muted)' }}>Unavailable</span> : usd(v.totalUsd)) : portfolio.isError ? '—' : '…'}</td>
                <td className="num">
                  <span style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className={ghost} type="button" onClick={() => setDialog(w)}>Rename</button>
                    {w.via !== 'promorphic' && <button className={ghost} type="button" disabled={remove.isPending} onClick={() => unlink(w)}>Remove</button>}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  const n = list.length;
  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Wallets" lead="Your assets stay in your own wallets. Promorphic never holds your assets or your keys.">
        <button className={ghost} type="button" onClick={() => setDialog('new')}>Link wallet</button>
      </PageHead>
      <Stats>
        <Stat value={token ? (wallets.data ? n : '…') : '—'} label={n === 1 ? 'Wallet linked' : 'Wallets linked'} />
        <Stat value={portfolio.data ? usd(portfolio.data.totals.usd) : '—'} label={portfolio.data && !portfolio.data.complete ? 'Held, some balances unavailable' : 'Held across linked wallets, indicative'} />
        <Stat value="You sign" label="Each trade is prepared here and confirmed in your wallet. Nothing moves until you sign it." />
      </Stats>
      {!activeLinked && active && (
        <Notice>
          This browser trades from {short(active)}, which is not linked to your account. <button className="live-btn" type="button" style={{ marginLeft: '8px' }} onClick={() => setDialog({ id: '', address: active, chain: 'robinhood', chainId: 4663, label: '', via: 'pasted', verified: false, addedAt: '' })}>Link it</button>
        </Notice>
      )}
      <PromorphicWallet />
      <section className="live-section" aria-label="Linked wallets" style={{ minWidth: 0 }}>
        <div className="live-head">
          <h2>Linked wallets</h2>
          <span className="live-meta">Wallets you hold elsewhere. Promorphic reads their balances; each trade asks that wallet to sign.</span>
        </div>
        <div className="live-box">{body}</div>
        {remove.isError && <p className="live-error" style={{ marginTop: '12px' }}>{remove.error.message}</p>}
      </section>
      {dialog && <WalletDialog onClose={() => setDialog(null)} edit={dialog === 'new' ? undefined : { address: dialog.address, label: dialog.label }} />}
    </main>
  );
}
