// One row of the Assets list. data/assets.json holds the snapshot; each chain's lister adds its own fields.
export interface ChainBlock {
  contract?: string;
  nav?: number;
  navUpdated?: string | number;
  navKind?: string;
  navSource?: string;
  navFeed?: { address: string; decimals: number };
  [field: string]: unknown;
}

export interface Asset extends ChainBlock {
  ticker: string;
  name: string;
  issuer: string;
  class: string;
  yield30d: number | null;
  chains: string[];
  settles?: string[];
  access?: string;
  kind?: string;
  source?: string;
  supply?: number;
  multiplier?: number | string;
  stellar?: ChainBlock;
  avalanche?: ChainBlock;
}

export interface ChainInfo { code?: string; name?: string; logo?: string }

export interface Snapshot {
  chains: Record<string, ChainInfo>;
  assets: Asset[];
  featured: Record<string, string[]>;
}

// What the Price column shows for a row, and what its tooltip says about where the figure is from.
export interface Price { text: string; title: string }
