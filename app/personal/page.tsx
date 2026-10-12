'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { ProfileForm } from '@/components/report/ProfileForm';
import { useLocale } from '@/lib/LocaleContext';
import { BirthProfile } from '@/lib/types';
import { calculateProfileApi } from '@/lib/api';
import { getUserSession, UserSession, getAccountProfileStorageKey } from '@/lib/auth';

export default function PersonalSpacePage() {
  const { locale, setLocale, dict } = useLocale();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [customProfile, setCustomProfile] = React.useState<any>(null);
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);
  const isVi = (locale === 'vi');

  React.useEffect(() => {
    const currentSession = getUserSession();
    setSession(currentSession);
    if (typeof window !== 'undefined') {
      // Use account-isolated storage key to prevent cross-account data leakage
      const storageKey = getAccountProfileStorageKey(currentSession?.email);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCustomProfile(JSON.parse(saved));
        } catch {}
      } else {
        setCustomProfile(null);
      }
    }
  }, []);
  const handleProfileSubmit = async (p: BirthProfile) => {
    const currentSession = getUserSession();
    const rawData = await calculateProfileApi(p, false, currentSession?.email);
    if (typeof window !== 'undefined') {
      const storageKey = getAccountProfileStorageKey(currentSession?.email);
      localStorage.setItem(storageKey, JSON.stringify({ profile: p, rawData }));
      setCustomProfile({ profile: p, rawData });
      setIsCalcOpen(false);
    }
  };

  const handleClearProfile = () => {
    if (typeof window !== 'undefined') {
      const currentSession = getUserSession();
      const storageKey = getAccountProfileStorageKey(currentSession?.email);
      localStorage.removeItem(storageKey);
      setCustomProfile(null);
    }
  };

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={setLocale}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      <main className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Header */}
          <div className="section-editorial-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-editorial-eyebrow">
              {isVi ? 'KHÔNG GIAN CÁ NHÂN & QUẢN LÝ LÁ SỐ' : 'PERSONAL RESEARCH SPACE & CHARTS'}
            </span>
            <h1 className="section-editorial-title">
              {isVi ? 'Không Gian Cá Nhân' : 'Personal Research Space'}
            </h1>
            <p className="section-editorial-desc">
              {isVi
                ? 'Không gian độc lập dành riêng cho hồ sơ của bạn, đồng bộ tài khoản Google và quản lý các phép tính biểu tượng.'
                : 'A dedicated, independent space to manage your personal birth charts, synchronized Google session, and multi-system calculations.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {/* Card 1: Identity & Session */}
            <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(217, 193, 143, 0.15)',
                  border: '1px solid var(--celestial-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}>
                  {session?.picture ? (
                    <img src={session.picture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    '👤'
                  )}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)' }}>
                    {session ? session.name : (isVi ? 'Khách Khám Phá' : 'Guest Explorer')}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {session ? session.email : (isVi ? 'Chưa đăng nhập Google' : 'Not signed in with Google')}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {session
                  ? (isVi
                    ? 'Tài khoản Google của bạn đang được kết nối an toàn. Dữ liệu tính toán và phiên làm việc được đồng bộ.'
                    : 'Your Google Account is securely connected. Personal charts and AI reasoning tokens are synced.')
                  : (isVi
                    ? 'Bạn đang duyệt web ở chế độ ẩn danh. Nhấn Đăng nhập để lưu trữ lá số dài hạn và mở khóa đầy đủ tính năng AI.'
                    : 'You are browsing in guest mode. Sign in with Google to synchronize your charts and unlock full AI reasoning.')}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {session ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('converglyph_user_session');
                        localStorage.removeItem('aetheria_user_session');
                        setSession(null);
                        window.location.reload();
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {isVi ? 'Đăng xuất' : 'Sign Out'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const btn = document.getElementById('btn-google-auth-login');
                      if (btn) btn.click();
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {isVi ? 'Đăng nhập Google' : 'Sign in with Google'}
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Active Calculated Chart */}
            <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)' }}>
                  {isVi ? 'Lá Số Cá Nhân Hiện Tại' : 'Active Personal Chart'}
                </h3>
                <span className={`status-chip ${customProfile ? 'confirmed' : 'demo'}`}>
                  {customProfile ? (isVi ? 'Đã Tính Toán' : 'Computed') : (isVi ? 'Chưa Có' : 'None')}
                </span>
              </div>

              {customProfile ? (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--celestial-gold)', marginBottom: '0.25rem' }}>
                      {customProfile.profile?.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {customProfile.profile?.year}-{String(customProfile.profile?.month).padStart(2, '0')}-{String(customProfile.profile?.day).padStart(2, '0')} • {customProfile.profile?.locationName}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {isVi
                      ? 'Lá số của bạn đã được tính toán đầy đủ trên 4 hệ thống (Chiêm tinh Tây phương, Bát Tự, Tử Vi, Thần số học).'
                      : 'Your personal chart is computed across all 4 canons (Western Ephemeris, BaZi, Tu Vi, Numerology).'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link href="/explore?profile=custom" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                      {isVi ? '👁 Mở Bản Đồ Đa Hệ Thống' : '👁 Open Life Map'}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={async () => {
                        if (window.confirm(isVi ? 'Bạn có chắc chắn muốn xóa bản ghi lá số này khỏi trình duyệt và cơ sở dữ liệu?' : 'Delete this chart record from browser and database?')) {
                          const { deleteProfileApi } = await import('@/lib/api');
                          if (customProfile.id) {
                            await deleteProfileApi(customProfile.id);
                          }
                          handleClearProfile();
                        }
                      }}
                      style={{ fontSize: '0.8rem', color: 'var(--rose-accent)', borderColor: 'rgba(244,63,94,0.4)' }}
                    >
                      🗑 {isVi ? 'Xóa Bản Ghi' : 'Delete Record'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {isVi
                      ? 'Bạn chưa lập lá số cá nhân nào. Hãy nhập ngày giờ và nơi sinh để tính toán bản đồ đa hệ thống độc lập.'
                      : 'You do not have a computed chart yet. Enter your birth details to generate an independent multi-system life map.'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsCalcOpen(true)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {isVi ? '✨ Lập Lá Số Cá Nhân Ngay' : '✨ Calculate My Chart Now'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginBottom: '1rem' }}>
              {isVi ? 'Lối Tắt Khám Phá Nhanh' : 'Quick Navigation Shortcuts'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Link href="/explore" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ color: 'var(--color-western)', fontWeight: 600, marginBottom: '0.25rem' }}>🧭 {isVi ? 'Khám Phá Bản Đồ' : 'Explore Life Map'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? 'Xem bản đồ 6 chủ đề Đông–Tây' : 'Multi-system 6-theme comparative map'}</div>
                </div>
              </Link>
              <Link href="/research" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ color: 'var(--emerald-accent)', fontWeight: 600, marginBottom: '0.25rem' }}>🔬 {isVi ? 'Sổ Cái Nghiên Cứu' : 'Research Ledger'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? 'Khóa dự đoán và kiểm toán SHA-256' : 'Cryptographic locks and Brier scoring'}</div>
                </div>
              </Link>
              <Link href="/articles" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ color: 'var(--color-tuvi)', fontWeight: 600, marginBottom: '0.25rem' }}>📖 {isVi ? 'Chuyên Đề Phương Pháp' : 'Methodology Papers'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? '6 bài viết chuyên sâu song ngữ' : '6 in-depth bilingual monographs'}</div>
                </div>
              </Link>
              <Link href="/documentation" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ color: 'var(--celestial-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>⚙ {isVi ? 'Đặc Tả Kỹ Thuật' : 'API Documentation'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? 'Toán học, ephemeris và REST API' : 'Math, ephemeris, and REST APIs'}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <ProfileForm
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onSubmitProfile={handleProfileSubmit}
        isVietnamese={isVi}
      />
    </>
  );
}
