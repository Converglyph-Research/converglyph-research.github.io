'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { ProfileForm } from '@/components/report/ProfileForm';
import { DICTIONARY, Locale } from '@/lib/i18n';
import { BirthProfile } from '@/lib/types';
import { calculateProfileApi } from '@/lib/api';

export default function HomePage() {
  const [locale, setLocale] = React.useState<Locale>('en');
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);
  const dict = DICTIONARY[locale];

  React.useEffect(() => {
    const saved = localStorage.getItem('aetheria_lang') as Locale | null;
    if (saved === 'vi' || saved === 'en') {
      setLocale(saved);
    } else {
      const navLang = (navigator.language || '').toLowerCase();
      if (navLang.startsWith('vi')) setLocale('vi');
    }
  }, []);

  const handleProfileSubmit = async (p: BirthProfile) => {
    await calculateProfileApi(p);
  };

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => {
          setLocale(l);
          localStorage.setItem('aetheria_lang', l);
        }}
        activeView="consumer"
        onViewChange={(v) => {
          if (v === 'research') window.location.href = '/research';
        }}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      <main>
        {/* Editorial Spacious Hero */}
        <section className="hero-section" id="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span style={{ color: 'var(--celestial-gold)' }}>✦</span>
                <span>{dict.hero_eyebrow}</span>
              </div>

              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: dict.hero_title }} />

              <div className="hero-subhead">{dict.hero_subhead}</div>

              <p className="hero-desc">{dict.hero_desc}</p>

              <div className="hero-actions">
                <Link href="/explore" className="btn btn-primary">
                  <span>{dict.btn_explore_sample}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <button className="btn btn-outline" type="button" onClick={() => setIsCalcOpen(true)}>
                  <span>{dict.btn_build_map}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5, display: 'flex', gap: '0.5rem', maxWidth: '480px' }}>
                <span style={{ color: 'var(--celestial-gold)' }}>⚖</span>
                <span>{dict.hero_disclaimer}</span>
              </div>
            </div>

            {/* Specimen Folio */}
            <div className="hero-folio">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <strong style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', color: 'var(--moon-ivory)' }}>
                    Vocational Sovereignty
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Albert Einstein (1879-03-14 • Ulm, Germany)
                  </div>
                </div>
                <span className="status-chip demo">Folio Specimen</span>
              </div>

              <div className="folio-tradition-row western">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-western)' }}>
                    Western Astrodienst (Swiss Ephemeris)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>MC 12° Pisces</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', lineHeight: 1.5 }}>
                  Midheaven in Pisces ruled by Jupiter (27° Aquarius); Mercury tightly conjunct Saturn in Aries (3°–4°). Indicates intense mathematical inquiry applied to foundational first principles.
                </p>
              </div>

              <div className="folio-tradition-row tuvi">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-tuvi)' }}>
                    Tử Vi Đẩu Số (12 Palaces)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>Quan Lộc in Ngọ</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', lineHeight: 1.5 }}>
                  Career Palace (Cung Quan Lộc) positioned in Earthly Branch Ngọ with sovereign command stars dictates independent directorial authority and conceptual mastery over routine administration.
                </p>
              </div>

              <div className="folio-tradition-row bazi">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-bazi)' }}>
                    Bát Tự (Four Pillars)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>Day Master Bính Hỏa</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', lineHeight: 1.5 }}>
                  Yang Fire (Bính Hỏa) Day Master supported by Wood resource pillars reveals visionary creative ignition, enduring perseverance, and pioneering speculative thought.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ProfileForm
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onSubmitProfile={handleProfileSubmit}
        isVietnamese={locale === 'vi'}
      />
    </>
  );
}
