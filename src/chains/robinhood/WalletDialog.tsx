import { useState, type FormEvent } from 'react';
import { Dialog } from '../../components/Dialog';
import { isAddress, setWallet, useWallet } from './wallet';

type Ethereum = { request: (args: { method: string }) => Promise<string[]> };

export function WalletDialog({ onClose }: { onClose: () => void }) {
  const wallet = useWallet();
  const [value, setValue] = useState(wallet || '');
  const [error, setError] = useState('');
  const ethereum = (window as { ethereum?: Ethereum }).ethereum;

  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!isAddress(v)) { setError('Enter a full address: 0x followed by 40 characters.'); return; }
    setWallet(v);
    onClose();
  };
  const useBrowserWallet = () => {
    ethereum!.request({ method: 'eth_requestAccounts' })
      .then((a) => { if (a && a[0]) setValue(a[0]); })
      .catch(() => setError('The browser wallet did not share an address.'));
  };

  return (
    <Dialog onClose={onClose}>
      <form method="dialog" onSubmit={save}>
        <h2>Robinhood Chain wallet</h2>
        <p>Paste a wallet address to see its live holdings on Robinhood Chain. This is read-only: Promorphic reads balances and never asks you to sign anything here.</p>
        <label>
          Wallet address
          <input className="live-input" type="text" placeholder="0x…" autoComplete="off" spellCheck={false} autoFocus value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        {error && <p className="live-error">{error}</p>}
        <div className="live-foot">
          {ethereum?.request && <button className="live-btn" type="button" onClick={useBrowserWallet}>Use browser wallet</button>}
          {wallet && <button className="live-btn" type="button" onClick={() => { setWallet(null); onClose(); }}>Remove</button>}
          <button className="live-btn" type="button" onClick={onClose}>Cancel</button>
          <button className="live-btn solid" type="submit">Save</button>
        </div>
      </form>
    </Dialog>
  );
}
