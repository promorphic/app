import { useState, type FormEvent } from 'react';
import { isAddress } from '../chains/robinhood/wallet';
import { isStellarAddress } from '../chains/stellar/address';
import { Dialog } from '../components/Dialog';
import { useToken } from '../lib/account';
import { ApiError } from '../lib/api';
import { prepareCantonRegistration, prepareTransfer, type Provider, type SendChain, type SigningRequest, type WalletAccount } from './api';
import { SignPanel } from './SignPanel';

const DECIMALS: Record<SendChain, number> = { robinhood: 18, avalanche: 18, stellar: 7 };
const PLACEHOLDER: Record<SendChain, string> = { robinhood: '0x…', avalanche: '0x…', stellar: 'G…' };
const validTo: Record<SendChain, (s: string) => boolean> = { robinhood: isAddress, avalanche: isAddress, stellar: isStellarAddress };

// Send the chain's own coin: the form, then the request to review and sign.
export function SendDialog({ account, balance, provider, onClose }: { account: WalletAccount; balance: string | null; provider: Provider; onClose: () => void }) {
  const token = useToken()!;
  const chain = account.chain as SendChain;
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [request, setRequest] = useState<SigningRequest | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const dest = to.trim(), amt = amount.trim();
    if (!validTo[chain](dest)) { setError(chain === 'stellar' ? 'Enter a Stellar account address: G followed by 55 characters.' : 'Enter an address: 0x followed by 40 characters.'); return; }
    if (dest.toLowerCase() === account.address.toLowerCase()) { setError('That is this wallet\'s own address.'); return; }
    const dp = DECIMALS[chain];
    if (!new RegExp(`^\\d+(\\.\\d{1,${dp}})?$`).test(amt) || Number(amt) <= 0) { setError(`Enter an amount above zero, with at most ${dp} decimal places.`); return; }
    setBusy(true); setError('');
    prepareTransfer(token, { chain, to: dest, amount: amt })
      .then(setRequest)
      .catch((err: Error) => setError(err instanceof ApiError && err.code === 'not_funded' ? 'This Stellar account is not active yet. Fund it with testnet XLM first.' : err.message))
      .finally(() => setBusy(false));
  };

  return (
    <Dialog onClose={onClose}>
      {request ? <SignPanel initial={request} provider={provider} title="Review and sign" onClose={onClose} /> : (
        <form onSubmit={submit} noValidate>
          <h2>Send {account.symbol} on {account.name}</h2>
          <p>From your Promorphic wallet{balance != null ? <>, which holds <span className="live-mono" style={{ color: 'var(--ink)' }}>{balance} {account.symbol}</span></> : ''}. You review the details and sign before anything is sent.</p>
          <label>
            To
            <input className="live-input live-mono" type="text" autoComplete="off" spellCheck={false} autoFocus placeholder={PLACEHOLDER[chain]} value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label>
            Amount in {account.symbol}
            <input className="live-input live-mono" type="text" inputMode="decimal" autoComplete="off" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          {chain === 'stellar' && <p>Sending to an address that is not active on Stellar yet creates it, which takes at least 1 XLM.</p>}
          {error && <p className="live-error">{error}</p>}
          <div className="live-foot">
            <button className="live-btn" type="button" onClick={onClose}>Cancel</button>
            <button className="live-btn solid" type="submit" disabled={busy}>{busy ? 'Preparing…' : 'Review'}</button>
          </div>
        </form>
      )}
    </Dialog>
  );
}

// Canton needs the wallet's key registered as a party once, before anything else on Canton.
export function RegisterDialog({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const token = useToken()!;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [request, setRequest] = useState<SigningRequest | null>(null);
  const start = () => {
    setBusy(true); setError('');
    prepareCantonRegistration(token).then(setRequest).catch((e: Error) => setError(e.message)).finally(() => setBusy(false));
  };
  return (
    <Dialog onClose={onClose}>
      {request ? <SignPanel initial={request} provider={provider} title="Sign to register" onClose={onClose} /> : (
        <div className="body">
          <h2>Register on Canton</h2>
          <p>Canton needs your wallet's key registered as a party before it can hold anything or take part in a transaction. You do this once, by signing. Your key stays yours: the party acts only with your signature.</p>
          {error && <p className="live-error">{error}</p>}
          <div className="live-foot">
            <button className="live-btn" type="button" onClick={onClose}>Cancel</button>
            <button className="live-btn solid" type="button" disabled={busy} onClick={start}>{busy ? 'Preparing…' : 'Continue'}</button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
