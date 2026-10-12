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
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: any) => void;
            error_callback?: (error: any) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

interface GoogleAuthProps {
  onSessionChange?: (session: UserSession | null) => void;
  isVietnamese?: boolean;
}

// Global flag to prevent re-calling google.accounts.id.initialize multiple times
let isGsiInitialized = false;

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSessionChange }) => {
  const { locale } = useLocale();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  // Check stored session on mount
  React.useEffect(() => {
    const s = getUserSession();
    setSession(s);
    if (onSessionChange) onSessionChange(s);
  }, []);

  // Initialize GSI once if client ID is configured
  React.useEffect(() => {
    if (clientId && typeof window !== 'undefined' && !isGsiInitialized) {
      const checkAndInit = () => {
        if (window.google?.accounts?.id && !isGsiInitialized) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse
            });
            isGsiInitialized = true;
          } catch (err) {
            console.warn('GSI init error:', err);
          }
        }
      };

      if (window.google?.accounts?.id) {
        checkAndInit();
      } else {
        const timer = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(timer);
            checkAndInit();
          }
        }, 300);
        return () => clearInterval(timer);
      }
    }
  }, [clientId]);

  // Real Google OAuth Popup trigger
  const handleGoogleOAuthPopup = () => {
    if (!clientId) {
      setIsModalOpen(true);
      return;
    }

    // Try Google OAuth2 Token Client popup (works without COOP / iframe blocking)
    if (typeof window !== 'undefined' && window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                // Fetch user info from Google UserInfo endpoint
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (res.ok) {
                  const userInfo = await res.json();
                  const newSession: UserSession = {
                    name: userInfo.name || userInfo.email,
                    email: userInfo.email,
                    picture: userInfo.picture,
                    sub: userInfo.sub || `google-${Date.now()}`
                  };
                  saveUserSession(newSession);
                  setSession(newSession);
                  setIsModalOpen(false);
                  if (onSessionChange) onSessionChange(newSession);
                  return;
                }
              } catch (fetchErr) {
                console.warn('Userinfo fetch notice:', fetchErr);
              }
            }
          },
          error_callback: (err: any) => {
            console.warn('Google OAuth popup notice:', err);
            // Fallback to opening modal
            setIsModalOpen(true);
          }
        });
        client.requestAccessToken();
        return;
      } catch (e) {
        console.warn('OAuth2 client initiation error:', e);
      }
    }

    // Fallback to GSI prompt or modal
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
            setIsModalOpen(true);
          }
        });
      } catch {
        setIsModalOpen(true);
      }
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
      {/* Standard Header Login Button */}
      <button
        type="button"
        id="btn-google-auth-login"
        onClick={handleGoogleOAuthPopup}
        className="btn"
        style={{
          fontSize: '0.75rem',
          padding: '0.35rem 0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          background: '#FFFFFF',
          color: '#1F1F1F',
          border: '1px solid #747775',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          fontWeight: 500,
          cursor: 'pointer'
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

      {/* Fallback Authentication Dialog */}
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

            {/* Direct Google OAuth Button */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={handleGoogleOAuthPopup}
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                </svg>
                <span>{isVi ? 'Đăng nhập bằng Google' : 'Sign in with Google'}</span>
              </button>
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
