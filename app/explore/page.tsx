'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { RadarChart } from '@/components/report/RadarChart';
import { ThemeCards } from '@/components/report/ThemeCards';
import { ProfileForm } from '@/components/report/ProfileForm';
import { AiReasoningStudio } from '@/components/report/AiReasoningStudio';
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

  // Run AI Thinking CoT synthesis across specific aspects or unified convergence
  const handleRunAiThinking = async (mode: 'all' | 'tuvi' | 'astro' | 'bazi' | 'convergence' = 'all') => {
    setIsAiLoading(true);
    setAiThinkingText('');

    const name = profileResult.profile.name;
    const dateStr = `${profileResult.profile.year}-${String(profileResult.profile.month).padStart(2, '0')}-${String(profileResult.profile.day).padStart(2, '0')}`;
    const loc = profileResult.profile.locationName;

    let sysPrompt = '';
    let userPrompt = '';

    if (mode === 'tuvi') {
      sysPrompt = locale === 'vi'
        ? "Bạn là Đại Sư Tử Vi Đẩu Số tinh thông cổ kim (kết hợp Tử Vi Toàn Thư, Trung Châu phái và lý thuyết Tinh Bàn Tử Vân). Phân tích chi tiết 12 cung, các chính tinh miếu hãm, bộ sao đắc địa, Tứ Hóa và đại hạn 10 năm với định dạng Markdown chuyên nghiệp (bảng, tiêu đề rõ ràng)."
        : "You are a Master of Classical Eastern Zi Wei Dou Shu (Purple Star Astrology). Deliver an authoritative, structured analysis of the 12 Palaces, star brightness levels, major luck decades, and transformations using clean Markdown headers and tables.";
      userPrompt = `Đương số: ${name}, Sinh ngày: ${dateStr}, Nơi sinh: ${loc}. Hãy phân tích sâu sắc: 1. Cung Mệnh & Thân (Bản thể & Căn cơ), 2. Cung Quan Lộc & Tài Bạch (Sự nghiệp & Tài chính), 3. Cung Phu Thê (Hôn nhân), 4. Kim chỉ nam hành động và vận hạn.`;
    } else if (mode === 'astro') {
      sysPrompt = locale === 'vi'
        ? "Bạn là Chuyên gia Chiêm Tinh Học Tây Phương (Western Astrologer) chuẩn Astrodienst và Cosmobiology. Luận giải chuyên sâu dựa trên The Big Three (Sun, Moon, Ascendant), hệ thống 12 Nhà và mạng lưới góc chiếu hình học (Aspects) chuẩn xác từ Swiss Ephemeris. Trình bày Markdown thẩm mỹ với đề mục và bảng phân tích."
        : "You are an Astrodienst-standard Western Astrologer. Analyze the Big Three (Sun, Moon, Ascendant), Placidus house rulers, and geometric aspect networks using structured Markdown tables and headers.";
      userPrompt = `Subject: ${name}, Birth: ${dateStr}, Location: ${loc}. Analyze: 1. Core Psychological Blueprint (Sun, Moon, Rising), 2. House Dynamics & Career Zenith (Midheaven), 3. Critical Aspect Tensions & Talents, 4. Strategic Life Advice.`;
    } else if (mode === 'bazi') {
      sysPrompt = locale === 'vi'
        ? "Bạn là Chuyên gia Bát Tự Tứ Trụ (Four Pillars of Destiny). Phân tích dựa trên Nhật Chủ (Day Master), tiết khí thiên văn 24 Jie Qi, thế cân bằng Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ) và Thập Thần. Trình bày Markdown chuyên nghiệp."
        : "You are a BaZi Four Pillars Master. Analyze Day Master balance, Five Element distributions, and Ten Gods dynamics using clear Markdown formatting.";
      userPrompt = `Subject: ${name}, Birth: ${dateStr}, Location: ${loc}. Evaluate: 1. Day Master Element & Polarity, 2. Dynamic Five Elements Balance, 3. Useful God (Dụng Thần) & Flow, 4. Career and Health Counsel.`;
    } else if (mode === 'convergence') {
      sysPrompt = locale === 'vi'
        ? "Bạn là Nhà Nghiên Cứu Định Lượng Đối Sánh Mệnh Lý Học Đông - Tây. Trách nhiệm của bạn là tổng hợp dữ liệu từ 4 môn phái (Chiêm Tinh Tây Phương, Tử Vi, Bát Tự, Thần Số Học) để đo lường mức độ ĐỒNG THUẬN (Convergence) và MÂU THUẪN (Divergence), nêu rõ điểm trùng khớp kỳ diệu và điểm phân kỳ học thuật dưới dạng bảng Markdown."
        : "You are a Quantitative Cross-Tradition Synthesis Researcher. Evaluate convergence and divergence across Western Astrology, Tu Vi, BaZi, and Numerology. Surface remarkable points of consensus and explain doctrinal conflicts objectively in structured Markdown tables.";
      userPrompt = `Đương số: ${name}, Sinh ngày: ${dateStr}, Tọa độ: ${loc}. Đối sánh: 1. Bảng Tổng Hợp Đồng Thuận (Chủ đề, Dấu ấn các môn phái, Tỷ lệ đồng thuận), 2. Bảng Phân Kỳ Học Thuật (Điểm mâu thuẫn giữa các quy tắc), 3. Kết Luận Hợp Nhất Đa Chiều.`;
    } else {
      // Mode === 'all': Full integration
      sysPrompt = locale === 'vi'
        ? "Bạn là Viện Trưởng Nghiên Cứu Biểu Tượng & Mệnh Lý Học Đa Chiều (Converglyph Research Intelligence). Hãy thực thi chuỗi suy luận Chain-of-Thought (CoT) hợp nhất toàn diện 4 hệ thống: 1. Tử Vi Đẩu Số 12 Cung, 2. Chiêm Tinh Học Tây Phương Swiss Ephemeris, 3. Bát Tự Tứ Trụ, 4. Thần Số Học Pythagore. Định dạng Markdown cao cấp với bảng phân tích đối sánh, trích dẫn quy tắc và kim chỉ nam khai phóng."
        : "You are the Lead Symbolic Intelligence Synthesizer at Converglyph Research. Execute a comprehensive Chain-of-Thought (CoT) integration across Tu Vi, Western Astrodienst, BaZi, and Pythagorean Numerology. Structure into Markdown headers, comparison tables, and actionable philosophical counsel.";
      userPrompt = `Subject: ${name}, Birth Date: ${dateStr}, Location: ${loc}.
Produce a comprehensive Master Synthesis:
### 1. Bản Thể Cốt Lõi & Động Lực Trí Tuệ (Core Ego & Cognitive Style)
### 2. Sự Nghiệp, Danh Vọng & Quyền Lực (Vocation, Zenith & Wealth)
### 3. Tình Duyên & Mối Quan Hệ (Partnership & Covenant)
### 4. Ma Trận Đối Sánh Đồng Thuận vs Mâu Thuẫn (Convergence vs Divergence Matrix)
### 5. Kim Chỉ Nam Khai Phóng Tiềm Năng (Actionable Strategic Counsel)`;
    }

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

          {/* Modern AI Reasoning Studio with Aspect Switching & Formatted Markdown */}
          <AiReasoningStudio
            isVietnamese={locale === 'vi'}
            subjectName={profileResult.profile.name}
            birthDateStr={`${profileResult.profile.year}-${String(profileResult.profile.month).padStart(2, '0')}-${String(profileResult.profile.day).padStart(2, '0')}`}
            locationName={profileResult.profile.locationName}
            synthesisData={synthesisData}
            onRunReasoning={handleRunAiThinking}
            reasoningText={aiThinkingText}
            isLoading={isAiLoading}
          />

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
                        {(synthesisData?.astro?.aspects || []).slice(0, 10).map((asp: any, idx: number) => {
                          const aspectTitle = asp.aspect_name || asp.aspect_vn || asp.type || 'Aspect';
                          const p1Name = asp.body1_name || asp.body1_vn || asp.p1 || 'Body 1';
                          const p2Name = asp.body2_name || asp.body2_vn || asp.p2 || 'Body 2';
                          const angleVal = asp.actual_angle !== undefined ? asp.actual_angle : (asp.target_angle !== undefined ? asp.target_angle : (asp.angle || 0));
                          const orbVal = asp.orb !== undefined ? asp.orb : 0;
                          return (
                            <tr key={`asp-${idx}`}>
                              <td style={{ color: 'var(--color-western)', fontWeight: 600 }}>{aspectTitle}</td>
                              <td>{p1Name} &amp; {p2Name}</td>
                              <td>{angleVal}° (orb {orbVal}°)</td>
                            </tr>
                          );
                        })}
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
