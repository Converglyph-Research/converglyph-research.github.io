/**
 * Google Identity Services & User Session Manager
 * Allows Google login with client-side credential persistence
 */

export interface UserSession {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

const STORAGE_KEY = 'converglyph_user_session';
const LEGACY_STORAGE_KEY = 'aetheria_user_session';

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

/**
 * Returns the user-isolated storage key for custom calculated charts.
 * Prevents cross-account data leakage when different Google users sign in on the same browser.
 */
export function getAccountProfileStorageKey(userEmail?: string): string {
  const session = userEmail ? { email: userEmail } : getUserSession();
  if (session && session.email) {
    const safeEmail = session.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `converglyph_chart_${safeEmail}`;
  }
  return 'converglyph_chart_guest';
}

/**
 * Decode JWT token payload safely without external dependencies
 */
export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
