import React from 'react';
import { ThemeDetail } from '@/lib/types';

interface ThemeCardsProps {
  details: ThemeDetail[];
  isVietnamese: boolean;
}

const THEME_VN: Record<string, string> = {
  "Intellect & First Principles": "Trí Tuệ & Nguyên Lý Cốt Lõi",
  "Vocation & Autonomy": "Sự Nghiệp & Tự Chủ",
  "Material Resources": "Tài Nguyên & Tài Lộc",
  "Personal Well-being": "Sức Khỏe & Thân Thể",
  "Partnership & Covenant": "Quan Hệ Đối Tác & Hôn Nhân",
  "Inner Transformation": "Chuyển Hóa Nội Tâm & Tinh Thần"
};

export const ThemeCards: React.FC<ThemeCardsProps> = ({ details, isVietnamese }) => {
  return (
    <div className="report-theme-list" id="domain-cards-list">
      {details.map((item, idx) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const isDivergent = itemRecord.is_divergent === true || itemRecord.status === 'divergence';
        const displayTheme = isVietnamese ? (THEME_VN[item.theme] || item.theme) : item.theme;

        return (
          <div key={`theme-${idx}`} className="theme-editorial-item">
            <div className="theme-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <h4 className="theme-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--moon-ivory-text)' }}>
                {item.icon} {displayTheme}
              </h4>
              <span className={`status-chip ${isDivergent ? 'contradicted' : 'confirmed'}`}>
                {isDivergent
                  ? (isVietnamese ? 'Có Điểm Bất Đồng' : 'Doctrinal Divergence')
                  : (isVietnamese ? 'Đồng Thuận Diễn Giải' : 'Interpretive Consensus')}
              </span>
            </div>

            <p className="theme-summary-text" style={{ fontSize: '0.875rem', color: '#4A4255', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              {item.synthesis}
            </p>

            <div className="theme-driver-box" style={{ background: '#F4EFE6', borderRadius: '8px', padding: '0.75rem 0.95rem', fontSize: '0.775rem', color: '#655C70', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
              <div><strong style={{ color: 'var(--color-western)' }}>{isVietnamese ? 'Chiêm Tinh (Western):' : 'Western Astrology:'}</strong> {item.western_driver}</div>
              <div style={{ marginTop: '0.35rem' }}><strong style={{ color: 'var(--color-tuvi)' }}>{isVietnamese ? 'Tử Vi & Bát Tự (Eastern):' : 'Eastern Metaphysics:'}</strong> {item.eastern_driver}</div>
              <div style={{ marginTop: '0.35rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.35rem', color: '#4A4255' }}>
                <strong>{isVietnamese ? 'Đối Chiếu Phương Sai:' : 'Vector Alignment:'}</strong> {isDivergent ? (isVietnamese ? '⚡ Xuất hiện xung đột về chu kỳ thời gian & cơ chế tác động' : '⚡ Structural divergence in temporal pacing') : (isVietnamese ? '✓ Cộng hưởng năng lượng trên cùng chiều vector' : '✓ Concordant directional valence across traditions')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
