import { useState } from 'react';
import { Link } from 'react-router';
import { Failed, Notice, PageHead, SignedOut } from '../components/PageHead';
import { Segmented } from '../components/Segmented';
import { useTo } from '../chains/canton/sandbox';
import { clock, day, shortId, useActivity, useToken, type Actor, type Entry } from '../lib/account';

type Filter = Actor | 'all';
const ACTOR_LABEL: Record<Actor, string> = { you: 'You', agent: 'Agent', system: 'System' };

function Ref({ e }: { e: Entry }) {
  const to = useTo();
  if (!e.ref) return null;
  if (e.ref.kind === 'order') return <Link className="ref acct-link" to={to('/orders/')}>{shortId(e.ref.id)}</Link>;
  return <Link className="ref acct-link" to={to('/wallets/')}>Wallet</Link>;
}

export default function Activity() {
  const token = useToken();
  const [actor, setActor] = useState<Filter>('all');
  const q = useActivity(actor);
  const entries = (q.data?.pages || []).flatMap((p) => p.entries);

  let body;
  if (!token) body = <SignedOut what="the activity on your account" />;
  else if (q.isPending) body = <Notice>Loading your activity…</Notice>;
  else if (q.isError) body = <Failed error={q.error} what="Your activity" />;
  else if (!entries.length) body = <Notice>{actor === 'all' ? 'Nothing recorded yet. Signing in, linking a wallet, confirming eligibility and trading all appear here.' : actor === 'agent' ? 'Your agent has not acted on this account.' : 'Nothing recorded for this filter.'}</Notice>;
  else {
    let lastDay = '';
    body = (
      <>
        {entries.map((e) => {
          const d = day(e.at);
          const head = d !== lastDay ? <div className="acct-day">{d}</div> : null;
          lastDay = d;
          return (
            <div key={e.id} style={{ display: 'contents' }}>
              {head}
              <div className="acct-row">
                <span className="time">{clock(e.at)}</span>
                <span className="who"><span className={e.actor === 'you' ? 'acct-pill' : e.actor === 'agent' ? 'acct-pill solid' : 'acct-pill quiet'}>{ACTOR_LABEL[e.actor]}</span></span>
                <span className="what">{e.text}</span>
                <Ref e={e} />
              </div>
            </div>
          );
        })}
        <div className="acct-table-note">
          <span>{entries.length} shown, newest first. This record is append-only.</span>
          {q.hasNextPage && <button className="live-btn acct-more" type="button" disabled={q.isFetchingNextPage} onClick={() => q.fetchNextPage()}>{q.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>}
        </div>
      </>
    );
  }

  return (
    <main className="app-main" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHead title="Activity" lead="A record of everything on this account: what you did, what your agent did, and what settled." />
      {token && (
        <div role="group" aria-label="Filters" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <Segmented<Filter> label="Actor" value={actor} onChange={setActor} options={[{ value: 'all', label: 'Everyone' }, { value: 'you', label: 'You' }, { value: 'agent', label: 'Agent' }, { value: 'system', label: 'System' }]} />
        </div>
      )}
      <section aria-label="Activity" className="acct-log">{body}</section>
    </main>
  );
}
