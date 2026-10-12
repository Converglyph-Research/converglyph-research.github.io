'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (loc: Locale) => void;
  activeView: 'consumer' | 'research';
  onViewChange: (v: 'consumer' | 'research') => void;
  onOpenCalc: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocale,
  onLocaleChange,
  activeView,
  onViewChange,
  onOpenCalc
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link href="/" className="nav-brand" aria-label="Aetheria Research Home">
          <div className="brand-glyph">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="44" stroke="#D9C18F" strokeWidth="1.5" strokeDasharray="3 3"/>
              <polygon points="50,14 82,74 18,74" stroke="#B9A3FF" strokeWidth="1.5"/>
              <circle cx="50" cy="50" r="18" stroke="#E6A8C3" strokeWidth="1.2"/>
              <circle cx="50" cy="50" r="3.5" fill="#D9C18F"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">Aetheria Research</div>
            <div className="brand-subtitle">Quantitative Symbolic Platform</div>
          </div>
        </Link>

        {/* View Switcher: Explore (Consumer) vs Audit (Research) */}
        <div className="mode-toggle-pill" role="tablist" aria-label="Audience View Switcher">
          <button
            type="button"
            className={`mode-pill-btn ${activeView === 'consumer' ? 'active' : ''}`}
            onClick={() => onViewChange('consumer')}
            role="tab"
            aria-selected={activeView === 'consumer'}
          >
            ✦ Explore
          </button>
          <button
            type="button"
            className={`mode-pill-btn ${activeView === 'research' ? 'active' : ''}`}
            onClick={() => onViewChange('research')}
            role="tab"
            aria-selected={activeView === 'research'}
          >
            🔬 Audit
          </button>
        </div>

        <nav
          className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}
          id="main-nav-links"
          aria-label="Primary Navigation"
        >
          {activeView === 'consumer' ? (
            <>
              <Link href="/explore" className="nav-link">Life Map</Link>
              <Link href="/#east-west-synthesis" className="nav-link">Synthesis</Link>
              <Link href="/#research-blog" className="nav-link">Methods & Blog</Link>
            </>
          ) : (
            <>
              <Link href="/research#systems-matrix" className="nav-link">Matrix</Link>
              <Link href="/research#claim-lifecycle" className="nav-link">Claims</Link>
              <Link href="/research#prediction-ledger" className="nav-link">Ledger</Link>
              <Link href="/research#methodologies" className="nav-link">Registry</Link>
            </>
          )}
        </nav>

        {/* Language switch */}
        <div className="lang-switch-group" role="group" aria-label="Language Switcher">
          <button
            type="button"
            className={`lang-btn ${currentLocale === 'en' ? 'active' : ''}`}
            onClick={() => onLocaleChange('en')}
            title="English"
          >
            EN
          </button>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>|</span>
          <button
            type="button"
            className={`lang-btn ${currentLocale === 'vi' ? 'active' : ''}`}
            onClick={() => onLocaleChange('vi')}
            title="Tiếng Việt"
          >
            VI
          </button>
        </div>

        <div className="nav-cta">
          <button
            className="btn btn-outline"
            id="btn-open-calc"
            type="button"
            onClick={onOpenCalc}
            aria-haspopup="dialog"
          >
            <span>Calculate</span>
          </button>
          <Link href="/explore" className="btn btn-primary">
            <span>Read Report</span>
          </Link>
          <button
            className="nav-mobile-toggle"
            id="nav-mobile-toggle"
            type="button"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};
