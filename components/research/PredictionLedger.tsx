'use client';

import React from 'react';
import { LedgerRecord } from '@/lib/types';
import { verifyLedgerRecordApi } from '@/lib/api';

interface PredictionLedgerProps {
  records: LedgerRecord[];
  isVietnamese: boolean;
  onOpenPreReg: () => void;
}

export const PredictionLedger: React.FC<PredictionLedgerProps> = ({
  records,
  isVietnamese,
  onOpenPreReg
}) => {
  const [selectedRecordId, setSelectedRecordId] = React.useState<string | null>(null);
  const [auditData, setAuditData] = React.useState<any>(null);
  const [auditLoading, setAuditLoading] = React.useState(false);

  const handleInspectAudit = async (recordId: string) => {
    setSelectedRecordId(recordId);
    setAuditLoading(true);
    try {
      const data = await verifyLedgerRecordApi(recordId);
      setAuditData(data);
    } catch (e) {
      setAuditData({ error: 'Audit verification request failed' });
    } finally {
      setAuditLoading(false);
    }
  };

  const closeAuditModal = () => {
    setSelectedRecordId(null);
    setAuditData(null);
  };

  return (
    <div className="ledger-container" id="prediction-ledger">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 500, color: 'var(--moon-ivory)' }}>
            {isVietnamese ? 'Các Bản Ghi Sổ Cái Khóa Mật Mã' : 'Ledger Records Specimen'}
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {isVietnamese
              ? 'Kiểm toán độc lập với xác thực đầy đủ chuỗi băm trạng thái và payload'
              : 'Independent audit records with full cryptographic payload verification'}
          </div>
        </div>
        <button
          className="btn btn-outline"
          id="btn-open-lock-drawer"
          type="button"
          onClick={onOpenPreReg}
          style={{ fontSize: '0.775rem' }}
        >
          {isVietnamese ? '+ Khóa Dự Đoán Mới' : '+ Pre-Register Forecast Specimen'}
        </button>
      </div>

      <div id="ledger-records-list">
        {records.map((r) => {
          let typeLabel = isVietnamese ? 'DỰ ĐOÁN ĐĂNG KÝ TRƯỚC' : 'PROSPECTIVE PRE-REGISTRATION';
          let typeClass = 'confirmed';
          if (r.record_type === 'retrospective_demo') {
            typeLabel = isVietnamese ? 'MINH HỌA HỒI TỐ (DEMO)' : 'RETROSPECTIVE ILLUSTRATION (DEMO)';
            typeClass = 'demo';
          }

          let statusBadge = isVietnamese ? 'Chưa Xác Định' : 'Unresolved';
          let statusClass = 'demo';
          if (r.status === 'confirmed_aligned') {
            statusBadge = isVietnamese ? 'Đã Xác Thực Phù Hợp' : 'Confirmed Aligned';
            statusClass = 'confirmed';
          } else if (r.status === 'contradicted') {
            statusBadge = isVietnamese ? 'Bị Bác Bỏ (Sai Lệch)' : 'Contradicted (Falsified)';
            statusClass = 'contradicted';
          } else if (r.status === 'locked_pending') {
            statusBadge = isVietnamese ? 'Đã Khóa (Đang Chờ Thời Hạn)' : 'Locked (Pending Window)';
            statusClass = 'pending';
          }

          const shortSha = (r.sha256_lock || '').substring(0, 16) + '...';

          return (
            <div key={r.record_id} className="ledger-record-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className={`status-chip ${typeClass}`}>{typeLabel}</span>
                  <strong style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--moon-ivory)' }}>
                    {r.subject_name}
                  </strong>
                </div>
                <span className={`status-chip ${statusClass}`}>{statusBadge}</span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                <strong>{isVietnamese ? 'Dự báo' : 'Forecast'} ({r.target_window}):</strong> {r.statement}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', borderLeft: '3px solid var(--cyan-light)', padding: '0.65rem', borderRadius: '6px', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                <strong>{isVietnamese ? 'Kết quả quan sát:' : 'Observed Outcome:'}</strong>{' '}
                {r.observed_outcome || (isVietnamese ? 'Khoảng thời gian quan sát đang diễn ra.' : 'Active observation window.')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span>SHA-256 Lock: <code style={{ color: 'var(--text-muted)' }}>{shortSha}</code></span>
                  <button
                    type="button"
                    className="btn-inspect-audit"
                    onClick={() => handleInspectAudit(r.record_id)}
                    style={{ background: 'none', border: 'none', color: 'var(--cyan-light)', cursor: 'pointer', textDecoration: 'underline', marginLeft: '0.5rem' }}
                  >
                    {isVietnamese ? 'Kiểm toán đầy đủ' : 'Inspect Full Audit'}
                  </button>
                </div>
                <div>
                  {typeof r.brier_loss === 'number' && !isNaN(r.brier_loss) ? (
                    <span>{isVietnamese ? 'Điểm Brier Loss:' : 'Brier Loss:'} <strong>{r.brier_loss}</strong></span>
                  ) : typeof r.forecast_probability === 'number' && !isNaN(r.forecast_probability) ? (
                    <span>{isVietnamese ? 'Xác suất dự báo:' : 'Forecast Prob:'} <strong>{r.forecast_probability}</strong></span>
                  ) : (
                    <span>{isVietnamese ? 'Chưa chấm điểm' : 'Unscored'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Modal */}
      {selectedRecordId && (
        <>
          <div className="drawer-backdrop active" onClick={closeAuditModal} aria-hidden="true" />
          <dialog className="calc-drawer open" id="audit-drawer" style={{ width: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500, color: 'var(--moon-ivory)' }}>
                  {isVietnamese ? 'Hồ Sơ Kiểm Toán Mật Mã' : 'Cryptographic Audit Record'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                  Full State Lock Digest & Raw Payload Verification
                </div>
              </div>
              <button
                type="button"
                onClick={closeAuditModal}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', color: 'var(--moon-ivory)', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {auditLoading && <p>Loading cryptographic audit...</p>}

            {auditData && !auditLoading && (
              <div id="audit-detail-content">
                <div style={{ marginBottom: '1.25rem' }}>
                  <span className="status-chip confirmed">{String(auditData.record_type || '').toUpperCase()}</span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>
                    Record ID: {auditData.record_id}
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                    Timestamp: {auditData.timestamp} UTC
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full SHA-256 Cryptographic Hash Digest</label>
                  <textarea
                    className="text-input"
                    readOnly
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', height: '60px', resize: 'none' }}
                    value={auditData.sha256_lock || ''}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pre-Registered JSON Payload</label>
                  <pre style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1', overflowX: 'auto' }}>
                    {JSON.stringify(auditData.raw_payload, null, 2)}
                  </pre>
                </div>

                {auditData.is_verified ? (
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--emerald-accent)' }}>
                    <strong>✓ Cryptographic Verification Passed:</strong> Payload re-hash matches locked SHA-256 digest.<br />
                    <span style={{ color: 'var(--text-muted)' }}>{auditData.verifier_notes}</span>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--rose-accent)' }}>
                    <strong>⚠ Verification Indeterminate:</strong> Hash could not be independently corroborated.
                  </div>
                )}
              </div>
            )}
          </dialog>
        </>
      )}
    </div>
  );
};
