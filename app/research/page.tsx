'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { PredictionLedger } from '@/components/research/PredictionLedger';
import { fetchOutcomesApi, fetchMethodologiesApi } from '@/lib/api';
import { LedgerRecord } from '@/lib/types';
import { Locale } from '@/lib/i18n';

export default function ResearchPage() {
  const [locale, setLocale] = React.useState<Locale>('en');
  const [records, setRecords] = React.useState<LedgerRecord[]>([]);
  const [methodologies, setMethodologies] = React.useState<Record<string, any>>({});
  const [isPreRegOpen, setIsPreRegOpen] = React.useState(false);

  React.useEffect(() => {
    fetchOutcomesApi().then(setRecords).catch(console.warn);
    fetchMethodologiesApi().then(setMethodologies).catch(console.warn);
  }, []);

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={setLocale}
        activeView="research"
        onViewChange={(v) => { if (v === 'consumer') window.location.href = '/'; }}
        onOpenCalc={() => { window.location.href = '/explore'; }}
      />

      <main>
        {/* Research Header */}
        <section className="section">
          <div className="container">
            <div className="section-editorial-header">
              <span className="section-editorial-eyebrow">Academic & Scientific Layer</span>
              <h1 className="section-editorial-title">Evaluation Framework & Provenance</h1>
              <p className="section-editorial-desc">
                Aetheria Research treats predictive capacity as an open scientific hypothesis. We record explicit claim provenance, track cross-system convergence, and maintain an immutable cryptographic forecast ledger.
              </p>
            </div>

            {/* Convergence vs Divergence Matrix */}
            <div className="matrix-editorial-container" id="systems-matrix" style={{ marginBottom: '4rem' }}>
              <div className="matrix-editorial-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9C18F" strokeWidth="2" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 500, color: 'var(--moon-ivory)' }}>
                    Interpretive Agreement Points
                  </h3>
                </div>
                <table className="editorial-table">
                  <thead>
                    <tr>
                      <th>Theme</th>
                      <th>Cross-Tradition Signature</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>First Principles</strong></td>
                      <td>
                        <span className="tradition-tag western">Western</span> Mercury conjunct Saturn in Aries<br />
                        <span className="tradition-tag numerology">Numerology</span> Master 33 Universal Systems<br />
                        <span className="tradition-tag bazi">Bát Tự</span> Yang Fire Day Master
                      </td>
                      <td><span className="status-chip confirmed">Thematic Consensus</span></td>
                    </tr>
                    <tr>
                      <td><strong>Vocational Agency</strong></td>
                      <td>
                        <span className="tradition-tag western">Western</span> Pisces Midheaven 10th House<br />
                        <span className="tradition-tag tuvi">Tử Vi</span> Quan Lộc Palace in Ngọ<br />
                        <span className="tradition-tag bazi">Bát Tự</span> Sovereign command stems
                      </td>
                      <td><span className="status-chip confirmed">Structural Agreement</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="matrix-editorial-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6A8C3" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 500, color: 'var(--moon-ivory)' }}>
                    Doctrinal Divergence
                  </h3>
                </div>
                <table className="editorial-table">
                  <thead>
                    <tr>
                      <th>Theme</th>
                      <th>Doctrinal Incongruity</th>
                      <th>Source of Disagreement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Partnership Timing</strong></td>
                      <td>
                        <span className="tradition-tag western">Western</span> 7th House indicates contractual tension.<br />
                        <span className="tradition-tag tuvi">Tử Vi</span> Phu Thê Palace suggests enduring alliance.
                      </td>
                      <td><span style={{ color: 'var(--rose-accent)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Aspect vs Palace Split</span></td>
                    </tr>
                    <tr>
                      <td><strong>Life Path Reduction</strong></td>
                      <td>
                        <span className="tradition-tag numerology">Numerology</span> Full digit sum preserves Master 33.<br />
                        <span className="tradition-tag numerology">Numerology</span> Period reduction yields 6.
                      </td>
                      <td><span style={{ color: 'var(--rose-accent)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Rule Variant Divergence</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prediction Ledger Component */}
            <PredictionLedger
              records={records}
              isVietnamese={locale === 'vi'}
              onOpenPreReg={() => setIsPreRegOpen(true)}
            />

            {/* Methodology Registry */}
            <div id="methodologies" style={{ marginTop: '4rem' }}>
              <div className="section-editorial-header">
                <span className="section-editorial-eyebrow">Canonical Provenance</span>
                <h2 className="section-editorial-title">Versioned Methodology Registry</h2>
                <p className="section-editorial-desc">
                  Complete documentation of classical editions, computational libraries, and known limitations for every supported tradition.
                </p>
              </div>

              <div>
                {Object.entries(methodologies).map(([key, item]) => (
                  <div key={key} className="matrix-editorial-card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--celestial-gold)' }}>
                        {item.name}
                      </h4>
                      <span className="status-chip demo">{item.canon_id}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.775rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                      <span><strong>Engine:</strong> {item.primary_engine}</span>
                      <span>•</span>
                      <span><strong>Status:</strong> {item.implementation_status}</span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.6' }}>
                      <strong>Input Requirements:</strong> {item.input_requirements}
                    </p>

                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                      <strong style={{ color: 'var(--moon-ivory)' }}>Classical Citations:</strong>
                      <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', lineHeight: '1.6', color: '#cbd5e1' }}>
                        {(item.classical_sources || []).map((s: string, idx: number) => (
                          <li key={`cite-${idx}`}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      <strong>Known Limitations:</strong> {item.known_limitations}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
