import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { getJSON } from '../lib/api';
import { avalanchePrice, useAvalancheNav } from '../chains/avalanche/nav';
import { mergeRobinhood, robinhoodPrice, useRobinhood } from '../chains/robinhood/prices';
import { mergeStellar, stellarPrice, useStellar } from '../chains/stellar';
import type { Asset, ChainInfo, Price, Snapshot } from './types';

const NONE: Asset[] = [];

// The snapshot in /data, read once. It is what the list shows when no live source answers.
function useSnapshot() {
  return useQuery({
    queryKey: ['snapshot'],
    queryFn: async (): Promise<Snapshot> => {
      const [list, featured] = await Promise.all([
        getJSON<{ chains?: Record<string, ChainInfo>; assets?: Asset[] }>('/data/assets.json'),
        getJSON<{ issuers?: Record<string, string[]> }>('/data/featured.json').catch(() => ({ issuers: {} })),
      ]);
      return { chains: list.chains ?? {}, assets: list.assets ?? [], featured: featured.issuers ?? {} };
    },
    staleTime: Infinity,
  });
}

// The Assets list: the snapshot, with each chain's live registry laid over it, and a price for each row.
// Every chain keeps its own reading and merging in src/chains/<chain>/; this is the one place they meet.
export function useAssets() {
  const snapshot = useSnapshot();
  const stellar = useStellar();
  const robinhood = useRobinhood();

  const base = snapshot.data?.assets ?? NONE;
  const assets = useMemo(
    () => mergeRobinhood(mergeStellar(base, stellar.live, stellar.quotes), robinhood.live),
    [base, stellar.live, stellar.quotes, robinhood.live],
  );
  const nav = useAvalancheNav(assets);

  const price = useCallback(
    (a: Asset): Price | null => stellarPrice(a, stellar.quotes) ?? robinhoodPrice(a, robinhood.prices) ?? avalanchePrice(a, nav),
    [stellar.quotes, robinhood.prices, nav],
  );

  return {
    loading: snapshot.isPending,
    failed: snapshot.isError,
    chains: snapshot.data?.chains ?? {},
    featured: snapshot.data?.featured ?? {},
    assets,
    price,
  };
}
