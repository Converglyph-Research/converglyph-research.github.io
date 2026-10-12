/**
 * Centralized API client for Aetheria Research
 */
import { BirthProfile, LedgerRecord, ResearchArticle } from './types';

// Production Gateway vs Localhost Development Endpoint
const PROD_API_GATEWAY = "https://meeting-tue-transform-cole.trycloudflare.com";
const API_BASE = (typeof window !== 'undefined')
  ? (window.location.hostname.includes('github.io') ? PROD_API_GATEWAY : '')
  : 'http://127.0.0.1:8089';
export async function calculateProfileApi(profile: BirthProfile): Promise<unknown> {
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
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
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
