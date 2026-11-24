// A Stellar account address (strkey): G followed by 55 base32 characters. The API checks the checksum.
export const isStellarAddress = (s: string | null | undefined): s is string => /^G[A-Z2-7]{55}$/.test(s || '');
