import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Logo } from '../layout/Logo';
import { ThemeSwitch } from '../layout/ThemeSwitch';
import { eyebrow, MONO, SANS } from '../layout/styles';

// Terms of Use and Privacy Policy. Interim text, written for what the app does today and waiting on
// counsel's own draft. When either changes, change UPDATED here and TERMS_VERSION in the API.
const UPDATED = '23 November 2026';
const CONTACT = 'founders@promorphic.xyz';

type Section = { title: string; body: ReactNode[] };

const mail = <a href={`mailto:${CONTACT}`} style={{ color: 'var(--ink)', textUnderlineOffset: '3px' }}>{CONTACT}</a>;

const TERMS: Section[] = [
  { title: 'What these terms cover', body: [
    'These terms apply to app.promorphic.xyz and the Promorphic API behind it (together, the service). By creating an account or using the service you agree to them. If you use the service for an organization, you confirm that you may accept these terms for it, and "you" means that organization as well.',
  ] },
  { title: 'What Promorphic is, and is not', body: [
    'Promorphic is software for finding, holding, trading and managing tokenized assets across issuers and chains, including through an agent that works within limits you set.',
    'Promorphic is not a broker, dealer, exchange, custodian, investment adviser or bank, and it does not issue any of the assets shown. Assets are issued by third parties. Trades are carried out by third-party venues and by smart contracts on public blockchains, in transactions that you sign with your own wallet.',
    'Promorphic never holds your assets or your keys. Nobody at Promorphic can move, freeze or recover what is in your wallet.',
  ] },
  { title: 'Your account', body: [
    'You sign in with a link sent to your email address or with Google. Give accurate details when you sign up, keep access to your email and Google account secure, and tell us promptly if you think someone else has used your account. You are responsible for what is done through it.',
    'You must be at least 18 years old and legally able to enter into these terms.',
  ] },
  { title: 'Eligibility and restricted assets', body: [
    'Some assets may only be offered to certain people or in certain countries. Their issuers set those rules, and you are responsible for following the rules that apply to you.',
    'Before a trade in a restricted asset, the service may check the country you are connecting from and ask you to confirm statements about yourself. You must answer truthfully and tell us if an answer stops being true. You must not use a VPN or any other means to get around a restriction. We may refuse a quote or a trade where a check is not met.',
  ] },
  { title: 'Prices, quotes and information', body: [
    'Prices, yields, net asset values and holdings shown in the service come from issuers, venues and public blockchains. They are indicative, they can be late or wrong, and they are not an offer. Only a quote you accept and sign is executable, and its final terms are set by the venue and the network, not by Promorphic.',
    'Nothing in the service is investment, legal or tax advice, or a recommendation to buy, sell or hold anything. Decide for yourself, and take professional advice where you need it.',
  ] },
  { title: 'Your agent and mandates', body: [
    'If you use an agent, it acts on your instructions and within the mandates you give it. You are responsible for those instructions and limits and for reviewing what the agent proposes or does. Transactions still need your wallet\'s signature unless you have expressly arranged otherwise.',
  ] },
  { title: 'Risks you accept', body: [
    'Tokenized assets can lose some or all of their value. Blockchain transactions cannot be reversed. Smart contracts, bridges, wallets and venues can fail or be attacked. Issuers can freeze, redeem or claw back tokens where their terms allow it. Network fees and slippage change the amount you receive. Laws and their interpretation can change. You accept these risks when you use the service.',
  ] },
  { title: 'Third parties', body: [
    'The service connects to issuers, trading venues, wallet software, blockchains and data providers that Promorphic does not control. Their own terms apply to your use of them, and Promorphic is not responsible for what they do or fail to do.',
  ] },
  { title: 'Acceptable use', body: [
    'Do not use the service to break the law, to deal with anyone subject to sanctions, to launder money, to manipulate a market, to misstate who or where you are, to interfere with the service or probe it for weaknesses without our written permission, or to collect data from it by automated means beyond the API\'s published limits.',
  ] },
  { title: 'Fees', body: [
    'Promorphic does not currently charge for the service. Network fees and any fees charged by venues or issuers are shown where we can show them and are paid by you. If we introduce fees, we will say so before they apply.',
  ] },
  { title: 'Our content and yours', body: [
    'The service, its software and its design belong to Promorphic. You may use them only to use the service. Names and logos of issuers, venues and chains belong to their owners and identify what can be reached through the service; they do not imply an endorsement or partnership.',
  ] },
  { title: 'No warranty, and limits on liability', body: [
    'The service is provided as it is and as available. To the fullest extent the law allows, Promorphic gives no warranty about it, including that it will be uninterrupted, accurate or free of errors.',
    'To the fullest extent the law allows, Promorphic is not liable for lost profits, lost assets, lost data or any indirect or consequential loss arising from your use of the service, including losses caused by third parties, blockchains, or transactions you signed. Nothing in these terms limits liability that cannot lawfully be limited.',
  ] },
  { title: 'Suspension and closing an account', body: [
    'You can stop using the service at any time and ask us to delete your account. We may suspend or close an account, or withhold a feature, where these terms are broken, where the law requires it, or where it is needed to protect the service or other people. Closing an account does not affect assets in your wallet.',
  ] },
  { title: 'Changes', body: [
    'The service is under active development and may change. We may also change these terms. When a change is material we will ask you to accept the new terms before you continue.',
  ] },
  { title: 'Contact', body: [
    <>Questions about these terms: {mail}.</>,
  ] },
];

const PRIVACY: Section[] = [
  { title: 'Who this covers', body: [
    'This policy describes what Promorphic collects through app.promorphic.xyz and its API, why, and what you can do about it.',
  ] },
  { title: 'What we collect', body: [
    'Account details: your email address, your name, whether the account is for an organization or an individual, the organization\'s name, and when you agreed to the terms. If you sign in with Google, we receive your name and email address from Google and nothing else.',
    'Sign-in records: a record of each sign-in link we send and of each session. We store only a scrambled form (a hash) of links and session tokens, not the tokens themselves.',
    'Wallet addresses you connect or enter, and the public blockchain balances and transactions for them. A wallet address is public, but together with your account it can identify you.',
    'Eligibility declarations: where an asset requires one, the wallet address, the version of the statements you confirmed, the time, and the country you connected from.',
    'Technical records: our hosting provider logs each request to the API, including the address it came from, for security and for fixing faults. We use that address to work out your country for eligibility checks. We do not store it with your account or your declaration.',
  ] },
  { title: 'What we do not collect', body: [
    'We never see or store your private keys or recovery phrases. We do not use advertising or analytics trackers, and we do not sell personal information.',
  ] },
  { title: 'What is kept in your browser', body: [
    'The app keeps a few things in your browser\'s storage so it works: your session, your light or dark setting, a wallet address you saved, and where to return you after signing in. These stay on your device and you can clear them at any time. Signing in with Google or connecting a wallet loads code from those providers, which may set storage of their own.',
  ] },
  { title: 'Why we use it', body: [
    'To create your account and sign you in, to show your holdings and prepare quotes, to meet the restrictions issuers place on their assets, to keep the service secure and working, and to contact you about your account.',
  ] },
  { title: 'Who else handles it', body: [
    'Google Cloud hosts the API and its database. Google provides sign-in with Google. Resend sends sign-in emails. Reown relays connections to mobile wallets. Blockchain data providers and trading venues receive the wallet addresses and trade details needed to return balances and quotes. Each handles information under its own terms, only as needed to provide its part.',
    'We may also disclose information where the law requires it, or to protect the service and the people who use it.',
  ] },
  { title: 'Where it is kept, and for how long', body: [
    'Account and declaration records are stored in the European Union; some providers process information in other countries. We keep account details while the account is open, sign-in links for 15 minutes, sessions for up to 30 days, and eligibility declarations for as long as the law or the issuer\'s rules require. Information written to a public blockchain cannot be changed or deleted by anyone.',
  ] },
  { title: 'Your choices', body: [
    <>You can ask for a copy of the information we hold about you, ask us to correct it, or ask us to delete your account, by writing to {mail}. Depending on where you live you may have further rights, including to object to how we use your information or to complain to your data protection authority.</>,
  ] },
  { title: 'Security', body: [
    'Sign-in uses one-time links or Google, so we hold no passwords. Tokens are stored only as hashes, and connections to the service are encrypted. No system is perfectly secure, so keep your email account and wallet protected.',
  ] },
  { title: 'Children', body: [
    'The service is for adults. We do not knowingly collect information from anyone under 18.',
  ] },
  { title: 'Changes and contact', body: [
    <>We will update this page when what we collect or how we use it changes. Questions: {mail}.</>,
  ] },
];

function LegalPage({ title, lead, sections, other }: { title: string; lead: string; sections: Section[]; other: { to: string; label: string } }) {
  return (
    <div className="app-root" style={{ boxSizing: 'border-box', background: 'var(--surface-0)', color: 'var(--ink)', fontFamily: SANS }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--hairline)' }}>
        <Logo style={{ padding: '0 8px' }} />
        <span style={{ marginLeft: 'auto' }}><ThemeSwitch /></span>
      </div>
      <main className="legal" style={{ boxSizing: 'border-box', maxWidth: '720px', margin: '0 auto', padding: '56px 24px 96px' }}>
        <div style={eyebrow}>Legal</div>
        <h1 style={{ margin: '12px 0 0', fontSize: '40px', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.025em' }}>{title}</h1>
        <p style={{ margin: '12px 0 0', fontFamily: MONO, fontSize: '12px', letterSpacing: '0.02em', color: 'var(--ink-muted)' }}>Last updated {UPDATED}</p>
        <p style={{ margin: '24px 0 0', padding: '14px 16px', border: '1px solid var(--hairline)', borderRadius: '2px', background: 'var(--surface-1)', fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-muted)' }}>
          This is an interim version while the service is in early access. It will be replaced by a version reviewed by our counsel.
        </p>
        <p style={{ margin: '24px 0 0', fontSize: '18px', lineHeight: 1.55, color: 'var(--ink)' }}>{lead}</p>
        {sections.map((s, i) => (
          <section key={s.title} style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--hairline)' }}>
            <h2 style={{ margin: 0, display: 'flex', gap: '16px', alignItems: 'baseline', fontSize: '20px', lineHeight: 1.25, fontWeight: 500, letterSpacing: '-0.01em' }}>
              <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: '12px', letterSpacing: '0.14em', color: 'var(--ink-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} style={{ margin: '14px 0 0', fontSize: '16px', lineHeight: 1.65, color: 'var(--ink-muted)' }}>{p}</p>
            ))}
          </section>
        ))}
        <p style={{ margin: '48px 0 0', paddingTop: '24px', borderTop: '1px solid var(--hairline)', fontSize: '14px', color: 'var(--ink-muted)' }}>
          <Link to={other.to} style={{ color: 'var(--ink)', textUnderlineOffset: '3px' }}>{other.label}</Link>
          {' · '}
          <Link to="/" style={{ color: 'var(--ink)', textUnderlineOffset: '3px' }}>Back to the app</Link>
        </p>
      </main>
    </div>
  );
}

export function Terms() {
  return <LegalPage title="Terms of Use" sections={TERMS} other={{ to: '/privacy/', label: 'Privacy Policy' }}
    lead="The short version: Promorphic is software. You keep custody of your assets, you sign your own transactions, and you are responsible for your decisions and for following the rules that apply to you." />;
}

export function Privacy() {
  return <LegalPage title="Privacy Policy" sections={PRIVACY} other={{ to: '/terms/', label: 'Terms of Use' }}
    lead="The short version: we keep what is needed to run your account and meet issuers' rules, we never hold your keys, and we do not sell your information or track you for advertising." />;
}
