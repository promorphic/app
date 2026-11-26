// What the signed-in account keeps on the API: linked wallets, orders, activity, portfolio.
// Every call carries the session token; without a session nothing is asked for, and the screens
// say so. Chain-specific reading and signing stay in src/chains/<chain>/; this is the account's ledger.
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../auth/session';
import { getApi } from './api';

export type Chain = 'robinhood' | 'canton';
export const CHAIN_NAMES: Record<Chain, string> = { robinhood: 'Robinhood Chain', canton: 'Canton' };
export type Via = 'pasted' | 'browser' | 'walletconnect' | 'promorphic';
export const VIA_NAMES: Record<Via, string> = { pasted: 'Address only', browser: 'Browser wallet', walletconnect: 'WalletConnect', promorphic: 'Promorphic wallet' };

export interface LinkedWallet { id: string; address: string; chain: Chain; chainId: number; label: string; via: Via; verified: boolean; addedAt: string }

export type OrderStatus = 'accepted' | 'approving' | 'sent' | 'settled' | 'failed' | 'cancelled';
export const STATUS_NAMES: Record<OrderStatus, string> = { accepted: 'Awaiting your wallet', approving: 'Approving', sent: 'Submitted', settled: 'Settled', failed: 'Failed', cancelled: 'Cancelled' };
export interface Order {
  id: string; createdAt: string; updatedAt: string; chain: Chain; chainId: number; wallet: string;
  side: 'buy' | 'sell'; symbol: string; assetName: string | null; contract: string | null;
  sell: { symbol: string; amount: string }; buy: { symbol: string; expected: string; min: string };
  pricePerToken: string | null; valueUsd: string; venue: string; route: string | null;
  approvalTxHash: string | null; txHash: string | null; status: OrderStatus; reason: string | null; placedBy: 'you' | 'agent'; settledAt: string | null;
}
export type OrderFilter = 'all' | 'open' | 'settled' | 'failed' | 'cancelled';
export interface OrdersPage { orders: Order[]; next: string | null; counts: Record<OrderStatus | 'open' | 'all', number> }

export type Actor = 'you' | 'agent' | 'system';
export interface Entry { id: string; at: string; actor: Actor; type: string; text: string; chain: Chain | null; symbol: string | null; wallet: string | null; ref: { kind: 'order' | 'wallet'; id: string } | null }
export interface EntriesPage { entries: Entry[]; next: string | null }

export interface Holding { symbol: string; name: string; contract: string; chain: Chain; tokens: string; shares: string; tokenMid: string | null; halted: boolean | null; valueUsd: string; share: number; wallets: string[] }
export interface PortfolioWallet { id: string; chain: Chain; address: string; label: string; via: Via; totalUsd: string | null; stockTokensUsd?: string; usdg?: string; eth?: string; asOf?: string; error?: string }
export interface Portfolio { asOf: string; indicative: boolean; complete: boolean; totals: { usd: string; stockTokensUsd: string; cashUsd: string }; wallets: PortfolioWallet[]; holdings: Holding[] }
export interface Snapshot { date: string; totalUsd: string; stockTokensUsd: string; cashUsd: string; wallets: number; at: string }

// The session token, or undefined when signed out (or while the app runs without accounts).
export const useToken = () => useSession()?.token;
// The same, but undefined for the test account, which has no wallets or portfolio of this kind:
// its holdings are on Canton and are read in src/chains/canton/.
const useLiveToken = () => { const s = useSession(); return s && !s.user.test ? s.token : undefined; };
const ACCOUNT = ['account'];

export function useWallets() {
  const token = useLiveToken();
  return useQuery({
    queryKey: [...ACCOUNT, 'wallets', token], enabled: !!token, staleTime: 60_000,
    queryFn: () => getApi<{ wallets: LinkedWallet[] }>('/v1/wallets', undefined, token).then((r) => r.wallets),
  });
}
export const linkWallet = (token: string, body: { address: string; chain: Chain; label?: string; via?: Via }) =>
  getApi<{ wallet: LinkedWallet; linked: boolean }>('/v1/wallets', body, token);

export function useLinkWallet() {
  const token = useToken(), client = useQueryClient();
  return useMutation({
    mutationFn: (body: { address: string; chain: Chain; label?: string; via?: Via }) => {
      if (!token) throw new Error('Sign in to link a wallet to your account.');
      return linkWallet(token, body);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNT }),
  });
}
export function useRemoveWallet() {
  const token = useToken(), client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getApi<{ removed: true }>(`/v1/wallets/${id}/remove`, {}, token),
    onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNT }),
  });
}

export function useOrders(filter: OrderFilter) {
  const token = useToken();
  return useInfiniteQuery({
    queryKey: [...ACCOUNT, 'orders', filter, token], enabled: !!token, staleTime: 15_000, refetchInterval: 30_000,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getApi<OrdersPage>(`/v1/orders?limit=25${filter === 'all' ? '' : '&status=' + filter}${pageParam ? '&before=' + pageParam : ''}`, undefined, token),
    getNextPageParam: (last) => last.next,
  });
}
export const placeOrder = (token: string, body: object) => getApi<{ order: Order }>('/v1/orders', body, token);
export const updateOrder = (token: string, id: string, body: { status: OrderStatus; approvalTxHash?: string; txHash?: string; reason?: string }) =>
  getApi<{ order: Order }>(`/v1/orders/${id}`, body, token);

export function useActivity(actor: Actor | 'all') {
  const token = useToken();
  return useInfiniteQuery({
    queryKey: [...ACCOUNT, 'activity', actor, token], enabled: !!token, staleTime: 15_000,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => getApi<EntriesPage>(`/v1/activity?limit=50${actor === 'all' ? '' : '&actor=' + actor}${pageParam ? '&before=' + pageParam : ''}`, undefined, token),
    getNextPageParam: (last) => last.next,
  });
}

export function usePortfolio() {
  const token = useLiveToken();
  return useQuery({
    queryKey: [...ACCOUNT, 'portfolio', token], enabled: !!token, staleTime: 30_000, refetchInterval: 60_000,
    queryFn: () => getApi<Portfolio>('/v1/portfolio', undefined, token),
  });
}
export function useHistory(days = 90) {
  const token = useLiveToken();
  return useQuery({
    queryKey: [...ACCOUNT, 'history', days, token], enabled: !!token, staleTime: 5 * 60_000,
    queryFn: () => getApi<{ snapshots: Snapshot[] }>(`/v1/portfolio/history?days=${days}`, undefined, token).then((r) => r.snapshots),
  });
}

export const shortId = (id: string) => id.slice(-6).toUpperCase();
export const when = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
export const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
