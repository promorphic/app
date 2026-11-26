import { useState } from 'react';
import { Link } from 'react-router';
import { Failed, Notice, PageHead } from '../../components/PageHead';
import { amount, shortUpdate, useMandateAction, useTestAccount, type MandateAction, type TestAccount } from './test';

const SAID: Record<MandateAction, string> = { create: 'Signed', pause: 'Paused', resume: 'Resumed', revoke: 'Revoked' };

// The rules, as rows. Before signing they come from the preset; after, from the contract on the ledger.
function rules(a: TestAccount) {
  const m = a.mandate;
  const l = m ? { instruments: m.instruments, maxPerTrade: m.maxPerTrade, maxPerDay: m.maxPerDay, priceBandBps: m.priceBandBps, maxPriceAgeHours: m.maxPriceAgeHours } : a.preset.limits;
  const others = l.instruments.filter((i) => i !== a.cash);
  return [
    ['What the agent may do', 'Trade, delivery versus payment only', 'It cannot withdraw or transfer'],
    ['Instruments', others.join(', '), `Paid in ${a.cash}`],
    ['Max per trade', `${amount(l.maxPerTrade)} ${a.cash}`, '—'],
    ['Max per day', `${amount(l.maxPerDay)} ${a.cash}`, m ? `${amount(m.usedToday, 2)} ${a.cash} used` : '—'],
    ['Price', `Within ${(l.priceBandBps / 100).toFixed(2).replace(/\.?0+$/, '')}% of the signed price`, `Signed price no older than ${l.maxPriceAgeHours} hours`],
    ['Venue', 'Promorphic only', '—'],
  ];
}

// The Mandates screen for the test account: the one mandate its party signs, on the ledger.
export default function TestMandates() {
  const q = useTestAccount();
  const act = useMandateAction();
  const [last, setLast] = useState<{ action: MandateAction; updateId: string } | null>(null);
  const a = q.data, m = a?.mandate;

  const run = (action: MandateAction) => {
    if (action === 'revoke' && !confirm('Revoke the mandate? The agent can do nothing for this account afterwards. You can sign a new one.')) return;
    act.mutate(action, { onSuccess: (r) => setLast({ action: r.done, updateId: r.updateId }) });
  };

  let body;
  if (q.isPending) body = <Notice>Reading the ledger…</Notice>;
  else if (q.isError) body = <Failed error={q.error} what="The mandate" />;
  else {
    body = (
      <section aria-label={a!.preset.label} style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', lineHeight: 1.3, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{m ? m.label : a!.preset.label}</h2>
          <span className={m && !m.paused ? 'acct-pill solid' : 'acct-pill quiet'}>{!m ? 'Not signed' : m.paused ? 'Paused' : 'Active'}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {!m && <button className="live-btn solid" type="button" disabled={act.isPending} onClick={() => run('create')}>{act.isPending ? 'Signing…' : 'Sign mandate'}</button>}
            {m && !m.paused && <button className="live-btn" type="button" disabled={act.isPending} onClick={() => run('pause')}>{act.isPending && act.variables === 'pause' ? 'Pausing…' : 'Pause'}</button>}
            {m && m.paused && <button className="live-btn solid" type="button" disabled={act.isPending} onClick={() => run('resume')}>{act.isPending && act.variables === 'resume' ? 'Resuming…' : 'Resume'}</button>}
            {m && <button className="live-btn" type="button" disabled={act.isPending} onClick={() => run('revoke')}>{act.isPending && act.variables === 'revoke' ? 'Revoking…' : 'Revoke'}</button>}
          </span>
        </div>
        <div className="live-box">
          <table className="live-table" style={{ minWidth: '640px' }}>
            <thead><tr><th scope="col">Rule</th><th scope="col">Limit</th><th scope="col">Now</th></tr></thead>
            <tbody>
              {rules(a!).map(([rule, limit, now]) => (
                <tr key={rule}><td style={{ color: 'var(--ink)' }}>{rule}</td><td style={{ color: 'var(--ink)' }}>{limit}</td><td>{now}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="acct-table-note">
            <span>
              {m
                ? <>These limits are in a contract on {a!.network}, signed by your party. The ledger checks every one each time the agent allocates. Contract <span className="live-mono" title={m.contractId}>{shortUpdate(m.contractId)}</span>.</>
                : <>Signing creates this mandate as a contract on {a!.network}, signed by your party's own key. Until then the agent can do nothing with your assets. <Link className="acct-link" to="/agent/">Try it</Link> before and after.</>}
            </span>
          </div>
        </div>
        {act.isError && <p className="live-error" role="alert" style={{ margin: 0 }}>{(act.error as Error).message}</p>}
        {last && <p className="live-meta" role="status" style={{ margin: 0 }}>{SAID[last.action]} in ledger update <span className="live-mono" title={last.updateId}>{shortUpdate(last.updateId)}</span>.{last.action === 'create' && <> Now <Link className="acct-link" to="/agent/">ask the agent to trade</Link>.</>}</p>}
      </section>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Mandates" lead="The limits your agent works inside. The ledger checks every trade against them before any asset moves." />
      {body}
    </main>
  );
}
