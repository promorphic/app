// WalletConnect, for a wallet on a phone: the app pairs with it over the WalletConnect relay and the
// wallet signs there. The provider is loaded only when someone uses it, so the main bundle stays small.
// The project ID comes from Reown (cloud.reown.com) at build time; without one the option is hidden.
import { currentWallet, isAddress, setWallet, useWallet, walletVia } from './wallet';

const PROJECT_ID = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '').trim();
export const wcConfigured = PROJECT_ID !== '';

const CHAIN = 'eip155:4663';
const RPC = 'https://rpc.mainnet.chain.robinhood.com';
// Ethereum is offered too, so a wallet that does not know Robinhood Chain yet can still pair and be
// asked to add it. Only what a trade needs is requested: sending a transaction and changing chain.
const NAMESPACES = {
  eip155: {
    chains: [CHAIN, 'eip155:1'],
    methods: ['eth_sendTransaction', 'wallet_switchEthereumChain', 'wallet_addEthereumChain'],
    events: ['chainChanged', 'accountsChanged'],
    rpcMap: { '4663': RPC },
  },
};

type Request = { method: string; params?: unknown[] };
interface Session { namespaces: Record<string, { accounts: string[] }>; peer: { metadata: { name?: string; redirect?: { native?: string; universal?: string } } } }
interface Client {
  session?: Session;
  request: (args: Request) => Promise<unknown>;
  connect: (opts: { optionalNamespaces: typeof NAMESPACES }) => Promise<Session | undefined>;
  disconnect: () => Promise<void>;
  on: (event: string, listener: (arg: never) => void) => void;
  off: (event: string, listener: (arg: never) => void) => void;
}

let loading: Promise<Client> | null = null;
function client(): Promise<Client> {
  if (!wcConfigured) return Promise.reject(new Error('WalletConnect is not set up for this site.'));
  loading ??= import('@walletconnect/universal-provider')
    .then(({ UniversalProvider }) => UniversalProvider.init({
      projectId: PROJECT_ID,
      logger: 'error',
      metadata: {
        name: 'Promorphic',
        description: 'Tokenized assets across chains.',
        url: location.origin,
        icons: [location.origin + '/apple-touch-icon.png'],
      },
    }))
    .then((p) => {
      const c = p as unknown as Client;
      c.on('session_delete', ended); // the wallet ended the session
      return c;
    })
    .catch((e) => { loading = null; throw e; });
  return loading;
}

// The address stays, so its balances can still be read; only the means of signing is gone.
function ended() {
  forgetLink();
  if (walletVia() === 'walletconnect') setWallet(currentWallet(), null);
}

const account = (s?: Session) => s?.namespaces.eip155?.accounts?.[0]?.split(':')[2] || '';

// The paired wallet as an EIP-1193 provider, or null when there is no live session (and then the
// saved wallet stops claiming one). Read calls go straight to the chain's RPC, not to the phone.
export async function wcWallet(): Promise<{ request: (args: Request) => Promise<unknown> } | null> {
  const c = await client();
  if (!c.session) { ended(); return null; }
  return {
    request: async (args) => {
      if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') return [account(c.session)].filter(Boolean);
      if (args.method === 'eth_chainId') return '0x' + Number(await c.request(args)).toString(16);
      if (args.method === 'wallet_switchEthereumChain') {
        try { return await c.request(args); } catch (e) {
          if ((e as { code?: number }).code === 4001) throw e;
          throw Object.assign(new Error('The wallet does not have Robinhood Chain yet.'), { code: 4902 }); // so the caller offers to add it
        }
      }
      return c.request(args);
    },
  };
}

// Starts a pairing. `onUri` receives the link the wallet must open (shown as a QR code or a deep
// link); resolves with the wallet's address once it approves. Rejects if it declines or the link expires.
export async function wcPair(onUri: (uri: string) => void): Promise<string> {
  const c = await client();
  if (c.session) await c.disconnect().catch(() => {});
  c.on('display_uri', onUri as (arg: never) => void);
  try {
    const session = await c.connect({ optionalNamespaces: NAMESPACES });
    const address = account(session);
    if (!isAddress(address)) throw new Error('The wallet did not share an Ethereum address.');
    // On a phone with no wallet chosen by name, the wallet's own link is how later requests reach it.
    const back = session?.peer.metadata.redirect;
    if (onPhone() && !wcLink() && (back?.universal || back?.native)) rememberLink(session!.peer.metadata.name || 'wallet', (back.universal || back.native)!);
    return address;
  } catch (e) {
    const err = e as { code?: number; message?: string };
    if (err?.code === 5000 || /reject|declin/i.test(err?.message || '')) throw new Error('The wallet declined the connection.');
    if (/expired/i.test(err?.message || '')) throw new Error('The connection request expired before the wallet approved it.');
    throw e;
  } finally {
    c.off('display_uri', onUri as (arg: never) => void);
  }
}

export async function wcDisconnect(): Promise<void> {
  forgetLink();
  if (!wcConfigured) return;
  try { const c = await client(); if (c.session) await c.disconnect(); } catch { /* the session is dropped here either way */ }
}

// Whether the wallet set here signs through WalletConnect.
export const useViaWalletConnect = () => { useWallet(); return walletVia() === 'walletconnect'; };

// A phone opens the wallet app through a link instead of scanning a code.
export const onPhone = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

// WalletConnect's own key: the client opens this link whenever it sends the wallet a request.
const LINK_KEY = 'WALLETCONNECT_DEEPLINK_CHOICE';
export const PHONE_WALLETS = [
  { name: 'MetaMask', href: 'https://metamask.app.link' },
  { name: 'Trust Wallet', href: 'https://link.trustwallet.com' },
  { name: 'Rainbow', href: 'https://rnbw.app' },
];
export const pairingLink = (href: string, uri: string) => `${href}/wc?uri=${encodeURIComponent(uri)}`;
export function rememberLink(name: string, href: string) {
  try { localStorage.setItem(LINK_KEY, JSON.stringify({ name, href })); } catch { /* private window */ }
}
export function forgetLink() {
  try { localStorage.removeItem(LINK_KEY); } catch { /* private window */ }
}
export function wcLink(): { name: string; href: string } | null {
  try {
    const v = JSON.parse(localStorage.getItem(LINK_KEY) || 'null');
    return v && typeof v.href === 'string' && /^https:\/\//.test(v.href) ? v : null;
  } catch { return null; }
}

// The pairing link as a QR code: the side length in modules and one SVG path for the dark ones.
export async function qr(text: string): Promise<{ size: number; path: string }> {
  const { encode } = await import('uqr');
  const { data, size } = encode(text, { ecc: 'M', border: 2 });
  let path = '';
  data.forEach((row, y) => row.forEach((dark, x) => { if (dark) path += `M${x} ${y}h1v1h-1z`; }));
  return { size, path };
}

// After a reload, a saved WalletConnect wallet either gets its session back or stops claiming one.
if (wcConfigured && walletVia() === 'walletconnect') void wcWallet().catch(() => {});
else if (!wcConfigured && walletVia() === 'walletconnect') ended();
