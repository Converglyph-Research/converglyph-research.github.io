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
                Converglyph Research treats predictive capacity as an open scientific hypothesis. We record explicit claim provenance, track cross-system convergence, and maintain an immutable cryptographic forecast ledger.
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

            {/* Pre-Registration Drawer / Modal */}
            {isPreRegOpen && (
              <>
                <div className="drawer-backdrop active" onClick={() => setIsPreRegOpen(false)} aria-hidden="true" />
                <dialog className="calc-drawer open" id="prereg-drawer" style={{ width: '600px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)' }}>
                        {locale === 'vi' ? 'Khóa Dự Đoán Triển Vọng (Pre-Register)' : 'Pre-Register Prospective Forecast'}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Cryptographically lock a testable prediction with SHA-256 before the event observation window opens.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPreRegOpen(false)}
                      style={{ background: 'none', border: 'none', fontSize: '1.6rem', color: 'var(--moon-ivory)', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const subject = (fd.get('subject') as string) || 'Pilot Subject';
                      const tradition = (fd.get('tradition') as string) || 'western_astrology';
                      const domain = (fd.get('domain') as string) || 'vocation_career';
                      const statement = (fd.get('statement') as string) || '';
                      const prob = parseFloat((fd.get('probability') as string) || '0.50');
                      const targetWindow = (fd.get('window') as string) || '2027-Q1 to 2027-Q4';

                      const PROD_GATEWAY = "https://meeting-tue-transform-cole.trycloudflare.com";
                      const apiBase = (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) ? PROD_GATEWAY : '';
                      try {
                        const resp = await fetch(`${apiBase}/api/ledger/lock`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            subject_name: subject,
                            tradition,
                            domain,
                            statement,
                            forecast_probability: prob,
                            target_window: targetWindow
                          })
                        });
                        if (resp.ok) {
                          alert('Prediction successfully locked on SHA-256 ledger!');
                          setIsPreRegOpen(false);
                          fetchOutcomesApi().then(setRecords).catch(console.warn);
                        } else {
                          alert('Failed to pre-register prediction');
                        }
                      } catch (err) {
                        alert(`Connection error: ${err}`);
                      }
                    }}
                  >
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Subject / Target</label>
                      <input name="subject" defaultValue="Albert Einstein Cohort" className="text-input" required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Tradition</label>
                      <select name="tradition" className="select-editorial" style={{ width: '100%' }}>
                        <option value="western_astrology">Western Ephemeris Astrology</option>
                        <option value="chinese_bazi">Four Pillars of Destiny (BaZi)</option>
                        <option value="chinese_tuvi">Tử Vi Đẩu Số</option>
                        <option value="pythagorean_numerology">Pythagorean Numerology</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Life Domain</label>
                      <select name="domain" className="select-editorial" style={{ width: '100%' }}>
                        <option value="vocation_career">Vocation & Executive Agency</option>
                        <option value="intellect_innovation">Intellect & Theoretical Innovation</option>
                        <option value="material_wealth">Material Resources & Capital</option>
                        <option value="partnership_alliances">Partnership & Relational Contracts</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Testable Proposition Statement</label>
                      <textarea
                        name="statement"
                        required
                        rows={3}
                        className="text-input"
                        defaultValue="Midheaven transit triggers significant vocational restructuring during target cycle."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Forecast Probability (0.0 – 1.0)</label>
                        <input name="probability" type="number" step="0.05" min="0" max="1" defaultValue="0.75" className="text-input" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Observation Window</label>
                        <input name="window" defaultValue="2027-Q1 to 2027-Q4" className="text-input" required />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setIsPreRegOpen(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        🔒 Lock Prediction
                      </button>
                    </div>
                  </form>
                </dialog>
              </>
            )}

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
