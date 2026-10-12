import React from 'react';
import Link from 'next/link';

interface PrototypeNoticeProps {
  bannerText?: string;
}

export const PrototypeNotice: React.FC<PrototypeNoticeProps> = ({
  bannerText = "Prototype: sample data only. Research and prediction testing are still in development."
}) => {
  return (
    <aside className="prototype-notice-banner" aria-label="Prototype Status Announcement">
      <div className="container banner-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="prototype-tag-pill">Prototype Specimen</span>
          <span>{bannerText}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <Link href="/documentation" style={{ color: 'var(--celestial-gold)', textDecoration: 'none' }}>
            Technical Documentation →
          </Link>
        </div>
      </div>
    </aside>
  );
};
