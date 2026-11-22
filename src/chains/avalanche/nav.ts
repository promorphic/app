// Avalanche C-Chain on the Assets list: net asset value per token for the funds that publish one.
//
// Read straight from the browser, with no key: the public C-Chain RPC for the on-chain feeds (RedStone,
// Chainlink and issuer oracles named in data/assets.json), and Centrifuge's API for its funds. Both allow
// any origin. If neither answers, the list shows the value in the snapshot.
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { postJSON } from '../../lib/api';
import type { Asset, ChainBlock, Price } from '../../assets/types';

const RPC = 'https://api.avax.network/ext/bc/C/rpc';
const CENTRIFUGE = 'https://api.centrifuge.io/';
const LATEST_ROUND_DATA = '0xfeaf968c';

export type LiveNav = Record<string, { nav: number; at: number }>; // by contract address, lower case

// An asset's Avalanche identity: the row itself when Avalanche is its only chain, else its "avalanche" block.
const onChain = (a: Asset): ChainBlock | null => (a.source === 'avalanche:list-assets' ? a : a.avalanche || null);
const key = (c: ChainBlock) => String(c.contract).toLowerCase();

// One batched call for every feed. A feed answers latestRoundData(): the value is the second word, the time the fourth.
async function loadFeeds(assets: ChainBlock[]): Promise<LiveNav> {
  const live: LiveNav = {};
  const fed = assets.filter((c) => c.navFeed && c.navFeed.address);
  if (!fed.length) return live;
  const out = await postJSON<{ id: number; result?: string }[]>(RPC, fed.map((c, i) => (
    { jsonrpc: '2.0', id: i, method: 'eth_call', params: [{ to: c.navFeed!.address, data: LATEST_ROUND_DATA }, 'latest'] }
  )));
  (Array.isArray(out) ? out : []).forEach((r) => {
    const c = fed[r.id], hex = r.result ? r.result.slice(2) : '';
    if (!c || hex.length < 320) return;
    const value = parseInt(hex.slice(64, 128), 16) / Math.pow(10, c.navFeed!.decimals);
    if (value > 0) live[key(c)] = { nav: value, at: parseInt(hex.slice(192, 256), 16) * 1000 };
  });
  return live;
}

// Centrifuge publishes each fund's price per token through its API. Avalanche is network 5 there.
async function loadCentrifuge(assets: ChainBlock[]): Promise<LiveNav> {
  const live: LiveNav = {};
  const ours = new Set(assets.filter((c) => /centrifuge/i.test(c.navSource || '')).map(key));
  if (!ours.size) return live;
  const d = await postJSON<{ data?: { tokenInstances?: { items?: { address: string; tokenPrice: string }[] } } }>(
    CENTRIFUGE, { query: '{ tokenInstances(where:{centrifugeId:"5"}, limit:100){ items { address tokenPrice } } }' });
  (d?.data?.tokenInstances?.items ?? []).forEach((t) => {
    const k = String(t.address).toLowerCase(), value = Number(t.tokenPrice) / 1e18;
    if (ours.has(k) && value > 0) live[k] = { nav: value, at: Date.now() };
  });
  return live;
}

// The two sources are read apart: each shows as soon as it answers, and when a refresh of one fails
// its rows keep the last value read rather than falling back to the snapshot.
export function useAvalancheNav(assets: Asset[]): LiveNav | undefined {
  const blocks = useMemo(() => assets.map(onChain).filter((c): c is ChainBlock => !!c && !!c.contract), [assets]);
  const contracts = useMemo(() => blocks.map(key).sort().join(','), [blocks]);
  const every5 = { enabled: blocks.length > 0, placeholderData: keepPreviousData, staleTime: 5 * 60_000, refetchInterval: 5 * 60_000 }; // the feeds move once a day; gold moves through the day
  const feeds = useQuery({ queryKey: ['avalanche', 'feeds', contracts], queryFn: () => loadFeeds(blocks), ...every5 }).data;
  const centrifuge = useQuery({ queryKey: ['avalanche', 'centrifuge', contracts], queryFn: () => loadCentrifuge(blocks), ...every5 }).data;
  return useMemo(() => (feeds || centrifuge ? { ...feeds, ...centrifuge } : undefined), [feeds, centrifuge]);
}

export function avalanchePrice(a: Asset, live: LiveNav | undefined): Price | null {
  const c = onChain(a);
  if (!c || !c.contract) return null;
  const now = live?.[key(c)], nav = now ? now.nav : c.nav, at = now ? now.at : c.navUpdated;
  if (!nav) return null;
  const dp = nav >= 100 ? 2 : 4;
  const when = at ? ', ' + new Date(at).toLocaleDateString() : '';
  return {
    text: '$' + Number(nav).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }),
    title: c.navKind === 'reference'
      ? 'Reference price, not a quote. ' + c.navSource + when
      : 'Net asset value per token on Avalanche, from ' + c.navSource + when + '. Not a quote.',
  };
}
