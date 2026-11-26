# Features

What the app at [app.promorphic.xyz](https://app.promorphic.xyz) does today, screen by screen, and what is still sample data. Last checked against the code on 24 November 2026.

**Live** means the screen reads or writes through the Promorphic API, a blockchain or an issuer. **Sample** means designed rows with no data behind them. Buttons with nothing behind them show "not yet" in the status line at the foot of the screen.

## Before any screen

| Feature | What it does | Where |
| --- | --- | --- |
| Region gate | The app first asks the API (`/v1/access`) whether the visitor's country is allowed. A visitor from the United States or a sanctioned country sees one plain "Not available" page, with links to the Terms and Privacy pages. If the API cannot answer, the app carries on, because the API refuses what it must anyway. | `src/access/RegionGate.tsx` |
| Sign-in gate | With the `VITE_AUTH=on` build setting (on in the live build), every app screen needs a session. A signed-out visitor is sent to sign in and brought back to the screen they asked for afterwards. | `src/auth/RequireAuth.tsx`, `src/auth/session.ts` |
| Theme | Dark and light versions of every screen, switched from the header. The choice is remembered, a first visit follows the system setting, and the theme is set before the first paint so there is no flash. | `index.html`, `src/lib/theme.ts`, `src/styles/app.css` |
| Narrow screens | Every screen works at phone width: the sidebar folds away, and wide tables either scroll or stack into blocks (Promorphic wallet). | `src/styles/app.css`, `src/wallet/wallet.css` |

## Sign in and sign up (live)

| Screen | Path | What it does |
| --- | --- | --- |
| Sign in | `/login/` | A sign-in link by email, or Google. A Google account with no Promorphic account goes straight on to sign-up with Google's confirmation kept, so the person is asked only for the account's details. |
| Sign up | `/signup/` | Name, work email, whether the account is for an organization or an individual (and the organization's name), and one box to tick: agreeing to the Terms and Privacy Policy and confirming the person is not a US person. Then a link by email, or Google. |
| Check your email | after sending | Says a link was sent. The link in the email finishes signing in, in whichever tab it opens. |
| Verify | `/auth/verify` | Where the email link lands. It swaps the link's one-time token for a session. |

- **Sessions** last up to 30 days and are checked with the API every 5 minutes. Signing in or out in one tab does the same in the others.
- **Look:** a colour photograph of the Financial District at dusk fills the page, with the headline "Hold, trade and manage tokenized assets from one place." above a centred card. The photo is by Zoshua Colah, used under the Unsplash licence.
- The API emails sign-in links through Resend and checks Google tokens with Google (`backend/api/src/auth.js`).

## App screens

| Screen | Path | State | What it shows |
| --- | --- | --- | --- |
| Assets | `/` | Live | Every listed tokenized asset, searchable from the header, with six filters (issuer, class, chain, settlement, access, yield). With no filter or search, it opens on each issuer's flagship assets. Prices come from each chain (below), and a Stock Token's row opens a quote and trade dialog. |
| Portfolio | `/portfolio/` | Live | Total value across the account's linked wallets, split into Stock Tokens and cash, each wallet's holdings, and a value-by-day line built from daily snapshots (up to 90 days). Indicative. |
| Orders | `/orders/` | Live | The account's trades, filterable by open, settled, failed and cancelled, 25 at a time. Refreshed every 30 seconds. |
| Activity | `/activity/` | Live | Everything that happened on the account, filterable by who did it (you, the agent, the system), 50 at a time. |
| Your agent | `/agent/` | Sample | The designed agent screen: a Copilot or Autopilot mode switch and an ask box. Nothing behind it yet. |
| Mandates | `/mandates/` | Sample | The designed mandates screen. Nothing behind it yet. |
| Wallets | `/wallets/` | Live | The Promorphic wallet card, then the wallets linked to the account. |
| Terms of Use, Privacy Policy | `/terms/`, `/privacy/` | Live | Interim texts written for what the app does today, waiting for counsel's version. Open to everyone, even from blocked countries. |
| Not found | any other path | | A plain "not found" screen. |

## Assets: live data per chain

| Chain | Rows | Price column | Refresh |
| --- | --- | --- | --- |
| Robinhood Chain | Stock Tokens from the API's live registry. They replace the snapshot's Stock Tokens, keeping each asset's class from the snapshot. | Indicative price from the API | List every 5 min, prices every 15 s |
| Stellar | Assets from the API, each verified against its issuer's domain. A fund already listed on another chain keeps its row and gains the Stellar chain. | The issuer's net asset value where one is published (Spiko, Etherfuse, Centrifuge), else the mid of the Stellar exchange's USDC book. A dash when there is neither. 30-day yield too. | List every 10 min, prices every minute |
| Avalanche C-Chain | 29 assets with a verified contract, written into the snapshot by the backend's lister | Net asset value per token, read by the browser from the public C-Chain RPC (RedStone, Chainlink and issuer feeds) and Centrifuge's API. Tether Gold shows gold spot. | Every 5 min |

If a live source fails, the list falls back to the snapshot in `data/assets.json` and shows a dash for live prices. How to list assets and set the opening order is in the [README](../README.md).

## Trading Robinhood Stock Tokens (live)

1. **Quote.** A Stock Token's row gives an indicative quote that compares LiFi and 0x.
2. **Eligibility.** The same dialog says whether this visitor may trade Stock Tokens. The API checks the connection's country, and a wallet in an allowed country confirms a short declaration, which the API records.
3. **Trade.** An eligible wallet takes a firm quote, reviews it, then signs two steps in its own wallet: an approval for exactly the amount sold, then the trade. The order is recorded on the account as it goes: awaiting the wallet, approving, submitted, then settled or failed.
4. **Who signs.** A browser wallet extension, or a phone wallet paired through WalletConnect (a QR code on desktop, a link that opens the wallet app on a phone). The app never holds a key.

## Wallets screen

### Linked wallets (live)

- **Linking.** A wallet can be linked by pasting an address, from a browser wallet, or through WalletConnect, and is stored on the account so it appears on every device. Reading a wallet needs no signature.
- **The trading wallet.** Which wallet trades are made from is a per-device choice, kept in the browser, because whether a wallet can sign depends on the device. A device with no choice yet picks the account's first linked wallet.
- A wallet can be renamed or removed. Removing one stops showing its balances; nothing changes in the wallet itself.

### Promorphic wallet (live on testnet)

- **One wallet per account,** self-custody and held in Turnkey, with its own address on Robinhood Chain, Avalanche C-Chain, Stellar and Canton.
- **Actions:** create it, copy each address, open it in the chain's explorer, see balances (refreshed every minute), send each chain's own coin, fund Stellar from the testnet Friendbot, and register a Canton party.
- **Sending:** the API prepares each send as a signing request, and the app shows every detail (from, to, amount, maximum fee, whether it creates the destination account). The person signs within 5 minutes or it is dropped, and closing the dialog cancels it. After signing, the app follows the transaction until the network confirms it or it fails.
- **Signing:** live, Turnkey signs in the browser after a code Turnkey emails to the account's address. Locally, the API's development key signs instead (`WALLET_PROVIDER=dev`).
- **Tested live on 24 November 2026:** wallet creation, Friendbot funding, and a 2 XLM Stellar testnet send signed through Turnkey and confirmed.
- **Not tested live:** sends from Robinhood Chain and Avalanche (no test coins yet), and Canton, because the live API has no Canton ledger and the card shows "Not available here".
- The card hides itself where the API has no Promorphic wallets.

## The test account (live on Canton MainNet)

One shared account, for people reviewing Promorphic. It signs in at `/sandbox/` with `test@promorphic.xyz` and a password, from the United States as well as wherever the app opens, though not from a sanctioned country, and every screen shows test assets only. The app calls it the sandbox, and all of its screens are under `/sandbox/`. Each action is a real transaction on Canton MainNet through Promorphic's validator; the instruments have no value. Code: `src/chains/canton/`. First run on MainNet: 26 November 2026.

| Screen | What the test account sees |
| --- | --- |
| Assets | Eighteen test instruments, each with a 30d yield. Six are on Canton (CC-TEST, TBILL-TEST, MMF-TEST, BOND-TEST, GOLD-TEST, EQTY-TEST), priced in CC-TEST, and the list opens with Canton chosen in the Chain filter. The other twelve are listings on the other chains, so the list looks as it does for a real account; nothing stands behind them and they do not trade. |
| Portfolio | What its Canton party holds, read from the ledger: available, locked to a settlement, and value in CC-TEST. It starts with 10,000 CC-TEST. |
| Mandates | One preset mandate. Signing it creates the contract on the ledger, signed by the party's key. Then pause, resume or revoke. The table shows the limits and what has been used today. |
| Your agent | An ask box and six things to try. A trade inside the limits settles in four ledger transactions; one outside them is refused by the ledger, and so is an attempt by the agent to send assets out. Each answer lists its ledger updates. |
| Orders, Activity | The same screens as any account, showing the agent's trades: settled with their ledger update, or refused with the ledger's reason. Amounts are in CC-TEST. |
| Wallets | The party's ID, Promorphic's own parties (agent, venue, price provider, test registry, test counterparty), and a reset that puts the account back to 10,000 CC-TEST with no mandate and no history. |

- **The agent here follows plain instructions** ("buy 100 TBILL-TEST"), read by a small parser in the API. There is no language model behind it.
- **The key.** The party is an external party, like a customer's, but its key is held by the API, for this account only.
- **Nothing else is reachable.** The API refuses this session every other endpoint.

## Not built yet

- The agent and mandates for ordinary accounts: their screens are sample only. They are live for the test account alone (above).
- Trading on any chain but Robinhood Chain.
- Turnkey's captcha on its code emails and sign-up. See [decisions.md](decisions.md), "Turnkey captcha off for now".
- Mainnet for the Promorphic wallet. It runs on test networks only.
- Filtering assets by the investor's jurisdiction. The data does not exist yet; see [feature-requests.md](feature-requests.md).
