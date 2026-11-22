# Promorphic app

The web app at [app.promorphic.xyz](https://app.promorphic.xyz): a static site served by GitHub Pages from the `main` branch.

It is the "Promorphic Design (Frontend)" canvas turned into pages. Each screen was designed twice, dark and light, with the same markup and different colours; here every colour is a CSS variable from the Promorphic design system, and one switch in the header changes the theme (the visitor's choice is remembered, and a first visit follows the system setting).

**Most of what is shown is placeholder data.** There is no sign-in and no wallet connection yet. Buttons that have nothing behind them say so.

**What is live:** on the Assets page, the Robinhood Stock Tokens and their prices come from the Promorphic API (`api/` in the private `promorphic/backend` repo), which refreshes the list every 5 minutes and prices every 15 seconds. Prices are indicative. The Stellar assets come from the API too, each verified against its issuer's domain and refreshed every 10 minutes, with price and 30-day yield refreshed every minute: the issuer's net asset value where it publishes one (Spiko, Etherfuse, Centrifuge), else the mid of the Stellar exchange's USDC order book; issuers with no feed show a dash. If the API cannot be reached, the page shows the snapshot in `data/assets.json` and a dash for each price. The API address is the `API` constant in `static/app.js`; on `localhost` it points to `http://localhost:8787`.

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

`static/app.css` holds the tokens, hover and focus states, the theme switch and the narrow-screen layout. `static/app.js` holds the theme switch, the menu, the segmented filters and the Assets list. No build step and no dependencies.

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
- `chains` are keys of the top-level `chains` map, which gives each chain its short code, its name and its logo: `"stellar": { "code": "XLM", "name": "Stellar", "logo": "stellar" }`. The list shows each chain by its mark from `static/chains/` (see the note there). Add a chain there before using it. Stellar and Robinhood Chain are already defined.
- A new issuer, class, settlement currency or access level appears in its filter as soon as one asset uses it.

## The opening view

With no filter and no search, the list opens on each issuer's flagship assets rather than the alphabet, so one large issuer cannot fill the first screen. [`data/featured.json`](data/featured.json) names up to five tickers per issuer, best first; the list takes every issuer's first, then every issuer's second, and so on, and puts all other assets after them in A to Z order. An issuer missing from that file contributes its five largest assets by `supply`, or its first five in `assets.json`. As soon as a filter or a search is on, the list is plain A to Z.

## Run it locally

```bash
python3 -m http.server 5210
```

Then open http://localhost:5210. Links are absolute, so serve from the repository root.
