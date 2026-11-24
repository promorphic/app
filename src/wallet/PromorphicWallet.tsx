import { useState } from 'react';
import { Failed } from '../components/PageHead';
import { useToken } from '../lib/account';
import { toast } from '../lib/toast';
import { useBalances, useCreateWallet, useEmbeddedWallet, useFundStellar, type Balance, type WalletAccount } from './api';
import { turnkeyConfigured } from './turnkey';
import { RegisterDialog, SendDialog } from './WalletDialogs';
import './wallet.css';

const shortAddr = (a: string) => (a.length > 16 ? a.slice(0, 8) + '…' + a.slice(-6) : a);
// A balance to six decimal places, grouped, without trailing zeros.
function amount(s: string) {
  const [w, f = ''] = s.split('.');
  const frac = f.slice(0, 6).replace(/0+$/, '');
  return BigInt(w || '0').toLocaleString('en-US') + (frac ? '.' + frac : '');
}

function BalanceCell({ a, b, loading }: { a: WalletAccount; b?: Balance; loading: boolean }) {
  if (!b) return <>{loading ? '…' : '—'}</>;
  if (b.error) return <span title={b.error} style={{ color: 'var(--ink-muted)' }}>Unavailable</span>;
  if (a.chain === 'canton') return b.registered ? <>{b.contracts ?? 0} {b.contracts === 1 ? 'contract' : 'contracts'}</> : <span style={{ color: 'var(--ink-muted)' }}>Not registered</span>;
  if (a.chain === 'stellar' && b.funded === false) return <span style={{ color: 'var(--ink-muted)' }}>Not active yet</span>;
  return <>{amount(b.balance || '0')} {a.symbol}</>;
}

// The account's own Promorphic wallet: one address per chain, its balances, and sending from it.
// Hidden where the API has no Promorphic wallets, or has them switched off and this account has none.
export function PromorphicWallet() {
  const token = useToken();
  const w = useEmbeddedWallet();
  const create = useCreateWallet();
  const wallet = w.state?.wallet || null;
  const provider = w.state?.provider ?? null;
  const balances = useBalances(!!wallet);
  const fund = useFundStellar();
  const [send, setSend] = useState<WalletAccount | null>(null);
  const [register, setRegister] = useState(false);

  if (!token || w.isPending) return null;
  if (w.isError) return <section className="live-section" aria-label="Promorphic wallet"><div className="live-box"><Failed error={w.error} what="Your Promorphic wallet" /></div></section>;
  if (!w.available) return null;

  const network = w.state!.network;
  const balanceOf = (a: WalletAccount) => balances.data?.find((b) => b.chain === a.chain);
  const copy = (a: WalletAccount) => navigator.clipboard.writeText(a.address).then(() => toast(`${a.name} address copied.`), () => toast('Copying is blocked in this browser.'));
  const fundNow = () => fund.mutate(undefined, { onSuccess: () => toast('10,000 test XLM sent to your Stellar account.'), onError: (e) => toast(e.message) });
  const signHere = provider === 'dev' || (provider === 'turnkey' && turnkeyConfigured);

  return (
    <section className="live-section" aria-label="Promorphic wallet">
      <div className="live-head">
        <h2>Promorphic wallet</h2>
        {network === 'testnet' && <span className="live-tag">Testnet</span>}
        <span className="live-meta">Self-custody: the keys are held in Turnkey and only you can sign. Promorphic cannot move anything in it.</span>
      </div>

      {!wallet ? (
        <div className="live-card">
          <div className="grow">
            <span className="addr">One wallet, with its own address on Robinhood Chain, Avalanche, Stellar and Canton.</span>
            <span className="live-meta">
              {provider ? `It is created for ${network === 'testnet' ? 'the test networks' : 'the main networks'} and tied to your account. You sign every transaction yourself.` : 'Promorphic wallets are not switched on yet.'}
            </span>
            {create.isError && <span className="live-error">{create.error.message}</span>}
          </div>
          <div className="live-actions">
            <button className="live-btn solid" type="button" disabled={!provider || create.isPending} onClick={() => create.mutate()}>{create.isPending ? 'Creating…' : 'Create wallet'}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="live-box">
            <table className="live-table wallet-table" style={{ minWidth: '760px' }}>
              <thead>
                <tr>
                  <th scope="col">Chain</th>
                  <th scope="col">Address</th>
                  <th scope="col" className="num">Balance</th>
                  <th scope="col" className="num"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {wallet.accounts.map((a) => {
                  const b = balanceOf(a);
                  const shown = a.chain === 'canton' && a.canton?.partyId ? a.canton.partyId : a.address;
                  return (
                    <tr key={a.chain}>
                      <td style={{ whiteSpace: 'nowrap' }}><span className="acct-cell-main">{a.name}</span></td>
                      <td>
                        <span className="wallet-addr">
                          <span className="live-mono" style={{ color: 'var(--ink)' }} title={shown}>{a.chain === 'canton' && !a.canton?.partyId ? `Key ${shortAddr(a.address)}` : shortAddr(shown)}</span>
                          {a.chain !== 'canton' && <button className="live-btn quiet" type="button" onClick={() => copy(a)} aria-label={`Copy the ${a.name} address`}>Copy</button>}
                          {a.explorer && <a className="live-btn quiet" href={a.explorer} target="_blank" rel="noopener noreferrer" aria-label={`Open the ${a.name} address in the explorer`}>Explorer</a>}
                        </span>
                      </td>
                      <td className="num"><BalanceCell a={a} b={b} loading={balances.isPending} /></td>
                      <td className="num">
                        <span className="wallet-actions">
                          {a.chain === 'stellar' && b?.funded === false && network === 'testnet' && (
                            <button className="live-btn" type="button" disabled={fund.isPending} onClick={fundNow}>{fund.isPending ? 'Funding…' : 'Fund with test XLM'}</button>
                          )}
                          {a.chain === 'canton' ? (
                            a.canton?.available === false ? <span style={{ color: 'var(--ink-muted)' }}>Not available here</span>
                              : !a.canton?.registered && <button className="live-btn" type="button" onClick={() => setRegister(true)}>Register party</button>
                          ) : !(a.chain === 'stellar' && b?.funded === false) && (
                            <button className="live-btn" type="button" onClick={() => setSend(a)}>Send</button>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="live-meta" style={{ margin: 0 }}>
            {balances.isError ? `Balances could not be read: ${balances.error.message} ` : ''}
            {provider === 'dev' ? 'Local run: transactions are signed by the API\'s development key in place of Turnkey. ' : ''}
            {provider === 'turnkey' && !turnkeyConfigured ? 'Signing in the browser is not switched on yet, so nothing can be sent from here. ' : ''}
            {signHere ? 'Each send shows you the details to check before you sign.' : ''}
          </p>
        </>
      )}

      {send && <SendDialog account={send} balance={balanceOf(send)?.balance ? amount(balanceOf(send)!.balance!) : null} provider={provider} onClose={() => setSend(null)} />}
      {register && <RegisterDialog provider={provider} onClose={() => { setRegister(false); w.refetch(); }} />}
    </section>
  );
}
