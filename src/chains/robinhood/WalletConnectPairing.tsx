import { useEffect, useRef, useState } from 'react';
import { toast } from '../../lib/toast';
import { walletMessage } from './evm';
import { setWallet } from './wallet';
import { PHONE_WALLETS, forgetLink, onPhone, pairingLink, qr, rememberLink, wcDisconnect, wcPair } from './walletconnect';

type State =
  | { at: 'starting' }
  | { at: 'waiting'; uri: string; code: { size: number; path: string } | null }
  | { at: 'failed'; text: string };

// Inside the wallet dialog: pair a phone wallet through WalletConnect. A phone gets links that open
// the wallet app; a desktop gets a QR code to scan. The wallet is saved once it approves.
export function WalletConnectPairing({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [state, setState] = useState<State>({ at: 'starting' });
  const [attempt, setAttempt] = useState(0);
  const phone = onPhone();
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let live = true;
    forgetLink();
    setState({ at: 'starting' });
    // No link within 20 seconds means the WalletConnect relay could not be reached.
    const slow = setTimeout(() => {
      setState((s) => (live && s.at === 'starting' ? { at: 'failed', text: 'WalletConnect could not be reached. Check your connection and try again.' } : s));
    }, 20_000);
    wcPair((uri) => {
      if (!live) return;
      clearTimeout(slow);
      setState({ at: 'waiting', uri, code: null });
      qr(uri).then((code) => { if (live) setState((s) => (s.at === 'waiting' && s.uri === uri ? { ...s, code } : s)); }).catch(() => {});
    }).then((address) => {
      // Approved after this view was left: nothing asked for that session any more, so end it.
      if (!live) { void wcDisconnect(); return; }
      setWallet(address, 'walletconnect');
      done.current();
    }).catch((e) => { if (live) { clearTimeout(slow); setState({ at: 'failed', text: walletMessage(e) }); } });
    return () => { live = false; clearTimeout(slow); };
  }, [attempt]);

  const copy = (uri: string) => {
    navigator.clipboard.writeText(uri).then(() => toast('Link copied. Paste it into your wallet.'), () => toast('The link could not be copied.'));
  };

  return (
    <div className="body" aria-live="polite">
      <h2>Connect with WalletConnect</h2>
      {state.at === 'starting' && <p>Preparing a connection…</p>}
      {state.at === 'failed' && (
        <>
          <p className="live-error">{state.text}</p>
          <div className="live-actions"><button className="live-btn solid" type="button" onClick={() => setAttempt((n) => n + 1)}>Try again</button></div>
        </>
      )}
      {state.at === 'waiting' && (
        <>
          {phone ? (
            <>
              <p>Open your wallet app and approve the connection. It shares the wallet's address; nothing is signed until you trade.</p>
              <div className="live-wc-links">
                <a className="live-btn solid" href={state.uri} onClick={forgetLink}>Open wallet app</a>
                {PHONE_WALLETS.map((w) => (
                  <a key={w.name} className="live-btn" href={pairingLink(w.href, state.uri)} target="_blank" rel="noopener" onClick={() => rememberLink(w.name, w.href)}>{w.name}</a>
                ))}
              </div>
              <p>If the first button opens nothing, choose your wallet by name, or copy the link and paste it into the wallet. Waiting for the wallet…</p>
              <details className="live-wc-more">
                <summary>Scan from another device instead</summary>
                <Code code={state.code} />
              </details>
            </>
          ) : (
            <>
              <p>Scan this code with the wallet app on your phone and approve the connection. It shares the wallet's address; nothing is signed until you trade.</p>
              <Code code={state.code} />
              <p>Waiting for the wallet…</p>
            </>
          )}
        </>
      )}
      <div className="live-foot">
        {state.at === 'waiting' && <button className="live-btn" type="button" onClick={() => copy(state.uri)}>Copy link</button>}
        <button className="live-btn" type="button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

// The code keeps dark modules on a white tile in both themes, which is what phone cameras read best.
function Code({ code }: { code: { size: number; path: string } | null }) {
  return (
    <div className="live-wc-code">
      {code && (
        <svg viewBox={`0 0 ${code.size} ${code.size}`} role="img" aria-label="QR code for the WalletConnect link" shapeRendering="crispEdges">
          <path d={code.path} />
        </svg>
      )}
    </div>
  );
}
