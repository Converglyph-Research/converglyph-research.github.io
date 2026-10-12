'use client';

import React from 'react';
import { UserSession, getUserSession, saveUserSession, clearUserSession, decodeJwt } from '@/lib/auth';

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

export const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSessionChange, isVietnamese = false }) => {
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const [hasGoogleClient, setHasGoogleClient] = React.useState(false);

  React.useEffect(() => {
    const s = getUserSession();
    setSession(s);
    if (onSessionChange) onSessionChange(s);

    // Initialize real Google Identity Services if client ID is configured
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (clientId && typeof window !== 'undefined' && window.google?.accounts?.id) {
      setHasGoogleClient(true);
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
              if (onSessionChange) onSessionChange(newSession);
            }
          }
        }
      });
    }
  }, []);

  const handleOpenAuth = () => {
    // If real Google client is loaded and configured, prompt GIS One Tap
    if (hasGoogleClient && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCustomAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const userSession: UserSession = {
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      sub: `user-${Date.now()}`
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
        {session.picture ? (
          <img src={session.picture} alt="" style={{ width: 18, height: 18, borderRadius: '50%' }} />
        ) : (
          <span style={{ color: 'var(--celestial-gold)' }}>●</span>
        )}
        <span style={{ color: 'var(--moon-ivory)', fontFamily: 'var(--font-mono)' }}>{session.name}</span>
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
        onClick={handleOpenAuth}
        className="btn btn-outline"
        style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        aria-haspopup="dialog"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
          <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
        </svg>
        <span>{isVietnamese ? 'Đăng nhập Google' : 'Sign in with Google'}</span>
      </button>

      {isModalOpen && (
        <>
          <div className="drawer-backdrop active" onClick={() => setIsModalOpen(false)} aria-hidden="true" />
          <dialog className="calc-drawer open" style={{ width: '480px', zIndex: 1100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)' }}>
                  {isVietnamese ? 'Đăng Nhập Tài Khoản' : 'Account Authentication'}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                  {isVietnamese ? 'Đồng bộ hồ sơ Tử Vi & Bản đồ sao với AI suy luận' : 'Sync Tử Vi & Astro Maps with AI Reasoning Studio'}
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
                ? 'Đăng nhập để lưu trữ bản đồ tử vi, bản đồ sao chiêm tinh và kích hoạt mô hình suy luận sâu (Groq GPT-OSS 120B / Qwen 27B) với hạn ngạch mở rộng.'
                : 'Sign in to sync your Tử Vi and Astrodienst charts, unlock extended AI Thinking limits, and track verified prediction ledger entries.'}
            </p>

            <form onSubmit={handleCustomAuth}>
              <div className="form-group">
                <label className="form-label">{isVietnamese ? 'Họ và tên' : 'Full Name'}</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder={isVietnamese ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Marie Curie'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isVietnamese ? 'Email Google' : 'Google Account Email'}</label>
                <input
                  type="email"
                  className="text-input"
                  placeholder="your-name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {isVietnamese ? 'Xác Nhận Đăng Nhập' : 'Confirm Sign In'}
              </button>
            </form>
          </dialog>
        </>
      )}
    </>
  );
};
