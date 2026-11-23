import { Segmented } from '../components/Segmented';
import { useRef, useState } from 'react';
export default function Agent() {
  const [mode, setMode] = useState('Copilot');
  const [ask, setAsk] = useState('');
  const box = useRef<HTMLTextAreaElement>(null);
  const suggest = (text: string) => { setAsk(text); box.current?.focus(); };
  return (
    <main className="app-main" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "11px", fontWeight: "500", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Your agent</div>
          <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", fontWeight: "300", letterSpacing: "-0.025em", color: "var(--ink)" }}>Your agent</h1>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", color: "var(--ink-muted)", maxWidth: "640px" }}>Every account gets its own agent. It keeps your context and memory, and learns how you work.</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <Segmented label="Mode" options={["Copilot", "Autopilot"]} value={mode} onChange={setMode} />
          <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Pause agent</button>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>Running</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Dedicated instance on Google Cloud</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>Copilot</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>It proposes orders. You approve each one.</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>3</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Proposals so far: 1 approved, 1 declined, 1 waiting for you</div>
        </div>
        <div style={{ flex: "1 1 200px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>5</div>
          <div style={{ fontSize: "13px", lineHeight: "1.45", color: "var(--ink-muted)" }}>Things it has learned about how you work</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "16px" }}>
        <section aria-label="Memory" style={{ flex: "1.4 1 480px", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px 8px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Memory</h2>
              <span style={{ fontSize: "14px", color: "var(--ink-muted)" }}>What your agent has learned about you. Remove anything that is wrong.</span>
            </div>
            <span style={{ marginLeft: "auto" }}>
              <button className="btn btn-ghost" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Add a note</button>
            </span>
          </div>
          <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
            <li style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Keep private credit under 5% of the portfolio.</span>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>Learned 17 Nov 2026 · when you declined PM-1031</span>
              </div>
              <button className="btn btn-ghost" data-soon="" type="button" aria-label="Forget: Keep private credit under 5% of the portfolio." style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Forget</button>
            </li>
            <li style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Settle in USDC when the balance covers the order.</span>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>Learned 19 Nov 2026 · from your orders</span>
              </div>
              <button className="btn btn-ghost" data-soon="" type="button" aria-label="Forget: Settle in USDC when the balance covers the order." style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Forget</button>
            </li>
            <li style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Hold at least $25,000.00 in USDC.</span>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>From mandate Treasury reserve · 11 Nov 2026</span>
              </div>
              <button className="btn btn-ghost" data-soon="" type="button" aria-label="Forget: Hold at least $25,000.00 in USDC." style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Forget</button>
            </li>
            <li style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>Prefer short-dated Treasuries when adding fixed income.</span>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>Learned 18 Nov 2026 · from your holdings</span>
              </div>
              <button className="btn btn-ghost" data-soon="" type="button" aria-label="Forget: Prefer short-dated Treasuries when adding fixed income." style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Forget</button>
            </li>
            <li style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", padding: "14px 0", borderTop: "1px solid var(--hairline)" }}>
              <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", lineHeight: "1.45", color: "var(--ink)" }}>You usually review proposals before noon.</span>
                <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>Learned 19 Nov 2026 · from your approvals</span>
              </div>
              <button className="btn btn-ghost" data-soon="" type="button" aria-label="Forget: You usually review proposals before noon." style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Forget</button>
            </li>
          </ul>
        </section>
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <section aria-label="Context" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Context</h2>
            <dl style={{ margin: "0", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>Account</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>abhi@promorphic.xyz</dd>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>Mandate</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>Treasury reserve</dd>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>Wallets</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>4 connected</dd>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>Holdings</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>5 assets, $650,000.00 with cash</dd>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "baseline", minHeight: "40px", borderTop: "1px solid var(--hairline)", paddingTop: "10px" }}>
                <dt style={{ flex: "0 0 96px", fontSize: "14px", color: "var(--ink-muted)" }}>Issuers</dt>
                <dd style={{ margin: "0", fontSize: "14px", color: "var(--ink)" }}>WisdomTree</dd>
              </div>
            </dl>
          </section>
          <section aria-label="Ask your agent" style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ margin: "0", fontSize: "18px", lineHeight: "1.3", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Ask your agent</h2>
            <label htmlFor="ask" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>Message your agent</label>
            <textarea id="ask" ref={box} value={ask} onChange={(e) => setAsk(e.target.value)} rows={3} placeholder="Ask a question, or say what you want done" style={{ boxSizing: "border-box", width: "100%", resize: "none", background: "var(--surface-0)", border: "1px solid var(--hairline)", borderRadius: "2px", color: "var(--ink)", fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "15px", lineHeight: "1.5", padding: "12px 14px" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button className="btn btn-ghost" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "400", borderRadius: "999px", minHeight: "44px" }} onClick={() => suggest("Why did you propose PM-1042?")}>Why did you propose PM-1042?</button>
              <button className="btn btn-ghost" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "400", borderRadius: "999px", minHeight: "44px" }} onClick={() => suggest("Move spare cash into Treasuries")}>Move spare cash into Treasuries</button>
              <button className="btn btn-ghost" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "400", borderRadius: "999px", minHeight: "44px" }} onClick={() => suggest("Sum up this week")}>Sum up this week</button>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-solid" data-soon="" type="button" style={{ fontFamily: "'Geist','Helvetica Neue',Arial,sans-serif", fontSize: "14px", fontWeight: "500", color: "var(--surface-0)", background: "var(--ink)", border: "1px solid var(--ink)", borderRadius: "2px", minHeight: "44px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Send</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
