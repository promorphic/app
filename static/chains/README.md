# Chain marks

One mark per chain, in two files: `<chain>-on-dark.svg` (ink for the dark version) and `<chain>-on-light.svg` (ink for the light version). All are drawn on the same 24 by 24 box, so they render at one size.

The shapes are the monochrome network marks from [web3icons](https://github.com/0xa3k5/web3icons) 4.0.61 (MIT licence), recoloured to the Promorphic `ink` token. Each mark is the trademark of its owner.

To add a chain: put both files here and set `"logo": "<chain>"` on its entry in `data/assets.json`. A chain without a logo shows its short code instead.
