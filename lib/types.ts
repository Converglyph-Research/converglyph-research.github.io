/**
 * Aetheria Research Canonical Types & Contracts
 * Single source of truth for profiles, scores, claims, and prediction ledger
 */

export interface BirthProfile {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number | null;
  isTimeUnknown: boolean;
  latitude: number;
  longitude: number;
  locationName: string;
  useLmt: boolean;
}

export interface DomainScore {
  w: number; // Western
  b: number; // BaZi
  t: number; // Tử Vi
  n: number; // Numerology
}

export interface ThemeDetail {
  theme: string;
  icon: string;
  synthesis: string;
  western_driver: string;
  eastern_driver: string;
}

export interface LifeMapResult {
  profile: BirthProfile;
  domain_scores: Record<string, DomainScore>;
  theme_details: ThemeDetail[];
  calculationVersion: string;
}

export interface CanonicalClaim {
  id: string;
  tradition: string;
  tradition_tag: string;
  original: string;
  normalized: string;
  mapping_rationale: string;
  criteria: string;
  falsification_status: string;
}

export interface LedgerRecord {
  record_id: string;
  record_type: 'retrospective_demo' | 'prospective_pre_reg' | 'synthetic_test';
  subject_name: string;
  claim_id: string;
  tradition: string;
  domain: string;
  statement: string;
  forecast_probability: number | null;
  predicted_direction: string;
  target_window: string;
  resolution_criteria?: string;
  verifiability_tier: string;
  sha256_lock: string;
  observed_outcome?: string | null;
  status: 'confirmed_aligned' | 'contradicted' | 'locked_pending' | 'unresolved';
  brier_loss: number | null;
  verifier_notes?: string;
  timestamp: string;
}

export interface ResearchArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  read_time: string;
  date: string;
  summary: string;
  content: string;
}
