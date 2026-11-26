// The sandbox account on Canton: one shared sign-in whose screens show test assets and nothing real.
// Every figure here is read from a Canton ledger through the API (/v1/test/*), and every action is
// a real transaction on it; the instruments have no value. The API refuses this account everything
// else, so these hooks are all its screens use.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../auth/session';
import type { Asset, ChainInfo, Price } from '../../assets/types';
import { getApi } from '../../lib/api';

export interface TestAsset extends Asset { price: number; permitted: boolean }
export interface TestAssets { asOf: string; network: string; cash: string; chains: Record<string, ChainInfo>; assets: TestAsset[] }

export interface TestHolding { instrument: string; name: string; class: string; available: number; locked: number; price: number; value: number }
export interface TestMandate {
  contractId: string; mandateId: string; label: string; paused: boolean;
  instruments: string[]; cash: string; maxPerTrade: number; maxPerDay: number; priceBandBps: number; maxPriceAgeHours: number;
  usedToday: number; dayStart: string; agent: string; venue: string; oracle: string;
}
export interface TestAsk { ask: string; expect: 'settles' | 'refused'; why: string }
export interface TestAccount {
  asOf: string; network: string; cash: string;
  party: { id: string; fingerprint: string; external: boolean };
  parties: { venue: string; agent: string; oracle: string; registry: string; maker: string };
  holdings: TestHolding[]; totalValue: number;
  mandate: TestMandate | null;
  preset: { mandateId: string; label: string; limits: { instruments: string[]; maxPerTrade: number; maxPerDay: number; priceBandBps: number; maxPriceAgeHours: number } };
  asks: TestAsk[];
}
export interface Step { step: 'proposed' | 'allocated' | 'refused' | 'withdrawn' | 'settled'; by: 'venue' | 'agent'; for?: 'owner' | 'maker'; updateId?: string | null; reason?: string }
export interface AskResult {
  ask: string; outcome: 'settled' | 'refused'; reason?: string; refusedBy?: 'contract' | 'ledger' | 'no_mandate' | null;
  settlementId?: string; side?: 'buy' | 'sell'; instrument?: string; units?: number; price?: number; cash?: number; updateId?: string;
  steps: Step[]; account: TestAccount;
}
export type MandateAction = 'create' | 'pause' | 'resume' | 'revoke';

// Whether the signed-in account is the sandbox account, and its token.
export function useTest() {
  const session = useSession();
  return { test: !!session?.user.test, token: session?.token };
}

const KEY = ['canton-test'];
export function useTestAssets() {
  const { test, token } = useTest();
  return useQuery({ queryKey: [...KEY, 'assets', token], enabled: test, staleTime: 5 * 60_000, queryFn: () => getApi<TestAssets>('/v1/test/assets', undefined, token) });
}
export function useTestAccount() {
  const { test, token } = useTest();
  return useQuery({ queryKey: [...KEY, 'account', token], enabled: test, staleTime: 15_000, refetchInterval: 60_000, queryFn: () => getApi<TestAccount>('/v1/test/account', undefined, token) });
}

// Each write answers with the account as it now stands, so the screens update without asking again.
function useWrite<In, Out extends { account: TestAccount }>(path: string, body: (input: In) => unknown) {
  const { token } = useTest(), client = useQueryClient();
  return useMutation({
    mutationFn: (input: In) => getApi<Out>(path, body(input), token),
    onSuccess: (out) => {
      client.setQueryData([...KEY, 'account', token], out.account);
      client.invalidateQueries({ queryKey: ['account'] }); // its orders and activity
    },
  });
}
export const useMandateAction = () => useWrite<MandateAction, { done: MandateAction; updateId: string; account: TestAccount }>('/v1/test/mandate', (action) => ({ action }));
export const useAsk = () => useWrite<string, AskResult>('/v1/test/agent', (ask) => ({ ask }));
export const useReset = () => useWrite<void, { reset: true; updateId: string; account: TestAccount }>('/v1/test/reset', () => ({}));

export const amount = (n: number, max = 4) => n.toLocaleString('en-US', { maximumFractionDigits: max });
export const shortParty = (id: string) => { const [hint, key = ''] = id.split('::'); return `${hint}::${key.slice(0, 8)}…${key.slice(-4)}`; };
export const shortUpdate = (id: string) => `${id.slice(0, 10)}…${id.slice(-6)}`;
// What the Assets list shows in its Price column for a test instrument.
export const testPrice = (a: Asset, cash: string): Price | null =>
  a.kind !== 'test' || typeof a.price !== 'number' ? null
    : a.chains.includes('canton') ? { text: `${amount(a.price)} ${cash}`, title: 'A fixed test price, signed on the ledger by the price provider. Not a market price.' }
    : { text: `${amount(a.price)} ${a.settles?.[0] ?? ''}`.trim(), title: 'A fixed test price for a listing on another chain. Not a market price.' };
