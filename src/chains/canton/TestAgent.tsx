import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { sandboxPath } from './sandbox';
import { Failed, Notice, PageHead, Stat, Stats } from '../../components/PageHead';
import { amount, shortUpdate, useAsk, useTestAccount, type AskResult, type Step } from './test';

const STEP: Record<Step['step'], (s: Step) => string> = {
  proposed: () => 'The venue proposed the settlement',
  allocated: (s) => `The agent locked the ${s.for === 'maker' ? 'counterparty\'s' : 'owner\'s'} leg under ${s.for === 'maker' ? 'its' : 'your'} mandate`,
  refused: () => 'The ledger refused the agent',
  withdrawn: () => 'The venue withdrew the proposal',
  settled: () => 'The venue settled both legs in one transaction',
};

function Result({ r, cash }: { r: AskResult; cash: string }) {
  const settled = r.outcome === 'settled';
  return (
    <li style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <span className={settled ? 'acct-pill solid' : 'acct-pill'}>{settled ? 'Settled' : 'Refused'}</span>
        <span style={{ fontSize: '15px', color: 'var(--ink)' }}>{r.ask}</span>
      </div>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: 'var(--ink)' }}>
        {settled
          ? <>{r.side === 'buy' ? 'Bought' : 'Sold'} {amount(r.units!)} {r.instrument} for {amount(r.cash!, 2)} {cash}, at {amount(r.price!)} each. Delivery and payment moved together, directly between the two parties.</>
          : r.reason}
      </p>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {r.steps.map((s, i) => (
          <li key={i} className="live-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span>{i + 1}. {STEP[s.step](s)}.</span>
            {s.updateId ? <span className="live-mono" title={`Ledger update ${s.updateId}`}>{shortUpdate(s.updateId)}</span> : s.step === 'refused' && <span>Nothing was written.</span>}
          </li>
        ))}
      </ol>
    </li>
  );
}

// The agent screen for the sandbox account. The agent here follows plain instructions; what matters is
// that it acts on the ledger as its own party, and the ledger decides what it may do.
export default function TestAgent() {
  const q = useTestAccount();
  const ask = useAsk();
  const [text, setText] = useState('');
  const [results, setResults] = useState<AskResult[]>([]);
  const box = useRef<HTMLInputElement>(null);
  const a = q.data, m = a?.mandate;

  const send = (what: string) => {
    const t = what.trim();
    if (!t || ask.isPending) return;
    ask.mutate(t, { onSuccess: (r) => { setResults((all) => [r, ...all]); setText(''); } });
  };
  const submit = (e: FormEvent) => { e.preventDefault(); send(text); };

  if (q.isPending) return <main className="app-main" style={{ padding: '32px' }}><Notice>Reading the ledger…</Notice></main>;
  if (q.isError) return <main className="app-main" style={{ padding: '32px' }}><Failed error={q.error} what="The agent" /></main>;

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Your agent" lead="Ask the agent to trade. It acts on the ledger as its own party, so it can do only what your mandate allows." />
      <Stats>
        <Stat value={!m ? 'No mandate' : m.paused ? 'Paused' : 'Ready'} label={!m ? 'The agent has nothing to act under' : m.paused ? 'You paused the mandate' : `Acting under "${m.label}"`} />
        <Stat value={m ? `${amount(m.maxPerTrade)}` : '—'} label={`Max per trade, in ${a!.cash}`} />
        <Stat value={m ? `${amount(Math.max(0, m.maxPerDay - m.usedToday), 2)}` : '—'} label={m ? `Left today, of ${amount(m.maxPerDay)} ${a!.cash}` : 'Left today'} />
        <Stat value={results.length} label={`Asked this visit: ${results.filter((r) => r.outcome === 'settled').length} settled, ${results.filter((r) => r.outcome === 'refused').length} refused`} />
      </Stats>
      {!m && <Notice>There is no mandate yet, so the ledger will refuse anything the agent tries. <Link to={sandboxPath('/mandates/')}>Sign the mandate</Link>, or ask first to see the refusal.</Notice>}

      <div className="acct-panels">
        <section className="acct-panel" aria-label="Ask">
          <h2>Ask the agent</h2>
          <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <label htmlFor="ask" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>What to ask the agent</label>
            <input id="ask" ref={box} className="live-input" type="text" autoComplete="off" placeholder="buy 100 TBILL-TEST" value={text} onChange={(e) => setText(e.target.value)} style={{ flex: '1 1 220px' }} />
            <button className="live-btn solid" type="submit" disabled={ask.isPending || !text.trim()}>{ask.isPending ? 'Working…' : 'Ask'}</button>
          </form>
          <p className="live-meta" style={{ margin: 0 }}>It understands "buy" or "sell", an amount and a test ticker, and "send" for a transfer. A trade takes four ledger transactions and about ten seconds.</p>
          {ask.isError && <p className="live-error" role="alert" style={{ margin: 0 }}>{(ask.error as Error).message}</p>}
        </section>
        <section className="acct-panel" aria-label="Things to try">
          <h2>Things to try</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {a!.asks.map((x) => (
              <li key={x.ask} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: '1px solid var(--hairline)' }}>
                <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '15px', color: 'var(--ink)' }}>{x.ask}</span>
                  <span className="live-meta">{x.expect === 'settles' ? 'Should settle. ' : 'Should be refused. '}{x.why}</span>
                </div>
                <button className="live-btn" type="button" disabled={ask.isPending} onClick={() => send(x.ask)}>{ask.isPending && ask.variables === x.ask ? 'Working…' : 'Ask'}</button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="acct-panel" aria-label="What happened" aria-live="polite">
        <h2>What happened</h2>
        {ask.isPending && <p className="live-meta" role="status" style={{ margin: 0 }}>The agent is working on "{ask.variables}"…</p>}
        {results.length
          ? <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{results.map((r, i) => <Result key={results.length - i} r={r} cash={a!.cash} />)}</ul>
          : !ask.isPending && <p className="live-meta" style={{ margin: 0 }}>Nothing asked yet. Each answer shows the ledger transactions behind it; the full record is on the <Link className="acct-link" to={sandboxPath('/orders/')}>Orders</Link> and <Link className="acct-link" to={sandboxPath('/activity/')}>Activity</Link> screens.</p>}
      </section>
    </main>
  );
}
