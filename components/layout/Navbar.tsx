'use client';

import React from 'react';
import Link from 'next/link';
import { Locale, DICTIONARY } from '@/lib/i18n';
import { GoogleAuth } from '@/components/auth/GoogleAuth';

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (loc: Locale) => void;
  onOpenCalc?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocale,
  onLocaleChange,
  onOpenCalc
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dict = DICTIONARY[currentLocale] || DICTIONARY.en;

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
            <div className="brand-name">Converglyph Research</div>
            <div className="brand-subtitle">{dict.brand_subtitle}</div>
          </div>
        </Link>

        {/* Primary Clean Navigation */}
        <nav
          className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}
          id="main-nav-links"
          aria-label="Primary Navigation"
        >
          <Link href="/explore" className="nav-link">{dict.nav_explore}</Link>
          <Link href="/research" className="nav-link">{dict.nav_research}</Link>
          <Link href="/documentation" className="nav-link">{dict.nav_docs}</Link>
          <Link href="/#how-it-works" className="nav-link">{dict.nav_articles}</Link>
        </nav>

        {/* Language switch */}
        <div className="lang-switch-group" role="group" aria-label="Language Switcher">
          <button
            type="button"
            id="btn-lang-en"
            className={`lang-btn ${currentLocale === 'en' ? 'active' : ''}`}
            onClick={() => onLocaleChange('en')}
            title="English"
          >
            EN
          </button>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>|</span>
          <button
            type="button"
            id="btn-lang-vi"
            className={`lang-btn ${currentLocale === 'vi' ? 'active' : ''}`}
            onClick={() => onLocaleChange('vi')}
            title="Tiếng Việt"
          >
            VI
          </button>
        </div>

        <div className="nav-cta">
          <GoogleAuth isVietnamese={currentLocale === 'vi'} />
          <Link href="/explore" className="btn btn-primary">
            <span>{dict.nav_sample_cta}</span>
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
