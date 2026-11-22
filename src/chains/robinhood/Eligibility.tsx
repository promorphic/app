import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';
import { getApi } from '../../lib/api';
import { short, useWallet } from './wallet';

interface Status {
  eligible: boolean;
  region: { status: string };
  reasons: { message: string }[];
  declared: boolean | null;
  declaredAt: string | null;
  declaration: { version: string; statements: string[] };
  attribution?: { text: string; url: string };
}

const eligibilityKey = (wallet: string | null) => ['robinhood', 'eligibility', wallet];
export function useEligibility(wallet: string | null) {
  return useQuery({ queryKey: eligibilityKey(wallet), queryFn: () => getApi<Status>('/v1/robinhood/eligibility' + (wallet ? '?address=' + wallet : '')), staleTime: 60_000 });
}

// Who may trade Stock Tokens: the API checks the visitor's country and whether the wallet has declared.
export function Eligibility() {
  const wallet = useWallet();
  const client = useQueryClient();
  const key = eligibilityKey(wallet);
  const [agreed, setAgreed] = useState(false);
  const status = useEligibility(wallet);
  const declare = useMutation({
    mutationFn: (s: Status) => getApi<Status>('/v1/robinhood/eligibility/declaration', { address: wallet, version: s.declaration.version, accepted: true }),
    onSuccess: (next) => client.setQueryData(key, next),
  });
  const s = status.data;

  let body;
  if (!s) {
    body = <><h3>Trading eligibility</h3><p>{status.isError ? 'Eligibility could not be checked right now.' : 'Checking…'}</p></>;
  } else if (s.region.status !== 'allowed') {
    body = <><h3>Trading is not available to you</h3><p className="live-error">{s.reasons[0]?.message} You can still see prices and indicative quotes.</p></>;
  } else if (!wallet) {
    body = (
      <>
        <h3>Trading eligibility</h3>
        <p>Stock Tokens can be offered in your country. To trade, each wallet must first confirm it is eligible. <Link to="/wallets/">Add a wallet on the Wallets page.</Link></p>
      </>
    );
  } else if (s.declared) {
    body = (
      <>
        <h3>Eligibility confirmed</h3>
        <p>Wallet {short(wallet)} confirmed on {new Date(s.declaredAt ?? Date.now()).toLocaleDateString()}. Get a quote above to trade.</p>
      </>
    );
  } else {
    body = (
      <>
        <h3>Confirm you are eligible</h3>
        <p>Stock Tokens are not available to everyone. Before wallet {short(wallet)} can trade them, confirm each of these:</p>
        <ul>{s.declaration.statements.map((t) => <li key={t}>{t}</li>)}</ul>
        <label className="live-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          All of this is true for me and for this wallet.
        </label>
        {declare.isError && <p className="live-error">{declare.error.message}</p>}
        <button className="live-btn" type="button" disabled={!agreed || declare.isPending} onClick={() => declare.mutate(s)}>Confirm eligibility</button>
      </>
    );
  }
  return (
    <div className="live-elig" aria-live="polite">
      {body}
      {s?.attribution && <p className="live-credit">Country check: <a href={s.attribution.url} target="_blank" rel="noopener">{s.attribution.text}</a>.</p>}
    </div>
  );
}
