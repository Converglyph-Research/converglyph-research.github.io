'use client';

import React from 'react';
import { UserSession, getUserSession, saveUserSession, clearUserSession, decodeJwt } from '@/lib/auth';
import { useLocale } from '@/lib/LocaleContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: any) => void; auto_select?: boolean }) => void;
          prompt: (notification?: (notification: any) => void) => void;
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
  const { locale } = useLocale();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const googleBtnContainerRef = React.useRef<HTMLDivElement>(null);
  const modalGoogleBtnContainerRef = React.useRef<HTMLDivElement>(null);

  const isVi = (locale === 'vi');
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  const handleCredentialResponse = (response: any) => {
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
  };

  // Initialize Google Identity Services
  React.useEffect(() => {
    const s = getUserSession();
    setSession(s);
    if (onSessionChange) onSessionChange(s);

    if (clientId && typeof window !== 'undefined') {
      const initGsi = () => {
        if (window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse
            });

            // If header button ref exists, render official Google button
            if (googleBtnContainerRef.current) {
              window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
                theme: 'outline',
                size: 'medium',
                shape: 'pill',
                text: 'signin_with',
                locale: isVi ? 'vi' : 'en'
              });
            }
          } catch (e) {
            console.warn('Google GSI initialization notice:', e);
          }
        }
      };

      if (window.google?.accounts?.id) {
        initGsi();
      } else {
        const timer = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(timer);
            initGsi();
          }
        }, 300);
        return () => clearInterval(timer);
      }
    }
  }, [clientId, isVi]);

  // When modal opens, render the official Google button inside the modal as well
  React.useEffect(() => {
    if (isModalOpen && clientId && typeof window !== 'undefined' && window.google?.accounts?.id) {
      if (modalGoogleBtnContainerRef.current) {
        try {
          window.google.accounts.id.renderButton(modalGoogleBtnContainerRef.current, {
            theme: 'filled_blue',
            size: 'large',
            shape: 'rectangular',
            text: 'continue_with',
            width: 320,
            locale: isVi ? 'vi' : 'en'
          });
        } catch (e) {
          console.warn('Modal GSI button render error:', e);
        }
      }
    }
  }, [isModalOpen, clientId, isVi]);

  const triggerGoogleLogin = () => {
    if (clientId && typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        // If One Tap is dismissed, suppressed, or blocked by 3rd-party cookie policies, open modal
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsModalOpen(true);
        }
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleManualEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsSubmitting(true);
    const name = customName.trim() || customEmail.split('@')[0];
    const userSession: UserSession = {
      name,
      email: customEmail.trim(),
      sub: `user-${Date.now()}`
    };
    saveUserSession(userSession);
    setSession(userSession);
    setIsModalOpen(false);
    setIsSubmitting(false);
    if (onSessionChange) onSessionChange(userSession);
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
      {/* Real Google GSI Mount container in Navbar */}
      <div
        ref={googleBtnContainerRef}
        id="google-signin-btn-container"
        style={{ display: 'inline-flex', alignItems: 'center' }}
      >
        {/* Fallback button if Google script is loading or rendering */}
        <button
          type="button"
          onClick={triggerGoogleLogin}
          className="btn btn-outline"
          style={{
            fontSize: '0.75rem',
            padding: '0.35rem 0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            fontWeight: 500
          }}
          aria-haspopup="dialog"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
            <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
          </svg>
          <span>{isVi ? 'Đăng nhập Google' : 'Sign in with Google'}</span>
        </button>
      </div>

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
              maxWidth: '420px',
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
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                margin: '0 auto 0.75rem',
                background: '#FFFFFF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)', marginBottom: '0.35rem' }}>
                {isVi ? 'Đăng Nhập Tài Khoản' : 'Account Sign In'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isVi
                  ? 'Đồng bộ hồ sơ sinh, lưu trữ kết quả phân tích và mở khóa AI Deep Reasoning.'
                  : 'Sync your birth profiles, save research calculations, and access AI Deep Reasoning.'}
              </p>
            </div>

            {/* Official Google OAuth GSI Button inside Modal */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', minHeight: '44px' }}>
              <div ref={modalGoogleBtnContainerRef} />
            </div>

            {/* Subtle Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245, 240, 232, 0.12)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {isVi ? 'HOẶC ĐĂNG NHẬP BẰNG EMAIL' : 'OR SIGN IN WITH EMAIL'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245, 240, 232, 0.12)' }} />
            </div>

            {/* Clean Email Fallback */}
            <form onSubmit={handleManualEmailLogin}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
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
                  style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
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
                  style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
              >
                {isVi ? 'Xác Nhận & Tiếp Tục' : 'Confirm & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
