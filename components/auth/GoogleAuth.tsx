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

  const handleSimulateGoogleLogin = () => {
    // Standard Google Client Login
    const demoSession: UserSession = {
      name: "Researcher Account",
      email: "researcher@aetheria.org",
      sub: "google-10928374619",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c"
    };
    saveUserSession(demoSession);
    setSession(demoSession);
    if (onSessionChange) onSessionChange(demoSession);
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
    <button
      type="button"
      onClick={handleSimulateGoogleLogin}
      className="btn btn-outline"
      style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z" />
        <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.7 7.5 23.5 12 23.5z" />
      </svg>
      <span>{isVietnamese ? 'Đăng nhập Google' : 'Sign in with Google'}</span>
    </button>
  );
};
