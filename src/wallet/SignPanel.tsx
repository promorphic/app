import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../auth/session';
import { useToken } from '../lib/account';
import { cancelRequest, devSign, getRequest, submitSignature, WALLET_KEY, type Provider, type SigningRequest } from './api';
import { confirmCode, hasSession, sendCode, sign, turnkeyConfigured, type CodeSent } from './turnkey';

// What each detail of a request is called, in the order they are shown.
const LABELS: [string, string][] = [
  ['from', 'From'], ['to', 'To'], ['amount', 'Amount'], ['maxFee', 'Network fee, at most'], ['fee', 'Network fee'],
  ['createsAccount', 'Creates the destination account'], ['partyId', 'Canton party'], ['command', 'Command'], ['templateId', 'Template'], ['choice', 'Choice'],
];
const SYMBOL_AFTER = new Set(['amount', 'maxFee', 'fee']);

function Details({ r }: { r: SigningRequest }) {
  const d = r.details || {};
  const rows = LABELS.filter(([k]) => d[k] != null && d[k] !== '');
  if (!rows.length) return null;
  const show = (k: string, v: unknown) => (typeof v === 'boolean' ? (v ? 'Yes' : 'No') : SYMBOL_AFTER.has(k) && d.symbol ? `${v} ${d.symbol}` : String(v));
  return (
    <dl className="wallet-details">
      {rows.map(([k, label]) => (
        <div key={k}><dt>{label}</dt><dd className={k === 'from' || k === 'to' || k === 'partyId' ? 'live-mono' : undefined}>{show(k, d[k])}</dd></div>
      ))}
    </dl>
  );
}

// What a screen may say in its own words about the request it prepared. Without these the panel
// speaks of a send, and lists the request's details by the labels above.
export interface Wording {
  done: string;      // the heading once the network has confirmed it, e.g. "Bought"
  notDone: string;   // the heading when it failed, expired or was cancelled
  rows?: (r: SigningRequest) => [label: string, value: ReactNode, mono?: boolean][]; // in place of the details
  failed?: (error: string | null) => string; // the network's refusal, in plain words
  after?: ReactNode; // a line under a confirmed request
}

function useCountdown(until: string, on: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { if (!on) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [on]);
  const left = Math.max(0, Math.floor((Date.parse(until) - now) / 1000));
  return { left, text: `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` };
}

const OUTCOME: Record<string, string> = {
  confirmed: 'Done. The network has confirmed it.',
  failed: 'It did not go through.',
  expired: 'This was not signed within 5 minutes, so it was dropped. Nothing was sent.',
  cancelled: 'Cancelled. Nothing was sent.',
};

// Shows a signing request, has the person sign it, and follows it until the network settles it.
// Locally (provider "dev") the API signs with its dev key; otherwise Turnkey signs in this browser,
// after a code emailed by Turnkey when there is no session yet.
// `onRetry` adds a way to prepare the same thing again after a request that failed or ran out of time.
export function SignPanel({ initial, provider, title, wording, onRetry, onClose }: { initial: SigningRequest; provider: Provider; title: string; wording?: Wording; onRetry?: () => void; onClose: () => void }) {
  const token = useToken()!;
  const email = useSession()?.user.email || '';
  const client = useQueryClient();
  const [r, setR] = useState(initial);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [code, setCode] = useState('');

  const waiting = r.status === 'awaiting_signature';
  const moving = r.status === 'submitting' || r.status === 'submitted';
  const done = !waiting && !moving;
  const clock = useCountdown(r.expiresAt, waiting);
  const canSign = provider === 'dev' || (provider === 'turnkey' && turnkeyConfigured);
  const rows = wording?.rows?.(r);
  const retry = !!onRetry && (r.status === 'failed' || r.status === 'expired');

  // An EVM transfer is followed from its receipt until it is confirmed or fails.
  const poll = useQuery({
    queryKey: [...WALLET_KEY, 'request', r.id], enabled: moving, refetchInterval: 2000, gcTime: 0,
    queryFn: () => getRequest(token, r.id),
  });
  useEffect(() => { if (poll.data && poll.data.updatedAt !== r.updatedAt) setR(poll.data); }, [poll.data, r.updatedAt]);
  // Past its expiry the API marks it expired when asked.
  useEffect(() => { if (waiting && clock.left === 0) getRequest(token, r.id).then(setR).catch(() => {}); }, [waiting, clock.left, token, r.id]);
  // Balances and activity change once something settles.
  useEffect(() => { if (r.status === 'confirmed' || r.status === 'submitted') client.invalidateQueries({ queryKey: ['account'] }); }, [r.status, client]);

  const run = async (what: string, fn: () => Promise<void>) => {
    setBusy(what); setError('');
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };
  const signNow = () => run('sign', async () => {
    if (provider === 'dev') { setR(await devSign(token, r.id)); return; }
    if (!r.sign) throw new Error('This request can no longer be signed.');
    if (!(await hasSession(r.sign.organizationId))) { setSent(await sendCode(email)); return; }
    setR(await submitSignature(token, r.id, await sign(r.sign)));
  });
  const confirm = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\w{4,12}$/.test(code.trim())) { setError('Enter the code from the email.'); return; }
    run('code', async () => {
      await confirmCode(sent!, code, r.sign!.organizationId);
      setSent(null); setCode('');
      setR(await submitSignature(token, r.id, await sign(r.sign!)));
    });
  };
  // Closing without signing drops the request, so it cannot be signed later by mistake.
  const close = () => { if (waiting) cancelRequest(token, r.id).catch(() => {}); onClose(); };

  return (
    <div className="body">
      <h2>{done ? (wording ? (r.status === 'confirmed' ? wording.done : wording.notDone) : r.kind === 'canton_register' ? (r.status === 'confirmed' ? 'Registered' : 'Not registered') : r.status === 'confirmed' ? 'Sent' : 'Not sent') : title}</h2>
      <p className="live-note">{r.summary}</p>
      {rows ? (
        <dl className="wallet-details">
          {rows.map(([label, value, mono]) => <div key={label}><dt>{label}</dt><dd className={mono ? 'live-mono' : undefined}>{value}</dd></div>)}
        </dl>
      ) : <Details r={r} />}

      {waiting && !sent && (
        <>
          {provider === 'dev' && <p>Local run: the API signs with its development key in place of Turnkey.</p>}
          {provider === 'turnkey' && !turnkeyConfigured && <p className="live-error">Signing in the browser is not switched on yet, so this cannot be signed here.</p>}
          {provider === 'turnkey' && turnkeyConfigured && <p>You sign this yourself. If this browser has not signed recently, Turnkey emails a code to {email} first.</p>}
          <p className="live-mono" style={{ fontSize: '12px' }}>Sign within {clock.text}</p>
        </>
      )}
      {waiting && sent && (
        <form onSubmit={confirm} className="wallet-code">
          <p>Turnkey emailed a code to <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>{email}</strong>. Enter it to sign.</p>
          <label>
            Code
            <input className="live-input live-mono" inputMode="text" autoComplete="one-time-code" autoFocus maxLength={12} value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <div className="live-foot">
            <button className="live-btn" type="button" disabled={!!busy} onClick={() => run('resend', async () => setSent(await sendCode(email)))}>{busy === 'resend' ? 'Sending…' : 'Send a new code'}</button>
            <button className="live-btn solid" type="submit" disabled={!!busy}>{busy === 'code' ? 'Signing…' : 'Confirm and sign'}</button>
          </div>
        </form>
      )}
      {moving && <p role="status">Sent to the network. Waiting for it to be confirmed…</p>}
      {done && <p role="status" className={r.status === 'confirmed' ? undefined : 'live-error'}>{r.status === 'failed' && wording?.failed ? wording.failed(r.error) : `${OUTCOME[r.status]}${r.error ? ` ${r.error}` : ''}`}</p>}
      {r.status === 'confirmed' && wording?.after && <p>{wording.after}</p>}
      {r.result?.explorer && <p><a href={r.result.explorer} target="_blank" rel="noopener noreferrer">View the transaction</a></p>}
      {r.result?.partyId && r.kind === 'canton_register' && <p>Your party: <span className="live-mono" style={{ color: 'var(--ink)', overflowWrap: 'anywhere' }}>{r.result.partyId}</span></p>}
      {error && <p className="live-error">{error}</p>}

      {!sent && (
        <div className="live-foot">
          {waiting ? (
            <>
              <button className="live-btn" type="button" onClick={close}>Cancel</button>
              <button className="live-btn solid" type="button" disabled={!canSign || !!busy || clock.left === 0} onClick={signNow}>
                {busy === 'sign' ? 'Signing…' : provider === 'dev' ? 'Sign with the dev key' : 'Sign'}
              </button>
            </>
          ) : retry ? (
            <>
              <button className="live-btn" type="button" onClick={onClose}>Close</button>
              <button className="live-btn solid" type="button" onClick={onRetry}>Try again</button>
            </>
          ) : <button className="live-btn solid" type="button" onClick={onClose}>{moving ? 'Close, it keeps going' : 'Close'}</button>}
        </div>
      )}
    </div>
  );
}
