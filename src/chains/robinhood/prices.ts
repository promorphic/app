// Robinhood Chain on the Assets list: the live Stock Token list and its indicative prices.
import { useQuery } from '@tanstack/react-query';
import { getApi } from '../../lib/api';
import type { Asset, Price } from '../../assets/types';

interface LiveToken { symbol: string; name: string; active?: boolean; contract?: string; multiplier?: number | string }
interface Quote { symbol: string; tokenMid?: number | string; tokenBid?: number | string; tokenAsk?: number | string; halted?: boolean; at?: string }
export type StockPrices = Record<string, Quote>;

export const isStockToken = (a: Asset) => a.kind === 'Stock Token';

export function useRobinhood() {
  const tokens = useQuery({
    queryKey: ['robinhood', 'assets'],
    queryFn: () => getApi<{ assets?: LiveToken[] }>('/v1/robinhood/assets').then((d) => (d.assets ?? []).filter((x) => x.active)),
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
  const prices = useQuery({
    queryKey: ['robinhood', 'prices'],
    queryFn: () => getApi<{ quotes?: Quote[] }>('/v1/robinhood/prices').then((d) => Object.fromEntries((d.quotes ?? []).map((q) => [q.symbol, q])) as StockPrices),
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
  return { live: tokens.data, prices: prices.data };
}

// The live registry replaces the snapshot's Stock Tokens; an asset's class is kept from the snapshot.
export function mergeRobinhood(all: Asset[], live: LiveToken[] | undefined): Asset[] {
  if (!live || live.length < 50) return all;
  const known: Record<string, Asset> = {};
  all.forEach((a) => { if (isStockToken(a)) known[a.ticker] = a; });
  const tokens = live.map((x): Asset => {
    const old: Partial<Asset> = known[x.symbol] ?? {};
    return {
      ticker: x.symbol, name: x.name, issuer: old.issuer || 'Robinhood', class: old.class || 'Equities', yield30d: null,
      chains: ['robinhood'], settles: old.settles || ['USDG'], access: old.access || 'Retail, non-US',
      kind: 'Stock Token', contract: x.contract, multiplier: x.multiplier,
    };
  });
  return [...all.filter((a) => !isStockToken(a)), ...tokens];
}

export function robinhoodPrice(a: Asset, prices: StockPrices | undefined): Price | null {
  const q = isStockToken(a) && prices ? prices[a.ticker] : undefined;
  if (!q || !q.tokenMid) return null;
  if (q.halted) return { text: 'Halted', title: 'Trading is halted.' };
  return {
    text: '$' + Number(q.tokenMid).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    title: 'Indicative. Bid ' + Number(q.tokenBid).toFixed(2) + ', ask ' + Number(q.tokenAsk).toFixed(2) + ' per token, ' + new Date(q.at ?? Date.now()).toLocaleTimeString(),
  };
}
