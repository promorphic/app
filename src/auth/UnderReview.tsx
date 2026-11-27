import { Link } from 'react-router';
import { ApiError } from '../lib/api';
import { ghost, Heading, note, primary } from './AuthLayout';

// The API's answer to an address that is not let in yet: while the app is not open to everyone, only
// allowlisted addresses may sign in or sign up (backend api/README.md, "Who may sign in"). The API
// has already told the team about the attempt.
export const isUnderReview = (e: unknown) => e instanceof ApiError && e.code === 'email_under_review';

// Shown in place of the sign-in or sign-up form after such an answer. `email` is the address when
// the app knows it (it does not after Google); `back` returns to the form.
export function UnderReview({ email, back }: { email?: string; back?: () => void }) {
  return (
    <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Heading title="Your email is being reviewed">
        Promorphic is not open to everyone yet.{' '}
        {email ? <strong style={{ fontWeight: 500, color: 'var(--ink)', overflowWrap: 'anywhere' }}>{email}</strong> : 'Your email'} is being reviewed for access, and we will be in touch within a week.
      </Heading>
      <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.5, color: 'var(--ink)' }}>
        Try out our sandbox instead. It has the same screens, with test assets that have no value.
      </p>
      <Link to="/sandbox/" className="btn btn-primary" style={{ ...primary, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Open the sandbox</Link>
      <p style={{ ...note, fontFamily: "'Geist Mono', 'SF Mono', Menlo, Consolas, monospace" }}>app.promorphic.xyz/sandbox</p>
      {back && <button className="btn btn-ghost" type="button" style={ghost} onClick={back}>Use a different email</button>}
    </div>
  );
}
