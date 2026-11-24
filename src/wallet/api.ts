// The Promorphic wallet: one self-custody wallet per account, with its own address on each chain.
// Keys are held in Turnkey and only the person can sign; the API creates the wallet, prepares each
// transaction as a signing request, and submits what was signed. Contract: backend/api/README.md,
// "Promorphic wallets".
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToken } from '../lib/account';
import { ApiError, getApi } from '../lib/api';

export type WalletChain = 'robinhood' | 'avalanche' | 'stellar' | 'canton';
export type SendChain = Exclude<WalletChain, 'canton'>;
export type Provider = 'turnkey' | 'dev' | null;

export interface WalletAccount {
  chain: WalletChain; name: string; chainId: number | null; symbol: string | null; address: string;
  publicKey: string; curve: string; path: string; explorer: string | null;
  canton?: { partyId: string | null; registered: boolean; available: boolean };
}
export interface EmbeddedWallet { provider: Provider; subOrganizationId: string; network: 'testnet' | 'mainnet'; createdAt: string; accounts: WalletAccount[] }
export interface WalletState { wallet: EmbeddedWallet | null; provider: Provider; network: 'testnet' | 'mainnet' }

export interface Balance {
  chain: WalletChain; name: string; address: string; symbol: string | null; balance?: string;
  funded?: boolean; registered?: boolean; partyId?: string; contracts?: number; error?: string;
}

export type RequestStatus = 'awaiting_signature' | 'submitting' | 'submitted' | 'confirmed' | 'failed' | 'expired' | 'cancelled';
export interface SignParams { activityType: string; organizationId: string; signWith: string; payload: string; encoding: string; hashFunction: string }
export interface SigningRequest {
  id: string; chain: WalletChain; kind: 'transfer' | 'canton_register' | 'canton_command'; status: RequestStatus; summary: string;
  details: Record<string, string | number | boolean | null> | null; createdAt: string; expiresAt: string; updatedAt: string | null;
  sign: SignParams | null;
  result: { txHash?: string; explorer?: string; block?: number; ledger?: number; partyId?: string; updateId?: string } | null;
  error: string | null;
}
const WALLET = ['account', 'embedded-wallet'];

// The wallet, or null. `available` is false where the API has no Promorphic wallets at all
// (an API without them answers 404) or they are switched off and this account has none.
export function useEmbeddedWallet() {
  const token = useToken();
  const q = useQuery({
    queryKey: [...WALLET, token], enabled: !!token, staleTime: 60_000, retry: false,
    queryFn: async (): Promise<WalletState | null> => {
      try { return await getApi<WalletState>('/v1/embedded-wallet', undefined, token); } catch (e) {
        if (e instanceof ApiError && e.status === 404 && e.code === 'not_found') return null;
        throw e;
      }
    },
  });
  const state = q.data;
  return { ...q, state, available: !!state && (!!state.provider || !!state.wallet) };
}

export function useCreateWallet() {
  const token = useToken(), client = useQueryClient();
  return useMutation({
    mutationFn: () => getApi<{ wallet: EmbeddedWallet; created: boolean }>('/v1/embedded-wallet', {}, token),
    // The Robinhood address is also added to the linked wallets, so everything on the account refreshes.
    onSuccess: () => client.invalidateQueries({ queryKey: ['account'] }),
  });
}

export function useBalances(enabled: boolean) {
  const token = useToken();
  return useQuery({
    queryKey: [...WALLET, 'balances', token], enabled: !!token && enabled, staleTime: 20_000, refetchInterval: 60_000,
    queryFn: () => getApi<{ network: string; asOf: string; balances: Balance[] }>('/v1/embedded-wallet/balances', undefined, token).then((r) => r.balances),
  });
}

export function useFundStellar() {
  const token = useToken(), client = useQueryClient();
  return useMutation({
    mutationFn: () => getApi<{ funded: boolean; txHash: string | null }>('/v1/embedded-wallet/stellar/fund', {}, token),
    onSuccess: () => client.invalidateQueries({ queryKey: WALLET }),
  });
}

// Each of these returns a signing request; nothing moves until it is signed.
export const prepareTransfer = (token: string, body: { chain: SendChain; to: string; amount: string }) =>
  getApi<{ request: SigningRequest }>('/v1/embedded-wallet/transfers', body, token).then((r) => r.request);
export const prepareCantonRegistration = (token: string) =>
  getApi<{ request: SigningRequest }>('/v1/embedded-wallet/canton/register', {}, token).then((r) => r.request);

export const getRequest = (token: string, id: string) =>
  getApi<{ request: SigningRequest }>(`/v1/embedded-wallet/requests/${id}`, undefined, token).then((r) => r.request);
export const submitSignature = (token: string, id: string, sig: { r: string; s: string; v: string }) =>
  getApi<{ request: SigningRequest }>(`/v1/embedded-wallet/requests/${id}/signature`, sig, token).then((r) => r.request);
export const cancelRequest = (token: string, id: string) =>
  getApi<{ request: SigningRequest }>(`/v1/embedded-wallet/requests/${id}/cancel`, {}, token).then((r) => r.request);
// Local runs only (WALLET_PROVIDER=dev): the API signs with its dev key, standing in for Turnkey.
export const devSign = (token: string, id: string) =>
  getApi<{ request: SigningRequest }>(`/v1/embedded-wallet/requests/${id}/dev-sign`, {}, token).then((r) => r.request);

export const WALLET_KEY = WALLET;
