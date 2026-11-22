// The browser wallet, for trading on Robinhood Chain. Plain EIP-1193 calls, no library.
// Everything here either reads through the wallet or asks it to sign; nothing is signed without the
// wallet's own confirmation window.

export const CHAIN_ID = 4663;
const CHAIN_HEX = '0x' + CHAIN_ID.toString(16);
const CHAIN = {
  chainId: CHAIN_HEX,
  chainName: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
  blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
};
export const txUrl = (hash: string) => `${CHAIN.blockExplorerUrls[0]}/tx/${hash}`;

interface Provider { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }
export const browserWallet = () => (window as { ethereum?: Provider }).ethereum?.request ? (window as { ethereum?: Provider }).ethereum! : null;

// A wallet's own errors carry a code; 4001 is the person saying no.
export function walletMessage(e: unknown): string {
  const err = e as { code?: number; message?: string };
  if (err?.code === 4001) return 'You declined it in your wallet, so it was not sent.';
  return err?.message || 'The wallet returned an error.';
}

// The wallet must be on the address set in the app and on Robinhood Chain before anything is signed.
export async function connect(expected: string): Promise<Provider> {
  const wallet = browserWallet();
  if (!wallet) throw new Error('No browser wallet was found. Open this page in a browser with a wallet extension.');
  const accounts = (await wallet.request({ method: 'eth_requestAccounts' })) as string[];
  const account = accounts?.[0] || '';
  if (account.toLowerCase() !== expected.toLowerCase()) {
    throw new Error(`Your browser wallet is on ${account ? account.slice(0, 6) + '…' + account.slice(-4) : 'no account'}, not the wallet set here. Switch account in the wallet, or change the wallet on the Wallets page.`);
  }
  if (((await wallet.request({ method: 'eth_chainId' })) as string).toLowerCase() !== CHAIN_HEX) {
    try {
      await wallet.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] });
    } catch (e) {
      if ((e as { code?: number }).code !== 4902) throw e; // 4902: the wallet does not know the chain yet
      await wallet.request({ method: 'wallet_addEthereumChain', params: [CHAIN] });
    }
    if (((await wallet.request({ method: 'eth_chainId' })) as string).toLowerCase() !== CHAIN_HEX) throw new Error('The wallet is not on Robinhood Chain.');
  }
  return wallet;
}

const word = (hex: string) => hex.replace(/^0x/, '').toLowerCase().padStart(64, '0');
const call = async (wallet: Provider, to: string, data: string) =>
  BigInt(((await wallet.request({ method: 'eth_call', params: [{ to, data }, 'latest'] })) as string) || '0x0');

export const balanceOf = (wallet: Provider, token: string, owner: string) => call(wallet, token, '0x70a08231' + word(owner));
export const allowance = (wallet: Provider, token: string, owner: string, spender: string) =>
  call(wallet, token, '0xdd62ed3e' + word(owner) + word(spender));

// approve(spender, amount) for exactly the amount being sold, never an open-ended allowance.
export const approve = (wallet: Provider, from: string, token: string, spender: string, amount: bigint) =>
  send(wallet, { from, to: token, data: '0x095ea7b3' + word(spender) + word(amount.toString(16)) });

// Asks the wallet to sign and send. The wallet estimates gas itself. Returns the transaction hash.
export async function send(wallet: Provider, tx: { from: string; to: string; data: string; value?: string | null }): Promise<string> {
  const value = '0x' + BigInt(tx.value || 0).toString(16);
  return (await wallet.request({ method: 'eth_sendTransaction', params: [{ from: tx.from, to: tx.to, data: tx.data, value }] })) as string;
}

// Waits until the transaction is in a block. Throws if it reverted or is not seen within two minutes.
export async function confirmed(wallet: Provider, hash: string): Promise<void> {
  for (let i = 0; i < 80; i++) {
    const r = (await wallet.request({ method: 'eth_getTransactionReceipt', params: [hash] })) as { status?: string } | null;
    if (r) {
      if (BigInt(r.status || '0x0') !== 1n) throw new Error('The transaction failed on chain. Nothing was traded.');
      return;
    }
    await new Promise((done) => setTimeout(done, 1500));
  }
  throw new Error('The transaction has not confirmed yet. Check it in the explorer before trying again.');
}
