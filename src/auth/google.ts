// Sign-in with Google, through Google's own popup. It hands back an access token; the API checks
// with Google whose it is and that it was issued to us. Google's script is only loaded when asked for.
type TokenResponse = { access_token?: string; error?: string };
type TokenClient = { requestAccessToken: () => void };
declare global {
  interface Window {
    google?: { accounts: { oauth2: { initTokenClient: (o: {
      client_id: string; scope: string;
      callback: (r: TokenResponse) => void;
      error_callback?: (e: { type: string }) => void;
    }) => TokenClient } } };
  }
}

let loading: Promise<void> | null = null;
function load(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { loading = null; s.remove(); reject(new Error('Google sign-in could not be loaded. Check your connection and try again.')); };
    document.head.appendChild(s);
  });
  return loading;
}

export class PopupClosed extends Error {}

export async function googleAccessToken(clientId: string): Promise<string> {
  await load();
  return new Promise<string>((resolve, reject) => {
    window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (r) => (r.access_token ? resolve(r.access_token) : reject(new Error('Google did not complete the sign-in. Try again.'))),
      error_callback: (e) => reject(e.type === 'popup_closed' ? new PopupClosed() : new Error(e.type === 'popup_failed_to_open' ? 'Your browser blocked the Google window. Allow pop-ups for this site and try again.' : 'Google did not complete the sign-in. Try again.')),
    }).requestAccessToken();
  });
}
