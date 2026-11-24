// Signing with Turnkey in the browser. The person proves it is them with a code Turnkey emails to
// the account's address; Turnkey's SDK then keeps a short session key in this browser, and that key
// signs. Promorphic's servers never see the code or the key.
//
// Switched on at build time with both of:
//   VITE_TURNKEY_ORGANIZATION_ID     Promorphic's parent organization in Turnkey
//   VITE_TURNKEY_AUTH_PROXY_CONFIG_ID  the Auth Proxy configuration that sends the email codes
// Without them the app cannot sign with Turnkey and says so. Turnkey's SDK is loaded only when a
// signature is actually needed, so it adds nothing to the app's first load.
//
// Not verified against Turnkey yet: there is no Turnkey account. Written to @turnkey/core 2.15's types.
import type { TurnkeyClient } from '@turnkey/core';
import type { SignParams } from './api';

const ORG = import.meta.env.VITE_TURNKEY_ORGANIZATION_ID as string | undefined;
const PROXY = import.meta.env.VITE_TURNKEY_AUTH_PROXY_CONFIG_ID as string | undefined;
export const turnkeyConfigured = !!ORG && !!PROXY;

let client: Promise<TurnkeyClient> | null = null;
function load(): Promise<TurnkeyClient> {
  if (!turnkeyConfigured) return Promise.reject(new Error('Signing in the browser is not switched on yet.'));
  client ??= import('@turnkey/core').then(async ({ TurnkeyClient }) => {
    const c = new TurnkeyClient({ organizationId: ORG!, authProxyConfigId: PROXY! });
    await c.init();
    return c;
  }).catch((e) => { client = null; throw e; });
  return client;
}

// Whether this browser already holds an unexpired Turnkey session for this person's own sub-organization.
export async function hasSession(organizationId: string): Promise<boolean> {
  const c = await load();
  const s = await c.getSession().catch(() => undefined);
  return !!s && s.organizationId === organizationId && s.expiry * 1000 > Date.now() + 30_000;
}

export interface CodeSent { otpId: string; bundle: string }
export async function sendCode(email: string): Promise<CodeSent> {
  const c = await load();
  const r = await c.initOtp({ otpType: 'OTP_TYPE_EMAIL' as never, contact: email });
  return { otpId: r.otpId, bundle: r.otpEncryptionTargetBundle };
}

// Verifies the code and signs in to the person's own sub-organization, never creating one.
export async function confirmCode(sent: CodeSent, code: string, organizationId: string): Promise<void> {
  const c = await load();
  const v = await c.verifyOtp({ otpId: sent.otpId, otpCode: code.trim(), otpEncryptionTargetBundle: sent.bundle });
  await c.loginWithOtp({ verificationToken: v.verificationToken, organizationId });
}

export async function sign(p: SignParams): Promise<{ r: string; s: string; v: string }> {
  const c = await load();
  const out = await c.httpClient.signRawPayload({
    organizationId: p.organizationId, signWith: p.signWith, payload: p.payload,
    encoding: p.encoding as never, hashFunction: p.hashFunction as never,
  });
  return { r: out.r, s: out.s, v: out.v };
}
