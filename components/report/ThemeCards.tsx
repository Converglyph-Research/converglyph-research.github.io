import React from 'react';
import { ThemeDetail } from '@/lib/types';

interface ThemeCardsProps {
  details: ThemeDetail[];
  isVietnamese: boolean;
}

export const ThemeCards: React.FC<ThemeCardsProps> = ({ details, isVietnamese }) => {
  return (
    <div className="report-theme-list" id="domain-cards-list">
      {details.map((item, idx) => {
        const itemRecord = item as unknown as Record<string, unknown>;
        const isDivergent = itemRecord.is_divergent === true || itemRecord.status === 'divergence';
        return (
          <div key={`theme-${idx}`} className="theme-editorial-item">
            <div className="theme-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <h4 className="theme-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--moon-ivory-text)' }}>
                {item.icon} {item.theme}
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

            <div className="theme-driver-box" style={{ background: '#F4EFE6', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.775rem', color: '#655C70', fontFamily: 'var(--font-mono)' }}>
              <div><strong>Western:</strong> {item.western_driver}</div>
              <div style={{ marginTop: '0.25rem' }}><strong>Eastern:</strong> {item.eastern_driver}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
