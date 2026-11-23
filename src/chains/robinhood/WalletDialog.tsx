import { useRef, useState, type FormEvent } from 'react';
import { Dialog } from '../../components/Dialog';
import { useLinkWallet, useToken, type Via } from '../../lib/account';
import { currentWallet, isAddress, setWallet, useWallet } from './wallet';
import { wcConfigured } from './walletconnect';
import { WalletConnectPairing } from './WalletConnectPairing';

type Ethereum = { request: (args: { method: string }) => Promise<string[]> };

// Links a wallet to the account (and, with no account, keeps it in this browser as before).
// Reading needs no signature; the wallet is only asked to sign when a trade is made from it.
export function WalletDialog({ onClose, edit }: { onClose: () => void; edit?: { address: string; label: string } }) {
  const token = useToken();
  const active = useWallet();
  const link = useLinkWallet();
  const [label, setLabel] = useState(edit?.label || '');
  const [value, setValue] = useState(edit?.address || '');
  const [error, setError] = useState('');
  const [pairing, setPairing] = useState(false);
  const fromBrowser = useRef(false); // the address came from the browser wallet, so that wallet can sign for it
  const ethereum = (window as { ethereum?: Ethereum }).ethereum;

  const finish = async (address: string, via: Via) => {
    if (token) await link.mutateAsync({ address, chain: 'robinhood', label: label.trim(), via });
    // The first wallet, or one that can sign from this browser, becomes the one trades are made from.
    if (!active || via !== 'pasted') setWallet(address, via === 'walletconnect' ? 'walletconnect' : null);
    onClose();
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!isAddress(v)) { setError('Enter a full address: 0x followed by 40 characters.'); return; }
    setError('');
    finish(v, fromBrowser.current ? 'browser' : 'pasted').catch((err: Error) => setError(err.message));
  };
  const useBrowserWallet = () => {
    ethereum!.request({ method: 'eth_requestAccounts' })
      .then((a) => { if (a && a[0]) { setValue(a[0]); fromBrowser.current = true; } })
      .catch(() => setError('The browser wallet did not share an address.'));
  };
  // Pairing has already made the phone wallet the active one; it is linked to the account here.
  const paired = () => {
    const a = currentWallet();
    if (a) finish(a, 'walletconnect').catch((err: Error) => { setPairing(false); setError(err.message); });
    else onClose();
  };

  if (pairing) {
    return <Dialog onClose={onClose}><WalletConnectPairing onBack={() => setPairing(false)} onDone={paired} /></Dialog>;
  }
  return (
    <Dialog onClose={onClose}>
      <form method="dialog" onSubmit={save}>
        <h2>{edit ? 'Rename wallet' : 'Link a wallet'}</h2>
        <p>
          {token ? 'A linked wallet shows its holdings on every device you sign in on. ' : ''}
          Linking is read-only: Promorphic reads balances and nothing is signed. A trade asks the wallet holding the address to confirm each step.
        </p>
        <label>
          Label
          <input className="live-input" type="text" placeholder="Treasury main" maxLength={40} autoComplete="off" value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          Wallet address on Robinhood Chain
          <input className="live-input" type="text" placeholder="0x…" autoComplete="off" spellCheck={false} autoFocus={!edit} readOnly={!!edit} value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        {error && <p className="live-error">{error}</p>}
        <div className="live-foot">
          {!edit && ethereum?.request && <button className="live-btn" type="button" onClick={useBrowserWallet}>Use browser wallet</button>}
          {!edit && wcConfigured && <button className="live-btn" type="button" onClick={() => setPairing(true)}>WalletConnect</button>}
          <button className="live-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="live-btn solid" type="submit" disabled={link.isPending}>{link.isPending ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Dialog>
  );
}
