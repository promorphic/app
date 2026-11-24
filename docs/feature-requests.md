# Feature requests

Features asked for but not built, with what is in the way. Newest first. When one is built, move it to [features.md](features.md) and record any decision in [decisions.md](decisions.md).

---

## Filter assets by the investor's jurisdiction

*Requested 24 November 2026. Status: not feasible yet, because the data does not exist.*

### The request

A customer enters their country of incorporation (or residence, for an individual) and the Assets screen shows only the funds they are eligible to buy.

### Why it cannot be built today

Eligibility is set per asset by each issuer's offering documents. It depends on more than one country:

- **The investor's country.** For an organization, its country of incorporation; for an individual, their residence.
- **The investor's type.** Retail, professional, accredited, or a qualified purchaser. Each country defines these differently.
- **How the asset is offered there.** For example, Reg S for non-US only, Reg D 506(c) for US accredited investors, an EU prospectus, a private placement, or nothing at all.
- **The issuer's allowlist.** Many funds also need KYC with the issuer or transfer agent before a wallet can hold the token.

What we hold is far coarser. In `data/assets.json`, each of the 255 assets has one `access` label, and the Assets screen already filters by it:

| `access` | Assets | What it tells us |
| --- | --- | --- |
| Retail, non-US | 205 | Robinhood Stock Tokens: open to retail outside the US, with country restrictions that the API's eligibility check applies at trade time |
| Issuer allowlist | 24 | The issuer must approve the holder first. Which countries it accepts is in its documents, not in our data. |
| Retail | 14 | No investor-type restriction found. Per-country rules are unknown. |
| Open | 11 | No restriction found |
| Accredited | 1 | Investor type only, no countries |

No asset has a list of allowed or excluded countries. A filter built on this data would be a guess.

### Would Token Terminal or rwa.xyz fill the gap?

Not on their own, as far as we know. They need confirming against their current data before relying on that.

- **rwa.xyz** describes tokenized assets with fields such as the issuer's jurisdiction, the regulatory framework and the investor type. That is where a fund is domiciled and how it is offered, not who may buy it from where. A fund domiciled in the British Virgin Islands and offered under Reg S tells us "not US persons", and nothing about whether, say, a German retail investor may buy it.
- **Token Terminal** covers market and on-chain metrics: supply, holders, flows. It has no eligibility data.

Either could help as a starting point, for example by marking which assets are offered under Reg S or Reg D, but per-country eligibility has to come from each issuer.

### The risk of getting it wrong

Showing a fund as eligible for someone who is not eligible is a regulatory problem for us and a real loss for them, worse than showing nothing. Any version needs wording like "may be available to you, confirm with the issuer", and counsel should sign off on both the wording and the data.

### What it would take

1. **Data per asset, from the issuer.** Extend each asset in `data/assets.json` with an `offering` block, filled from offering documents, issuer FAQs, or the issuer directly:

   ```json
   "offering": {
     "framework": ["Reg S"],
     "investorTypes": ["professional", "accredited"],
     "allowedCountries": null,
     "excludedCountries": ["US", "CA", "GB"],
     "kycRequired": true,
     "source": "https://issuer.example/offering-memorandum.pdf",
     "checked": "2026-11-24"
   }
   ```

   `allowedCountries: null` means anywhere not excluded. Every entry needs a source and a check date, because offering terms change.

   Start with the issuers we list most: WisdomTree, Franklin (BENJI), Securitize-issued funds (BUIDL and others), Spiko, Etherfuse, Centrifuge pools, and the Robinhood Stock Tokens. Their rules are one entry, since the API already enforces them.
2. **The investor's side.** Ask at sign-up, or later in account settings, for the country of incorporation or residence and the investor type. Sign-up already records whether the account is an organization or an individual. Store both on the account in the API.
3. **The filter.** On the Assets screen, add an "Available to you" filter that compares the account's country and type with each asset's `offering`. It should show three states: available, not available, and unknown where there is no data. Never hide "unknown" assets silently.
4. **Review.** Counsel reviews the data and the wording before the filter goes live.

### A smaller first step, if wanted

Show each asset's offering framework (Reg S, Reg D, prospectus) and whether KYC is needed, where known, as information rather than a filter. That gives customers something useful without claiming eligibility.
