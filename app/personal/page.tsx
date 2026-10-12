'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { ProfileForm } from '@/components/report/ProfileForm';
import { useLocale } from '@/lib/LocaleContext';
import type { BirthProfile } from '@/lib/types';
import {
  calculateProfileApi,
  fetchSubscriptionPlansApi,
  fetchUserSubscriptionStatusApi,
  createStripeCheckoutApi,
  verifyStripeSessionApi,
  fetchPromoCaptchaApi,
  applyPromoCodeApi
} from '@/lib/api';
import { getUserSession, UserSession, getAccountProfileStorageKey } from '@/lib/auth';

export default function PersonalSpacePage() {
  const { locale, setLocale } = useLocale();
  const [session, setSession] = React.useState<UserSession | null>(null);
  const [customProfile, setCustomProfile] = React.useState<{ profile: BirthProfile; rawData: unknown } | null>(null);
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);
  const [subStatus, setSubStatus] = React.useState<{ tier: string; credits_remaining: number; is_pro: boolean; plan_id?: string; expires_at?: string }>({
    tier: 'free',
    credits_remaining: 5,
    is_pro: false
  });
  const [plans, setPlans] = React.useState<Record<string, unknown>[]>([]);
  const [checkoutLoading, setCheckoutLoading] = React.useState<string | null>(null);
  const [verifyNotice, setVerifyNotice] = React.useState<string | null>(null);
  // Promo Code & Captcha state
  const [promoCode, setPromoCode] = React.useState('');
  const [captchaData, setCaptchaData] = React.useState<{ challenge_id: string; question: string } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = React.useState('');
  const [promoLoading, setPromoLoading] = React.useState(false);
  const [promoMessage, setPromoMessage] = React.useState<{ text: string; isError: boolean } | null>(null);

  const loadCaptcha = React.useCallback(async () => {
    try {
      const data = await fetchPromoCaptchaApi();
      setCaptchaData(data);
      setCaptchaAnswer('');
    } catch {
      setCaptchaData(null);
    }
  }, []);

  React.useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage(null);
    if (!session || !session.email) {
      setPromoMessage({
        text: isVi ? 'Vui lòng đăng nhập Google trước khi áp dụng mã khuyến mãi.' : 'Please sign in with Google before applying a promo code.',
        isError: true
      });
      return;
    }
    if (!promoCode.trim()) {
      setPromoMessage({
        text: isVi ? 'Vui lòng nhập mã khuyến mãi.' : 'Please enter a promo code.',
        isError: true
      });
      return;
    }
    if (!captchaData || !captchaAnswer.trim()) {
      setPromoMessage({
        text: isVi ? 'Vui lòng hoàn thành câu hỏi Captcha.' : 'Please answer the Captcha challenge.',
        isError: true
      });
      return;
    }

    setPromoLoading(true);
    try {
      const res = await applyPromoCodeApi({
        user_email: session.email,
        code: promoCode.trim(),
        challenge_id: captchaData.challenge_id,
        captcha_response: captchaAnswer.trim()
      });

      if (res.error) {
        setPromoMessage({ text: res.error, isError: true });
        // Refresh captcha on failure to prevent replay
        loadCaptcha();
      } else if (res.success) {
        setPromoMessage({
          text: `${res.message} (+${res.credits_added} credits, Tổng: ${res.total_credits})`,
          isError: false
        });
        setPromoCode('');
        loadCaptcha();
        // Refresh subscription balance
        fetchUserSubscriptionStatusApi(session.email).then(setSubStatus).catch(console.warn);
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : (isVi ? 'Không thể kết nối đến máy chủ.' : 'Could not connect to server.');
      setPromoMessage({
        text: errMessage,
        isError: true
      });
      loadCaptcha();
    } finally {
      setPromoLoading(false);
    }
  };

  const isVi = (locale === 'vi');

  React.useEffect(() => {
    const currentSession = getUserSession();
    setSession(currentSession);

    if (currentSession && currentSession.email) {
      fetchUserSubscriptionStatusApi(currentSession.email).then(setSubStatus).catch(console.warn);
    }
    fetchSubscriptionPlansApi().then(res => setPlans(res.plans)).catch(console.warn);

    if (typeof window !== 'undefined') {
      const storageKey = getAccountProfileStorageKey(currentSession?.email);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCustomProfile(JSON.parse(saved));
        } catch {}
      } else {
        setCustomProfile(null);
      }

      // Check if redirected from Stripe success
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        verifyStripeSessionApi(sessionId, currentSession?.email).then(res => {
          if (res.success) {
            setVerifyNotice(isVi ? '✓ Nâng cấp thành công! Tài khoản Pro đã được kích hoạt.' : '✓ Payment successful! Your Pro Plan is now active.');
            if (currentSession?.email) {
              fetchUserSubscriptionStatusApi(currentSession.email).then(setSubStatus).catch(console.warn);
            }
          }
        }).catch(console.warn);
      }
    }
  }, [isVi]);

  const handleProfileSubmit = async (p: BirthProfile) => {
    const currentSession = getUserSession();
    if (!currentSession) {
      alert(isVi ? 'Vui lòng đăng nhập Google trước khi tính toán lá số cá nhân.' : 'Please sign in with Google before calculating your personal chart.');
      return;
    }
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

  const handleBuyPlan = async (planId: string) => {
    if (!session) {
      alert(isVi ? 'Vui lòng đăng nhập Google trước khi đăng ký gói.' : 'Please sign in with Google before purchasing a pass.');
      const btn = document.getElementById('btn-google-auth-login');
      if (btn) btn.click();
      return;
    }
    setCheckoutLoading(planId);
    try {
      const res = await createStripeCheckoutApi(planId, session.email, 'usd');
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        alert(res.error || 'Failed to initiate Stripe Checkout');
      }
    } catch (e) {
      alert(`Stripe error: ${e}`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <>
      <PrototypeNotice />
      <Navbar
        currentLocale={locale}
        onLocaleChange={setLocale}
        onOpenCalc={() => {
          if (!session) {
            alert(isVi ? 'Vui lòng đăng nhập Google để lập lá số cá nhân.' : 'Please sign in with Google to calculate your personal chart.');
            const btn = document.getElementById('btn-google-auth-login');
            if (btn) btn.click();
            return;
          }
          setIsCalcOpen(true);
        }}
      />

      <main className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Header */}
          <div className="section-editorial-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-editorial-eyebrow">
              {isVi ? 'KHÔNG GIAN CÁ NHÂN & GÓI NGHIÊN CỨU PRO' : 'PERSONAL RESEARCH SPACE & PRO TIERS'}
            </span>
            <h1 className="section-editorial-title">
              {isVi ? 'Không Gian Cá Nhân & Đăng Ký Gói' : 'Personal Space & Subscription Passes'}
            </h1>
            <p className="section-editorial-desc">
              {isVi
                ? 'Quản lý lá số cá nhân, số dư lượt suy luận AI và đăng ký các gói nghiên cứu chuyên sâu (3 ngày, 7 ngày, 30 ngày, 1 năm).'
                : 'Manage your authenticated birth charts, AI reasoning credits, and choose your Pro research pass.'}
            </p>
          </div>

          {verifyNotice && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--emerald-accent)', borderRadius: '10px', padding: '1rem', color: 'var(--emerald-accent)', marginBottom: '2rem', textAlign: 'center' }}>
              {verifyNotice}
            </div>
          )}

          {/* User & Chart Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {/* Card 1: Identity & Credit Balance */}
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
                    {session ? session.name : (isVi ? 'Chưa Đăng Nhập' : 'Not Signed In')}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {session ? session.email : (isVi ? 'Yêu cầu đăng nhập Google' : 'Google sign in required')}
                  </div>
                </div>
              </div>

              {/* Status and Credit Badge */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? 'Gói hiện tại:' : 'Current Plan:'}</div>
                  <strong style={{ color: subStatus.is_pro ? 'var(--celestial-gold)' : 'var(--moon-ivory)', fontSize: '0.9rem' }}>
                    {subStatus.is_pro ? 'CONVERGLYPH PRO' : 'FREE TIER (Mặc định)'}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{isVi ? 'Lượt AI CoT:' : 'AI Reasoning Credits:'}</div>
                  <strong style={{ color: subStatus.credits_remaining > 0 ? 'var(--emerald-accent)' : 'var(--rose-accent)', fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}>
                    {session ? subStatus.credits_remaining : 0} ⚡
                  </strong>
                </div>
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
                    {isVi ? 'Đăng nhập Google Ngay' : 'Sign In with Google'}
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Active Calculated Chart (Requires Login) */}
            <div className="matrix-editorial-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)' }}>
                  {isVi ? 'Lá Số Cá Nhân Hiện Tại' : 'Active Personal Chart'}
                </h3>
                <span className={`status-chip ${customProfile ? 'confirmed' : 'demo'}`}>
                  {customProfile ? (isVi ? 'Đã Tính Toán' : 'Computed') : (isVi ? 'Chưa Có' : 'None')}
                </span>
              </div>

              {!session ? (
                <div>
                  <div style={{ background: 'rgba(217, 193, 143, 0.1)', border: '1px solid rgba(217, 193, 143, 0.3)', borderRadius: '8px', padding: '1rem', fontSize: '0.825rem', color: 'var(--celestial-gold-bright)', marginBottom: '1.25rem' }}>
                    🔒 {isVi
                      ? 'Tính toán lá số cá nhân yêu cầu đăng nhập Google để bảo mật quyền sở hữu dữ liệu và ngăn ngừa rò rỉ chéo giữa các tài khoản.'
                      : 'Active Personal Chart requires Google sign in to protect chart privacy and enforce per-account data isolation.'}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const btn = document.getElementById('btn-google-auth-login');
                      if (btn) btn.click();
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {isVi ? 'Đăng nhập để xem & lập lá số' : 'Sign in to access personal chart'}
                  </button>
                </div>
              ) : customProfile ? (
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
                      ? 'Lá số của bạn được lưu an toàn gắn liền với tài khoản Google này.'
                      : 'Your chart is stored privately and isolated strictly to your Google account.'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link href="/explore?profile=custom" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                      {isVi ? '👁 Mở Bản Đồ Đa Hệ Thống' : '👁 Open Life Map'}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleClearProfile}
                      style={{ fontSize: '0.8rem', color: 'var(--rose-accent)', borderColor: 'rgba(244,63,94,0.35)' }}
                    >
                      {isVi ? 'Xóa Bản Ghi' : 'Delete Chart'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {isVi
                      ? 'Tài khoản của bạn chưa có lá số cá nhân nào. Hãy nhập ngày giờ và nơi sinh để lập bản đồ đa hệ thống.'
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

          {/* Pricing Passes Section (Stripe Integration) */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div className="section-editorial-header" style={{ marginBottom: '2rem' }}>
              <span className="section-editorial-eyebrow">
                {isVi ? 'BẢNG GIÁ DỊCH VỤ & HẠN MỨC SUY LUẬN AI' : 'SUBSCRIPTION PASSES & AI REASONING CREDITS'}
              </span>
              <h2 className="section-editorial-title" style={{ fontSize: '2rem' }}>
                {isVi ? 'Nâng Cấp Gói Nghiên Cứu Pro' : 'Choose Your Pro Research Pass'}
              </h2>
              <p className="section-editorial-desc">
                {isVi
                  ? 'Khai mở toàn bộ Ma Trận Đối Sánh, Chuỗi Thời Gian Dòng Đời và Lượt Suy Luận AI Deep Reasoning không giới hạn rào cản.'
                  : 'Unlock the Convergence Matrix, Chronological Time-Series Visualizer, and AI Deep Reasoning runs.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {/* Pass 1: 3-Day Fast Pass */}
              <div className="matrix-editorial-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="status-chip demo" style={{ fontSize: '0.7rem' }}>3-Day Pass</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginTop: '0.5rem' }}>
                    {isVi ? 'Gói Khám Phá' : '3-Day Fast Pass'}
                  </h4>
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--celestial-gold)', fontFamily: 'var(--font-serif)' }}>
                      $1.49 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 400 }}>USD</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{isVi ? 'Hiệu lực 3 ngày (72 giờ)' : 'Valid for 72 hours'}</div>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li><strong>25 Lượt</strong> AI Deep Reasoning</li>
                    <li>Ma Trận Đối Sánh Đông–Tây</li>
                    <li>Xuất Chuyên Khảo Hợp Nhất</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={checkoutLoading === 'pass_3d'}
                  onClick={() => handleBuyPlan('pass_3d')}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {checkoutLoading === 'pass_3d' ? 'Connecting...' : (isVi ? 'Đăng Ký $1.49' : 'Get 3-Day Pass ($1.49)')}
                </button>
              </div>

              {/* Pass 2: 7-Day Weekly Sprint (Featured) */}
              <div className="matrix-editorial-card" style={{ padding: '1.75rem', border: '1px solid var(--celestial-gold)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(217, 193, 143, 0.08)' }}>
                <div>
                  <span className="status-chip confirmed" style={{ fontSize: '0.7rem' }}>7-Day Popular</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginTop: '0.5rem' }}>
                    {isVi ? 'Gói Tuần Nghiên Cứu' : '7-Day Sprint Pass'}
                  </h4>
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--celestial-gold)', fontFamily: 'var(--font-serif)' }}>
                      $2.99 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 400 }}>USD</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{isVi ? 'Tiết kiệm ~35%' : 'Save ~35%'}</div>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li><strong>70 Lượt</strong> AI Deep Reasoning</li>
                    <li>Chu Kỳ Dòng Đời (Time Series Wave)</li>
                    <li>Khóa Dự Đoán SHA-256 Không Giới Hạn</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={checkoutLoading === 'pass_7d'}
                  onClick={() => handleBuyPlan('pass_7d')}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {checkoutLoading === 'pass_7d' ? 'Connecting...' : (isVi ? 'Đăng Ký $2.99' : 'Get 7-Day Pass ($2.99)')}
                </button>
              </div>

              {/* Pass 3: 30-Day Monthly */}
              <div className="matrix-editorial-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="status-chip demo" style={{ fontSize: '0.7rem' }}>30-Day Pro</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginTop: '0.5rem' }}>
                    {isVi ? 'Gói Chuyên Nghiệp' : '30-Day Monthly Pro'}
                  </h4>
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--celestial-gold)', fontFamily: 'var(--font-serif)' }}>
                      $8.99 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 400 }}>USD</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{isVi ? 'Tiết kiệm ~60%' : 'Save ~60%'}</div>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li><strong>350 Lượt</strong> AI Deep Reasoning</li>
                    <li>Truy cập toàn bộ 4 môn phái</li>
                    <li>Ưu tiên hàng đợi GPU Groq LPU</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={checkoutLoading === 'sub_30d'}
                  onClick={() => handleBuyPlan('sub_30d')}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {checkoutLoading === 'sub_30d' ? 'Connecting...' : (isVi ? 'Đăng Ký $8.99' : 'Get Monthly Pro ($8.99)')}
                </button>
              </div>

              {/* Pass 4: 1-Year Annual Scholar */}
              <div className="matrix-editorial-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="status-chip confirmed" style={{ fontSize: '0.7rem' }}>1-Year VIP</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginTop: '0.5rem' }}>
                    {isVi ? 'Gói Học Giả 1 Năm' : '1-Year Annual Scholar'}
                  </h4>
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--celestial-gold)', fontFamily: 'var(--font-serif)' }}>
                      $69.99 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 400 }}>USD</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{isVi ? 'Tiết kiệm ~75%' : 'Best Value (~75% Off)'}</div>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li><strong>5.000 Lượt</strong> AI Deep Reasoning</li>
                    <li>Không giới hạn lưu trữ hồ sơ</li>
                    <li>Hỗ trợ học thuật ưu tiên 24/7</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={checkoutLoading === 'sub_1y'}
                  onClick={() => handleBuyPlan('sub_1y')}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                >
                  {checkoutLoading === 'sub_1y' ? 'Connecting...' : (isVi ? 'Đăng Ký $69.99' : 'Get Annual Pass ($69.99)')}
                </button>
              </div>
            </div>
          </div>
          {/* Promo Code & Captcha Redemption Section */}
          <div className="matrix-editorial-card" style={{ padding: '2rem', border: '1px solid rgba(217, 193, 143, 0.4)', borderRadius: '12px', background: 'rgba(217, 193, 143, 0.04)', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="status-chip confirmed" style={{ fontSize: '0.7rem' }}>
                  {isVi ? 'MÃ ƯU ĐÃI & KHUYẾN MÃI' : 'PROMO CODE REDEMPTION'}
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--moon-ivory)', marginTop: '0.5rem' }}>
                  {isVi ? 'Áp Dụng Mã Ưu Đãi Nghiên Cứu' : 'Apply Research Promo Code'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0.35rem 0 0' }}>
                  {isVi
                    ? 'Nhập mã kích hoạt của bạn để nhận thêm lượt suy luận AI hoặc nâng cấp tài khoản Pro. Xác minh Captcha bên dưới giúp ngăn chặn tấn công tự động brute-force.'
                    : 'Enter your voucher code to grant AI reasoning runs or activate Pro access. Complete the anti-brute-force Captcha to verify.'}
                </p>
              </div>

              {/* Testing Code Hint Pill */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--celestial-gold)', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.75rem', color: 'var(--celestial-gold)', fontFamily: 'var(--font-mono)' }}>
                <div><strong>Testing Infinite Code:</strong> <code>CONVERGLYPH_INFINITY</code></div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Unlimited redemptions (+9,999 credits, Pro tier)</div>
              </div>
            </div>

            {promoMessage && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                background: promoMessage.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${promoMessage.isError ? '#ef4444' : '#10b981'}`,
                color: promoMessage.isError ? '#fca5a5' : '#6ee7b7'
              }}>
                {promoMessage.isError ? '⚠️ ' : '✓ '} {promoMessage.text}
              </div>
            )}

            <form onSubmit={handleApplyPromo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  {isVi ? 'MÃ KHUYẾN MÃI' : 'PROMO CODE'}
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CONVERGLYPH_INFINITY"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--moon-ivory)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {isVi ? 'XÁC MINH CAPTCHA' : 'CAPTCHA CHALLENGE'}
                  </label>
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    style={{ background: 'none', border: 'none', color: 'var(--celestial-gold)', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                  >
                    {isVi ? '↻ Đổi câu hỏi' : '↻ Refresh'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{
                    padding: '0.75rem 0.9rem',
                    background: 'rgba(217, 193, 143, 0.12)',
                    border: '1px solid rgba(217, 193, 143, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--celestial-gold)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}>
                    {captchaData ? captchaData.question : (isVi ? 'Đang tải...' : 'Loading...')}
                  </div>
                  <input
                    type="text"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder={isVi ? 'Đáp án' : 'Answer'}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--moon-ivory)',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={promoLoading || !promoCode.trim() || !captchaAnswer.trim()}
                  style={{ width: '100%', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
                >
                  {promoLoading ? (isVi ? 'Đang xác minh...' : 'Verifying...') : (isVi ? 'Kích Hoạt Mã' : 'Redeem Code')}
                </button>
              </div>
            </form>
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
