import { LiveHoldings } from '../chains/robinhood/LiveHoldings';
export default function Portfolio() {
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Portfolio</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "300", letterSpacing: "-0.025em", color: "var(--ink)" }}>Portfolio</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>Everything you hold, across issuers and chains, in one place.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Export</button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>$650,000.00</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Total value</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>$600,000.00</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Invested, in 5 assets</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>4.13%</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>30d yield, weighted by value</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>$50,000.00</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Cash, in USDC</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "16px" }}>
        <section aria-label="Allocation" style={{ flex: "1.3 1 420px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Allocation</h2>
          <div role="img" aria-label="Allocation by asset class" style={{ display: "flex", gap: "2px" }}>
            <span style={{ display: "block", flex: "275000 1 0", height: "12px", background: "var(--ink)", opacity: "1" }} />
            <span style={{ display: "block", flex: "250000 1 0", height: "12px", background: "var(--ink)", opacity: "0.6" }} />
            <span style={{ display: "block", flex: "75000 1 0", height: "12px", background: "var(--ink)", opacity: "0.35" }} />
            <span style={{ display: "block", flex: "50000 1 0", height: "12px", background: "var(--ink)", opacity: "0.16" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "28px" }}>
              <span aria-hidden="true" style={{ display: "block", width: "10px", height: "10px", background: "var(--ink)", opacity: "1" }} />
              <span style={{ fontSize: "14px", color: "var(--ink)" }}>Fixed income</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>$275,000.00</span>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "56px", textAlign: "right" }}>42.3%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "28px" }}>
              <span aria-hidden="true" style={{ display: "block", width: "10px", height: "10px", background: "var(--ink)", opacity: "0.6" }} />
              <span style={{ fontSize: "14px", color: "var(--ink)" }}>Money market</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>$250,000.00</span>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "56px", textAlign: "right" }}>38.5%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "28px" }}>
              <span aria-hidden="true" style={{ display: "block", width: "10px", height: "10px", background: "var(--ink)", opacity: "0.35" }} />
              <span style={{ fontSize: "14px", color: "var(--ink)" }}>Equities</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>$75,000.00</span>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "56px", textAlign: "right" }}>11.5%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "28px" }}>
              <span aria-hidden="true" style={{ display: "block", width: "10px", height: "10px", background: "var(--ink)", opacity: "0.16" }} />
              <span style={{ fontSize: "14px", color: "var(--ink)" }}>Cash</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>$50,000.00</span>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: "var(--ink-muted)", width: "56px", textAlign: "right" }}>7.7%</span>
            </div>
          </div>
        </section>
        <section aria-label="Your agent" style={{ flex: "1 1 340px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px 8px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>From your agent</h2>
            <span style={{ marginLeft: "auto" }}>
              <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "var(--ink-muted)", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Copilot</span>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ borderTop: "1px solid var(--hairline)", padding: "14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>Cash is $25,000.00 above your minimum.</div>
              <div style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Proposed: buy $25,000.00 of WTSYX on Base. It passed all 3 mandate checks.</div>
              <div style={{ paddingTop: "6px" }}>
                <button className="btn btn-solid" data-go="/orders/" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--surface-0)", background: "var(--ink)", border: "1px solid var(--ink)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Review proposal</button>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--hairline)", padding: "14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>WTGXX is 38.5% of the portfolio.</div>
              <div style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Your mandate caps one asset at 50%. Nothing to do.</div>
            </div>
          </div>
        </section>
      </div>
      <LiveHoldings />
      <section aria-label="Holdings" style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Holdings</h2>
        <div style={{ overflowX: "auto", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px" }}>
          <table style={{ width: "100%", minWidth: "860px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Asset</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Class</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Chain</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>Value</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>Share</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "center" }}>30d yield</th>
                <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "right" }}>
                  <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTGXX</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>WisdomTree Treasury Money Market Digital Fund</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Money market</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$250,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>38.5%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "38.5%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>3.67%</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>WTSYX</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>WisdomTree Short-Term Treasury Digital Fund</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Fixed income</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Base</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$150,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>23.1%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "23.1%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>4.65%</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>FLTTX</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>WisdomTree Floating Rate Treasury Digital Fund</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Fixed income</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Arbitrum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$100,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>15.4%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "15.4%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>4.04%</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>SPXUX</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>WisdomTree 500 Digital Fund</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Equities</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$75,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>11.5%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "11.5%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>1.05%</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>CRDYX</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>WisdomTree Private Credit and Alternative Income Digital Fund</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Fixed income</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Avalanche</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$25,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>3.8%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "3.8%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>15.11%</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "13px", fontWeight: "500", letterSpacing: "0.02em", color: "var(--ink)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "6px 8px", minWidth: "52px", textAlign: "center" }}>USDC</span>
                    <span style={{ fontSize: "15px", color: "var(--ink)" }}>Settlement balance</span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Cash</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", whiteSpace: "nowrap" }}>Ethereum</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "right" }}>$50,000.00</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>7.7%</span>
                    <span aria-hidden="true" style={{ display: "block", width: "72px", height: "6px", background: "var(--surface-2)", borderRadius: "0" }}>
                      <span style={{ display: "block", width: "7.7%", height: "6px", background: "var(--ink)" }} />
                    </span>
                  </div>
                </td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "14px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textAlign: "center" }}>—</td>
                <td style={{ padding: "0 16px", height: "64px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", textAlign: "right" }}>
                  <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Actions</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
