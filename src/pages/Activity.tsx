import { Link } from 'react-router';
import { Segmented } from '../components/Segmented';
import { useState } from 'react';

export default function Activity() {
  const [actor, setActor] = useState('Everyone');
  const shows = (...actors: string[]) => actor === 'Everyone' || actors.includes(actor);
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Activity</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.025em", color: "var(--ink)" }}>Activity</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>A record of everything on this account: what you did, what your agent did, and what settled.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Export</button>
        </div>
      </div>
      <div role="group" aria-label="Filters" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
        <Segmented label="Actor" options={["Everyone", "You", "Agent", "System"]} value={actor} onChange={setActor} />
        <button className="btn btn-filter" data-soon="" type="button" aria-haspopup="listbox" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 14px", background: "var(--surface-1)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "2px", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          {"Type"}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: "var(--ink)" }} strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button className="btn btn-filter" data-soon="" type="button" aria-haspopup="listbox" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 14px", background: "var(--surface-1)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "2px", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          {"Asset"}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: "var(--ink)" }} strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button className="btn btn-filter" data-soon="" type="button" aria-haspopup="listbox" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 14px", background: "var(--surface-1)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "2px", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          {"Date: last 7 days"}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: "var(--ink)" }} strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>
      <section aria-label="Activity" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ marginTop: "-1px" }}>
          <div style={{ padding: "12px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent", "You")}>
            <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Fri 20 Nov 2026</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>12:41</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Proposed PM-1042: buy $25,000.00 of WTSYX on Base. Passed all 3 mandate checks.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1042</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>09:15</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Placed PM-1041: sell $10,000.00 of SPXUX on Ethereum.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1041</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>09:02</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Signed in with Google.</span>
          </div>
          <div style={{ padding: "12px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent", "System", "You")}>
            <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Thu 19 Nov 2026</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("System")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>16:05</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink-muted)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>System</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>PM-1038 settled: $50,000.00 of WTGXX on Ethereum.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1038</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>11:30</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Approved PM-1038, proposed by your agent.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1038</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>11:22</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Proposed PM-1038: buy $50,000.00 of WTGXX on Ethereum. Passed all 3 mandate checks.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1038</Link>
          </div>
          <div style={{ padding: "12px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--hairline)" }} hidden={!shows("System", "You")}>
            <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Wed 18 Nov 2026</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("System")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>16:10</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink-muted)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>System</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>PM-1035 settled: $100,000.00 of FLTTX on Arbitrum.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1035</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>10:05</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Placed PM-1035: buy $100,000.00 of FLTTX on Arbitrum.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1035</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>09:40</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Changed mandate Treasury reserve: max per order raised from $25,000.00 to $50,000.00.</span>
            <Link to="/mandates/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>Mandate</Link>
          </div>
          <div style={{ padding: "12px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent", "You")}>
            <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Tue 17 Nov 2026</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>15:02</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Saved to memory: keep private credit under 5% of the portfolio.</span>
            <Link to="/agent/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>Memory</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("You")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>15:01</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Declined PM-1031, proposed by your agent.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1031</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", minHeight: "56px", padding: "8px 24px", borderTop: "1px solid var(--hairline)" }} hidden={!shows("Agent")}>
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "48px" }}>14:30</span>
            <span style={{ width: "76px" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
            </span>
            <span style={{ flex: "1 1 320px", fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Proposed PM-1031: buy $25,000.00 of CRDYX on Avalanche.</span>
            <Link to="/orders/" style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", whiteSpace: "nowrap", textUnderlineOffset: "3px" }}>PM-1031</Link>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--hairline)", display: "flex", justifyContent: "center", padding: "8px" }}>
          <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", borderColor: "transparent" }}>Show more</button>
        </div>
      </section>
    </main>
  );
}
