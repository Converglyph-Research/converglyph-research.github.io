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

  // Run AI Thinking CoT synthesis across specific methods, aspects, models, and languages
  const handleRunAiThinking = async ({
    method = 'unified',
    aspect = 'all',
    model = 'openai/gpt-oss-120b',
    aiLang = 'vi'
  }: {
    method: 'unified' | 'tuvi' | 'astro' | 'bazi' | 'numerology';
    aspect: string;
    model: string;
    aiLang: 'vi' | 'en';
  }) => {
    setIsAiLoading(true);
    setAiThinkingText('');

    const name = profileResult.profile.name;
    const dateStr = `${profileResult.profile.year}-${String(profileResult.profile.month).padStart(2, '0')}-${String(profileResult.profile.day).padStart(2, '0')}`;
    const loc = profileResult.profile.locationName;
    const isAiVi = (aiLang === 'vi');

    let sysPrompt = '';
    let userPrompt = '';

    // Gather available data context from calculations
    let contextData = `Subject: ${name}, Date: ${dateStr}, Location: ${loc}.\n`;
    if (synthesisData?.tuvi) {
      const tb = synthesisData.tuvi.thienBan || {};
      contextData += `Tu Vi Ban Menh: ${tb.banMenh || 'N/A'}, Cuc: ${tb.cuc || 'N/A'}.\n`;
    }
    if (synthesisData?.astro) {
      const b3 = synthesisData.astro.big_three || {};
      contextData += `Western Big Three: Sun ${b3.sun?.sign || 'N/A'}, Moon ${b3.moon?.sign || 'N/A'}, Ascendant ${b3.ascendant?.sign_name || 'N/A'}.\n`;
    }

    if (method === 'tuvi') {
      sysPrompt = isAiVi
        ? "Bạn là Đại Sư Tử Vi Đẩu Số tinh thông cổ kim (kết hợp Tử Vi Toàn Thư, Trung Châu phái và phương pháp Tinh Bàn Tử Vân). Luận giải chuyên sâu theo tinh đẩu, miếu hãm, tam phương tứ chính và đại hạn. BẮT BUỘC TRÌNH BÀY MARKDOWN ĐẸP MẮT: dùng tiêu đề rõ ràng, bảng markdown đối chiếu và danh sách điểm gạch đầu dòng."
        : "You are a Master of Classical Eastern Zi Wei Dou Shu (Purple Star Astrology). Provide an authoritative analysis of the 12 Palaces, star brightness levels, major luck decades, and transformations using clean Markdown headers, bullet points, and comparison tables.";
      userPrompt = `${contextData}\nKhía cạnh khảo sát: ${aspect}.\nHãy phân tích chuyên sâu chi tiết: 1. Đắc Hãm & Cục Số, 2. Ảnh Hưởng Cung Trọng Tâm (${aspect}), 3. Bảng Phân Tích Cát/Hung & Tinh Đẩu, 4. Lời Khuyên Hành Động Thực Tiễn.`;
    } else if (method === 'astro') {
      sysPrompt = isAiVi
        ? "Bạn là Chuyên gia Chiêm Tinh Học Tây Phương (Western Astrologer) chuẩn Astrodienst và Cosmobiology. Luận giải chuyên sâu dựa trên The Big Three (Sun, Moon, Ascendant), hệ thống 12 Nhà và mạng lưới góc chiếu hình học (Aspects) từ Swiss Ephemeris. BẮT BUỘC TRÌNH BÀY BẢNG MARKDOWN VÀ ĐỀ MỤC."
        : "You are an Astrodienst-standard Western Astrologer. Analyze the Big Three (Sun, Moon, Ascendant), Placidus house rulers, and geometric aspect networks using structured Markdown tables and headers.";
      userPrompt = `${contextData}\nInquiry aspect: ${aspect}.\nProvide deep analysis: 1. Psychological Blueprint, 2. Focus on Aspect (${aspect}), 3. Aspect Tension Matrix (Markdown Table), 4. Evolutionary Growth Counsel.`;
    } else if (method === 'bazi') {
      sysPrompt = isAiVi
        ? "Bạn là Bậc Thầy Bát Tự Tứ Trụ (Four Pillars of Destiny). Phân tích dựa trên Nhật Chủ (Day Master), tiết khí 24 Jie Qi, thế cân bằng Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ), Thập Thần và Dụng Thần. Trình bày bảng Markdown và phân tích sinh khắc."
        : "You are a BaZi Four Pillars Master. Analyze Day Master balance, Five Element distributions, and Ten Gods dynamics using clear Markdown formatting and tables.";
      userPrompt = `${contextData}\nKhía cạnh khảo sát: ${aspect}.\nPhân tích: 1. Nhật Chủ & Can Chi Tứ Trụ, 2. Bảng Phân Bổ Ngũ Hành & Thập Thần, 3. Dụng Thần & Hỷ Thần, 4. Vận Trình & Định Hướng.`;
    } else if (method === 'numerology') {
      sysPrompt = isAiVi
        ? "Bạn là Chuyên gia Thần Số Học Pythagore & Chaldean. Phân tích đối chiếu song song Công thức A (Cộng tổng chữ số giữ Master 11, 22, 33) và Công thức B (Rút gọn độc lập từng chu kỳ). Trình bày bảng Markdown đối chiếu."
        : "You are a Pythagorean & Chaldean Numerology Scholar. Cross-examine Master Number preservation vs independent period reduction using structured Markdown tables.";
      userPrompt = `${contextData}\nKhía cạnh: ${aspect}.\nPhân tích: 1. Đối Chiếu Hai Công Thức Đường Đời (Bảng Markdown), 2. Con Số Linh Hồn & Biểu Đạt, 3. Chu Kỳ Cá Nhân & Kim Chỉ Nam.`;
    } else {
      // Mode === 'unified' (Requires multi-system data)
      sysPrompt = isAiVi
        ? "Bạn là Viện Trưởng Nghiên Cứu Mệnh Lý Học Đa Chiều (Converglyph Research). Hãy tích hợp và đối chiếu toàn bộ dữ liệu từ các phương pháp có sẵn (Chiêm Tinh Tây Phương, Tử Vi, Bát Tự, Thần Số Học). BẮT BUỘC TRÌNH BÀY:\n1. BẢNG ĐỒNG THUẬN Ý NGHĨA (Chủ đề, Dấu ấn các môn phái, Mức độ hội tụ)\n2. BẢNG PHÂN KỲ HỌC THUẬT (Mâu thuẫn giữa các quy tắc)\n3. KIM CHỈ NAM TỔNG HỢP TOÀN DIỆN."
        : "You are the Lead Symbolic Intelligence Synthesizer at Converglyph Research. Synthesize all active calculation outputs across Western Astrology, Tu Vi, BaZi, and Numerology. YOU MUST PROVIDE:\n1. CONVERGENCE MATRIX TABLE (Theme, Cross-System Signatures, Alignment Level)\n2. DOCTRINAL DIVERGENCE TABLE (Rule Contradictions & Tension)\n3. UNIFIED STRATEGIC COUNSEL.";
      userPrompt = `${contextData}\nKhía cạnh trọng tâm: ${aspect}.\nHãy thực hiện luận giải hợp nhất đa hệ thống với các bảng Markdown chi tiết.`;
    }

    await streamAiReasoning({
      model: model || "openai/gpt-oss-120b",
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

          {/* Dedicated Deep-Dive Laboratory */}
          <div id="deep-dive-lab" style={{ marginTop: '3rem', marginBottom: '3.5rem' }}>
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

          {/* Modern AI Reasoning Studio Placed AFTER Calculation Laboratory */}
          <AiReasoningStudio
            isVietnamese={locale === 'vi'}
            subjectName={profileResult.profile.name}
            birthDateStr={`${profileResult.profile.year}-${String(profileResult.profile.month).padStart(2, '0')}-${String(profileResult.profile.day).padStart(2, '0')}`}
            locationName={profileResult.profile.locationName}
            synthesisData={synthesisData}
            activeMethodsCount={Object.values(traditions).filter(Boolean).length}
            onRunReasoning={handleRunAiThinking}
            reasoningText={aiThinkingText}
            isLoading={isAiLoading}
          />
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
