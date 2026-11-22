import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthLayout, Field, foot, ghost, Heading, inkLink, note, Or, primary, Problem } from '../auth/AuthLayout';
import { CheckEmail } from '../auth/CheckEmail';
import { googleAccessToken, PopupClosed } from '../auth/google';
import { AUTH_ON, signedIn, takeReturn, useAuthConfig, type SignedIn } from '../auth/session';
import { ApiError, getApi } from '../lib/api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const navigate = useNavigate();
  const config = useAuthConfig();
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState<{ field?: 'email'; text: string; signup?: boolean } | null>(null);
  const [busy, setBusy] = useState<'' | 'email' | 'google'>('');
  const [sentTo, setSentTo] = useState('');

  const showGoogle = !AUTH_ON || !!config.data?.google;
  const showEmail = !AUTH_ON || !config.data || config.data.email;
  const fail = (e: unknown) => {
    if (e instanceof PopupClosed) return;
    const noAccount = e instanceof ApiError && e.code === 'no_account';
    setProblem({ text: (e as Error).message, signup: noAccount, field: noAccount || (e instanceof ApiError && e.code === 'bad_email') ? 'email' : undefined });
  };
  const send = (to: string) => getApi('/v1/auth/email', { email: to, intent: 'signin' });

  const withEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!AUTH_ON) return navigate('/');
    const to = email.trim();
    if (!EMAIL.test(to)) return setProblem({ field: 'email', text: 'Enter your work email, like you@company.com.' });
    setBusy('email'); setProblem(null);
    try { await send(to); setSentTo(to); } catch (err) { fail(err); } finally { setBusy(''); }
  };
  const withGoogle = async () => {
    if (!AUTH_ON) return navigate('/');
    if (!config.data?.google) return;
    setBusy('google'); setProblem(null);
    try {
      const accessToken = await googleAccessToken(config.data.google.clientId);
      signedIn(await getApi<SignedIn>('/v1/auth/google', { accessToken, intent: 'signin' }));
      navigate(takeReturn(), { replace: true });
    } catch (err) { fail(err); } finally { setBusy(''); }
  };

  return (
    <AuthLayout aside={<p style={{ margin: 0, fontSize: '18px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>Your own agent works inside the limits you set. You keep custody.</p>}>
      {sentTo ? (
        <CheckEmail email={sentTo} isNew={false} resend={() => send(sentTo)} back={() => { setSentTo(''); setProblem(null); }} />
      ) : (
        <>
          <Heading title="Sign in">Use the account you signed up with.</Heading>
          {config.isError && <Problem>Sign-in is unavailable right now. Try again in a moment.</Problem>}
          {AUTH_ON && config.data && !config.data.email && !config.data.google && <Problem>Sign-in is not switched on yet.</Problem>}
          {showGoogle && (
            <button className="btn btn-ghost" type="button" style={ghost} disabled={!!busy} onClick={withGoogle}>
              {busy === 'google' ? 'Waiting for Google…' : 'Continue with Google'}
            </button>
          )}
          {showGoogle && showEmail && <Or />}
          {showEmail && (
            <form noValidate onSubmit={withEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field id="login-email" label="Work email" type="email" name="email" autoComplete="email" placeholder="you@company.com"
                value={email} onChange={(e) => { setEmail(e.target.value); if (problem?.field) setProblem(null); }}
                error={problem?.field === 'email' && !problem.signup ? problem.text : undefined} />
              {problem?.signup && (
                <Problem>
                  {problem.text} <Link to="/signup/" state={{ email: email.trim() }} style={inkLink}>Create an account</Link>
                </Problem>
              )}
              <button className="btn btn-primary" type="submit" style={primary} disabled={!!busy}>
                {busy === 'email' ? 'Sending…' : 'Continue with email'}
              </button>
              <p style={note}>We will email you a sign-in link. No password needed.</p>
            </form>
          )}
          {problem && !problem.field && <Problem>{problem.text}</Problem>}
          <p style={foot}>
            {'New to Promorphic? '}
            <Link to="/signup/" style={inkLink}>Create an account</Link>
          </p>
          <p style={note}>
            <a href="#" style={{ textUnderlineOffset: '3px' }}>Terms</a>
            {' · '}
            <a href="#" style={{ textUnderlineOffset: '3px' }}>Privacy</a>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
