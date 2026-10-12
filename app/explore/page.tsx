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
import { streamAiReasoning } from '@/lib/ai';
import { useLocale } from '@/lib/LocaleContext';

export default function ExplorePage() {
  const { locale, setLocale, dict } = useLocale();
  const [selectedKey, setSelectedKey] = React.useState<string>('einstein');
  const [profileResult, setProfileResult] = React.useState<LifeMapResult>(BENCHMARK_PROFILES.einstein);
  const [traditions, setTraditions] = React.useState({ w: true, b: true, t: true, n: true });
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);

  // Deep-dive Comparative State
  const [synthesisData, setSynthesisData] = React.useState<any>(null);
  const [activeLabTab, setActiveLabTab] = React.useState<'synthesis' | 'tuvi' | 'astro'>('synthesis');

  // AI Thinking State (Groq LPU reasoning from tu-vi)
  const [aiThinkingText, setAiThinkingText] = React.useState<string>('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  React.useEffect(() => {
    // Check if custom profile was saved from home form
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const savedCustom = localStorage.getItem('converglyph_custom_profile') || localStorage.getItem('aetheria_custom_profile');
      if (urlParams.get('profile') === 'custom' && savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (parsed && parsed.profile && parsed.rawData) {
            const derived = deriveDomainScores(parsed.rawData);
            const customRes: LifeMapResult = {
              profile: parsed.profile,
              domain_scores: derived,
              theme_details: [
                {
                  theme: "Intellect & First Principles",
                  icon: "🧠",
                  synthesis: `Computed cognitive synthesis for ${parsed.profile.name}.`,
                  western_driver: `Mercury in ${parsed.rawData?.western?.planets?.find((p: any) => p.name === 'Mercury')?.sign || 'Aries'}`,
                  eastern_driver: `Day Master: ${parsed.rawData?.bazi?.day_master?.name || 'Yang Fire'}`
                },
                {
                  theme: "Vocation & Autonomy",
                  icon: "🏛️",
                  synthesis: `Vocational trajectory governed by ${parsed.rawData?.western?.midheaven?.sign || 'Pisces'} Midheaven.`,
                  western_driver: `Midheaven at ${parsed.rawData?.western?.midheaven?.degree || 12}°`,
                  eastern_driver: `Career Palace in ${parsed.rawData?.tuvi?.palaces?.find((p: any) => p.name?.includes('Career'))?.branch_vi || 'Ngọ'}`
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
                  western_driver: `Sun in ${parsed.rawData?.western?.planets?.find((p: any) => p.name === 'Sun')?.sign || 'Pisces'}`,
                  eastern_driver: `Wood ${parsed.rawData?.bazi?.elements_distribution?.Wood || 20}%, Fire ${parsed.rawData?.bazi?.elements_distribution?.Fire || 20}%`
                },
                {
                  theme: "Partnership & Covenant",
                  icon: "🤝",
                  synthesis: "Relational contracts across 7th House & Spouse Palace.",
                  western_driver: `Venus in ${parsed.rawData?.western?.planets?.find((p: any) => p.name === 'Venus')?.sign || 'Aries'}`,
                  eastern_driver: "Spouse Palace branch placement"
                },
                {
                  theme: "Inner Transformation",
                  icon: "🔮",
                  synthesis: `Philosophical resilience reflected in Life Path ${parsed.rawData?.numerology?.life_path_reduced?.number || 6}.`,
                  western_driver: `Saturn in ${parsed.rawData?.western?.planets?.find((p: any) => p.name === 'Saturn')?.sign || 'Aries'}`,
                  eastern_driver: "Ancestral Mind Palace in Wood"
                }
              ],
              calculationVersion: "API-v1-custom"
            };
            setProfileResult(customRes);
            setSelectedKey('custom');
          }
        } catch {}
      }
    }
  }, []);

  React.useEffect(() => {
    // Load compare synthesis data whenever active profile or locale changes
    fetchCompareApi(profileResult.profile, locale)
      .then(setSynthesisData)
      .catch(console.warn);
  }, [profileResult.profile, locale]);

  const toggleTradition = (key: 'w' | 'b' | 't' | 'n') => {
    setTraditions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectProfile = (key: string) => {
    setSelectedKey(key);
    if (BENCHMARK_PROFILES[key]) {
      setProfileResult(BENCHMARK_PROFILES[key]);
      setAiThinkingText('');
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
          synthesis: `Computed cognitive synthesis for ${profile.name}.`,
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
          synthesis: "Relational contracts across 7th House & Spouse Palace.",
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
    setAiThinkingText('');
  };

  // Run AI Thinking CoT synthesis (Groq LPU LLM inference)
  const handleRunAiThinking = async () => {
    setIsAiLoading(true);
    setAiThinkingText('');

    const sysPrompt = locale === 'vi'
      ? "Bạn là Chuyên gia Cao cấp về Tử Vi Đẩu Số và Chiêm Tinh Học Tây Phương. Nhiệm vụ của bạn là luận giải hợp nhất sâu sắc giữa 12 Cung Tử Vi và Bản Đồ Sao Astrodienst, nêu rõ điểm tương đồng, điểm mâu thuẫn và kim chỉ nam hành động dựa trên dữ liệu tính toán chính xác."
      : "You are a Senior Metaphysical and Astrological Reasoning Intelligence. Your objective is to cross-examine Eastern Zi Wei Dou Shu and Western Astrodienst natal charts, highlighting points of consensus, structural tension, and actionable guidance without mystical vagueness.";

    const userPrompt = `Subject: ${profileResult.profile.name}, Birth Date: ${profileResult.profile.year}-${profileResult.profile.month}-${profileResult.profile.day}, Location: ${profileResult.profile.locationName}. Please provide a structured Chain-of-Thought (CoT) cross-tradition synthesis covering: 1. Core Identity & Ego, 2. Career & Authority, 3. Synthesis Actionable Counsel.`;

    await streamAiReasoning({
      model: "openai/gpt-oss-120b",
      systemPrompt: sysPrompt,
      userPrompt,
      onChunk: (chunk) => setAiThinkingText(prev => prev + chunk),
      onError: (err) => setAiThinkingText(`AI Inference Error: ${err}`),
      onDone: () => setIsAiLoading(false)
    });
  };

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={setLocale}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      <main className="section" id="life-map-report">
        <div className="container">
          <div className="section-editorial-header">
            <span className="section-editorial-eyebrow">Personal Life Report</span>
            <h1 className="section-editorial-title">Multi-System Life Map</h1>
            <p className="section-editorial-desc">
              Explore how four traditions evaluate your life across six themes. Select an illustrative specimen or calculate your own chart.
            </p>
          </div>

          <div className="editorial-report-wrapper" style={{ marginBottom: '3.5rem' }}>
            <div className="report-masthead">
              <div>
                <span className="report-masthead-meta">Converglyph Specimen Report • Vol. 01</span>
                <h2 className="report-masthead-title" style={{ marginTop: '0.4rem' }}>{profileResult.profile.name}</h2>
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

          {/* AI Thinking Reasoning Card (Groq LPU LLM inference) */}
          <div className="matrix-editorial-card" style={{ marginBottom: '3.5rem', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <span className="status-chip confirmed">Groq LPU Reasoning</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)', marginTop: '0.4rem' }}>
                  AI Thinking Deep Reasoning Studio
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isAiLoading}
                onClick={handleRunAiThinking}
                style={{ fontSize: '0.8rem' }}
              >
                {isAiLoading ? 'Generating Reasoning Stream...' : '🧠 Run AI Deep Reasoning'}
              </button>
            </div>

            {aiThinkingText ? (
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '1.5rem', fontSize: '0.9rem', color: 'var(--moon-ivory)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {aiThinkingText}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tap "Run AI Deep Reasoning" to execute real-time multi-model Chain-of-Thought inference synthesizing your Western and Eastern natal positions.
              </p>
            )}
          </div>

          {/* Dedicated Deep-Dive Laboratory */}
          <div id="deep-dive-lab" style={{ marginTop: '3rem' }}>
            <div className="section-editorial-header">
              <span className="section-editorial-eyebrow">Interactive Foundations Lab</span>
              <h2 className="section-editorial-title">East–West Calculation Laboratory</h2>
              <p className="section-editorial-desc">
                Inspect the deterministic calculation baselines: authentic 12 palaces from Tử Vi Đẩu Số and Swiss Ephemeris geometric aspect networks.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn-toggle-pill ${activeLabTab === 'synthesis' ? 'active' : ''}`}
                onClick={() => setActiveLabTab('synthesis')}
              >
                ✦ Synthesis Monograph
              </button>
              <button
                type="button"
                className={`btn-toggle-pill ${activeLabTab === 'tuvi' ? 'active' : ''}`}
                onClick={() => setActiveLabTab('tuvi')}
              >
                ☯ Tử Vi 12 Palaces Matrix
              </button>
              <button
                type="button"
                className={`btn-toggle-pill ${activeLabTab === 'astro' ? 'active' : ''}`}
                onClick={() => setActiveLabTab('astro')}
              >
                🪐 Astrodienst Planetary Wheel
              </button>
            </div>

            {/* TAB 1: Synthesis */}
            {activeLabTab === 'synthesis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {synthesisData?.comparison ? (
                  Object.entries(synthesisData.comparison).map(([k, item]: [string, any]) => {
                    if (!item || !item.title) return null;
                    return (
                      <div key={k} className="synthesis-editorial-card">
                        <h4 className="synthesis-card-title">{item.title}</h4>
                        <div className="synthesis-columns">
                          <div className="synthesis-subbox">
                            <strong style={{ color: 'var(--color-tuvi)' }}>TỬ VI PALACES</strong>
                            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {Object.entries(item.tuvi || {}).map(([tk, tv]) => (
                                <div key={tk}><strong>{tk.replace(/_/g, ' ')}:</strong> {String(tv)}</div>
                              ))}
                            </div>
                          </div>
                          <div className="synthesis-subbox">
                            <strong style={{ color: 'var(--color-western)' }}>WESTERN EPHEMERIS</strong>
                            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {Object.entries(item.astro || {}).map(([ak, av]) => (
                                <div key={ak}><strong>{ak.replace(/_/g, ' ')}:</strong> {String(av)}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--moon-ivory)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                          <strong style={{ color: 'var(--celestial-gold)' }}>Unified Verdict:</strong> {item.synthesis || item.content}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>Loading synthesis monograph...</p>
                )}
              </div>
            )}

            {/* TAB 2: Tử Vi 12 Palaces */}
            {activeLabTab === 'tuvi' && (
              <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {(synthesisData?.tuvi?.palaces || []).map((p: any) => (
                    <div key={p.cung_so} className="tuvi-palace-cell">
                      <div className="tuvi-palace-title">
                        <span>{p.tenCung} ({p.cungCanChi})</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--celestial-gold)' }}>{p.hanhCung}</span>
                      </div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: p.chinhTinh?.length ? 'var(--color-tuvi)' : 'var(--text-dim)', marginBottom: '0.35rem' }}>
                        ★ {p.chinhTinh?.join(', ') || 'Vô Chính Diệu'}
                      </div>
                      <div className="tuvi-stars-list">
                        {(p.phuTinh || []).slice(0, 5).join(', ')}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Đại Hạn: {p.daiHan}</span>
                        <span>{p.isThan ? '★ Thân Cư' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Astrodienst Wheel */}
            {activeLabTab === 'astro' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--moon-ivory)' }}>
                    Big Three & Angles
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="astro-angle-box">
                      <span>☉ Sun</span>
                      <span className="astro-angle-val">{synthesisData?.astro?.big_three?.sun?.sign} ({synthesisData?.astro?.big_three?.sun?.formatted})</span>
                    </div>
                    <div className="astro-angle-box">
                      <span>☽ Moon</span>
                      <span className="astro-angle-val">{synthesisData?.astro?.big_three?.moon?.sign} ({synthesisData?.astro?.big_three?.moon?.formatted})</span>
                    </div>
                    <div className="astro-angle-box">
                      <span>↑ Ascendant</span>
                      <span className="astro-angle-val">{synthesisData?.astro?.big_three?.ascendant?.sign_name} ({synthesisData?.astro?.big_three?.ascendant?.formatted})</span>
                    </div>
                  </div>
                </div>

                <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--moon-ivory)' }}>
                    Geometric Aspects
                  </h4>
                  <div className="table-wrapper" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    <table className="editorial-table">
                      <thead>
                        <tr>
                          <th>Aspect</th>
                          <th>Bodies</th>
                          <th>Angle / Orb</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(synthesisData?.astro?.aspects || []).slice(0, 10).map((asp: any, idx: number) => (
                          <tr key={`asp-${idx}`}>
                            <td style={{ color: 'var(--color-western)', fontWeight: 600 }}>{asp.type}</td>
                            <td>{asp.p1} &amp; {asp.p2}</td>
                            <td>{asp.angle}° (orb {asp.orb}°)</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
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
