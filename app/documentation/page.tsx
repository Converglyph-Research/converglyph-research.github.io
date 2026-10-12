import React from 'react';
import Link from 'next/link';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';

export default function DocumentationPage() {
  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />

      <main className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-editorial-header">
            <span className="section-editorial-eyebrow">Technical Reference</span>
            <h1 className="section-editorial-title">Documentation & Engine Specifications</h1>
            <p className="section-editorial-desc">
              Comprehensive reference covering calculation engines, astronomical assumptions, calendar boundary algorithms, formulas, and REST API endpoints.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Western Astrology Engine */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                1. Western Ephemeris Engine (`pyswisseph`)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Calculates high-precision geocentric planetary coordinates using the Swiss Ephemeris (standard Moshier and JPL DE431 integration).
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
                <div><strong>Standard:</strong> Tropical Zodiac (Geocentric Ecliptic Longitude)</div>
                <div><strong>House System:</strong> Placidus Semi-Arc Division (with Whole Sign cross-check)</div>
                <div><strong>Aspect Orbs:</strong> Conjunction, Opposition, Trine: 8.0° | Square: 7.0° | Sextile: 6.0°</div>
                <div><strong>Timezone Handling:</strong> Historical Local Mean Time (LMT = Longitude / 15.0 hours)</div>
              </div>
            </article>

            {/* 2. BaZi Four Pillars */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                2. Four Pillars of Destiny (BaZi / Tứ Trụ)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Calculates the 10 Heavenly Stems and 12 Earthly Branches based on astronomical 24 Solar Terms (Jie Qi).
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
                <div><strong>Year Boundary:</strong> Lichun (Start of Spring, 315° solar longitude), not Lunar New Year</div>
                <div><strong>Hour Pillar Correction:</strong> True Solar Time (LST) adjusting for longitude and Equation of Time (EoT)</div>
                <div><strong>Day Pillar:</strong> Modulo-60 sexagenary day progression derived from astronomical Julian Day count</div>
              </div>
            </article>

            {/* 3. Tu Vi Dau So */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                3. Tử Vi Đẩu Số Classical 12-Palace Matrix
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Authentic lunisolar palace chart and star assignment based on the Ho Ngoc Duc calendar algorithms and classical Song Dynasty texts.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', lineHeight: '1.6' }}>
                <div><strong>Lunisolar Resolution:</strong> Jean Meeus astronomical new moon calculation resolving leap months</div>
                <div><strong>Palace Establishment:</strong> Life Palace (Mệnh) = (Month Branch - Hour Branch + 12) % 12</div>
                <div><strong>Star Systems:</strong> 14 Major Stars, Auxiliary Stars, 4 Transformation Stars (Khoa, Quyền, Lộc, Kỵ)</div>
              </div>
            </article>

            {/* 4. API Endpoints */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                4. Public REST API Endpoints
              </h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', lineHeight: '1.7' }}>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/calculate</span> — Normalized 6-theme vectors and atomic claims</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/compare</span> — Deep East-West comparative synthesis</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/tuvi</span> — Authentic 12-palace calculation</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/astro</span> — Astrodienst-standard planetary wheel</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET /api/outcomes</span> — Empirical prediction ledger & Brier scores</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET /api/articles</span> — Methodology monographs (bilingual en/vi)</div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
