'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { RadarChart } from '@/components/report/RadarChart';
import { ThemeCards } from '@/components/report/ThemeCards';
import { ProfileForm } from '@/components/report/ProfileForm';
import { BENCHMARK_PROFILES, deriveDomainScores } from '@/lib/profile';
import { BirthProfile, LifeMapResult } from '@/lib/types';
import { calculateProfileApi, fetchCompareApi } from '@/lib/api';
import { Locale } from '@/lib/i18n';

export default function ExplorePage() {
  const [locale, setLocale] = React.useState<Locale>('en');
  const [selectedKey, setSelectedKey] = React.useState<string>('einstein');
  const [profileResult, setProfileResult] = React.useState<LifeMapResult>(BENCHMARK_PROFILES.einstein);
  const [traditions, setTraditions] = React.useState({ w: true, b: true, t: true, n: true });
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);

  const toggleTradition = (key: 'w' | 'b' | 't' | 'n') => {
    setTraditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectProfile = (key: string) => {
    setSelectedKey(key);
    if (BENCHMARK_PROFILES[key]) {
      setProfileResult(BENCHMARK_PROFILES[key]);
    }
  };

  const handleCalculate = async (profile: BirthProfile) => {
    const rawData = await calculateProfileApi(profile) as any;
    const derivedScores = deriveDomainScores(rawData);

    const newResult: LifeMapResult = {
      profile,
      domain_scores: derivedScores,
      theme_details: [
        {
          theme: "Intellect & First Principles",
          icon: "🧠",
          synthesis: `Computed cognitive synthesis for ${profile.name}. Combines foundational analytical reduction with creative pattern synthesis.`,
          western_driver: `Mercury in ${rawData?.western?.planets?.find((p: any) => p.name === 'Mercury')?.sign || 'Aries'}`,
          eastern_driver: `Day Master: ${rawData?.bazi?.day_master?.name || 'Yang Fire'}`
        },
        {
          theme: "Vocation & Autonomy",
          icon: "🏛️",
          synthesis: `Vocational trajectory governed by ${rawData?.western?.midheaven?.sign || 'Pisces'} Midheaven.`,
          western_driver: `Midheaven at ${rawData?.western?.midheaven?.degree || 12}°`,
          eastern_driver: `Career Palace in ${rawData?.tuvi?.palaces?.find((p: any) => p.name?.includes('Career'))?.branch_vi || 'Ngọ'}`
        },
        {
          theme: "Material Resources",
          icon: "💎",
          synthesis: "Financial orientation shows deliberate resource pacing and capital mobilization.",
          western_driver: "2nd/8th houses division",
          eastern_driver: "Wealth Palace configuration"
        },
        {
          theme: "Personal Well-being",
          icon: "🌱",
          synthesis: "Personal stamina and somatic pacing anchored in Five Element distribution.",
          western_driver: `Sun in ${rawData?.western?.planets?.find((p: any) => p.name === 'Sun')?.sign || 'Pisces'}`,
          eastern_driver: `Wood ${rawData?.bazi?.elements_distribution?.Wood || 20}%, Fire ${rawData?.bazi?.elements_distribution?.Fire || 20}%`
        },
        {
          theme: "Partnership & Covenant",
          icon: "🤝",
          synthesis: "Relational contracts and peer dynamics across 7th House & Spouse Palace.",
          western_driver: `Venus in ${rawData?.western?.planets?.find((p: any) => p.name === 'Venus')?.sign || 'Aries'}`,
          eastern_driver: "Spouse Palace branch placement"
        },
        {
          theme: "Inner Transformation",
          icon: "🔮",
          synthesis: `Philosophical resilience reflected in Life Path ${rawData?.numerology?.life_path_reduced?.number || 6}.`,
          western_driver: `Saturn in ${rawData?.western?.planets?.find((p: any) => p.name === 'Saturn')?.sign || 'Aries'}`,
          eastern_driver: "Ancestral Mind Palace in Wood"
        }
      ],
      calculationVersion: "API-v1-custom"
    };

    setProfileResult(newResult);
    setSelectedKey('custom');
  };

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={setLocale}
        activeView="consumer"
        onViewChange={(v) => { if (v === 'research') window.location.href = '/research'; }}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      <main className="section" id="life-map-report">
        <div className="container">
          <div className="section-editorial-header">
            <span className="section-editorial-eyebrow">Product 01: The Multi-System Life Map</span>
            <h2 className="section-editorial-title">Personal Life Map Report</h2>
            <p className="section-editorial-desc">
              Explore your personal life across 6 core interpretive themes. Switch profiles, toggle individual traditions, and discover where traditions converge or diverge.
            </p>
          </div>

          <div className="editorial-report-wrapper">
            <div className="report-masthead">
              <div>
                <span className="report-masthead-meta">Aetheria Research Specimen • Vol. 01</span>
                <h3 className="report-masthead-title">{profileResult.profile.name}</h3>
              </div>
              <div className="report-masthead-meta">
                {profileResult.profile.year}-{String(profileResult.profile.month).padStart(2, '0')}-{String(profileResult.profile.day).padStart(2, '0')} • {profileResult.profile.locationName}
              </div>
            </div>

            <div className="report-controls-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label className="report-selector-label">Profile Specimen:</label>
                <select
                  value={selectedKey}
                  onChange={(e) => handleSelectProfile(e.target.value)}
                  className="select-editorial"
                >
                  <option value="einstein">Albert Einstein — Theoretical Physics (1879)</option>
                  <option value="da_vinci">Leonardo da Vinci — Polymath Synthesis (1452)</option>
                  <option value="curie">Marie Curie — Radiology Pioneer (1867)</option>
                  {selectedKey === 'custom' && (
                    <option value="custom">★ {profileResult.profile.name} (Calculated Profile)</option>
                  )}
                </select>
              </div>

              <div className="report-tradition-toggles">
                <button
                  type="button"
                  className={`btn-toggle-pill ${traditions.w ? 'active' : ''}`}
                  onClick={() => toggleTradition('w')}
                >
                  Western
                </button>
                <button
                  type="button"
                  className={`btn-toggle-pill ${traditions.b ? 'active' : ''}`}
                  onClick={() => toggleTradition('b')}
                >
                  Bát Tự
                </button>
                <button
                  type="button"
                  className={`btn-toggle-pill ${traditions.t ? 'active' : ''}`}
                  onClick={() => toggleTradition('t')}
                >
                  Tử Vi
                </button>
                <button
                  type="button"
                  className={`btn-toggle-pill ${traditions.n ? 'active' : ''}`}
                  onClick={() => toggleTradition('n')}
                >
                  Numerology
                </button>
              </div>
            </div>

            <div className="report-grid-layout">
              <div className="report-radar-stage">
                <RadarChart scores={profileResult.domain_scores} activeTraditions={traditions} />
                <div className="radar-legend-strip">
                  <span><span className="legend-dot" style={{ background: 'var(--color-western)' }}></span> Western</span>
                  <span><span className="legend-dot" style={{ background: 'var(--color-bazi)' }}></span> Bát Tự</span>
                  <span><span className="legend-dot" style={{ background: 'var(--color-tuvi)' }}></span> Tử Vi</span>
                  <span><span className="legend-dot" style={{ background: 'var(--color-numerology)' }}></span> Numerology</span>
                </div>
              </div>

              <ThemeCards details={profileResult.theme_details} isVietnamese={locale === 'vi'} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ProfileForm
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onSubmitProfile={handleCalculate}
        isVietnamese={locale === 'vi'}
      />
    </>
  );
}
