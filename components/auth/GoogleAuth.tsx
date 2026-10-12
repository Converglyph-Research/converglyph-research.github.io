'use client';

import React from 'react';
import { UserSession, getUserSession, saveUserSession, clearUserSession, decodeJwt } from '@/lib/auth';

interface GoogleAuthProps {
  onSessionChange?: (session: UserSession | null) => void;
  isVietnamese?: boolean;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSessionChange, isVietnamese = false }) => {
  const [session, setSession] = React.useState<UserSession | null>(null);

  React.useEffect(() => {
    const s = getUserSession();
    setSession(s);
    if (onSessionChange) onSessionChange(s);
  }, []);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');

  const handleOpenAuthModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const userSession: UserSession = {
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      sub: `researcher-${Date.now()}`
    };
    saveUserSession(userSession);
    setSession(userSession);
    setIsModalOpen(false);
    if (onSessionChange) onSessionChange(userSession);
  };
  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    if (onSessionChange) onSessionChange(null);
  };

  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(38, 33, 58, 0.7)', border: '1px solid var(--border-editorial)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--celestial-gold)', fontFamily: 'var(--font-mono)' }}>● {session.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.7rem', textDecoration: 'underline' }}
        >
          {isVietnamese ? 'Đăng xuất' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenAuthModal}
        className="btn btn-outline"
        style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
      >
        <span style={{ color: 'var(--celestial-gold)' }}>🔑</span>
        <span>{isVietnamese ? 'Tài Khoản Nghiên Cứu' : 'Researcher Access'}</span>
      </button>

      {isModalOpen && (
        <>
          <div className="drawer-backdrop active" onClick={() => setIsModalOpen(false)} aria-hidden="true" />
          <dialog className="calc-drawer open" style={{ width: '480px', zIndex: 1100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)' }}>
                  {isVietnamese ? 'Xác Thực Tài Khoản Nghiên Cứu' : 'Researcher Access Portal'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                  {isVietnamese ? 'Cấp quyền truy cập sổ cái & API thử nghiệm' : 'Pre-Registration & API Sandbox Authorization'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', color: 'var(--moon-ivory)', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {isVietnamese
                ? 'Aetheria Research áp dụng cơ chế xác thực nghiên cứu định danh. Nhập thông tin để liên kết các dự đoán khóa mật mã và tải báo cáo chi tiết.'
                : 'Aetheria Research authenticates researcher credentials to link cryptographic pre-registrations and unlock experimental monograph exports.'}
            </p>

            <form onSubmit={handleConfirmAccess}>
              <div className="form-group">
                <label className="form-label">{isVietnamese ? 'Họ tên hoặc Tổ chức' : 'Name / Institution'}</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder={isVietnamese ? 'Ví dụ: TS. Nguyễn Văn A' : 'e.g. Dr. Jane Doe'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isVietnamese ? 'Email nghiên cứu' : 'Researcher Email'}</label>
                <input
                  type="email"
                  className="text-input"
                  placeholder="researcher@institution.org"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {isVietnamese ? 'Kích Hoạt Phiên Nghiên Cứu' : 'Authorize Research Session'}
              </button>
            </form>
          </dialog>
        </>
      )}
    </>
  );
};
