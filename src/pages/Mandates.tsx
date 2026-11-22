export default function Mandates() {
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Mandates</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.025em", color: "var(--ink)" }}>Mandates</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>The limits your agent works inside. Every order is checked against them before it is submitted.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>New mandate</button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "16px" }}>
        <section aria-label="Treasury reserve" style={{ flex: "1.5 1 520px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Treasury reserve</h2>
            <span style={{ display: "inline-block", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.08em", textTransform: "uppercase", background: "var(--ink)", color: "var(--surface-0)", border: "1px solid var(--ink)", borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>Active</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Edit</button>
              <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Pause</button>
            </span>
          </div>
          <div style={{ overflowX: "auto", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px" }}>
            <table style={{ width: "100%", minWidth: "520px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Rule</th>
                  <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Limit</th>
                  <th scope="col" style={{ padding: "0 16px", height: "44px", fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)", whiteSpace: "nowrap", textAlign: "left" }}>Now</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Mode</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>Copilot: you approve each order</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Asset classes</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>Money market, Fixed income</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Issuers</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>WisdomTree</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Chains</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>Ethereum, Base, Arbitrum, Avalanche</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Settles in</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>USD, USDC</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>—</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Max per order</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>$50,000.00</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>$25,000.00 in the open proposal</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Max per day</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>$100,000.00</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>$25,000.00 proposed</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Max in one asset</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>50%</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>38.5% in WTGXX</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "15px", color: "var(--ink)", height: "56px" }}>Minimum cash</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink)", height: "56px" }}>$25,000.00 USDC</td>
                  <td style={{ padding: "0 16px", borderTop: "1px solid var(--hairline)", verticalAlign: "middle", fontSize: "14px", color: "var(--ink-muted)", height: "56px" }}>$50,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <section aria-label="Last check" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px 8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Last check</h2>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "var(--ink-muted)" }}>PM-1042 · buy $25,000.00 of WTSYX on Base · 20 Nov 2026, 12:41</p>
            <ol style={{ listStyle: "none", margin: "0", padding: "0" }}>
              <li style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid var(--hairline)" }}>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)", paddingTop: "2px" }}>01</span>
                <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>Allowlist</span>
                  <span style={{ fontSize: "14px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Your Base wallet is on the issuer's allowlist.</span>
                </div>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink)" }}>Passed</span>
              </li>
              <li style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid var(--hairline)" }}>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)", paddingTop: "2px" }}>02</span>
                <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>Rules</span>
                  <span style={{ fontSize: "14px", lineHeight: "1.45", color: "var(--ink-muted)" }}>The order is inside every limit in this mandate.</span>
                </div>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink)" }}>Passed</span>
              </li>
              <li style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid var(--hairline)" }}>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)", paddingTop: "2px" }}>03</span>
                <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>Window</span>
                  <span style={{ fontSize: "14px", lineHeight: "1.45", color: "var(--ink-muted)" }}>The issuer is accepting orders.</span>
                </div>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink)" }}>Passed</span>
              </li>
            </ol>
            <p style={{ margin: "0", padding: "12px 0", borderTop: "1px solid var(--hairline)", fontSize: "14px", color: "var(--ink)" }}>Result: sent to you for approval.</p>
          </section>
          <section aria-label="Changes" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Changes</h2>
            <dl style={{ margin: "0", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>18 Nov 2026</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>Max per order raised from $25,000.00 to $50,000.00</dd>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>11 Nov 2026</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>Mandate created</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
