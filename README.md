# Promorphic app

The web app at [app.promorphic.xyz](https://app.promorphic.xyz): a static site served by GitHub Pages from the `main` branch.

It is the "Promorphic Design (Frontend)" canvas turned into pages. Each screen was designed twice, dark and light, with the same markup and different colours; here every colour is a CSS variable from the Promorphic design system, and one switch in the header changes the theme (the visitor's choice is remembered, and a first visit follows the system setting).

**Everything shown is placeholder data.** There is no sign-in, no backend and no wallet connection yet. Buttons that have nothing behind them say so.

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
- `chains` are keys of the top-level `chains` map, which gives each chain its short code and its name: `"stellar": { "code": "XLM", "name": "Stellar" }`. Add a chain there before using it. Stellar and Robinhood Chain are already defined.
- A new issuer, class, settlement currency or access level appears in its filter as soon as one asset uses it.

## Run it locally

```bash
python3 -m http.server 5210
```

Then open http://localhost:5210. Links are absolute, so serve from the repository root.
