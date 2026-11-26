# Decisions

The choices behind the app, newest first, each with why it was made and what it costs. Add a new entry at the top when a decision is made or reversed, rather than editing an old one.

---

## A shared test account, with a password and no country check

*26 November 2026*

The Canton Foundation's reviewers need to try Promorphic themselves, and they are in the United States, where the app does not open. They also cannot read an inbox of ours, so a sign-in link or a Turnkey signing code would never reach them.

**Decision:** one account, `test@promorphic.xyz`, signs in at `/sandbox/` with a password, from any country, and sees only test assets. The app calls it the sandbox; it first opened at `/test/`, which now redirects.

- **What it can reach.** Its own versions of Assets, Portfolio, Your agent, Mandates and Wallets (`src/chains/canton/`), and its own Orders and Activity. The API refuses that session everything else, so lifting the country check for it opens nothing real: no Stock Tokens, no quotes, no linked wallets, no Promorphic wallet.
- **Real transactions, test instruments.** Every action is a transaction on Canton MainNet through Promorphic's validator. The instruments (CC-TEST, TBILL-TEST and four more) are issued by a test registry of ours and have no value. The Assets screen also lists twelve test instruments on other chains, as listings only, so that it looks as it does for a real account.
- **`/sandbox/` sits outside the region gate** in `src/App.tsx`. Everywhere else a visitor from a blocked country still sees "Not available".
- **The cost:** this account breaks two rules the app otherwise keeps, "no passwords" and "the person holds the key". Its Canton party's key is held by the API, because whoever shares the password cannot receive a signing code. The Wallets screen says so. No other account can be given a password.
- **It is shared.** Anyone with the password sees the same holdings and can reset them. The password goes to reviewers in a document, not in the application, which is published.

## Turnkey captcha off for now

*24 November 2026*

Turnkey's Auth Proxy lets a browser call Turnkey directly using our config ID, which is public in the app's code. Anyone with it can trigger code emails to any address (spamming inboxes in our name and using up our Turnkey email allowance) and sign up through the proxy, which creates sub-organizations in our Turnkey account. The allowed-origins list does not stop this: a browser enforces it, and a script can send any `Origin` header. Turnkey's captcha (Cloudflare Turnstile) is the real protection.

**Decision:** leave it off while we are on testnet with few users. It would add a Cloudflare check before every code email, load a Cloudflare script, and need a line in the Privacy Policy.

**Turn it on** before opening sign-up to the public or moving to mainnet, or sooner if Turnkey's activity log or usage shows code requests or sign-ups we did not make. `@turnkey/core` accepts a `captchaToken` on `initOtp`, so the app change is to get a Turnstile token before sending the code.

## The Promorphic wallet is self-custody, in Turnkey

*24 November 2026*

**Decision:** each account gets one wallet with an address on every chain we support, so a person can hold and move assets without installing a wallet first. Promorphic must not hold the keys, which ruled out keeping them ourselves in a cloud key service. Among wallets the person owns, Privy was the other option. Canton support narrowed it to Turnkey or Dfns, and we chose Turnkey.

- **Who holds what.** The API creates a Turnkey sub-organization for each account, with the person as its only user. The API's own Turnkey key can create sub-organizations and read, and nothing else (a Turnkey policy). It is not a user in any sub-organization, so it cannot sign.
- **How the person signs.** In the browser, after a code Turnkey emails to the account's address (Auth Proxy, email OTP, 9 characters, letters and numbers). The browser session lasts 15 minutes.
- **The cost:** an extra code step the first time someone signs in a while.
- **How the key was made.** The API key pair was generated on a developer machine rather than in Turnkey's dashboard, so the private key never passed through a browser. It lives in Secret Manager (`turnkey-api-private-key`).
- **Two signing providers.** Locally, the API's dev signer (`WALLET_PROVIDER=dev`) stands in for Turnkey, so the whole flow works without a Turnkey account. It refuses to run in production.
- **Testnet only.** It runs on test networks until mainnet is wanted (`WALLET_NETWORK` unset in the API).

## Every send is a signing request the person reviews

*24 November 2026*

The API prepares each transaction and returns a summary, the details (from, to, amount, maximum fee, whether it creates the destination account) and the exact payload to sign. The app shows all of it before the person signs.

- A request expires 5 minutes after it is prepared, and closing the dialog cancels it, so nothing can be signed later by mistake.
- The API, not the browser, assembles and broadcasts the transaction, so every chain's quirks stay in one place.

## Turnkey's SDK is loaded only when signing

*24 November 2026*

`@turnkey/core` is large, and most visits never sign anything. It is loaded with a dynamic import at the moment a signature is needed. When the two Turnkey build settings are empty, the build leaves it out entirely. WalletConnect's provider and Google's sign-in script are loaded the same way, only when used.

## Region gate in the app as well as the API

*23 November 2026*

Promorphic is not offered to US persons or in sanctioned countries. The API refuses requests from those countries anyway. The app asks `/v1/access` first, so such a visitor sees one plain explanation instead of a broken app.

- If the check itself fails, the app carries on, because the API still refuses what it must.
- The Terms and Privacy pages stay open to everyone.
- Sign-up also asks the person to confirm they are not a US person.

## The account's data lives on the API, not in the browser

*23 November 2026*

Linked wallets, orders, activity and portfolio history are stored by the API (Postgres on Cloud SQL), so they follow the account to every device.

**The one exception** is which wallet trades are made from on this device. It is kept in the browser, because whether a wallet can sign depends on the device (an extension here, a phone paired there). A device with no choice yet picks the account's first linked wallet.

## Interim Terms and Privacy pages

*23 November 2026*

The links on the sign-in screens needed somewhere to go before counsel's text exists. The interim pages were written fresh for what the app actually does, rather than copied from another site, and are marked interim on the page.

- When either text changes, change `UPDATED` in `src/pages/Legal.tsx`.
- Change `TERMS_VERSION` in the API only for a change people must accept again.
- Adding Turnkey to the Privacy Policy on 24 November did not change `TERMS_VERSION`: it describes a provider and asks nothing new of anyone.

## Sign-in: email link or Google, bearer token, no passwords

*22–23 November 2026*

- **No passwords to store or leak.** Sign-in is a one-time link by email (sent through Resend) or Google.
- **Bearer token, not a cookie.** The session is a bearer token in `localStorage`. The API is on a different site (`run.app`) from the app (`promorphic.xyz`), so a cookie would be a third-party cookie, which browsers increasingly block.
- **The cost of that:** any script running on the page could read the token. We keep third-party scripts to the few we load on demand.
- **Sessions** last 30 days and are re-checked every 5 minutes. Links last 15 minutes. The API stores only hashes of both.
- **Google with no account.** It continues straight on to sign-up with Google's confirmation kept. Bouncing people back to the sign-in screen confused them.

## The sign-in gate is a build setting

*22 November 2026*

`VITE_AUTH=on` puts every app screen behind sign-in. It shipped switched off, so the sign-in screens and the API's sign-in could go live and be tested before the app depended on them. It is on in the live build.

## The sign-in screens use a real photograph

*23 November 2026*

The sign-in screens are the first impression for institutions, so they use a full-page colour photograph of the Financial District at dusk, with the form in a centred card and the headline "Hold, trade and manage tokenized assets from one place.". The photo is by Zoshua Colah, under the Unsplash licence.

- It replaced an etched, line-drawn skyline that looked downgraded and was cropped at some widths.
- The page around the card stays dark in both themes, so the photograph is shown as taken.

## Trades are signed by the person's own wallet

*22 November 2026*

The app never holds a key for trading. It gets a firm quote from the API and shows it for review. The wallet then signs an approval for exactly the amount sold (never unlimited), then the trade.

- **WalletConnect** came next, for people whose wallet is on their phone. It is hidden until a Reown project ID is set, and its provider loads only when used.

## A single-page React app on GitHub Pages

*22 November 2026*

The first version was static HTML per screen, and every move between screens reloaded the page. The rebuild uses React 19, TypeScript and Vite, with React Router for screens and TanStack Query for live data. The sidebar and header now stay put, and live figures keep refreshing on their timers.

- **Hosting.** It stays on GitHub Pages: free, simple, deployed on every push. Pages serves files, not routes, so the build copies the page to every route's folder and to `404.html`.
- **Why TanStack Query.** Caching, refresh timers that pause in background tabs, and retry, without writing them by hand.
- **Why no state library.** The little client state there is (session, theme, search, trading wallet) uses a 20-line store on `useSyncExternalStore`.

## Each chain keeps its own folder

*22 November 2026*

Chain-specific code lives in `src/chains/<chain>/`: what it reads, how its rows merge into the Assets list, how it prices a row, and for Robinhood Chain, trading. `src/assets/useAssets.ts` is the one place the chains meet.

- **Why:** several people and sessions work on different chains at once, and separate folders keep their changes apart.
- **No loose files:** a new chain gets a folder, not files beside the others.

## The asset snapshot stays in `data/`

*22 November 2026*

`data/assets.json` is written by the listers in the backend repo, and the Assets list falls back to it whenever a live source fails. It stays outside `public/`, where the listers already write, and the build copies it in as it is. Adding an asset means adding an object to that file, nothing else.

## One markup, two themes, design-system variables

*22 November 2026*

Every screen was designed dark and light. Instead of two stylesheets, every colour is a CSS variable from the Promorphic design system, redefined per theme.

- The theme is set in `index.html` before the first paint, from the saved choice or else the system setting, so there is no flash.
- **No CSS framework.** The designs were hand-made, and variables plus inline styles reproduce them most directly.
- The whole app is set in Geist, with Geist Mono for figures.

## Sample screens say so

*22 November 2026*

Screens without live data (Your agent, Mandates) keep their designed sample rows. Their buttons carry `data-soon`, and clicking one shows "not yet" in the status line instead of doing nothing, so nobody mistakes a sample for a broken feature.
