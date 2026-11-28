// The BPS JWT returned by POST /bps/auth/login.
//
// The backend also sets it as the httpOnly `bpsToken` cookie, but browsers
// don't always send that cookie back (Secure cookie on http, the app opened via
// 127.0.0.1 / a LAN IP, cross-site API host, blocked third-party cookies). The
// backend accepts `Authorization: Bearer <token>` as a fallback, so we keep the
// token here and send it with every request.
const KEY = "bps_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable (private mode): the cookie still works */
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
