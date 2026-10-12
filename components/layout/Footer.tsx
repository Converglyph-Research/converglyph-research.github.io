'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/LocaleContext';

export const Footer: React.FC = () => {
  const { dict } = useLocale();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-name" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Converglyph Research
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '320px' }}>
              {dict.footer_tagline}
            </p>
          </div>

          <div className="footer-col">
            <h4>{dict.footer_explore}</h4>
            <ul>
              <li><Link href="/explore">{dict.footer_lifemap}</Link></li>
              <li><Link href="/articles">{dict.nav_articles}</Link></li>
              <li><Link href="/explore#deep-dive-lab">{dict.footer_lab}</Link></li>
              <li><Link href="/#how-it-works">{dict.footer_how}</Link></li>
              <li><Link href="/research#prediction-ledger">{dict.footer_ledger}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{dict.footer_research}</h4>
            <ul>
              <li><Link href="/research#methodologies">{dict.footer_registry}</Link></li>
              <li><Link href="/research#systems-matrix">{dict.footer_matrix}</Link></li>
              <li><Link href="/research#claim-lifecycle">{dict.footer_claims}</Link></li>
              <li><Link href="/documentation#api-reference">{dict.footer_docs}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{dict.footer_governance}</h4>
            <ul>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>EU AI Act (Art. 50) Aligned</span></li>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>DGCCRF Misleading Practice Safeguards</span></li>
              <li><span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>CNIL Privacy Principles</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>{dict.footer_copy}</div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--celestial-gold)', fontSize: '0.75rem' }}>
            Celestial Pop Editorial • Swiss Ephemeris Standard
          </div>
        </div>
      </div>
    </footer>
  );
};
