import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ChainMarks } from '../assets/ChainMarks';
import { FilterMenu } from '../assets/FilterMenu';
import { FILTERS, MORE, NO_SELECTION, PAGE_SIZE, byName, featuredFirst, matches, optionLabel, options, type Selection } from '../assets/filters';
import type { Asset } from '../assets/types';
import { useAssets } from '../assets/useAssets';
import { isStockToken } from '../chains/robinhood/prices';
import { QuoteDialog } from '../chains/robinhood/QuoteDialog';
import { TradeDialog } from '../chains/stellar/TradeDialog';
import { useTradeAssets, type TradeAsset } from '../chains/stellar/trade';
import { MONO, SANS, eyebrow, visuallyHidden } from '../layout/styles';
import { setSearch, useSearch } from '../lib/search';
import { notYet } from '../lib/toast';

const th: CSSProperties = { ...eyebrow, padding: '0 16px', height: '44px', textAlign: 'left', whiteSpace: 'nowrap' };
const td: CSSProperties = { padding: '0 16px', height: '64px', borderTop: '1px solid var(--hairline)', verticalAlign: 'middle' };
const figure: CSSProperties = { ...td, fontFamily: MONO, fontSize: '14px', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' };
const tickerStyle: CSSProperties = { fontFamily: MONO, fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--ink)', background: 'var(--surface-2)', border: '1px solid var(--hairline)', borderRadius: '2px', padding: '6px 8px', minWidth: '52px', textAlign: 'center', whiteSpace: 'nowrap' };
const fmtYield = (y: number | null) => (y == null ? '—' : y.toFixed(2) + '%');

export default function Assets() {
  return <AssetsScreen source={useAssets()} />;
}

// The same screen over another list. The sandbox account (src/chains/canton/) uses it for its test
// instruments: `chain` opens the list with that chain already chosen in the Chain filter, and
// `onAction` is what a row's Actions button does.
export interface Variant { chain: string; lead: string; onAction: (a: Asset) => void }

export function AssetsScreen({ source, variant }: { source: ReturnType<typeof useAssets>; variant?: Variant }) {
  const { loading, failed, assets, chains, featured, price } = source;
  const q = useSearch().trim();
  const [sel, setSel] = useState<Selection>(() => (variant ? { ...NO_SELECTION, chain: [variant.chain] } : NO_SELECTION));
  const [shown, setShown] = useState(PAGE_SIZE);
  const [quoting, setQuoting] = useState<Asset | null>(null);
  // A Stellar asset the API trades on the wallet's network, found by its id (code and issuer), never
  // by its ticker. On the test network the tradable assets are test funds, which this list does not show.
  const market = useTradeAssets().data;
  const [trading, setTrading] = useState<TradeAsset | null>(null);
  const onStellar = (a: Asset) => {
    const id = a.source === 'stellar:list-assets' ? a.id : a.stellar?.id;
    return typeof id === 'string' ? market?.assets.find((x) => x.id === id && x.tradable) : undefined;
  };
  const act = (a: Asset) => {
    if (variant) return variant.onAction(a);
    if (isStockToken(a)) return setQuoting(a);
    const s = onStellar(a);
    return s ? setTrading(s) : notYet();
  };

  const filtering = !!q || FILTERS.some((f) => sel[f.id].length > 0);
  useEffect(() => setShown(PAGE_SIZE), [q, sel]); // a new search or filter starts from the first rows

  // With no filter and no search the list opens on each issuer's flagship assets; otherwise it is A to Z.
  const list = useMemo(
    () => (filtering ? assets.filter((a) => matches(a, sel, q, chains)).sort(byName) : featuredFirst(assets, featured)),
    [assets, chains, featured, filtering, q, sel],
  );
  const issuers = useMemo(() => [...new Set(list.map((a) => a.issuer))], [list]);

  const toggle = (id: string, single: boolean | undefined, value: string) => setSel((s) => {
    const has = s[id].includes(value);
    return { ...s, [id]: single ? (has ? [] : [value]) : has ? s[id].filter((v) => v !== value) : [...s[id], value] };
  });
  const clear = () => { setSel(NO_SELECTION); setSearch(''); };

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={eyebrow}>Assets</div>
        <h1 style={{ margin: 0, fontSize: '36px', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.025em', color: 'var(--ink)' }}>Tokenized assets</h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: 'var(--ink-muted)', maxWidth: '640px' }}>{variant ? variant.lead : 'Every asset on the layer, in one list. Filter by issuer, chain, asset class and yield.'}</p>
      </div>

      <div role="group" aria-label="Filters" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        {FILTERS.map((f) => (
          <FilterMenu key={f.id} filter={f} options={options(f, assets, chains)} selected={sel[f.id]}
            label={(v) => optionLabel(f, v, chains)} onToggle={(v) => toggle(f.id, f.single, v)} />
        ))}
        {filtering && (
          <a href="/" onClick={(e) => { e.preventDefault(); clear(); }} style={{ fontSize: '14px', textUnderlineOffset: '3px', padding: '0 6px', minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>Clear all</a>
        )}
      </div>

      <section aria-label="Results" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <span aria-live="polite" style={{ fontSize: '15px', color: 'var(--ink)' }}>
            {failed ? <strong style={{ fontWeight: 500 }}>The asset list could not be loaded.</strong>
              : loading ? <strong style={{ fontWeight: 500 }}>Loading assets</strong>
              : (
                <>
                  <strong style={{ fontWeight: 500 }}>{list.length === 1 ? '1 asset' : list.length + ' assets'}</strong>
                  {issuers.length > 0 && <span style={{ color: 'var(--ink-muted)' }}> from {issuers.length === 1 ? issuers[0] : issuers.length + ' issuers'}</span>}
                </>
              )}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: '12px', letterSpacing: '0.02em', color: 'var(--ink-muted)' }}>{filtering ? 'Sort: Name A–Z' : 'Sort: Featured'}</span>
        </div>
        <div style={{ overflowX: 'auto', background: 'var(--surface-1)', border: '1px solid var(--hairline)', borderRadius: '2px' }}>
          <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th scope="col" style={th}>Asset</th>
                <th scope="col" style={th}>Class</th>
                <th scope="col" style={{ ...th, textAlign: 'right' }}>Price</th>
                <th scope="col" style={{ ...th, textAlign: 'center' }}>30d yield</th>
                <th scope="col" style={th}>Chains</th>
                <th scope="col" style={{ ...th, textAlign: 'right' }}><span style={visuallyHidden}>Action</span></th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, shown).map((a) => {
                const p = price(a);
                return (
                  <tr key={a.issuer + '|' + a.ticker + '|' + (a.contract ?? '')}>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={tickerStyle}>{a.ticker}</span>
                        <span style={{ fontSize: '15px', color: 'var(--ink)' }}>{a.name}</span>
                      </div>
                    </td>
                    <td style={{ ...td, fontSize: '14px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>{a.class}</td>
                    <td style={{ ...figure, textAlign: 'right', whiteSpace: 'nowrap' }} title={p?.title}>{p ? p.text : '—'}</td>
                    <td style={{ ...figure, textAlign: 'center' }}>{fmtYield(a.yield30d)}</td>
                    <td style={{ ...td, fontFamily: MONO, fontSize: '12px', letterSpacing: '0.02em', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                      <ChainMarks ids={a.chains || []} chains={chains} />
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {/* A Stock Token has a live quote behind its button, and a Stellar asset the API trades has its trade; nothing else does yet. */}
                      <button className="btn btn-ghost" type="button" onClick={() => act(a)}
                        style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 500, color: 'var(--ink)', background: 'transparent', border: '1px solid var(--hairline)', borderRadius: '2px', minHeight: '44px', padding: '0 16px', cursor: 'pointer' }}>Actions</button>
                    </td>
                  </tr>
                );
              })}
              {!loading && !failed && !list.length && (
                <tr>
                  <td colSpan={6} style={{ padding: '0 16px', height: '96px', textAlign: 'center', fontSize: '15px', color: 'var(--ink-muted)' }}>
                    {assets.length ? 'No assets match these filters.' : 'No assets listed yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {list.length > shown && (
            <div style={{ borderTop: '1px solid var(--hairline)', display: 'flex', justifyContent: 'center', padding: '8px' }}>
              <button className="btn btn-quiet" type="button" onClick={() => setShown(shown + MORE)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minHeight: '44px', padding: '0 16px', background: 'transparent', color: 'var(--ink)', border: 0, borderRadius: '2px', fontFamily: SANS, fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                Show more
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: 'var(--ink)' }} strokeWidth="1.5" fill="none" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
      {quoting && <QuoteDialog asset={quoting} onClose={() => setQuoting(null)} />}
      {trading && <TradeDialog asset={trading} onClose={() => setTrading(null)} />}
    </main>
  );
}
