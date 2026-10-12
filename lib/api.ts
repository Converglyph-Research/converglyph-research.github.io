/**
 * Centralized API client for Converglyph Research
 */
import { BirthProfile, LedgerRecord, ResearchArticle } from './types';

// Production Gateway vs Localhost Development Endpoint
const PROD_API_GATEWAY = "https://meeting-tue-transform-cole.trycloudflare.com";
const API_BASE = (typeof window !== 'undefined')
  ? (window.location.hostname.includes('github.io') ? PROD_API_GATEWAY : '')
  : 'http://127.0.0.1:8089';
export async function calculateProfileApi(profile: BirthProfile, allowOverwrite: boolean = false, userEmail?: string): Promise<unknown> {
  const resp = await fetch(`${API_BASE}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: profile.name,
      year: profile.year,
      month: profile.month,
      day: profile.day,
      is_time_unknown: profile.isTimeUnknown,
      hour: profile.isTimeUnknown ? null : profile.hour,
      minute: profile.isTimeUnknown ? null : profile.minute,
      location_name: profile.locationName,
      use_lmt: profile.useLmt,
      latitude: profile.latitude,
      longitude: profile.longitude,
      allow_overwrite: allowOverwrite,
      user_email: userEmail || ''
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
  return resp.json();
}

export async function checkProfileDbApi(name: string, year: number, month: number, day: number, userEmail?: string): Promise<{ exists: boolean; profile_id?: number; calculated_at?: string; message?: string }> {
  try {
    const emailParam = userEmail ? `&email=${encodeURIComponent(userEmail)}` : '';
    const resp = await fetch(`${API_BASE}/api/profile/check?name=${encodeURIComponent(name)}&year=${year}&month=${month}&day=${day}${emailParam}`);
    if (resp.ok) return resp.json();
  } catch {}
  return { exists: false };
}

export async function fetchSavedProfilesApi(userEmail?: string): Promise<Array<{ id: number; name: string; birth_year: number; birth_month: number; birth_day: number; location_name: string; calculated_at: string }>> {
  try {
    const emailParam = userEmail ? `?email=${encodeURIComponent(userEmail)}` : '';
    const resp = await fetch(`${API_BASE}/api/profiles${emailParam}`);
    if (resp.ok) {
      const data = await resp.json();
      return data.profiles || [];
    }
  } catch {}
  return [];
}

export async function loadSavedProfileApi(id: number | string): Promise<{ profile: BirthProfile; rawData: any } | null> {
  try {
    const resp = await fetch(`${API_BASE}/api/profile/load/${id}`);
    if (resp.ok) {
      return resp.json();
    }
  } catch {}
  return null;
}

export async function fetchAiHistoryApi(subjectName?: string, method?: string, aspect?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (subjectName) params.append('name', subjectName);
    if (method) params.append('method', method);
    if (aspect) params.append('aspect', aspect);
    const resp = await fetch(`${API_BASE}/api/ai/history?${params.toString()}`);
    if (resp.ok) {
      const data = await resp.json();
      return data.history || [];
    }
  } catch {}
  return [];
}

export async function deleteProfileApi(id: number | string): Promise<boolean> {
  try {
    const resp = await fetch(`${API_BASE}/api/profile/delete/${id}`);
    return resp.ok;
  } catch {}
  return false;
}

export async function deleteAiHistoryApi(id: number | string): Promise<boolean> {
  try {
    const resp = await fetch(`${API_BASE}/api/ai/history/delete/${id}`);
    return resp.ok;
  } catch {}
  return false;
}

export async function fetchSubscriptionPlansApi(): Promise<{ plans: any[]; stripe_publishable_key: string }> {
  try {
    const resp = await fetch(`${API_BASE}/api/subscription/plans`);
    if (resp.ok) return resp.json();
  } catch {}
  return { plans: [], stripe_publishable_key: '' };
}

export async function fetchUserSubscriptionStatusApi(email: string): Promise<{ tier: string; credits_remaining: number; is_pro: boolean; plan_id?: string; expires_at?: string }> {
  try {
    const resp = await fetch(`${API_BASE}/api/subscription/status?email=${encodeURIComponent(email)}`);
    if (resp.ok) return resp.json();
  } catch {}
  return { tier: 'free', credits_remaining: 5, is_pro: false };
}

export async function createStripeCheckoutApi(planId: string, email?: string, currency: 'usd' | 'eur' = 'usd'): Promise<{ checkout_url?: string; session_id?: string; error?: string }> {
  const resp = await fetch(`${API_BASE}/api/subscription/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: planId,
      user_email: email || '',
      currency
    })
  });
  return resp.json();
}

export async function verifyStripeSessionApi(sessionId: string, email?: string): Promise<{ success?: boolean; tier?: string; plan?: any; error?: string }> {
  try {
    const resp = await fetch(`${API_BASE}/api/subscription/verify-session?session_id=${encodeURIComponent(sessionId)}&email=${encodeURIComponent(email || '')}`);
    return resp.json();
  } catch (e) {
    return { error: String(e) };
  }
}
export async function fetchPromoCaptchaApi(): Promise<{ challenge_id: string; question: string }> {
  const resp = await fetch(`${API_BASE}/api/promo/captcha`);
  if (!resp.ok) throw new Error('Failed to load captcha challenge');
  return resp.json();
}

export async function applyPromoCodeApi(payload: {
  user_email: string;
  code: string;
  challenge_id: string;
  captcha_response: string;
}): Promise<{
  success?: boolean;
  message?: string;
  credits_added?: number;
  total_credits?: number;
  tier?: string;
  expires_at?: string;
  error?: string;
}> {
  const resp = await fetch(`${API_BASE}/api/promo/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return resp.json();
}

export async function fetchCompareApi(profile: BirthProfile, lang: 'en' | 'vi'): Promise<unknown> {
  const resp = await fetch(`${API_BASE}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: profile.name,
      year: profile.year,
      month: profile.month,
      day: profile.day,
      hour: profile.isTimeUnknown ? null : profile.hour,
      minute: profile.isTimeUnknown ? null : profile.minute,
      is_time_unknown: profile.isTimeUnknown,
      gender: 1,
      latitude: profile.latitude,
      longitude: profile.longitude,
      use_lmt: profile.useLmt,
      lang: lang,
    }),
  });

  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function fetchArticlesApi(lang: 'en' | 'vi'): Promise<ResearchArticle[]> {
  const resp = await fetch(`${API_BASE}/api/articles?lang=${lang}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  return (data.articles || []) as ResearchArticle[];
}

export async function fetchOutcomesApi(): Promise<LedgerRecord[]> {
  const resp = await fetch(`${API_BASE}/api/outcomes`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  return (data.records || []) as LedgerRecord[];
}

export async function fetchMethodologiesApi(): Promise<Record<string, unknown>> {
  const resp = await fetch(`${API_BASE}/api/methodologies`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function verifyLedgerRecordApi(recordId: string): Promise<unknown> {
  const resp = await fetch(`${API_BASE}/api/ledger/verify/${encodeURIComponent(recordId)}`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}
