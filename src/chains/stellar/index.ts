// Stellar on the Assets list: the live asset registry, and a price and 30-day yield for each asset.
// Price is the issuer's net asset value where one is published, else the mid of the built-in exchange's USDC book.
import { useQuery } from '@tanstack/react-query';
import { getApi } from '../../lib/api';
import type { Asset, Price } from '../../assets/types';

interface LiveAsset {
  id: string; symbol: string; name: string; issuer: string; class: string; kind: string; active?: boolean;
  contract?: string; decimals?: number; domain?: string; controls?: unknown; fundTicker?: string;
  settles?: string[]; access?: string; logo?: string; supply?: number; holders?: number;
}
export interface Quote {
  symbol: string; price?: number; currency?: string; priceKind?: string; source?: string; navAt?: string;
  marketBid?: number; marketAsk?: number; yield30d?: number | null;
}
export type Quotes = Record<string, Quote>;

const SOURCE = 'stellar:list-assets';
const CCY: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ' };
const isOurs = (a: Asset) => a.source === SOURCE;

export function useStellar() {
  const assets = useQuery({
    queryKey: ['stellar', 'assets'],
    queryFn: () => getApi<{ assets?: LiveAsset[] }>('/v1/stellar/assets').then((d) => (d.assets ?? []).filter((x) => x.active !== false)),
    staleTime: 10 * 60_000,
    refetchInterval: 10 * 60_000,
  });
  const quotes = useQuery({
    queryKey: ['stellar', 'prices'],
    queryFn: () => getApi<{ quotes?: Quote[] }>('/v1/stellar/prices').then((d) => Object.fromEntries((d.quotes ?? []).map((q) => [q.symbol, q])) as Quotes),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
  return { live: assets.data, quotes: quotes.data };
}

// The live registry replaces the snapshot's Stellar rows. Each asset was verified by the API against its
// issuer's domain. A fund the list already has from other chains (matched by fund ticker, same issuer)
// keeps its row and gains or loses the Stellar chain; everything else is its own row.
export function mergeStellar(snapshot: Asset[], live: LiveAsset[] | undefined, quotes: Quotes | undefined): Asset[] {
  let rows = snapshot;
  if (live && live.length >= 20) {
    const old: Record<string, Asset> = {};
    snapshot.forEach((a) => { if (isOurs(a)) old[a.ticker] = a; });
    const others = snapshot.filter((a) => !isOurs(a)).map((a) => {
      if (!a.stellar) return a;
      const { stellar: _gone, ...rest } = a;
      return { ...rest, chains: a.chains.filter((c) => c !== 'stellar') } as Asset;
    });
    const hosts = new Map(others.map((a, i) => [a.issuer + '|' + a.ticker, i]));
    const added: Asset[] = [];
    const listed = new Set<string>();
    live.forEach((x) => {
      const host = x.fundTicker ? hosts.get(x.issuer + '|' + x.fundTicker) : undefined;
      if (host !== undefined) {
        const a = others[host];
        others[host] = {
          ...a,
          stellar: { id: x.id, code: x.symbol, kind: x.kind, contract: x.contract || x.id, decimals: x.decimals, domain: x.domain, controls: x.controls },
          chains: a.chains.includes('stellar') ? a.chains : [...a.chains, 'stellar'],
        };
        return;
      }
      const was: Partial<Asset> = old[x.symbol] ?? {};
      // The fund may also be on other chains (BENJI and JAAA are on Avalanche): keep those chains and their blocks.
      const elsewhere = (was.chains ?? []).filter((c) => c !== 'stellar');
      const row: Asset = {
        ticker: x.symbol, name: x.name, issuer: x.issuer, class: x.class, yield30d: was.yield30d ?? null,
        chains: ['stellar', ...elsewhere], settles: x.settles || was.settles || ['USD'], access: x.access,
        kind: x.kind === 'soroban' ? 'Soroban token' : 'Stellar asset', source: SOURCE,
        id: x.id, contract: x.contract || x.id, decimals: x.decimals, logoUrl: x.logo, domain: x.domain,
        controls: x.controls, supply: x.supply, holders: x.holders,
      };
      elsewhere.forEach((c) => { if (was[c]) row[c] = was[c]; });
      added.push(row);
      listed.add(x.symbol);
    });
    // A snapshot row the registry no longer lists goes, unless the fund is also on another chain:
    // then the row stays for that chain, without Stellar and without the Stellar token's own details.
    const kept = Object.values(old).filter((a) => !listed.has(a.ticker) && a.chains.some((c) => c !== 'stellar')).map((a) => {
      const { source: _s, kind: _k, id: _i, contract: _c, decimals: _d, domain: _m, controls: _o, logoUrl: _l, supply: _u, holders: _h, ...rest } = a;
      return { ...rest, chains: a.chains.filter((c) => c !== 'stellar') } as Asset;
    });
    rows = [...others, ...kept, ...added];
  }
  if (!quotes) return rows;
  return rows.map((a) => {
    const q = isOurs(a) ? quotes[a.ticker] : undefined;
    return q && q.yield30d != null ? { ...a, yield30d: q.yield30d } : a;
  });
}

export function stellarPrice(a: Asset, quotes: Quotes | undefined): Price | null {
  const q = isOurs(a) && quotes ? quotes[a.ticker] : undefined;
  if (!q || !q.price) return null;
  const dp = q.price < 0.01 ? 6 : 4;
  let title = q.priceKind === 'nav'
    ? 'Net asset value from ' + q.source + (q.navAt ? ', ' + new Date(q.navAt).toLocaleDateString() : '')
    : 'Indicative. Mid of the Stellar exchange order book against USDC';
  if (q.marketBid && q.marketAsk) title += '. Market bid ' + q.marketBid.toFixed(4) + ', ask ' + q.marketAsk.toFixed(4);
  return {
    text: (CCY[q.currency ?? ''] || '') + Number(q.price).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }),
    title,
  };
}
