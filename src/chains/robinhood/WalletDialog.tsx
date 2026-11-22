import { useRef, useState, type FormEvent } from 'react';
import { Dialog } from '../../components/Dialog';
import { isAddress, setWallet, useWallet } from './wallet';
import { useViaWalletConnect, wcConfigured, wcDisconnect } from './walletconnect';
import { WalletConnectPairing } from './WalletConnectPairing';

type Ethereum = { request: (args: { method: string }) => Promise<string[]> };

export function WalletDialog({ onClose }: { onClose: () => void }) {
  const wallet = useWallet();
  const [value, setValue] = useState(wallet || '');
  const [error, setError] = useState('');
  const [pairing, setPairing] = useState(false);
  const paired = useViaWalletConnect();
  const fromBrowser = useRef(false); // the address was taken from the browser wallet, so that is what signs
  const ethereum = (window as { ethereum?: Ethereum }).ethereum;

  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!isAddress(v)) { setError('Enter a full address: 0x followed by 40 characters.'); return; }
    // The same address keeps its WalletConnect session; a different one ends it.
    const same = paired && !fromBrowser.current && wallet?.toLowerCase() === v.toLowerCase();
    if (paired && !same) void wcDisconnect();
    setWallet(v, same ? 'walletconnect' : null);
    onClose();
  };
  const remove = () => {
    if (paired) void wcDisconnect();
    setWallet(null);
    onClose();
  };
  const useBrowserWallet = () => {
    ethereum!.request({ method: 'eth_requestAccounts' })
      .then((a) => { if (a && a[0]) { setValue(a[0]); fromBrowser.current = true; } })
      .catch(() => setError('The browser wallet did not share an address.'));
  };

  if (pairing) {
    return <Dialog onClose={onClose}><WalletConnectPairing onBack={() => setPairing(false)} onDone={onClose} /></Dialog>;
  }
  return (
    <Dialog onClose={onClose}>
      <form method="dialog" onSubmit={save}>
        <h2>Robinhood Chain wallet</h2>
        <p>Paste a wallet address to see its live holdings on Robinhood Chain. Setting it is read-only: Promorphic reads balances and nothing is signed. A trade asks your wallet to confirm each step.</p>
        {paired && <p className="live-note">This wallet is connected with WalletConnect and can sign trades from your phone.</p>}
        <label>
          Wallet address
          <input className="live-input" type="text" placeholder="0x…" autoComplete="off" spellCheck={false} autoFocus value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        {error && <p className="live-error">{error}</p>}
        <div className="live-foot">
          {ethereum?.request && <button className="live-btn" type="button" onClick={useBrowserWallet}>Use browser wallet</button>}
          {wcConfigured && <button className="live-btn" type="button" onClick={() => setPairing(true)}>{paired ? 'Reconnect with WalletConnect' : 'WalletConnect'}</button>}
          {wallet && <button className="live-btn" type="button" onClick={remove}>{paired ? 'Disconnect' : 'Remove'}</button>}
          <button className="live-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="live-btn solid" type="submit">Save</button>
        </div>
      </form>
    </Dialog>
  );
}
