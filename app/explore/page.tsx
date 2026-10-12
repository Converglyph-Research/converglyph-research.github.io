'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { RadarChart } from '@/components/report/RadarChart';
import { ThemeCards } from '@/components/report/ThemeCards';
import { ProfileForm } from '@/components/report/ProfileForm';
import { TimeSeriesConvergenceView } from '@/components/report/TimeSeriesConvergenceView';
import { AiReasoningStudio } from '@/components/report/AiReasoningStudio';
import { BENCHMARK_PROFILES, deriveDomainScores } from '@/lib/profile';
import { BirthProfile, LifeMapResult } from '@/lib/types';
import { calculateProfileApi, fetchCompareApi, fetchSavedProfilesApi, loadSavedProfileApi } from '@/lib/api';
import { streamAiReasoning } from '@/lib/ai';
import { useLocale } from '@/lib/LocaleContext';
import { getUserSession, getAccountProfileStorageKey } from '@/lib/auth';

export default function ExplorePage() {
  const { locale, setLocale, dict } = useLocale();
  const [selectedKey, setSelectedKey] = React.useState<string>('einstein');
  const [profileResult, setProfileResult] = React.useState<LifeMapResult>(BENCHMARK_PROFILES.einstein);
  const [traditions, setTraditions] = React.useState({ w: true, b: true, t: true, n: true });
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);

  // Deep-dive Comparative State
  const [synthesisData, setSynthesisData] = React.useState<any>(null);
  const [activeLabTab, setActiveLabTab] = React.useState<'tuvi' | 'astro' | 'synthesis'>('tuvi');
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);
  const [savedDbProfiles, setSavedDbProfiles] = React.useState<Array<{ id: number; name: string; birth_year: number; birth_month: number; birth_day: number; location_name: string }>>([]);
  // AI Thinking State (Groq LPU reasoning from tu-vi)
  const [aiThinkingText, setAiThinkingText] = React.useState<string>('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  React.useEffect(() => {
    // Check if custom profile was saved from home form
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const currentSession = getUserSession();
      const storageKey = getAccountProfileStorageKey(currentSession?.email);
      const savedCustom = localStorage.getItem(storageKey) || localStorage.getItem('converglyph_custom_profile') || localStorage.getItem('aetheria_custom_profile');
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
    fetchSavedProfilesApi().then(setSavedDbProfiles).catch(console.warn);
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

  const handleSelectProfile = async (key: string) => {
    setSelectedKey(key);
    setAiThinkingText('');

    if (BENCHMARK_PROFILES[key]) {
      setProfileResult(BENCHMARK_PROFILES[key]);
      return;
    }

    if (key.startsWith('db-')) {
      const profId = key.replace('db-', '');
      try {
        const saved = await loadSavedProfileApi(profId);
        if (saved) {
          const derived = deriveDomainScores(saved.rawData);
          setProfileResult({
            profile: saved.profile,
            domain_scores: derived,
            theme_details: [
              {
                theme: "Intellect & First Principles",
                icon: "🧠",
                synthesis: `Computed cognitive synthesis for ${saved.profile.name}.`,
                western_driver: `Mercury in ${saved.rawData?.western?.planets?.find((p: any) => p.name === 'Mercury')?.sign || 'Aries'}`,
                eastern_driver: `Day Master: ${saved.rawData?.bazi?.day_master?.name || 'Yang Fire'}`
              },
              {
                theme: "Vocation & Autonomy",
                icon: "🏛️",
                synthesis: `Vocational trajectory governed by ${saved.rawData?.western?.midheaven?.sign || 'Pisces'} Midheaven.`,
                western_driver: `Midheaven at ${saved.rawData?.western?.midheaven?.degree || 12}°`,
                eastern_driver: `Career Palace in ${saved.rawData?.tuvi?.palaces?.find((p: any) => p.name?.includes('Career'))?.branch_vi || 'Ngọ'}`
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
                western_driver: `Sun in ${saved.rawData?.western?.planets?.find((p: any) => p.name === 'Sun')?.sign || 'Pisces'}`,
                eastern_driver: `Wood ${saved.rawData?.bazi?.elements_distribution?.Wood || 20}%, Fire ${saved.rawData?.bazi?.elements_distribution?.Fire || 20}%`
              },
              {
                theme: "Partnership & Covenant",
                icon: "🤝",
                synthesis: "Relational contracts across 7th House & Spouse Palace.",
                western_driver: `Venus in ${saved.rawData?.western?.planets?.find((p: any) => p.name === 'Venus')?.sign || 'Aries'}`,
                eastern_driver: "Spouse Palace branch placement"
              },
              {
                theme: "Inner Transformation",
                icon: "🔮",
                synthesis: `Philosophical resilience reflected in Life Path ${saved.rawData?.numerology?.life_path_reduced?.number || 6}.`,
                western_driver: `Saturn in ${saved.rawData?.western?.planets?.find((p: any) => p.name === 'Saturn')?.sign || 'Aries'}`,
                eastern_driver: "Ancestral Mind Palace in Wood"
              }
            ],
            calculationVersion: `DB-${profId}`
          });
        }
      } catch (e) {
        console.warn('Failed to load profile from db:', e);
      }
    }
  };

  const handleCalculate = async (profile: BirthProfile) => {
    const currentSession = getUserSession();
    const rawData = await calculateProfileApi(profile, false, currentSession?.email) as any;
    const derivedScores = deriveDomainScores(rawData);
    const storageKey = getAccountProfileStorageKey(currentSession?.email);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify({ profile, rawData }));
    }

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

  // Run AI Thinking CoT synthesis across specific methods, aspects, models, languages, and time horizons
  const handleRunAiThinking = async ({
    method = 'unified',
    aspect = 'all',
    model = 'openai/gpt-oss-120b',
    aiLang = 'vi',
    timeHorizon = 'whole_life'
  }: {
    method: 'unified' | 'tuvi' | 'astro' | 'bazi' | 'numerology';
    aspect: string;
    model: string;
    aiLang: 'vi' | 'en';
    timeHorizon: 'whole_life' | 'youth' | 'middle_age' | 'senior' | 'current_decade' | 'upcoming_year';
  }) => {
    setIsAiLoading(true);
    setAiThinkingText('');

    const name = profileResult.profile.name;
    const dateStr = `${profileResult.profile.year}-${String(profileResult.profile.month).padStart(2, '0')}-${String(profileResult.profile.day).padStart(2, '0')}`;
    const loc = profileResult.profile.locationName;
    const isAiVi = (aiLang === 'vi');

    let sysPrompt = '';
    let userPrompt = '';

    // Double-blind anonymization protocol (Carlson 1985 standard):
    // Strip explicit famous names from the LLM prompt to prevent training-weight prior bias (halo effect)
    const blindedSubjectToken = `Subject_${profileResult.profile.year}_${String(profileResult.profile.month).padStart(2, '0')}`;
    let contextData = `=== DỮ LIỆU ĐƯƠNG SỐ ĐÃ TÍNH TOÁN TIỀN ĐỊNH (PRE-CALCULATED DATA / DOUBLE-BLIND PROTOCOL) ===\n`;
    contextData += `- Mã định danh đối tượng (Anonymized Token): ${blindedSubjectToken}\n`;
    contextData += `- Ngày sinh & Tọa độ thiên văn: ${dateStr} | Tọa độ: ${profileResult.profile.latitude ?? 0}°N, ${profileResult.profile.longitude ?? 0}°E\n`;
    contextData += `- Chu kỳ thời gian khảo sát (Time Horizon): ${timeHorizon}\n`;
    contextData += `- Khía cạnh trọng tâm (Aspect): ${aspect}\n\n`;

    // 1. Pre-calculated Tu Vi Dau So
    const rawDataPayload = (profileResult && typeof profileResult === 'object' && 'rawData' in profileResult)
      ? (profileResult.rawData as Record<string, unknown>)
      : undefined;

    const tuviSource = (synthesisData?.tuvi || rawDataPayload?.tuvi) as Record<string, unknown> | undefined;
    if (tuviSource) {
      const tb = (tuviSource.thienBan as Record<string, unknown>) || {};
      contextData += `1. DỮ LIỆU TỬ VI ĐẨU SỐ (TIỀN TÍNH TOÁN - PRE-CALCULATED):\n`;
      contextData += `- Bản mệnh: ${tb.banMenh || 'N/A'} | Cục: ${tb.cuc || 'N/A'} | Âm dương: ${tb.amDuongMenh || 'N/A'} | Giờ Can Chi: ${tb.gioSinh || 'N/A'}\n`;
      contextData += `- Mệnh chủ: ${tb.menhChu || 'N/A'} | Thân chủ: ${tb.thanChu || 'N/A'}\n`;
      const palacesList = Array.isArray(tuviSource.palaces) ? (tuviSource.palaces as Array<Record<string, unknown>>) : [];
      const palaces = palacesList.map((p) => {
        const chinhTinhStr = Array.isArray(p.chinhTinh) ? p.chinhTinh.join(', ') : 'VCD';
        return `Cung ${p.tenCung} (${p.cungCanChi}): ${chinhTinhStr}${p.daiHan ? ` [Đại hạn: ${p.daiHan}]` : ''}`;
      }).join('; ');
      contextData += `- 12 Cung & Tinh Đẩu: ${palaces}\n\n`;
    }

    // 2. Pre-calculated Western Astrology (Swiss Ephemeris)
    const astroSource = (synthesisData?.astro || rawDataPayload?.western) as Record<string, unknown> | undefined;
    if (astroSource) {
      const b3 = (astroSource.big_three as Record<string, Record<string, unknown>>) || {};
      const planetsList = Array.isArray(astroSource.planets) ? (astroSource.planets as Array<Record<string, unknown>>) : [];
      const sunSign = b3.sun?.sign || planetsList.find((p) => p.name === 'Sun')?.sign || 'N/A';
      const moonSign = b3.moon?.sign || planetsList.find((p) => p.name === 'Moon')?.sign || 'N/A';
      const ascSign = b3.ascendant?.sign_name || (astroSource.ascendant as Record<string, unknown>)?.sign || 'N/A';
      contextData += `2. DỮ LIỆU CHIÊM TINH TÂY PHƯƠNG (SWISS EPHEMERIS - TIỀN TÍNH TOÁN):\n`;
      contextData += `- The Big Three: Sun ${sunSign}, Moon ${moonSign}, Ascendant ${ascSign}\n`;
      const mc = (astroSource.angles as Record<string, Record<string, unknown>>)?.Midheaven || (astroSource.midheaven as Record<string, unknown>);
      if (mc) contextData += `- Midheaven (MC): ${mc.sign || 'N/A'} (${mc.degree || 0}°)\n`;
      const aspectsRaw = Array.isArray(astroSource.aspects) ? (astroSource.aspects as Array<Record<string, unknown>>) : [];
      const aspectsList = aspectsRaw.slice(0, 10).map((a) => `${a.aspect_name || a.type || 'Aspect'}: ${a.body1_name || a.p1} & ${a.body2_name || a.p2} (${a.actual_angle || a.angle || 0}°)`).join('; ');
      contextData += `- Mạng lưới góc chiếu (Aspects): ${aspectsList || 'None'}\n\n`;
    }

    // 3. Pre-calculated BaZi Four Pillars
    const baziSource = (synthesisData?.bazi || rawDataPayload?.bazi) as Record<string, unknown> | undefined;
    if (baziSource) {
      const dm = baziSource.day_master as Record<string, unknown> | undefined;
      const fp = baziSource.four_pillars as Record<string, Record<string, unknown>> | undefined;
      contextData += `3. DỮ LIỆU BÁT TỰ TỨ TRỤ (TIỀN TÍNH TOÁN - PRE-CALCULATED):\n`;
      contextData += `- Nhật Chủ (Day Master): ${dm?.name || 'N/A'} (${dm?.element || 'N/A'} - ${dm?.polarity || ''})\n`;
      contextData += `- Tứ Trụ: Năm ${fp?.year?.label || 'N/A'}, Tháng ${fp?.month?.label || 'N/A'}, Ngày ${fp?.day?.label || 'N/A'}, Giờ ${fp?.hour?.label || 'N/A'}\n`;
      const elemDist = baziSource.elements_distribution as Record<string, number> | undefined;
      if (elemDist) {
        contextData += `- Cân bằng Ngũ Hành: Kim ${elemDist.Metal || 0}%, Mộc ${elemDist.Wood || 0}%, Thủy ${elemDist.Water || 0}%, Hỏa ${elemDist.Fire || 0}%, Thổ ${elemDist.Earth || 0}%\n\n`;
      }
    }

    // 4. Pre-calculated Pythagorean Numerology
    const numSource = (synthesisData?.numerology || rawDataPayload?.numerology) as Record<string, unknown> | undefined;
    if (numSource) {
      const lpMaster = (numSource.life_path_master_preserved || numSource.life_path_master) as Record<string, unknown> | undefined;
      const lpRed = numSource.life_path_reduced as Record<string, unknown> | undefined;
      const expr = numSource.expression as Record<string, unknown> | undefined;
      const soul = numSource.soul_urge as Record<string, unknown> | undefined;
      contextData += `4. DỮ LIỆU THẦN SỐ HỌC (PYTHAGOREAN DUAL LINEAGE - TIỀN TÍNH TOÁN):\n`;
      contextData += `- Life Path Master Preservation (Công thức A): ${lpMaster?.number || 'N/A'} (${lpMaster?.archetype || 'N/A'})\n`;
      contextData += `- Life Path Period Reduction (Công thức B): ${lpRed?.number || 'N/A'} (${lpRed?.archetype || 'N/A'})\n`;
      if (expr) contextData += `- Chỉ số Biểu Đạt (Expression Number): ${expr.number}\n`;
      if (soul) contextData += `- Con số Linh Hồn (Soul Urge): ${soul.number}\n\n`;
    }
    if (method === 'tuvi') {
      sysPrompt = isAiVi
        ? "Bạn là Đại Sư Tử Vi Đẩu Số tinh thông cổ kim (kết hợp Tử Vi Toàn Thư, Trung Châu phái và phương pháp Tinh Bàn Tử Vân). Phân tích chi tiết 12 cung, tinh đẩu miếu hãm, Tứ Hóa và đại hạn 10 năm theo chuỗi thời gian dòng đời (Time Series). BẮT BUỘC TRÌNH BÀY BẢNG MARKDOWN ĐỐI SOÁT VÀ ĐỀ MỤC RÕ RÀNG."
        : "You are a Master of Classical Eastern Zi Wei Dou Shu (Purple Star Astrology). Provide an authoritative analysis of the 12 Palaces, star brightness levels, major luck decades, and transformations across the life-stage time series using clean Markdown headers, bullet points, and comparison tables.";
      userPrompt = `${contextData}\nKhảo sát Cung/Tinh đẩu (${aspect}) theo giai đoạn: ${timeHorizon}.\nHãy phân tích: 1. Đắc Hãm & Cục Số Bản Thể, 2. Tác Động Trong Giai Đoạn (${timeHorizon}), 3. Bảng Phân Tích Cát/Hung & Tinh Đẩu (Bảng Markdown), 4. Lời Khuyên Hành Động & Hóa Giải.`;
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
      // Mode === 'unified' (Requires multi-system data >= 2 methods)
      sysPrompt = isAiVi
        ? `Bạn là Viện Trưởng Nghiên Cứu Mệnh Lý Học Đa Chiều (Converglyph Research Intelligence). Hãy thực thi chuỗi suy luận Chain-of-Thought (CoT) hợp nhất và đối chiếu toàn bộ dữ liệu từ các phương pháp có sẵn (Chiêm Tinh Tây Phương, Tử Vi, Bát Tự, Thần Số Học) theo chuỗi thời gian (Time Series).
NGUYÊN TẮC SUY LUẬN & ĐỊNH DẠNG:
1. ĐỐI SÁNH THEO CHUỖI THỜI GIAN: Phân tích sự hội tụ và biến đổi năng lượng trong giai đoạn (${timeHorizon}).
2. CÔNG THỨC TOÁN HỌC & LATEX: Khi tính toán Thần Số Học hoặc chu kỳ, dùng định dạng LaTeX chuẩn $$...$$ hoặc $...$ (ví dụ: $$3 (\\text{Ngày}) + 7 (\\text{Tháng}) + 4 (\\text{Năm}) = 14$$).
3. BẢNG MARKDOWN CHUYÊN NGHIỆP:
   - BẢNG 1: MA TRẬN ĐỒNG THUẬN (Convergence Matrix) gồm các cột: | Chủ Đề / Khía Cạnh | Dấu Ấn Môn Phái (Tử Vi / Astro / BaZi) | Mức Độ Đồng Thuận (%) | Ý Nghĩa Hợp Nhất |
   - BẢNG 2: ĐIỂM PHÂN KỲ & BỔ KHUYẾT (Divergence & Tension) gồm các cột: | Khía Cạnh | Điểm Mâu Thuẫn Giữa Các Quy Tắc | Nguồn Gốc Phân Kỳ | Hướng Giải Quyết |
4. KIM CHỈ NAM HÀNH ĐỘNG KHAI PHÓNG.`
        : `You are the Lead Symbolic Intelligence Synthesizer at Converglyph Research. Execute an integrated cross-examination across all active methods (Western Astrology, Tu Vi, BaZi, Numerology) across the life stage time-series (${timeHorizon}).
REQUIREMENTS:
1. TIME-SERIES EVALUATION: Analyze convergence and phase transitions during (${timeHorizon}).
2. MATHEMATICAL FORMULAS: Use clean LaTeX ($$...$$ and $...$) for calculations.
3. MARKDOWN COMPARISON TABLES:
   - TABLE 1: CONVERGENCE MATRIX (| Theme | Traditions Alignment | Consensus Score | Unified Verdict |)
   - TABLE 2: DOCTRINAL DIVERGENCE (| Dimension | Rule Conflict | Source of Tension | Reconciliation |)
4. ACTIONABLE STRATEGIC SYNTHESIS.`;
      userPrompt = `${contextData}\nKhía cạnh trọng tâm: ${aspect}.\nGiai đoạn thời gian: ${timeHorizon}.\nHãy thực hiện luận giải hợp nhất đa hệ thống với các bảng Markdown và công thức LaTeX hoàn chỉnh.`;
    }
    const allowed = method === 'unified'
      ? Object.entries(traditions).filter(([_, active]) => active).map(([k]) => {
          if (k === 'w') return 'western';
          if (k === 't') return 'tuvi';
          if (k === 'b') return 'bazi';
          return 'numerology';
        })
      : [method];
    const currentSession = getUserSession();
    await streamAiReasoning({
      model: model || "openai/gpt-oss-120b",
      systemPrompt: sysPrompt,
      userPrompt,
      subjectName: name,
      userEmail: currentSession?.email || '',
      method,
      aspect,
      aiLang,
      timeHorizon,
      tier: "pro",
      allowedTraditions: allowed,
      context: {
        tuvi: synthesisData?.tuvi,
        western: synthesisData?.astro,
        bazi: (profileResult as any)?.rawData?.bazi,
        numerology: (profileResult as any)?.rawData?.numerology
      },
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
                  <optgroup label={locale === 'vi' ? 'Hồ sơ chuẩn kinh điển' : 'Benchmark Presets'}>
                    <option value="einstein">Albert Einstein — Theoretical Physics (1879)</option>
                    <option value="da_vinci">Leonardo da Vinci — Polymath Synthesis (1452)</option>
                    <option value="curie">Marie Curie — Radiology Pioneer (1867)</option>
                  </optgroup>
                  {savedDbProfiles.length > 0 && (
                    <optgroup label={locale === 'vi' ? 'Hồ sơ đã lưu trong CSDL' : 'Saved Database Runs'}>
                      {savedDbProfiles.map(p => (
                        <option key={`db-${p.id}`} value={`db-${p.id}`}>
                          💾 {p.name} ({p.birth_year}-{p.birth_month}-{p.birth_day})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {selectedKey === 'custom' && (
                    <optgroup label={locale === 'vi' ? 'Hồ sơ vừa tính' : 'Active Calculation'}>
                      <option value="custom">★ {profileResult.profile.name} (Calculated Profile)</option>
                    </optgroup>
                  )}
                </select>
                {savedDbProfiles.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleSelectProfile(`db-${savedDbProfiles[0].id}`)}
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', color: 'var(--celestial-gold)', borderColor: 'rgba(217,193,143,0.4)' }}
                    title={locale === 'vi' ? 'Tải nhanh bản ghi gần nhất đã lưu trong CSDL' : 'Quickly load most recent saved run'}
                  >
                    📥 {locale === 'vi' ? `Tải bản ghi gần nhất (${savedDbProfiles[0].name})` : `Load Latest Run (${savedDbProfiles[0].name})`}
                  </button>
                )}
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

            {Object.values(traditions).filter(Boolean).length >= 2 ? (
              <div className="report-grid-layout">
                <div className="report-radar-stage">
                  <RadarChart scores={profileResult.domain_scores} activeTraditions={traditions} />
                  <div className="radar-legend-strip">
                    {traditions.w && <span><span className="legend-dot" style={{ background: 'var(--color-western)' }}></span> Western</span>}
                    {traditions.b && <span><span className="legend-dot" style={{ background: 'var(--color-bazi)' }}></span> Bát Tự</span>}
                    {traditions.t && <span><span className="legend-dot" style={{ background: 'var(--color-tuvi)' }}></span> Tử Vi</span>}
                    {traditions.n && <span><span className="legend-dot" style={{ background: 'var(--color-numerology)' }}></span> Numerology</span>}
                  </div>
                </div>

                <ThemeCards details={profileResult.theme_details} isVietnamese={locale === 'vi'} />
              </div>
            ) : (
              <div className="matrix-editorial-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                  {traditions.w ? '🪐' : traditions.t ? '☯' : traditions.b ? '🎋' : '🔢'}
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  {locale === 'vi' ? 'Chế Độ Khảo Sát Đơn Môn Phái' : 'Single-Tradition Examination Mode'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 1.25rem', lineHeight: '1.6' }}>
                  {locale === 'vi'
                    ? 'Bạn đang chọn xem 1 trường phái duy nhất. Biểu đồ Radar đối sánh và bảng tổng hợp đa môn phái sẽ tự động kích hoạt khi bạn bật từ 2 môn phái trở lên. Bạn có thể xem kết quả tính toán chi tiết của môn phái này ở khu vực bên dưới.'
                    : 'You are currently examining a single tradition. The multi-system polar radar chart and cross-tradition synthesis cards will activate when at least 2 traditions are selected. Detailed calculation metrics are displayed below.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setTraditions({ w: true, b: true, t: true, n: true })}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ✦ {locale === 'vi' ? 'Kích hoạt cả 4 môn phái để đối sánh' : 'Enable all 4 traditions for convergence'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Deep-Dive Laboratory with Collapsible Technical Toggle */}
          <div id="deep-dive-lab" style={{ marginTop: '3rem', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="section-editorial-eyebrow">
                  {locale === 'vi' ? 'PHÒNG THÍ NGHIỆM ĐÔNG–TÂY' : 'Interactive Foundations Lab'}
                </span>
                <h2 className="section-editorial-title" style={{ marginTop: '0.2rem' }}>
                  {locale === 'vi' ? 'Thông Số Tính Toán & Tọa Độ Bản Đồ' : 'Calculation Laboratory & Technical Metrics'}
                </h2>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>{showTechnicalDetails ? '▲' : '▼'}</span>
                <span>{showTechnicalDetails ? (locale === 'vi' ? 'Thu gọn thông số kỹ thuật' : 'Hide Technical Details') : (locale === 'vi' ? 'Xem thông số chi tiết (Dành cho người quan tâm)' : 'Show Technical Calculations')}</span>
              </button>
            </div>

            {showTechnicalDetails && (
              <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn-toggle-pill ${activeLabTab === 'tuvi' ? 'active' : ''}`}
                onClick={() => setActiveLabTab('tuvi')}
              >
                ☯ {locale === 'vi' ? 'Lá Số 12 Cung Tử Vi' : 'Tử Vi 12 Palaces Matrix'}
              </button>
              <button
                type="button"
                className={`btn-toggle-pill ${activeLabTab === 'astro' ? 'active' : ''}`}
                onClick={() => setActiveLabTab('astro')}
              >
                🪐 {locale === 'vi' ? 'Bản Đồ Sao Tây Phương' : 'Astrodienst Planetary Wheel'}
              </button>
              {Object.values(traditions).filter(Boolean).length >= 2 && (
                <button
                  type="button"
                  className={`btn-toggle-pill ${activeLabTab === 'synthesis' ? 'active' : ''}`}
                  onClick={() => setActiveLabTab('synthesis')}
                >
                  ✦ {locale === 'vi' ? 'Chuyên Khảo Đối Sánh Đông–Tây' : 'East–West Synthesis Monograph'}
                </button>
              )}
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
                            <strong style={{ color: 'var(--color-tuvi)' }}>
                              {locale === 'vi' ? 'TỬ VI ĐẨU SỐ (THẬP NHỊ CUNG)' : 'TỬ VI PALACES'}
                            </strong>
                            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {Object.entries(item.tuvi || {}).map(([tk, tv]) => (
                                <div key={tk}><strong>{tk.replace(/_/g, ' ')}:</strong> {String(tv)}</div>
                              ))}
                            </div>
                          </div>
                          <div className="synthesis-subbox">
                            <strong style={{ color: 'var(--color-western)' }}>
                              {locale === 'vi' ? 'CHIÊM TINH TÂY PHƯƠNG (SWISS EPHEMERIS)' : 'WESTERN EPHEMERIS'}
                            </strong>
                            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                              {Object.entries(item.astro || {}).map(([ak, av]) => (
                                <div key={ak}><strong>{ak.replace(/_/g, ' ')}:</strong> {String(av)}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--moon-ivory)', lineHeight: 1.6, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                          <strong style={{ color: 'var(--celestial-gold)' }}>{locale === 'vi' ? 'Nhận Định Hợp Nhất:' : 'Unified Verdict:'}</strong> {item.synthesis || item.content}
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
            )}
          </div>
          {/* Dedicated Chronological Time-Series & Cross-System Comparative Section */}
          <TimeSeriesConvergenceView
            isVietnamese={locale === 'vi'}
            subjectName={profileResult.profile.name}
            birthYear={profileResult.profile.year}
          />
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
        onLoadSavedProfile={(p, rawData) => {
          const derived = deriveDomainScores(rawData);
          setProfileResult({
            profile: p,
            domain_scores: derived,
            theme_details: [
              {
                theme: "Intellect & First Principles",
                icon: "🧠",
                synthesis: `Computed cognitive synthesis for ${p.name}.`,
                western_driver: `Mercury in ${rawData?.western?.planets?.find((item: any) => item.name === 'Mercury')?.sign || 'Aries'}`,
                eastern_driver: `Day Master: ${rawData?.bazi?.day_master?.name || 'Yang Fire'}`
              },
              {
                theme: "Vocation & Autonomy",
                icon: "🏛️",
                synthesis: `Vocational trajectory governed by ${rawData?.western?.midheaven?.sign || 'Pisces'} Midheaven.`,
                western_driver: `Midheaven at ${rawData?.western?.midheaven?.degree || 12}°`,
                eastern_driver: `Career Palace in ${rawData?.tuvi?.palaces?.find((item: any) => item.name?.includes('Career'))?.branch_vi || 'Ngọ'}`
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
                western_driver: `Sun in ${rawData?.western?.planets?.find((item: any) => item.name === 'Sun')?.sign || 'Pisces'}`,
                eastern_driver: `Wood ${rawData?.bazi?.elements_distribution?.Wood || 20}%, Fire ${rawData?.bazi?.elements_distribution?.Fire || 20}%`
              },
              {
                theme: "Partnership & Covenant",
                icon: "🤝",
                synthesis: "Relational contracts across 7th House & Spouse Palace.",
                western_driver: `Venus in ${rawData?.western?.planets?.find((item: any) => item.name === 'Venus')?.sign || 'Aries'}`,
                eastern_driver: "Spouse Palace branch placement"
              },
              {
                theme: "Inner Transformation",
                icon: "🔮",
                synthesis: `Philosophical resilience reflected in Life Path ${rawData?.numerology?.life_path_reduced?.number || 6}.`,
                western_driver: `Saturn in ${rawData?.western?.planets?.find((item: any) => item.name === 'Saturn')?.sign || 'Aries'}`,
                eastern_driver: "Ancestral Mind Palace in Wood"
              }
            ],
            calculationVersion: "DB-Loaded"
          });
          setSelectedKey('custom');
        }}
        isVietnamese={locale === 'vi'}
      />
    </>
  );
}
