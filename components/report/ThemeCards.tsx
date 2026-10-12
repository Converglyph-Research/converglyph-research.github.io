import React from 'react';
import type { ThemeDetail } from '@/lib/types';

interface ThemeCardsProps {
  details: ThemeDetail[];
  isVietnamese: boolean;
}

const THEME_DATA: Record<string, {
  nameVi: string;
  nameEn: string;
  archetypeVi: string;
  archetypeEn: string;
  descriptionVi: string;
  descriptionEn: string;
}> = {
  "Intellect & First Principles": {
    nameVi: "Trí Tuệ & Nguyên Lý Cốt Lõi",
    nameEn: "Intellect & First Principles",
    archetypeVi: "Tư duy bản nguyên, cấu trúc nhận thức & năng lực tổng hợp lý thuyết",
    archetypeEn: "Foundational deduction, abstract pattern recognition & theoretical modeling",
    descriptionVi: "Khảo sát cách tâm trí phân tích quy luật tự nhiên, khả năng học sâu và phương pháp giải quyết các nan đề trừu tượng.",
    descriptionEn: "Evaluates deductive clarity, solitary theoretical depth, and capacity for fundamental synthesis."
  },
  "Vocation & Autonomy": {
    nameVi: "Sự Nghiệp & Tự Chủ",
    nameEn: "Vocation & Autonomy",
    archetypeVi: "Đỉnh cao danh vọng công chúng, năng lực lãnh đạo & vị thế chấp chính",
    archetypeEn: "Vocational zenith, public agency, executive mastery & authority",
    descriptionVi: "Định vị quỹ đạo nghề nghiệp, sự ưu tiên giữa quyền tự chủ nghiên cứu độc lập với việc điều hành thể chế quy mô lớn.",
    descriptionEn: "Delineates public trajectory between solitary autonomous mastery and institutional executive command."
  },
  "Material Resources": {
    nameVi: "Tài Nguyên & Tài Lộc",
    nameEn: "Material Resources",
    archetypeVi: "Quản trị dòng tiền, tốc độ tích lũy tư bản & khẩu vị rủi ro",
    archetypeEn: "Capital formation, resource liquidity, risk appetite & asset stewardship",
    descriptionVi: "Đối chiếu cơ chế tạo lập của cải: tích lũy tiệm tiến theo uy tín học thuật hay bứt phá nhờ đòn bẩy cơ hội phi đối xứng.",
    descriptionEn: "Contrasts wealth accretion via intellectual prestige vs high-leverage commercial risk mobilization."
  },
  "Personal Well-being": {
    nameVi: "Sức Khỏe & Thân Thể",
    nameEn: "Personal Well-being",
    archetypeVi: "Nhịp điệu sinh học, khả năng phục hồi somatic & cân bằng nội môi",
    archetypeEn: "Somatic stamina, biological recovery rhythms & energetic homeostasis",
    descriptionVi: "Đo lường sức bền tâm thể, tác động của các giai đoạn lao động trí óc căng thẳng và giải pháp dưỡng sinh ngũ hành.",
    descriptionEn: "Tracks resilience under deep intellectual absorption, somatic stamina, and rhythmic lifestyle equilibrium."
  },
  "Partnership & Covenant": {
    nameVi: "Quan Hệ Đối Tác & Hôn Nhân",
    nameEn: "Partnership & Covenant",
    archetypeVi: "Hợp đồng hôn phối, liên minh đồng minh & độ nhạy cảm pháp lý",
    archetypeEn: "Relational covenants, matrimonial alliances & contractual friction",
    descriptionVi: "Phân tích điểm mâu thuẫn giữa nhu cầu tự do cá nhân với trách nhiệm cam kết gắn kết lâu dài trong quan hệ đối tác.",
    descriptionEn: "Surfaces tension between radical intellectual detachment and binding contractual covenants."
  },
  "Inner Transformation": {
    nameVi: "Chuyển Hóa Nội Tâm & Tinh Thần",
    nameEn: "Inner Transformation",
    archetypeVi: "Tâm thức di sản, sự buông bỏ triết học & tiến hóa tâm linh",
    archetypeEn: "Ancestral consciousness, solitary reflection & philosophical detachment",
    descriptionVi: "Hành trình tự thức ngộ khi đối diện với các khủng hoảng hiện sinh và sự kế thừa tâm thức từ nguồn cội tổ tiên.",
    descriptionEn: "Tracks continuous self-realization through existential solitude and detachment from transient temporal acclaim."
  }
};

export const ThemeCards: React.FC<ThemeCardsProps> = ({ details, isVietnamese }) => {
  return (
    <div className="report-theme-list" id="domain-cards-list">
      {details.map((item, idx) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const isDivergent = itemRecord.is_divergent === true || itemRecord.status === 'divergence';
        const meta = THEME_DATA[item.theme] || {
          nameVi: item.theme,
          nameEn: item.theme,
          archetypeVi: "Khía cạnh cuộc sống đa môn phái",
          archetypeEn: "Multi-tradition developmental theme",
          descriptionVi: "",
          descriptionEn: ""
        };

        const displayTitle = isVietnamese ? meta.nameVi : meta.nameEn;
        const displayArchetype = isVietnamese ? meta.archetypeVi : meta.archetypeEn;

        return (
          <div key={`theme-${idx}`} className="theme-editorial-item" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#FCFAF6', border: '1px solid rgba(217,193,143,0.35)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            {/* Header Row */}
            <div className="theme-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 className="theme-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#171321', margin: 0, fontWeight: 600 }}>
                  {item.icon} {displayTitle}
                </h4>
                <div style={{ fontSize: '0.75rem', color: '#7A7185', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>
                  {displayArchetype}
                </div>
              </div>
              <span className={`status-chip ${isDivergent ? 'contradicted' : 'confirmed'}`} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                {isDivergent
                  ? (isVietnamese ? '⚡ Xuất Hiện Phân Kỳ' : '⚡ Doctrinal Divergence')
                  : (isVietnamese ? '✓ Đồng Thuận Diễn Giải' : '✓ Interpretive Consensus')}
              </span>
            </div>

            {/* In-Depth Multi-System Synthesis Body */}
            <p className="theme-summary-text" style={{ fontSize: '0.885rem', color: '#312A3B', lineHeight: '1.7', margin: '0.85rem 0', borderLeft: '3px solid var(--celestial-gold)', paddingLeft: '0.85rem' }}>
              {item.synthesis}
            </p>

            {/* Traditional Ground-Truth Drivers */}
            <div className="theme-driver-box" style={{ background: '#F4EFE6', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#52495C', fontFamily: 'var(--font-mono)', lineHeight: '1.7', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <strong style={{ color: '#6845B2' }}>{isVietnamese ? '🪐 Chiêm Tinh (Western Ephemeris):' : '🪐 Western Astrology:'}</strong>{' '}
                <span style={{ color: '#2B2535' }}>{item.western_driver}</span>
              </div>
              <div style={{ marginTop: '0.4rem' }}>
                <strong style={{ color: '#B23A68' }}>{isVietnamese ? '☯ Tử Vi & Bát Tự (Eastern Metaphysics):' : '☯ Eastern Metaphysics:'}</strong>{' '}
                <span style={{ color: '#2B2535' }}>{item.eastern_driver}</span>
              </div>
              <div style={{ marginTop: '0.45rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '0.45rem', color: '#4A4255', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                  <strong>{isVietnamese ? 'Vector Hội Tụ:' : 'Vector Valence:'}</strong>{' '}
                  <span style={{ color: isDivergent ? 'var(--rose-accent)' : 'var(--emerald-accent)', fontWeight: 600 }}>
                    {isDivergent
                      ? (isVietnamese ? 'Xung đột giữa đòn bẩy quá cảnh và chu kỳ nạp âm' : 'Opposing directional drivers across canons')
                      : (isVietnamese ? 'Đồng hướng năng lượng tăng trưởng & củng cố' : 'Aligned directional resonance')}
                  </span>
                </span>
                <span style={{ color: '#8C8296', fontSize: '0.72rem' }}>
                  {isVietnamese ? 'Chuẩn quy tắc Ptolemy & Trần Đoàn' : 'Ptolemy & Chen Tuan Axioms'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
