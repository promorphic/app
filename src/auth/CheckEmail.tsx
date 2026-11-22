import { useState } from 'react';
import { ghost, Heading, note, Problem } from './AuthLayout';

// Shown once a link has been sent. Nothing more happens in this tab: the link in the email finishes the job.
export function CheckEmail({ email, isNew, resend, back }: { email: string; isNew: boolean; resend: () => Promise<unknown>; back: () => void }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [problem, setProblem] = useState('');
  const again = async () => {
    setState('sending'); setProblem('');
    try { await resend(); setState('sent'); } catch (e) { setProblem((e as Error).message); setState('idle'); }
  };
  return (
    <>
      <Heading title="Check your email">
        We sent a link to <strong style={{ fontWeight: 500, color: 'var(--ink)', overflowWrap: 'anywhere' }}>{email}</strong>. Open it on this device to {isNew ? 'finish creating your account' : 'sign in'}.
      </Heading>
      <p style={note}>The link works once and expires in 15 minutes. If it is not in your inbox, look in spam.</p>
      <button className="btn btn-ghost" type="button" style={ghost} disabled={state === 'sending'} onClick={again}>
        {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Sent again' : 'Send it again'}
      </button>
      <Problem>{problem}</Problem>
      <p style={{ ...note, fontSize: '14px' }}>
        <a href="#" onClick={back} style={{ textUnderlineOffset: '3px' }}>Use a different email</a>
      </p>
    </>
  );
}
