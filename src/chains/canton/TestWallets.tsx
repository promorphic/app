import { useState } from 'react';
import { Failed, Notice, PageHead } from '../../components/PageHead';
import { toast } from '../../lib/toast';
import { amount, shortUpdate, useReset, useTestAccount } from './test';

const ROLES: ['agent' | 'venue' | 'oracle' | 'registry' | 'maker', string, string][] = [
  ['agent', 'Agent', 'Allocates the owner\'s holdings, only through the owner\'s mandate.'],
  ['venue', 'Venue', 'Proposes and settles trades. Never a sender or a receiver.'],
  ['oracle', 'Price provider', 'Signs the prices the mandate checks a trade against.'],
  ['registry', 'Test registry', 'Administers the test instruments. Test only.'],
  ['maker', 'Test counterparty', 'Promorphic\'s own party on the other side of every test trade.'],
];

function Party({ id }: { id: string }) {
  const copy = () => navigator.clipboard.writeText(id).then(() => toast('Party ID copied.'), () => toast('Could not copy.'));
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
      <span className="live-mono" style={{ color: 'var(--ink)', overflowWrap: 'anywhere', flex: '1 1 320px' }}>{id}</span>
      <button className="live-btn quiet" type="button" onClick={copy}>Copy</button>
    </span>
  );
}

// The Wallets screen for the sandbox account: its Canton party, and Promorphic's parties around it.
export default function TestWallets() {
  const q = useTestAccount();
  const reset = useReset();
  const [last, setLast] = useState('');
  const a = q.data;

  const startAgain = () => {
    if (!confirm('Reset the sandbox account? Its holdings go back to 10,000 CC-TEST, its mandate is revoked and its orders and activity are cleared.')) return;
    reset.mutate(undefined, { onSuccess: (r) => { setLast(r.updateId); toast('The sandbox account was reset.'); } });
  };

  let body;
  if (q.isPending) body = <Notice>Reading the ledger…</Notice>;
  else if (q.isError) body = <Failed error={q.error} what="The sandbox account's party" />;
  else {
    body = (
      <>
        <section className="acct-panel" aria-label="Your party">
          <h2>Your Canton party</h2>
          <Party id={a!.party.id} />
          <p className="live-meta" style={{ margin: 0 }}>
            On {a!.network}. It holds {a!.holdings.length ? a!.holdings.map((h) => `${amount(h.available + h.locked)} ${h.instrument}`).join(', ') : 'nothing'}.
          </p>
          <p className="live-meta" style={{ margin: 0 }}>
            This is an external party: its own key signs everything it does, and the validator that hosts it cannot act for it. A customer's key is in their own wallet.
            For this shared sandbox account only, Promorphic's API holds the key, so that no signing code has to reach your inbox.
          </p>
        </section>
        <section aria-label="Promorphic's parties" style={{ minWidth: 0 }}>
          <div className="live-box">
            <table className="live-table" style={{ minWidth: '820px' }}>
              <thead>
                <tr><th scope="col">Role</th><th scope="col">What it does</th><th scope="col">Party ID</th></tr>
              </thead>
              <tbody>
                {ROLES.map(([key, name, what]) => (
                  <tr key={key}>
                    <td style={{ color: 'var(--ink)', whiteSpace: 'nowrap' }}>{name}</td>
                    <td>{what}</td>
                    <td className="live-mono" style={{ overflowWrap: 'anywhere' }}>{a!.parties[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="acct-table-note"><span>Promorphic's own parties, hosted on its validator. None of them can move your party's assets except as the mandate you sign allows.</span></div>
          </div>
        </section>
        <section className="acct-panel" aria-label="Reset">
          <h2>Start again</h2>
          <p className="live-meta" style={{ margin: 0 }}>Puts the account back to 10,000 CC-TEST with no mandate and no history. The sandbox account is shared, so do this before a fresh run.</p>
          <div><button className="live-btn" type="button" disabled={reset.isPending} onClick={startAgain}>{reset.isPending ? 'Resetting…' : 'Reset sandbox account'}</button></div>
          {reset.isError && <p className="live-error" role="alert" style={{ margin: 0 }}>{(reset.error as Error).message}</p>}
          {last && <p className="live-meta" style={{ margin: 0 }}>Reset in ledger update <span className="live-mono" title={last}>{shortUpdate(last)}</span>.</p>}
        </section>
      </>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Wallets" lead="The sandbox account's party on Canton, and the Promorphic parties it deals with." />
      {body}
    </main>
  );
}
