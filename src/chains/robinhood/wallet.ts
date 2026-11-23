// The wallet trades are made from on Robinhood Chain: an address, kept in this browser, because
// which wallet can sign is a property of the device. Trading (Trade.tsx) asks the wallet holding it
// to sign: the browser's own wallet, or one on a phone paired through WalletConnect.
// The wallets linked to the account live on the API (lib/account.ts); useWalletSync picks the first
// of them when this browser has none, so a wallet linked on one device is ready on another.
import { useEffect } from 'react';
import { useWallets } from '../../lib/account';
import { createStore } from '../../lib/store';

const KEY = 'pm-rh-wallet';
const VIA_KEY = 'pm-rh-wallet-via';
export const isAddress = (s: string | null | undefined): s is string => /^0x[0-9a-fA-F]{40}$/.test(s || '');

// How the wallet signs: null is the browser's own wallet (or nothing, for an address only pasted in),
// 'walletconnect' is a wallet on a phone paired through WalletConnect (walletconnect.ts).
export type Via = 'walletconnect' | null;

function saved() {
  try { const w = localStorage.getItem(KEY); return isAddress(w) ? w : null; } catch { return null; }
}
function savedVia(): Via {
  try { return saved() && localStorage.getItem(VIA_KEY) === 'walletconnect' ? 'walletconnect' : null; } catch { return null; }
}
let via = savedVia();
const store = createStore<string | null>(saved());
// Both are set together, and the address is compared by value, so one render sees both changes.
const changed = createStore(0);
export const useWallet = () => { changed.use(); return store.use(); };
export const currentWallet = store.get;
export const walletVia = () => via;
export function setWallet(address: string | null, by: Via = null) {
  const next = address ? by : null;
  try {
    if (address) localStorage.setItem(KEY, address); else localStorage.removeItem(KEY);
    if (next) localStorage.setItem(VIA_KEY, next); else localStorage.removeItem(VIA_KEY);
  } catch { /* private window */ }
  via = next;
  store.set(address);
  changed.set(changed.get() + 1);
}

// Once the account's wallets are known, a browser with no trading wallet takes the first one.
export function useWalletSync() {
  const { data } = useWallets();
  useEffect(() => {
    const mine = (data || []).filter((w) => w.chain === 'robinhood');
    if (!store.get() && mine[0]) setWallet(mine[0].address, null);
  }, [data]);
}

export const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
export const usd = (v: string | number | null | undefined) =>
  v == null || v === '' ? '—' : '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const qty = (v: string | number, max = 6) => Number(v).toLocaleString('en-US', { maximumFractionDigits: max });
export const time = (iso: string | number) => new Date(iso).toLocaleTimeString();
