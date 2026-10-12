import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-name" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Converglyph Research
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '320px' }}>
              The quantitative intelligence layer and reproducible evaluation framework for symbolic forecasting systems.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link href="/explore">Personal Life Map</Link></li>
              <li><Link href="/explore#deep-dive-lab">East–West Laboratory</Link></li>
              <li><Link href="/#how-it-works">How It Works</Link></li>
              <li><Link href="/research#prediction-ledger">Prediction Ledger</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Research</h4>
            <ul>
              <li><Link href="/research#methodologies">Methodology Registry</Link></li>
              <li><Link href="/research#systems-matrix">Convergence Matrix</Link></li>
              <li><Link href="/research#claim-lifecycle">Claim Lifecycle</Link></li>
              <li><Link href="/documentation#api-reference">API Documentation</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Governance & Ethics</h4>
            <ul>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>EU AI Act (Art. 50) Aligned</span></li>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>DGCCRF Misleading Practice Safeguards</span></li>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>CNIL Privacy Principles</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Converglyph Research. Developed in accordance with scientific humility and methodological transparency.</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--celestial-gold)', fontSize: '0.75rem' }}>
            Celestial Pop Editorial • Swiss Ephemeris Standard
          </div>
        </div>
      </div>
    </footer>
  );
};
