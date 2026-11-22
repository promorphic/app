// The wallet whose Robinhood Chain balances the app reads. Read-only: an address, kept in this browser.
import { useQuery } from '@tanstack/react-query';
import { getApi } from '../../lib/api';
import { createStore } from '../../lib/store';

const KEY = 'pm-rh-wallet';
export const isAddress = (s: string | null | undefined): s is string => /^0x[0-9a-fA-F]{40}$/.test(s || '');

function saved() {
  try { const w = localStorage.getItem(KEY); return isAddress(w) ? w : null; } catch { return null; }
}
const store = createStore<string | null>(saved());
export const useWallet = store.use;
export function setWallet(address: string | null) {
  try { if (address) localStorage.setItem(KEY, address); else localStorage.removeItem(KEY); } catch { /* private window */ }
  store.set(address);
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
