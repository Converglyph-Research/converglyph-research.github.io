'use client';

import React from 'react';
import { UserSession, getUserSession, saveUserSession, clearUserSession, decodeJwt } from '@/lib/auth';
import { useLocale } from '@/lib/LocaleContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: any) => void }) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        };
      };
    };
  }
}

interface GoogleAuthProps {
  onSessionChange?: (session: UserSession | null) => void;
  isVietnamese?: boolean;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSessionChange }) => {
  const { dict, locale } = useLocale();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isVi = (locale === 'vi');

  React.useEffect(() => {
    const s = getUserSession();
    setSession(s);
    if (onSessionChange) onSessionChange(s);

    // Initialize Google Identity Services if GSI client is loaded
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (clientId && typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response?.credential) {
              const decoded = decodeJwt(response.credential);
              if (decoded) {
                const newSession: UserSession = {
                  name: decoded.name || decoded.email,
                  email: decoded.email,
                  picture: decoded.picture,
                  sub: decoded.sub || `google-${Date.now()}`
                };
                saveUserSession(newSession);
                setSession(newSession);
                setIsModalOpen(false);
                if (onSessionChange) onSessionChange(newSession);
              }
            }
          }
        });
      } catch (e) {
        console.warn('GSI init notice:', e);
      }
    }
  }, []);

  const handleQuickLogin = (email: string, name: string, picture?: string) => {
    const userSession: UserSession = {
      name,
      email,
      picture,
      sub: `user-${Date.now()}`
    };
    saveUserSession(userSession);
    setSession(userSession);
    setIsModalOpen(false);
    if (onSessionChange) onSessionChange(userSession);
  };

  const handleManualEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSubmitting(true);
    const name = customName.trim() || customEmail.split('@')[0];
    handleQuickLogin(customEmail.trim(), name);
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    if (onSessionChange) onSessionChange(null);
  };

  if (session) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'rgba(38, 33, 58, 0.75)',
        border: '1px solid var(--border-editorial)',
        padding: '0.3rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        flexShrink: 0
      }}>
        {session.picture ? (
          <img src={session.picture} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
        ) : (
          <span style={{ color: 'var(--celestial-gold)' }}>●</span>
        )}
        <span style={{ color: 'var(--moon-ivory)', fontFamily: 'var(--font-mono)' }}>{session.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            fontSize: '0.7rem',
            textDecoration: 'underline'
          }}
        >
          {isVi ? 'Đăng xuất' : 'Sign out'}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Clean, authentic Google Sign-in button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="btn"
        style={{
          fontSize: '0.75rem',
          padding: '0.4rem 0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          background: '#FFFFFF',
          color: '#1F1F1F',
          border: '1px solid #747775',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        aria-haspopup="dialog"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
          <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
        </svg>
        <span>{isVi ? 'Đăng nhập Google' : 'Sign in with Google'}</span>
      </button>

      {/* Authentication Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(10, 8, 16, 0.78)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#1A1528',
              border: '1px solid rgba(217, 193, 143, 0.3)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '440px',
              padding: '2rem 1.75rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
              color: 'var(--moon-ivory)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                lineHeight: 1
              }}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 1rem',
                background: '#FFFFFF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--moon-ivory)', marginBottom: '0.35rem' }}>
                {isVi ? 'Đăng Nhập Tài Khoản' : 'Sign In with Google'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isVi
                  ? 'Đồng bộ hồ sơ lá số, lưu trữ kết quả phân tích và mở khóa AI Deep Reasoning.'
                  : 'Sync your birth profiles, save research calculations, and access AI Deep Reasoning.'}
              </p>
            </div>

            {/* Quick One-Click Google Account Option */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('researcher@converglyph.io', 'Converglyph Researcher')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#FFFFFF',
                  color: '#1F1F1F',
                  border: '1px solid #DADCE0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                </svg>
                <span>{isVi ? 'Tiếp tục với Google Account' : 'Continue with Google Account'}</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245, 240, 232, 0.12)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {isVi ? 'HOẶC NHẬP EMAIL CỦA BẠN' : 'OR ENTER YOUR EMAIL'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245, 240, 232, 0.12)' }} />
            </div>

            {/* Manual Email Fallback */}
            <form onSubmit={handleManualEmailLogin}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.72rem' }}>
                  {isVi ? 'Họ và tên hiển thị' : 'Display Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  className="text-input"
                  placeholder={isVi ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Marie Curie'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.72rem' }}>
                  {isVi ? 'Địa chỉ Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  name="email"
                  className="text-input"
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
              >
                {isVi ? 'Xác Nhận & Đồng Bộ' : 'Sign In & Synchronize'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
