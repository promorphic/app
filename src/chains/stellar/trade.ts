// Trading on Stellar from the Promorphic wallet: the assets that can be traded, a quote, the wallet's
// Stellar account, and the two things the person signs (activating the account, and each trade).
// The API prepares every transaction and checks it; the wallet signs it (src/wallet/). An asset is
// always named by its id, CODE:ISSUER, never by its ticker. Contract: backend/api/README.md,
// "Stellar trading".
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToken } from '../../lib/account';
import { getApi } from '../../lib/api';
import { WALLET_KEY, type SigningRequest } from '../../wallet/api';

export type Side = 'buy' | 'sell';
export interface Cash { code: string; issuer: string; id: string }
export interface TradeAsset {
  id: string; symbol: string; name: string; issuer: string; code: string; issuerAccount: string; access: string;
  flags: { required: boolean; revocable: boolean; clawback: boolean }; nav: number | null; tradable: boolean;
}
export interface TradeAssets { network: 'testnet' | 'mainnet'; cash: Cash | null; sponsored: boolean; priceBandPct: number; assets: TradeAsset[] }

export interface Check { id: string; ok: boolean; detail: string }
export interface Quote {
  sell: { symbol: string; amount: string }; buy: { symbol: string; expected: string; min: string };
  pricePerToken: string; nav: number | null; slippageBps: number; venue: string; route: string;
}
// `quote` is absent when no path was found; the failed checks then say why.
export interface QuoteResult { tradable: boolean; firm: boolean; checks: Check[]; quote?: Quote | null; at: string }

export interface Holding { id: string; symbol: string; name: string; issuer: string; balance: string; approvedByIssuer: boolean; reservePaidBy: string; nav: number | null }
export interface TradeAccount {
  network: 'testnet' | 'mainnet'; address: string; explorer: string; active: boolean; exists: boolean; xlm: string;
  cashBalance: string; cash: Cash; sponsored: boolean; faucet: boolean; holdings: Holding[];
}
export interface Placed { order: { id: string; status: string }; request: SigningRequest; checks: Check[]; quote: Quote }

const ASSETS = ['stellar', 'trade', 'assets'];
// Under the wallet's key, so it is read again whenever something the wallet signed settles.
const ACCOUNT = [...WALLET_KEY, 'stellar-trade'];

// What can be traded on the wallet's network, and in which cash asset. Public, and null where the
// API has no Stellar trading (an older API, or a network it is not set up on).
export function useTradeAssets() {
  return useQuery({
    queryKey: ASSETS, staleTime: 5 * 60_000, retry: false,
    queryFn: () => getApi<TradeAssets>('/v1/stellar/trade/assets').then((d) => (d.cash ? d : null), () => null),
  });
}

// The wallet's Stellar account. `enabled` is false until the account has a Promorphic wallet.
export function useTradeAccount(enabled: boolean) {
  const token = useToken();
  return useQuery({
    queryKey: [...ACCOUNT, token], enabled: !!token && enabled, staleTime: 15_000, retry: false,
    queryFn: () => getApi<TradeAccount>('/v1/stellar/trade/account', undefined, token),
  });
}

// A quote is asked for only when the person presses the button: the API allows 30 a minute.
// `amount` is what is spent: the cash asset on a buy, the asset itself on a sell.
export const getQuote = (v: { side: Side; asset: string; amount: string }, token?: string) =>
  getApi<QuoteResult>(`/v1/stellar/trade/quote?side=${v.side}&asset=${encodeURIComponent(v.asset)}&amount=${encodeURIComponent(v.amount)}`, undefined, token);

// Each of these answers with a request to sign; nothing moves until it is signed. Activating answers
// {active: true} instead when there is nothing left to do.
export const prepareActivation = (token: string) =>
  getApi<{ active?: boolean; request?: SigningRequest }>('/v1/stellar/trade/activate', {}, token);
export const prepareOrder = (token: string, body: { side: Side; asset: string; amount: string }) =>
  getApi<Placed>('/v1/stellar/trade/orders', body, token);

// Testnet only: test dollars from Promorphic, to trade with.
export function useFaucet() {
  const token = useToken(), client = useQueryClient();
  return useMutation({
    mutationFn: () => getApi<{ funded: boolean; amount: string; symbol: string }>('/v1/stellar/trade/faucet', {}, token),
    onSuccess: () => client.invalidateQueries({ queryKey: ACCOUNT }),
  });
}

// An amount as Stellar gives it (up to seven decimal places), grouped and without trailing zeros.
export const units = (v: string | number, max = 7) => Number(v).toLocaleString('en-US', { maximumFractionDigits: max });
export const explorerTx = (network: string | undefined, hash: string) => `https://stellar.expert/explorer/${network === 'mainnet' ? 'public' : 'testnet'}/tx/${hash}`;
