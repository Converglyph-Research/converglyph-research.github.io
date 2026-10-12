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
  const dict = DICTIONARY[locale] || DICTIONARY.en;

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
    window.location.href = '/explore';
  };

  return (
    <>
      <PrototypeNotice bannerText={dict.proto_banner} />
      <Navbar
        currentLocale={locale}
        onLocaleChange={(l) => {
          setLocale(l);
          localStorage.setItem('aetheria_lang', l);
        }}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      <main>
        {/* BLOCK 1: Clean, Dramatic Editorial Hero */}
        <section className="hero-section" id="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span style={{ color: 'var(--celestial-gold)' }}>✦</span>
                <span>{dict.hero_eyebrow}</span>
              </div>

              <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: dict.hero_title }} />

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
                  <span>{dict.btn_create_report}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5, display: 'flex', gap: '0.5rem', maxWidth: '480px' }}>
                <span style={{ color: 'var(--celestial-gold)' }}>⚖</span>
                <span>{dict.hero_disclaimer}</span>
              </div>
            </div>

            {/* BLOCK 3 PREVIEW: Compact Sample Comparison Preview */}
            <div className="hero-folio">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <strong style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', color: 'var(--moon-ivory)' }}>
                    {dict.preview_title}
                  </strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Albert Einstein (1879-03-14 • Ulm, Germany)
                  </div>
                </div>
                <span className="status-chip demo">{dict.preview_badge}</span>
              </div>

              <div className="folio-tradition-row western">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', fontWeight: 600, color: 'var(--color-western)' }}>
                    Western Astrodienst (Swiss Ephemeris)
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)' }}>MC 12° Pisces</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', lineHeight: 1.5 }}>
                  Midheaven in Pisces ruled by Jupiter (27° Aquarius); Mercury conjunct Saturn in Aries (3°–4°).
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
                  Career Palace in Ngọ indicates autonomous intellectual stewardship and institutional standing.
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
                  Yang Fire (Bính Hỏa) Day Master supported by Wood resource pillars reveals visionary creative ignition.
                </p>
              </div>

              <div className="folio-synthesis-card">
                <p className="synthesis-text" style={{ fontStyle: 'italic', fontSize: '0.775rem' }}>
                  {dict.preview_caveat}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK 2: How It Works */}
        <section className="section alt-bg" id="how-it-works">
          <div className="container">
            <div className="section-editorial-header" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
              <span className="section-editorial-eyebrow">User Journey</span>
              <h2 className="section-editorial-title">{dict.how_title}</h2>
              <p className="section-editorial-desc">{dict.how_desc}</p>
            </div>

            <div className="roadmap-grid">
              <div className="roadmap-card">
                <h4>{dict.how_step1_title}</h4>
                <p>{dict.how_step1_desc}</p>
              </div>
              <div className="roadmap-card">
                <h4>{dict.how_step2_title}</h4>
                <p>{dict.how_step2_desc}</p>
              </div>
              <div className="roadmap-card">
                <h4>{dict.how_step3_title}</h4>
                <p>{dict.how_step3_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK 4: Trust, Limitations & Open Science */}
        <section className="section" id="trust-and-limitations">
          <div className="container" style={{ maxWidth: '880px' }}>
            <div className="matrix-editorial-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {dict.trust_title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                {dict.trust_desc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: 'var(--moon-ivory)', lineHeight: '1.6' }}>
                <p>{dict.trust_p1}</p>
                <p>{dict.trust_p2}</p>
                <p>{dict.trust_p3}</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCK 5: Call to Action */}
        <section className="section alt-bg" id="get-started" style={{ textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            <h2 className="section-editorial-title" style={{ fontSize: '2.4rem' }}>{dict.cta_title}</h2>
            <p className="section-editorial-desc" style={{ marginBottom: '2rem' }}>{dict.cta_desc}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/explore" className="btn btn-primary">
                <span>{dict.btn_cta_explore}</span>
              </Link>
              <Link href="/research" className="btn btn-outline">
                <span>{dict.btn_cta_research}</span>
              </Link>
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
