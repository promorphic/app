import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { AuthLayout, Heading, primary } from '../auth/AuthLayout';
import { signedIn, takeReturn, useSession, type SignedIn } from '../auth/session';
import { getApi } from '../lib/api';
import { isUnderReview, UnderReview } from '../auth/UnderReview';

// A link works once, so each token is traded for a session once, however often this screen renders.
const trades = new Map<string, Promise<SignedIn>>();
function trade(token: string) {
  let p = trades.get(token);
  if (!p) { p = getApi<SignedIn>('/v1/auth/email/verify', { token }); trades.set(token, p); }
  return p;
}

// Where the link in a sign-in email lands.
export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const session = useSession();
  const token = params.get('token') || '';
  const [problem, setProblem] = useState(token ? '' : 'This link is incomplete. Copy the whole link from the email, or ask for a new one.');
  const [review, setReview] = useState(false); // the link is for an address that is not let in yet

  useEffect(() => {
    if (!token) return;
    let here = true;
    trade(token).then(
      (r) => { signedIn(r); if (here) navigate(takeReturn(), { replace: true }); },
      (e: Error) => { if (!here) return; if (isUnderReview(e)) setReview(true); setProblem(e.message); },
    );
    return () => { here = false; };
  }, [token, navigate]);

  // An old link opened by someone who is signed in anyway: nothing to fix, so on to the app.
  if (problem && session) return <Navigate to="/" replace />;
  return (
    <AuthLayout>
      {review ? <UnderReview /> : problem ? (
        <>
          <Heading title="That link did not work">{problem}</Heading>
          <Link to="/login/" className="btn btn-primary" style={{ ...primary, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Send a new link</Link>
        </>
      ) : (
        <div role="status"><Heading title="Signing you in">One moment.</Heading></div>
      )}
    </AuthLayout>
  );
}
