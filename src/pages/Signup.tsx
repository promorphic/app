import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthLayout, Field, foot, ghost, Heading, inkLink, Or, primary, Problem } from '../auth/AuthLayout';
import { CheckEmail } from '../auth/CheckEmail';
import { googleAccessToken, PopupClosed } from '../auth/google';
import { AUTH_ON, signedIn, takeReturn, useAuthConfig, type SignedIn } from '../auth/session';
import { Segmented } from '../components/Segmented';
import { ApiError, getApi } from '../lib/api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Problems = { name?: string; email?: string; organization?: string; agreed?: string; form?: string };
// Which field each of the API's refusals belongs to.
const FIELD: Record<string, keyof Problems> = { bad_email: 'email', name_required: 'name', organization_required: 'organization', terms_required: 'agreed' };

export default function Signup() {
  const navigate = useNavigate();
  const config = useAuthConfig();
  const carried = (useLocation().state as { email?: string } | null)?.email || '';
  const [type, setType] = useState<'Organization' | 'Individual'>('Organization');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(carried);
  const [organization, setOrganization] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [problems, setProblems] = useState<Problems>({});
  const [busy, setBusy] = useState<'' | 'email' | 'google'>('');
  const [sentTo, setSentTo] = useState('');

  const isOrg = type === 'Organization';
  const showGoogle = !AUTH_ON || !!config.data?.google;
  const showEmail = !AUTH_ON || !config.data || config.data.email;
  const clear = (k: keyof Problems) => { if (problems[k]) setProblems({ ...problems, [k]: undefined }); };
  const form = () => ({ intent: 'signup', accountType: isOrg ? 'organization' : 'individual', name: name.trim(), organization: isOrg ? organization.trim() : '', agreed });
  // What both ways of signing up need before anything is sent.
  const shared = (): Problems => ({
    organization: isOrg && !organization.trim() ? 'Enter the legal name of your organization.' : undefined,
    agreed: agreed ? undefined : 'Agree to the Terms and Privacy Policy to continue.',
  });
  const any = (p: Problems) => Object.values(p).some(Boolean);
  const fail = (e: unknown) => {
    if (e instanceof PopupClosed) return;
    const field = e instanceof ApiError ? FIELD[e.code] : undefined;
    setProblems({ [field || 'form']: (e as Error).message });
  };
  const send = (to: string) => getApi('/v1/auth/email', { ...form(), email: to });

  const withEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!AUTH_ON) return navigate('/');
    const to = email.trim();
    const p: Problems = {
      name: name.trim() ? undefined : 'Enter your full name.',
      email: EMAIL.test(to) ? undefined : 'Enter your work email, like you@company.com.',
      ...shared(),
    };
    setProblems(p);
    if (any(p)) return;
    setBusy('email');
    try { await send(to); setSentTo(to); } catch (err) { fail(err); } finally { setBusy(''); }
  };
  const withGoogle = async () => {
    if (!AUTH_ON) return navigate('/');
    if (!config.data?.google) return;
    const p = shared();
    setProblems(p);
    if (any(p)) return;
    setBusy('google');
    try {
      const accessToken = await googleAccessToken(config.data.google.clientId);
      signedIn(await getApi<SignedIn>('/v1/auth/google', { ...form(), accessToken }));
      navigate(takeReturn(), { replace: true });
    } catch (err) { fail(err); } finally { setBusy(''); }
  };

  return (
    <AuthLayout>
      {sentTo ? (
        <CheckEmail email={sentTo} isNew resend={() => send(sentTo)} back={() => { setSentTo(''); setProblems({}); }} />
      ) : (
        <>
          <Heading title="Create your account">It takes a minute. Verification comes next.</Heading>
          {config.isError && <Problem>Sign-up is unavailable right now. Try again in a moment.</Problem>}
          {AUTH_ON && config.data && !config.data.email && !config.data.google && <Problem>Sign-up is not switched on yet.</Problem>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>Account type</span>
            <div>
              <Segmented label="Account type" options={['Organization', 'Individual']} value={type} onChange={(t) => { setType(t); clear('organization'); }} />
            </div>
          </div>
          {showGoogle && (
            <button className="btn btn-ghost" type="button" style={ghost} disabled={!!busy} onClick={withGoogle}>
              {busy === 'google' ? 'Waiting for Google…' : 'Sign up with Google'}
            </button>
          )}
          {showGoogle && showEmail && <Or />}
          <form noValidate onSubmit={withEmail} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {showEmail && (
              <>
                <Field id="su-name" label="Full name" type="text" name="name" autoComplete="name" placeholder="Your name"
                  value={name} onChange={(e) => { setName(e.target.value); clear('name'); }} error={problems.name} />
                <Field id="su-email" label="Work email" type="email" name="email" autoComplete="email" placeholder="you@company.com"
                  value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} error={problems.email} />
              </>
            )}
            {isOrg && (
              <Field id="su-org" label="Organization" type="text" name="organization" autoComplete="organization" placeholder="Legal name of your organization"
                value={organization} onChange={(e) => { setOrganization(e.target.value); clear('organization'); }} error={problems.organization} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="su-agree" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minHeight: '44px', fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-muted)', cursor: 'pointer' }}>
                <input id="su-agree" type="checkbox" checked={agreed} aria-describedby={problems.agreed ? 'su-agree-problem' : undefined}
                  onChange={(e) => { setAgreed(e.target.checked); clear('agreed'); }} style={{ width: '18px', height: '18px', margin: '2px 0 0', accentColor: 'var(--ink)' }} />
                <span>
                  {'I agree to the '}
                  <a href="#" style={inkLink}>Terms</a>
                  {' and '}
                  <a href="#" style={inkLink}>Privacy Policy</a>.
                </span>
              </label>
              <Problem id="su-agree-problem">{problems.agreed}</Problem>
            </div>
            {showEmail && (
              <button className="btn btn-primary" type="submit" style={primary} disabled={!!busy}>
                {busy === 'email' ? 'Sending…' : 'Create account'}
              </button>
            )}
          </form>
          <Problem>{problems.form}</Problem>
          <p style={foot}>
            {'Already have an account? '}
            <Link to="/login/" style={inkLink}>Sign in</Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
