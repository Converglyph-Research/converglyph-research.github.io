import React from 'react';
import Link from 'next/link';

export const PrototypeNotice: React.FC = () => {
  return (
    <aside className="prototype-notice-banner" aria-label="Prototype Status Announcement">
      <div className="container banner-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="prototype-tag-pill">Prototype Specimen</span>
          <span>Illustrative demonstration data. Prospective evaluation protocol under active peer development.</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          <Link href="/research#roadmap" style={{ color: 'var(--celestial-gold)', textDecoration: 'none' }}>
            Research Roadmap & Questions →
          </Link>
        </div>
      </div>
    </aside>
  );
};
