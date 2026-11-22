import { Link } from 'react-router';
import { ThemeSwitch } from '../layout/ThemeSwitch';

export default function Login() {
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
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Your own agent works inside the limits you set. You keep custody.</p>
        </div>
        <div style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", letterSpacing: "0.02em", color: "var(--ink-faint)" }}>app.promorphic.xyz</div>
      </div>
      <main className="auth-main" style={{ flex: "1 1 480px", boxSizing: "border-box", padding: "48px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h1 style={{ margin: "0", fontSize: "32px", lineHeight: "1.1", fontWeight: "500", letterSpacing: "-0.02em", color: "var(--ink)" }}>Sign in</h1>
            <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.5", color: "var(--ink-muted)" }}>Use the account you signed up with.</p>
          </div>
          <button className="btn btn-ghost" data-go="/" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontWeight: "500", color: "var(--ink)", background: "transparent", border: "1px solid var(--hairline)", borderRadius: "2px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", width: "100%", minHeight: "48px", fontSize: "15px" }}>Continue with Google</button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span aria-hidden="true" style={{ flex: "1 1 0", height: "1px", background: "var(--hairline)" }} />
            <span style={{ fontFamily: "'Geist Mono','SF Mono',Menlo,Consolas,monospace", fontSize: "12px", color: "var(--ink-muted)" }}>or</span>
            <span aria-hidden="true" style={{ flex: "1 1 0", height: "1px", background: "var(--hairline)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="login-email" style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>Work email</label>
            <input id="login-email" type="email" placeholder="you@company.com" style={{ height: "48px", boxSizing: "border-box", background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: "2px", color: "var(--ink)", fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontSize: "15px", padding: "0 14px" }} />
          </div>
          <button className="btn btn-primary" data-go="/" type="button" style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Arial,sans-serif", fontWeight: "500", color: "var(--on-brand)", background: "var(--brand)", border: "0", borderRadius: "2px", padding: "0 16px", cursor: "pointer", whiteSpace: "nowrap", width: "100%", minHeight: "48px", fontSize: "15px" }}>Continue with email</button>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "var(--ink-muted)" }}>We will email you a sign-in link. No password needed.</p>
          <p style={{ margin: "0", paddingTop: "12px", borderTop: "1px solid var(--hairline)", fontSize: "14px", color: "var(--ink-muted)" }}>
            {"New to Promorphic? "}
            <Link to="/signup/" style={{ color: "var(--ink)", textUnderlineOffset: "3px" }}>Create an account</Link>
          </p>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "var(--ink-muted)" }}>
            <a href="#" style={{ textUnderlineOffset: "3px" }}>Terms</a>
            {" · "}
            <a href="#" style={{ textUnderlineOffset: "3px" }}>Privacy</a>
          </p>
        </div>
      </main>
    </div>
  );
}
