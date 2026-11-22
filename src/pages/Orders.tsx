import { Segmented } from '../components/Segmented';
import { useState } from 'react';
export default function Orders() {
  const [status, setStatus] = useState('All');
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Orders</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.025em", color: "var(--ink)" }}>Orders</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>Orders you placed and orders your agent proposed. In Copilot, nothing is submitted until you approve it.</p>
        </div>
      </div>
      <div role="group" aria-label="Filters" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
        <Segmented label="Status" options={[{ value: "All", label: "All 9" }, { value: "Open", label: "Open 2" }, { value: "Settled", label: "Settled 6" }, { value: "Declined", label: "Declined 1" }]} value={status} onChange={setStatus} />
        <button className="btn btn-filter" data-soon="" type="button" aria-haspopup="listbox" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 14px", background: "var(--surface-1)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "2px", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          {"Placed by"}
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
          {"Chain"}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: "var(--ink)" }} strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        <button className="btn btn-filter" data-soon="" type="button" aria-haspopup="listbox" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 14px", background: "var(--surface-1)", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "2px", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          {"Date"}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2.5 4.5l3.5 3.5 3.5-3.5" style={{ stroke: "var(--ink)" }} strokeWidth="1.5" fill="none" />
          </svg>
        </button>
      </div>
      <section aria-label="Orders" style={{ minWidth: "0" }}>
        <div style={{ overflowX: "auto", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px" }}>
          <table style={{ width: "100%", minWidth: "1080px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Order</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Placed</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Side</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Asset</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>Amount</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Settles in</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Chain</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Placed by</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Status</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>
                  <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr hidden={status !== "All" && status !== "Open"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1042</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>20 Nov 2026, 12:41</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTSYX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$25,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USDC</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Base</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink)", fontWeight: "500" }}>
                    <span aria-hidden="true" style={{ display: "block", width: "8px", height: "8px", background: "var(--ink)" }} />Awaiting your approval</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-solid" data-go="/orders/" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--surface-0)", background: "var(--ink)", border: "1px solid var(--ink)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Review</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Open"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1041</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>20 Nov 2026, 09:15</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Sell</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>SPXUX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$10,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USD</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink)" }}>
                    <span aria-hidden="true" style={{ display: "block", width: "6px", height: "6px", border: "1px solid var(--ink)" }} />Submitted</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1038</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>19 Nov 2026, 11:22</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTGXX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$50,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USDC</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1035</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>18 Nov 2026, 10:05</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>FLTTX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$100,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USD</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Arbitrum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Declined"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1031</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>17 Nov 2026, 14:30</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>CRDYX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$25,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USDC</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Avalanche</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Agent</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Declined</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1029</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>16 Nov 2026, 11:48</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>SPXUX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$75,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USD</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1026</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>13 Nov 2026, 15:10</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>CRDYX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$25,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USDC</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Avalanche</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1024</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>12 Nov 2026, 10:20</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTGXX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$200,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USD</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr hidden={status !== "All" && status !== "Settled"}>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>PM-1021</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>11 Nov 2026, 16:02</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)" }}>Buy</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTSYX</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$150,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>USD</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Base</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>You</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", whiteSpace: "nowrap", color: "var(--ink-muted)" }}>Settled</span>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
