import { Link } from 'react-router';
import { ThemeSwitch } from '../layout/ThemeSwitch';
import { Segmented } from '../components/Segmented';
import { useState } from 'react';

export default function Signup() {
  const [type, setType] = useState('Organization');
  return (
    <div className="app-root" style={{ boxSizing: "border-box", background: "var(--surface-0)", color: "var(--ink)", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", display: "flex", flexWrap: "wrap", alignItems: "stretch" }}>
      <div className="auth-aside" style={{ flex: "1 1 480px", boxSizing: "border-box", borderRight: "1px solid var(--hairline)", padding: "32px 48px 40px", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "44px", padding: "0 8px", textDecoration: "none", color: "var(--ink)" }}>
            <svg width="26" height="26" viewBox="0 4 70.3125 70.3125" role="img" aria-label="Promorphic">
              <rect x="0" y="4" width="39.5508" height="24.1699" style={{ fill: "var(--ink)" }} />
              <rect x="0" y="32.5645" width="70.3125" height="13.1836" style={{ fill: "var(--brand)" }} />
              <rect x="30.7617" y="50.1426" width="39.5508" height="24.1699" style={{ fill: "var(--ink)" }} />
            </svg>
            <span style={{ fontSize: "20px", fontWeight: "500", letterSpacing: "-0.01em", color: "var(--ink)" }}>Promorphic</span>
          </Link>
          <span style={{ marginLeft: "auto" }}>
            <ThemeSwitch />
          </span>
        </div>
        <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "520px" }}>
          <p className="auth-hero" style={{ margin: "0", fontSize: "44px", lineHeight: "1.08", fontWeight: "500", letterSpacing: "-0.025em", color: "var(--ink)" }}>Hold, trade and manage tokenized assets from one place.</p>
          <ol className="auth-steps" style={{ listStyle: "none", margin: "0", padding: "0" }}>
            <li style={{ display: "flex", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--hairline)" }}>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.14em", color: "var(--ink-muted)", paddingTop: "3px" }}>01</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "17px", fontWeight: "500", color: "var(--ink)" }}>Create your account</span>
                <span style={{ fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Sign up with Google or your work email.</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--hairline)" }}>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.14em", color: "var(--ink-muted)", paddingTop: "3px" }}>02</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "17px", fontWeight: "500", color: "var(--ink)" }}>Verify who you are</span>
                <span style={{ fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>A one-time check, for you or your organization.</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--hairline)" }}>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.14em", color: "var(--ink-muted)", paddingTop: "3px" }}>03</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "17px", fontWeight: "500", color: "var(--ink)" }}>Your agent is set up</span>
                <span style={{ fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Every account gets its own agent. It keeps your context and memory, and learns how you work.</span>
              </div>
            </li>
            <li style={{ display: "flex", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--hairline)" }}>
              <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", fontWeight: "500", letterSpacing: "0.14em", color: "var(--ink-muted)", paddingTop: "3px" }}>04</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "17px", fontWeight: "500", color: "var(--ink)" }}>Connect a wallet</span>
                <span style={{ fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>You keep custody. Promorphic never holds your keys.</span>
              </div>
            </li>
          </ol>
        </div>
        <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", letterSpacing: "0.02em", color: "var(--ink-faint)" }}>app.promorphic.xyz</div>
      </div>
      <main className="auth-main" style={{ flex: "1 1 480px", boxSizing: "border-box", padding: "48px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{ margin: "0", fontSize: "32px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)" }}>Create your account</h1>
            <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>It takes a minute. Verification comes next.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>Account type</span>
            <div>
              <Segmented label="Account type" options={["Organization", "Individual"]} value={type} onChange={setType} />
            </div>
          </div>
          <button className="btn btn-ghost" data-go="/" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", width: "100%", minHeight: "48px", fontSize: "15px" }}>Sign up with Google</button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span aria-hidden="true" style={{ flex: "1 1 0", height: "1px", background: "var(--hairline)" }} />
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>or</span>
            <span aria-hidden="true" style={{ flex: "1 1 0", height: "1px", background: "var(--hairline)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="su-name" style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>Full name</label>
            <input id="su-name" type="text" placeholder="Your name" style={{ height: "48px", boxSizing: "border-box", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", color: "var(--ink)", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "15px", padding: "0 14px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="su-email" style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>Work email</label>
            <input id="su-email" type="email" placeholder="you@company.com" style={{ height: "48px", boxSizing: "border-box", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", color: "var(--ink)", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "15px", padding: "0 14px" }} />
          </div>
          <div hidden={type === 'Individual'} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="su-org" style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>Organization</label>
            <input id="su-org" type="text" placeholder="Legal name of your organization" style={{ height: "48px", boxSizing: "border-box", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", color: "var(--ink)", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "15px", padding: "0 14px" }} />
          </div>
          <label htmlFor="su-agree" style={{ display: "flex", alignItems: "flex-start", gap: "10px", minHeight: "44px", fontSize: "14px", lineHeight: "1.5", color: "var(--ink-muted)", cursor: "pointer" }}>
            <input id="su-agree" type="checkbox" style={{ width: "18px", height: "18px", margin: "2px 0 0", accentColor: "var(--ink)" }} />
            <span>
              {"I agree to the "}
              <a href="#" style={{ color: "var(--ink)", textUnderlineOffset: "3px" }}>Terms</a>
              {" and "}
              <a href="#" style={{ color: "var(--ink)", textUnderlineOffset: "3px" }}>Privacy Policy</a>.</span>
          </label>
          <button className="btn btn-primary" data-go="/" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontWeight: "500", color: "var(--on-brand)", background: "var(--brand)", border: "0", borderRadius: "2px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", width: "100%", minHeight: "48px", fontSize: "15px" }}>Create account</button>
          <p style={{ margin: "0", paddingTop: "12px", borderTop: "1px solid var(--hairline)", fontSize: "14px", color: "var(--ink-muted)" }}>
            {"Already have an account? "}
            <Link to="/login/" style={{ color: "var(--ink)", textUnderlineOffset: "3px" }}>Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
