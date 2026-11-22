import type { Asset, ChainInfo } from './types';

export const PAGE_SIZE = 10;
export const MORE = 10;
const PER_ISSUER = 5;

export type Chains = Record<string, ChainInfo>;
export const chainCode = (chains: Chains, id: string) => chains[id]?.code || id.toUpperCase();
export const chainName = (chains: Chains, id: string) => chains[id]?.name || id;

const YIELD = [
  { id: 'lt2', label: 'Under 2%', test: (y: number | null) => y != null && y < 2 },
  { id: '2to4', label: '2% to 4%', test: (y: number | null) => y != null && y >= 2 && y < 4 },
  { id: 'gte4', label: '4% and over', test: (y: number | null) => y != null && y >= 4 },
];

export interface Option { value: string; label: string; meta?: string }
export interface Filter {
  id: string;
  name: string;
  single?: boolean; // one choice at a time
  get?: (a: Asset) => (string | undefined)[];
}
export const FILTERS: Filter[] = [
  { id: 'issuer', name: 'Issuer', get: (a) => [a.issuer] },
  { id: 'chain', name: 'Chain', get: (a) => a.chains || [] },
  { id: 'class', name: 'Asset class', get: (a) => [a.class] },
  { id: 'yield', name: '30d yield', single: true },
  { id: 'settles', name: 'Settles in', get: (a) => a.settles || [] },
  { id: 'access', name: 'Access', get: (a) => [a.access] },
];
export type Selection = Record<string, string[]>;
export const NO_SELECTION: Selection = Object.fromEntries(FILTERS.map((f) => [f.id, []]));

export function optionLabel(f: Filter, value: string, chains: Chains) {
  if (f.single) return YIELD.find((r) => r.id === value)?.label ?? value;
  return f.id === 'chain' ? chainName(chains, value) : value;
}

// A filter offers whatever the listed assets use: a new issuer or class appears as soon as one asset has it.
export function options(f: Filter, assets: Asset[], chains: Chains): Option[] {
  if (f.single) return YIELD.map((r) => ({ value: r.id, label: r.label }));
  const seen = new Set<string>();
  assets.forEach((a) => f.get!(a).forEach((v) => { if (v) seen.add(v); }));
  return [...seen]
    .map((v) => ({ value: v, label: optionLabel(f, v, chains), meta: f.id === 'chain' ? chainCode(chains, v) : '' }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function matches(a: Asset, sel: Selection, q: string, chains: Chains) {
  for (const f of FILTERS) {
    const chosen = sel[f.id];
    if (!chosen.length) continue;
    if (f.single) {
      const rule = YIELD.find((r) => r.id === chosen[0]);
      if (rule && !rule.test(a.yield30d)) return false;
    } else if (!f.get!(a).some((v) => v !== undefined && chosen.includes(v))) {
      return false;
    }
  }
  if (q) {
    const on = a.chains || [];
    const hay = [a.ticker, a.name, a.issuer, a.class, ...on.map((c) => chainName(chains, c)), ...on.map((c) => chainCode(chains, c))].join(' ').toLowerCase();
    if (q.toLowerCase().split(/\s+/).some((w) => !hay.includes(w))) return false;
  }
  return true;
}

export const byName = (a: Asset, b: Asset) => a.name.localeCompare(b.name, 'en');

// The opening order: each issuer's flagship assets taken in turn (every issuer's first, then every
// issuer's second, five deep), so the top of the list is a spread of issuers; then everything else A to Z.
export function featuredFirst(all: Asset[], featured: Record<string, string[]>) {
  const groups: Record<string, Asset[]> = {};
  all.forEach((a) => { (groups[a.issuer] ||= []).push(a); });
  const order = Object.keys(featured);
  Object.keys(groups).sort().forEach((i) => { if (!order.includes(i)) order.push(i); });
  const picks = order.filter((i) => groups[i]).map((i) => {
    const want = featured[i], g = groups[i];
    if (want) return want.map((t) => g.find((a) => a.ticker === t)).filter((a): a is Asset => !!a).slice(0, PER_ISSUER);
    const bySupply = g.some((a) => typeof a.supply === 'number');
    return (bySupply ? [...g].sort((a, b) => (b.supply || 0) - (a.supply || 0)) : g).slice(0, PER_ISSUER);
  });
  const out: Asset[] = [];
  for (let n = 0; n < PER_ISSUER; n++) picks.forEach((p) => { if (p[n]) out.push(p[n]); });
  const seen = new Set(out);
  return [...out, ...all.filter((a) => !seen.has(a)).sort(byName)];
}
