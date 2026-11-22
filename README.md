# Promorphic app

The web app at [app.promorphic.xyz](https://app.promorphic.xyz): a single-page React app, built with Vite and published to GitHub Pages by a workflow on every push to `main`.

It is the "Promorphic Design (Frontend)" canvas turned into pages. Each screen was designed twice, dark and light, with the same markup and different colours; here every colour is a CSS variable from the Promorphic design system, and one switch in the header changes the theme (the visitor's choice is remembered, and a first visit follows the system setting).

**Most of what is shown is placeholder data.** There is no sign-in and no wallet connection yet. Buttons that have nothing behind them say so.

**What is live:** on the Assets page, the Robinhood Stock Tokens and their prices come from the Promorphic API (`api/` in the private `promorphic/backend` repo), which refreshes the list every 5 minutes and prices every 15 seconds. Prices are indicative. The Stellar assets come from the API too, each verified against its issuer's domain and refreshed every 10 minutes, with price and 30-day yield refreshed every minute: the issuer's net asset value where it publishes one (Spiko, Etherfuse, Centrifuge), else the mid of the Stellar exchange's USDC order book; issuers with no feed show a dash. If the API cannot be reached, the page shows the snapshot in `data/assets.json` and a dash for each price. The API address is the `API` constant in `src/lib/api.ts`; on `localhost` it points to `http://localhost:8787`.

**Also live, for Robinhood Chain** (`src/chains/robinhood/`: `prices.ts` for the Assets list and prices, `wallet.ts` and the components beside it for the rest; each chain keeps its own code in a folder under `src/chains/`): a read-only wallet address on the Wallets page (pasted or read from a browser wallet, kept in the browser, never used to sign), that wallet's live holdings on the Portfolio page, and an indicative LiFi and 0x quote from a Stock Token's Actions button on the Assets page. The same dialog shows whether the visitor may trade Stock Tokens: the API checks their country, and a wallet in an allowed country confirms a short declaration, which the API records. An eligible wallet can then trade the quoted amount (`Trade.tsx`, `evm.ts`): the app takes a firm quote from the API, shows it for review, and the browser wallet holding that address signs an approval for exactly the amount sold and then the trade. The app never holds a key. Only a browser wallet extension works; there is no WalletConnect.

**Also live, for Avalanche C-Chain** (`src/chains/avalanche/nav.ts`): 29 assets carry a verified C-Chain contract, each traced to its issuer and checked on chain by the lister in the backend repo (`integrations/avalanche/`), which also writes them into `data/assets.json`. For the funds that publish one, the price column shows net asset value per token, read by the browser itself from the public C-Chain RPC (RedStone, Chainlink and issuer feeds) and from Centrifuge's API, with no key and no backend, and refreshed every five minutes; Tether Gold shows gold spot as a reference price. It is a NAV, not a quote. If those calls fail, the page shows the value in the snapshot. Yields for these rows come from the snapshot.

## Pages

| Path | Screen |
| --- | --- |
| `/` | Assets |
| `/portfolio/` | Portfolio |
| `/orders/` | Orders |
| `/activity/` | Activity |
| `/agent/` | Your agent |
| `/mandates/` | Mandates |
| `/wallets/` | Wallets |
| `/login/`, `/signup/` | Sign in, sign up |

Moving between screens never reloads the page: the sidebar and header stay where they are and only the content changes. Every screen still has its own address, so a link to `/orders/` opens Orders directly, and Back and Forward work.

## How it is built

React 19 and TypeScript, bundled by Vite. React Router swaps the screens; TanStack Query reads the live figures, refreshes them on their timers while the tab is in view, and keeps what was last read while you move between screens.

| Path | What it holds |
| --- | --- |
| `src/App.tsx` | The routes, one per screen |
| `src/layout/` | The frame every screen shares: sidebar, header, theme switch |
| `src/pages/` | One component per screen. Apart from Assets they are the designed screens with sample data |
| `src/assets/` | The Assets list: the snapshot, the filters, the opening order, the chain marks |
| `src/chains/<chain>/` | Each chain's own code: what it reads, how its rows merge into the list, how it prices them. `src/assets/useAssets.ts` is the one place the chains meet |
| `src/lib/` | The API address, the theme, the search box, the status line |
| `src/styles/app.css` | The design tokens for both themes, hover and focus states, the narrow-screen layout |
| `data/`, `static/chains/` | The asset snapshot and the chain logos. They are served as they are, so the listers in the backend repo keep writing to `data/assets.json` |

To add a chain: give it a folder under `src/chains/` that exports a hook for what it reads, a function that merges its rows into the list and a function that prices a row, then call those three from `src/assets/useAssets.ts`.

GitHub Pages serves files, not routes, so the build copies the page to every screen's address and to `404.html` (see `vite.config.ts`). A new screen needs a route in `src/App.tsx` and its path in `ROUTES` there.

## Adding assets

The Assets list, its count, its search and all six filters are drawn from [`data/assets.json`](data/assets.json). To list a new asset, add an object to `assets`; nothing else needs to change.

```json
{
  "ticker": "WTGXX",
  "name": "WisdomTree Treasury Money Market Digital Fund",
  "issuer": "WisdomTree",
  "class": "Money market",
  "yield30d": 3.67,
  "chains": ["ethereum", "base"],
  "settles": ["USD", "USDC"],
  "access": "Retail"
}
```

- `yield30d` is a number in percent, or `null` when there is none (shown as a dash).
- `chains` are keys of the top-level `chains` map, which gives each chain its short code, its name and its logo: `"stellar": { "code": "XLM", "name": "Stellar", "logo": "stellar" }`. The list shows each chain by its mark from `static/chains/` (see the note there). Add a chain there before using it. Stellar, Robinhood Chain and Avalanche are already defined.
- A new issuer, class, settlement currency or access level appears in its filter as soon as one asset uses it.

## The opening view

With no filter and no search, the list opens on each issuer's flagship assets rather than the alphabet, so one large issuer cannot fill the first screen. [`data/featured.json`](data/featured.json) names up to five tickers per issuer, best first; the list takes every issuer's first, then every issuer's second, and so on, and puts all other assets after them in A to Z order. An issuer missing from that file contributes its five largest assets by `supply`, or its first five in `assets.json`. As soon as a filter or a search is on, the list is plain A to Z.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5210. `npm run build` type-checks and writes the site to `dist/`; `npm run preview` serves that build.

## Deploying

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the app and publishes `dist/` to GitHub Pages. Nothing built is committed.
