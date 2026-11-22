import { WalletDialog } from '../chains/robinhood/WalletDialog';
import { WalletCard } from '../chains/robinhood/WalletCard';
import { useState } from 'react';
export default function Wallets() {
  const [editing, setEditing] = useState(false);
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Wallets</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.025em", color: "var(--ink)" }}>Wallets</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>Your assets stay in your own wallets. Promorphic never holds your assets or your keys.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-ghost" onClick={() => setEditing(true)} type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Connect wallet</button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>4</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Wallets connected</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>$650,000.00</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Held across 4 chains</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>You sign</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Your agent prepares each order. Nothing moves until you sign it.</div>
        </div>
      </div>
      <WalletCard onEdit={() => setEditing(true)} />
      <section aria-label="Wallets" style={{ minWidth: "0" }}>
        <div style={{ overflowX: "auto", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px" }}>
          <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Wallet</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Chain</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Address</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Allowlisted with</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Agent access</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>Value</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>
                  <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)" }}>Treasury main</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>0x7a3F…c41B</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", whiteSpace: "nowrap" }}>WisdomTree</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Prepares orders, you sign</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$375,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)" }}>Treasury Base</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Base</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>0x7a3F…c41B</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", whiteSpace: "nowrap" }}>WisdomTree</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Prepares orders, you sign</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$150,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)" }}>Treasury Arbitrum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Arbitrum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>0x7a3F…c41B</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", whiteSpace: "nowrap" }}>WisdomTree</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Prepares orders, you sign</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$100,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)" }}>Credit sleeve</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Avalanche</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>0x52D9…08Ae</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", whiteSpace: "nowrap" }}>WisdomTree</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Prepares orders, you sign</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$25,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      {editing && <WalletDialog onClose={() => setEditing(false)} />}
    </main>
  );
}
