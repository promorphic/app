// The wallet whose Robinhood Chain balances the app reads: an address, kept in this browser.
// Reading needs no signature. Trading (Trade.tsx) asks the wallet holding it to sign: the browser's
// own wallet, or one on a phone paired through WalletConnect.
import { useQuery } from '@tanstack/react-query';
import { getApi } from '../../lib/api';
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

export interface Positions {
  address: string;
  asOf: string;
  stockTokens: { symbol: string; name: string; tokens: string; shares: string; multiplier: string; halted?: boolean; tokenMid?: string; valueUsd?: string }[];
  cash: { usdg: string; eth: string };
  totals: { withUsdgUsd: string; stockTokensUsd: string };
}

// Shared by the Wallets and Portfolio screens, so moving between them does not read the chain again.
export function usePositions(wallet: string | null) {
  return useQuery({
    queryKey: ['robinhood', 'positions', wallet],
    queryFn: () => getApi<Positions>('/v1/robinhood/positions/' + wallet),
    enabled: !!wallet,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4);
export const usd = (v: string | number | null | undefined) =>
  v == null || v === '' ? '—' : '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const qty = (v: string | number, max = 6) => Number(v).toLocaleString('en-US', { maximumFractionDigits: max });
export const time = (iso: string | number) => new Date(iso).toLocaleTimeString();
