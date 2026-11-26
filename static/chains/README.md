# Chain marks

One mark per chain, in two files: `<chain>-on-dark.svg` for the dark version of the app and `<chain>-on-light.svg` for the light one. All are drawn on the same 24 by 24 box, so they render at one size.

The shapes and colours are the branded network marks from [web3icons](https://github.com/0xa3k5/web3icons) 4.0.61 (MIT licence). Most are identical on both grounds. Two differ so they stay visible: Stellar is black on light and off-white on dark, and Robinhood is its neon lime on dark and its green (#00C805) on light. Each mark is the trademark of its owner.

Canton is not in web3icons, so its two files are the mark from Canton's own logo (https://www.canton.network/brand-kit-trademark-use), taken from the wordmarks in the site's `brand/venues/` without the lettering, unchanged in shape and colour, and centred with the same margin as the others: white edges on dark, lime edges on light.

To add a chain: put both files here and set `"logo": "<chain>"` on its entry in `data/assets.json`. A chain without a logo shows its short code instead.
