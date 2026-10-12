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
            <span className="section-editorial-eyebrow">Converglyph Research • Technical Specifications</span>
            <h1 className="section-editorial-title">Platform Architecture, Calculation Engines & API Specifications</h1>
            <p className="section-editorial-desc">
              Authoritative documentation covering isolated calculation engines, astronomical assumptions, calendar boundary algorithms, quantitative evaluation protocols, and REST API schemas.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Western Astrology Engine */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                1. Western Ephemeris Engine (`pyswisseph`)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Calculates sub-arcsecond geocentric ecliptic planetary coordinates using Swiss Ephemeris v2.10.3.2 (derived from NASA JPL DE431 ephemerides).
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>Coordinate Frame:</strong> Tropical Zodiac ($0^\circ$ Aries Vernal Equinox)</div>
                <div><strong>House System:</strong> Placidus Semi-Arc Trisection with Whole Sign secondary verification</div>
                <div><strong>Aspect Orbs:</strong> Conjunction ($0^\circ$), Trine ($120^\circ$), Opposition ($180^\circ$): $\pm 8.0^\circ$ | Square ($90^\circ$): $\pm 7.0^\circ$ | Sextile ($60^\circ$): $\pm 6.0^\circ$</div>
                <div><strong>Time Standards:</strong> Astronomical Julian Day with Local Mean Time (LMT = Longitude / 15.0 hrs) for pre-1920 historical benchmarks</div>
              </div>
            </article>

            {/* 2. BaZi Four Pillars */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                2. Four Pillars of Destiny (BaZi / Tứ Trụ)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Calculates the 10 Heavenly Stems (*Thiên Can*) and 12 Earthly Branches (*Địa Chi*) based strictly on the Sun's apparent ecliptic longitude across 24 Solar Terms (*Jie Qi*).
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>Year Boundary:</strong> Lichun (Start of Spring, 315° Solar Longitude), strictly independent of the civil Lunar New Year</div>
                <div><strong>Hour Pillar Correction:</strong> True Solar Time (LST = Clock Time + 4 × (Local Longitude - Std Longitude) + EoT)</div>
                <div><strong>Equation of Time (EoT):</strong> Compensates for orbital eccentricity and axial tilt (±16 min)</div>
                <div><strong>Day Master & Ten Gods:</strong> Classical Shi Shen elemental interactions (Resource, Output, Wealth, Officer)</div>
              </div>
            </article>

            {/* 3. Tu Vi Dau So */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                3. Tử Vi Đẩu Số Classical 12-Palace Matrix
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Orthodox lunisolar palace chart and star assignment based on the Ho Ngoc Duc calendar algorithm and classical Song Dynasty canons (*Tử Vi Đẩu Số Toàn Thư*).
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>Lunisolar Mechanics:</strong> Jean Meeus astronomical New Moon calculations resolving leap months (*tháng nhuận*)</div>
                <div><strong>Palace Establishment:</strong> Life Palace (*Mệnh*) and Body Palace (*Thân*) established via lunar birth month and two-hour birth branch (*Chi giờ*)</div>
                <div><strong>Bureau & Star Placement:</strong> 5 Elemental Bureaus (*Cục*), Emperor Star (*Tử Vi*), Treasury Star (*Thiên Phủ*), Auxiliary Stars, and 4 Transformation Stars (*Tứ Hóa*: Khoa, Quyền, Lộc, Kỵ)</div>
                <div><strong>Decadal Luck:</strong> 10-Year Major Luck Cycles (*Đại Hạn*) moving clockwise for Yang Male/Yin Female, counter-clockwise for Yin Male/Yang Female</div>
              </div>
            </article>

            {/* 4. Numerology & Divination */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                4. Numerology & Symbolic Divination Canons
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Rigorous multi-lineage exposure preserving mathematical heritage without arbitrary dogma.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>Pythagorean Life Path Dual Standard:</strong> Exposes both Formula A (Full Digit Sum preserving Master Numbers 11, 22, 33) and Formula B (Independent Period Reduction)</div>
                <div><strong>I Ching Archetypal Mapping:</strong> 6-bit binary progression states ($2^6 = 64$) of the *Zhouyi*; explicitly identified as an exploratory prototype model</div>
              </div>
            </article>

            {/* 5. Empirical Evaluation & Ledger Protocol */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                5. Empirical Evaluation Protocol & SHA-256 State Ledger
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                Enforces strict prospective locking to eliminate hindsight bias, evaluated against proper scoring rules.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>Prospective Ledger:</strong> Pre-registers predictive claims with SHA-256 digests before outcome windows open</div>
                <div><strong>Proper Scoring Rule:</strong> Brier Score Brier = (1/N) * Σ (f_t - o_t)² with quadratic penalties for overconfident failures</div>
                <div><strong>Empirical Benchmark:</strong> Evaluated against the uncalibrated coin-flip null baseline (0.2500) and historical base rates</div>
              </div>
            </article>

            {/* 6. Public REST API Endpoints */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                6. Converglyph REST API Reference
              </h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/health</span> — Engine status, Swiss Ephemeris version, and supported canons</div>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/methodologies</span> — Versioned methodology registry with canonical rule citations</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/calculate</span> — Normalized 6-theme vectors and atomic canonical claims</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/compare</span> — Deep East-West comparative synthesis (Tu Vi & Western Astrology)</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/tuvi</span> — Authentic 12-palace calculation, stars, and major luck decades</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/astro</span> — High-precision Western planetary chart and Placidus houses</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/outcomes</span> — Empirical prediction ledger, calibration curves & Brier score</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>POST /api/ledger/lock</span> — Cryptographic SHA-256 prospective prediction registration</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/ledger/verify/:id</span> — Cryptographic audit and on-the-fly digest recomputation</div>
                <div><span style={{ color: 'var(--celestial-gold)' }}>GET  /api/articles</span> — Methodology monographs (bilingual en/vi)</div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
