# Architecture

How the app is put together, where each piece lives, and how it talks to the outside world. Why it is this way is in [decisions.md](decisions.md); what it does is in [features.md](features.md).

## At a glance

```
Browser (app.promorphic.xyz, GitHub Pages)
 ├─ Promorphic API (Cloud Run, promorphic-api)   accounts, sign-in, prices, quotes, eligibility, wallets
 ├─ Turnkey (api.turnkey.com, Auth Proxy)        email codes and signing for the Promorphic wallet
 ├─ Browser wallet or WalletConnect relay        signing trades from linked wallets
 ├─ Avalanche C-Chain RPC, Centrifuge API        net asset values, read directly
 └─ Google Identity Services                     sign-in with Google
```

The app is static files: a single-page React app with no server of its own. Everything private goes through the API, which lives in the private `promorphic/backend` repo (`api/`).

## Stack

| Piece | Choice |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 8 (`vite.config.ts`) |
| Routing | React Router, with a static copy of the page per route (see Hosting) |
| Server data | TanStack Query: caching, refresh timers, pagination |
| Local state | A tiny external store (`src/lib/store.ts`, `useSyncExternalStore`) for the session, the theme, the search box and the trading wallet |
| Styling | Plain CSS with design-system variables, plus inline styles. No CSS framework. Font: Geist and Geist Mono from Google Fonts. |
| Signing | Browser wallets (EIP-1193), `@walletconnect/universal-provider`, `@turnkey/core` |
| Other dependencies | `uqr` for WalletConnect QR codes |

## Folders

| Path | What it holds |
| --- | --- |
| `index.html` | Sets the theme before first paint. Loads the fonts. |
| `src/main.tsx` | Query client defaults (retry once, keep data 30 min, refetch on focus), router, global CSS |
| `src/App.tsx` | All routes, grouped by who may see them; the page title; the `data-go` / `data-soon` click handling for sample buttons |
| `src/access/` | The region gate |
| `src/auth/` | Session store, sign-in gate, Google sign-in, the sign-in screens' shared frame |
| `src/layout/` | Sidebar, header, logo, theme switch: the frame every app screen shares |
| `src/pages/` | One component per screen |
| `src/components/` | Small shared pieces: dialog, page head and states, segmented control |
| `src/assets/` | The Assets list: types, snapshot loading, filters, chain marks |
| `src/chains/<chain>/` | Everything chain-specific: `robinhood/` (prices, wallet, eligibility, quote, trade, WalletConnect), `stellar/` (registry and prices, address check, trading from the Promorphic wallet), `avalanche/` (NAV feeds) |
| `src/lib/` | API client, account data (`account.ts`), theme, search, store, toast |
| `src/wallet/` | The Promorphic wallet: API calls, Turnkey signing, the card, send and sign dialogs |
| `src/styles/` | Design tokens for both themes, states, narrow-screen layout; account screens' styles |
| `data/` | `assets.json` (the asset snapshot) and `featured.json` (the opening order), written by the backend's listers |
| `static/chains/` | Chain logos, one per theme |
| `public/` | Favicons, the sign-in photograph, `CNAME` |
| `.github/workflows/deploy.yml` | Build and publish to GitHub Pages |

## Routes and gates

`App.tsx` nests the routes so each gate wraps only what it must:

```
RegionGate (asks /v1/access)
 ├─ RequireAuth → AppShell → /, /portfolio, /orders, /activity, /agent, /mandates, /wallets
 ├─ SignedOutOnly → /login, /signup
 └─ /auth/verify
/terms, /privacy            open to everyone, outside the region gate
/sandbox, /sandbox/*        the sandbox: SandboxOnly → sign-in when signed out, else RegionGate → AppShell → its screens (/test redirects to /sandbox)
*                           not found
```

`RequireAuth` lets everything through while `VITE_AUTH` is off. Adding a screen means a route in `App.tsx` and its path in `ROUTES` in `vite.config.ts`.

### The test account

`/sandbox/` is a route outside `RegionGate`, so the page opens anywhere; the API accepts its sign-in from the United States but still refuses it from a sanctioned country. The app calls this account the sandbox; the code and the API paths call it the test account. The sandbox is kept apart from the app's own screens by address. Its screens live under `/sandbox/` (`SANDBOX_APP` in `src/App.tsx`): five come from `src/chains/canton/` (Assets, Portfolio, Your agent, Mandates, Wallets), and Orders and Activity are the ordinary screens. The sandbox also has a session of its own (`src/auth/session.ts`): the app's session is saved as `pm-session` and the sandbox's as `pm-sandbox-session`, and `useSession()` returns the one for the side the address is on. So being signed in to the app does not sign anyone in to the sandbox, or the other way round; both can be open at once, and signing out of one leaves the other. `SandboxOnly` shows the sign-in at `/sandbox/` when there is no sandbox session and lets its screens through when there is. Shared parts (the sidebar, header, logo, Activity) build their links with `useTo()` from `src/chains/canton/sandbox.ts`, so a link stays on the side the reader is on. `RegionGate` sends the session token with `/v1/access`, and the API answers "allowed" for the test account's session wherever it is.

The Assets screen lists test instruments on every chain the app lists and opens with Canton chosen in the Chain filter; only the Canton ones trade. The test screens read `GET /v1/test/assets` and `GET /v1/test/account` and write through `POST /v1/test/mandate`, `/v1/test/agent` and `/v1/test/reset` (`src/chains/canton/test.ts`). Each write returns the account as it now stands, which replaces the cached copy. The account hooks in `src/lib/account.ts` for wallets and portfolio are off for this account, since the API would refuse them.

## Hosting

GitHub Pages serves files, not routes. The Vite plugin in `vite.config.ts` copies the built `index.html` to `<route>/index.html` for every route and to `404.html`, so a deep link like `/orders/` loads the app directly. It also copies `data/` and `static/chains/` into the build as they are, and serves them the same way while developing.

`public/CNAME` points the Pages site at app.promorphic.xyz.

## Talking to the API

- **Client.** `src/lib/api.ts` exports `API` and `getApi(path, body?, token?)`: a GET without a body, a POST with one, `Authorization: Bearer <token>` when a session is given. A refusal becomes `ApiError(status, code, message)`, and screens show the message.
- **Address.** `https://promorphic-api-1017392197056.europe-west1.run.app` in production. On localhost it is `http://localhost:8787`, or `VITE_API_URL` if set.
- **Account data.** `src/lib/account.ts` holds the account's ledger: `/v1/wallets`, `/v1/orders`, `/v1/activity`, `/v1/portfolio`, `/v1/portfolio/history`. Each call carries the session token, and nothing is asked for without one.
- **Chain data.** Each chain folder calls its own endpoints, for example `/v1/robinhood/assets`, `/v1/robinhood/prices`, `/v1/robinhood/quote`, `/v1/robinhood/eligibility`, `/v1/stellar/assets`, `/v1/stellar/prices` and `/v1/stellar/trade/*`.
- **Wallet data.** `src/wallet/api.ts` calls `/v1/embedded-wallet/*`. The contract is in the backend's `api/README.md` under "Promorphic wallets".

### Refresh timers

| Data | Stale after | Refetched every |
| --- | --- | --- |
| Robinhood Stock Token list / prices | 5 min / 15 s | 5 min / 15 s |
| Stellar asset list / prices | 10 min / 1 min | 10 min / 1 min |
| Avalanche NAVs | 5 min | 5 min |
| Portfolio / orders / activity / linked wallets | 30 s / 15 s / 15 s / 1 min | 1 min / 30 s / on demand / on demand |
| Promorphic wallet balances | 20 s | 1 min |
| A submitted signing request | 0 | 2 s, until confirmed or failed |
| Session check / region check | 1 min / 10 min | 5 min / on load |

Timers run only while the tab is in view, and everything is refetched when the tab comes back.

## Sign-in and the session

- **Email.** `Login` and `Signup` post to `/v1/auth/email`. The email's link opens `/auth/verify?token=…`, which posts the token once to `/v1/auth/email/verify` and gets `{ session, user }` back.
- **Google.** `src/auth/google.ts` loads Google Identity Services only when asked, gets an access token from Google's popup, and posts it to `/v1/auth/google`. The API checks with Google who the token belongs to and that it was issued to our client ID. An address with no account comes back as `no_account`, and the app carries the token on to sign-up.
- **Session.** `{ token, expiresAt, user }` is kept in `localStorage` under `pm-session` and shared across tabs through the `storage` event. The token is sent as a bearer header. It is checked against `/v1/auth/session` every 5 minutes. A 401 there signs the person out; any other answer updates the stored user details.
- **Return path.** The screen a signed-out person asked for is kept under `pm-return-to` in both `sessionStorage` and `localStorage`, so it survives the trip to their inbox.

## Signing paths

The app never holds a private key. There are three ways a transaction gets signed:

| Path | Used for | How |
| --- | --- | --- |
| Browser wallet | Robinhood trades from a linked wallet | EIP-1193 `eth_sendTransaction` in the wallet's own window (`src/chains/robinhood/evm.ts`). The wallet must be on the chosen address and on Robinhood Chain first. |
| WalletConnect | The same trades, from a phone wallet | `@walletconnect/universal-provider` over Reown's relay, loaded only when used. Asks only for sending transactions and switching chain. Needs `VITE_WALLETCONNECT_PROJECT_ID`. |
| Turnkey | The Promorphic wallet | Below |

### The Promorphic wallet with Turnkey

```
Create:  app → API POST /v1/embedded-wallet → Turnkey create_sub_organization (the API's key)
           → a sub-organization whose only user is the person (their email), holding one wallet:
             secp256k1 for Robinhood and Avalanche, ed25519 for Stellar and Canton

Send:    app → API POST /v1/embedded-wallet/transfers → signing request {summary, details, payload, sign params}
         app shows it → no Turnkey session in this browser?
           → Turnkey Auth Proxy initOtp (emails a code) → person enters it → verifyOtp → loginWithOtp
         → Turnkey signRawPayload in the browser → app → API POST …/requests/:id/signature
         → API assembles and broadcasts → app polls …/requests/:id until confirmed or failed
```

- The API's Turnkey key can only create sub-organizations (a Turnkey policy) and read. It is not a user in any sub-organization, so it cannot sign.
- The browser's Turnkey session lasts 15 minutes and is held by `@turnkey/core` (a session record, and a key the browser will not let anyone copy out).
- `src/wallet/turnkey.ts` never creates a sub-organization from the browser. It only signs in to the one the API made.
- `@turnkey/core` is loaded with a dynamic import only when a signature is needed. Rollup drops it from the build entirely when the two Turnkey settings are empty.

## Build settings

All are read at build time through `import.meta.env`. Locally they go in `.env.local` (git-ignored); the deploy reads them from repository variables on `promorphic/app`.

| Variable | Effect when set | Live value |
| --- | --- | --- |
| `VITE_AUTH` | `on` puts every app screen behind sign-in | `on` |
| `VITE_WALLETCONNECT_PROJECT_ID` | Shows WalletConnect pairing. A Reown project ID, public by design. | set |
| `VITE_TURNKEY_ORGANIZATION_ID` | Promorphic's parent organization in Turnkey (public) | `84904cbd-…56d6` |
| `VITE_TURNKEY_AUTH_PROXY_CONFIG_ID` | The Auth Proxy configuration that emails codes (public) | `2adc78c5-…16dc` |
| `VITE_API_URL` | Points a local run at another API | unset |

Nothing secret goes in the app: everything built ships to every visitor.

## Browser storage

| Key | Where | What |
| --- | --- | --- |
| `pm-session` | localStorage | Session token, expiry, user |
| `pm-return-to` | sessionStorage and localStorage | Where to go after signing in |
| `pm-theme` | localStorage | `light` or `dark` |
| Trading wallet keys | localStorage | The address trades are made from on this device, and whether it signs through WalletConnect (`src/chains/robinhood/wallet.ts`) |
| WalletConnect link | localStorage | The paired phone wallet's name and link (`walletconnect.ts`) |
| Turnkey session | localStorage and IndexedDB | Kept by `@turnkey/core` while signing |

## Styling

- **Colours.** Every colour is a CSS variable from the Promorphic design system, defined for both themes in `src/styles/app.css` (`--ink`, `--ink-muted`, `--surface-1`, `--hairline`, `--brand` and so on). Dark and light share one markup.
- **Where styles live.** Components use inline styles and a few shared classes (`live-*`, `acct-*`, `wallet-*`). Chain and wallet screens bring their own CSS file.
- **Breakpoints:** 900 px (sidebar), 700 px (stacked tables, sign-in layout), 420 px. Motion is turned off under `prefers-reduced-motion`.

## Local development

```bash
npm install
```

```bash
npm run dev
```

The app opens on http://localhost:5210 and talks to the API on :8787. To run with sign-in and the dev wallet signer, start `promorphic-api-auth` and `promorphic-app-auth` from `../.claude/launch.json`. The app is then on :5212, the API prints sign-in links instead of emailing them, and it signs wallet requests with its development key.

`npm run build` type-checks (`tsc --noEmit`) and writes `dist/`.

## Deploying

A push to `main` runs `.github/workflows/deploy.yml`: `npm ci`, `npm run build` with the repository variables, then a GitHub Pages deploy. You can also start it by hand with `gh workflow run deploy.yml`. Nothing built is committed.

The API deploys separately, from the backend repo, with `gcloud run deploy` (see its `api/README.md`).
