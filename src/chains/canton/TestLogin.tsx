import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { AuthLayout, Field, foot, Heading, inkLink, note, primary, Problem } from '../../auth/AuthLayout';
import { signedIn, useSession, type SignedIn } from '../../auth/session';
import { getApi } from '../../lib/api';

// Sign-in for the sandbox account, at /sandbox/. It is the one account with a password, because the people
// testing with it cannot read its inbox, and the one screen outside the country check, because they
// may be anywhere. It opens test assets and nothing else.
export default function TestLogin() {
  const navigate = useNavigate();
  const session = useSession();
  const [email, setEmail] = useState('test@promorphic.xyz');
  const [password, setPassword] = useState('');
  const [problem, setProblem] = useState('');
  const [busy, setBusy] = useState(false);
  if (session) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return setProblem('Enter the sandbox account\'s password.');
    setBusy(true); setProblem('');
    try {
      signedIn(await getApi<SignedIn>('/v1/auth/test', { email: email.trim(), password }));
      navigate('/', { replace: true });
    } catch (err) { setProblem((err as Error).message); } finally { setBusy(false); }
  };

  return (
    <AuthLayout>
      <Heading title="Sandbox">Sign in to try Promorphic with test assets. Trades settle on Canton MainNet, and nothing in this account has any value.</Heading>
      <form noValidate onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Field id="test-email" label="Email" type="email" name="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field id="test-password" label="Password" type="password" name="password" autoComplete="current-password" value={password}
          onChange={(e) => { setPassword(e.target.value); if (problem) setProblem(''); }} />
        <Problem>{problem}</Problem>
        <button className="btn btn-primary" type="submit" style={primary} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p style={note}>This account is shared. It holds test instruments only, and anyone using it can reset it.</p>
        <p style={foot}>
          This sandbox is for reviewers. The Promorphic platform is at{' '}
          <a href="https://app.promorphic.xyz" target="_blank" rel="noopener" style={inkLink}>app.promorphic.xyz</a>.
        </p>
      </form>
    </AuthLayout>
  );
}
