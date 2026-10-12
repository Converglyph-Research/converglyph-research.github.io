'use client';

import React from 'react';
import Link from 'next/link';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { useLocale } from '@/lib/LocaleContext';

export default function DocumentationPage() {
  const { locale } = useLocale();
  const isVi = (locale === 'vi');

  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />

      <main className="section">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-editorial-header">
            <span className="section-editorial-eyebrow">
              {isVi ? 'CONVERGLYPH RESEARCH • HỆ THỐNG KỸ THUẬT' : 'Converglyph Research • Technical Specifications'}
            </span>
            <h1 className="section-editorial-title">
              {isVi ? 'Kiến Trúc Nền Tảng, Động Cơ Tính Toán & Đặc Tả API' : 'Platform Architecture, Calculation Engines & API Specifications'}
            </h1>
            <p className="section-editorial-desc">
              {isVi
                ? 'Tài liệu chuẩn xác về các động cơ tính toán độc lập, giả định thiên văn học, thuật toán ranh giới lịch, giao thức đánh giá thực nghiệm và cấu trúc REST API.'
                : 'Authoritative documentation covering isolated calculation engines, astronomical assumptions, calendar boundary algorithms, quantitative evaluation protocols, and REST API schemas.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Western Astrology Engine */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '1. Động Cơ Chiêm Tinh Tây Phương (`pyswisseph`)' : '1. Western Ephemeris Engine (`pyswisseph`)'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Tính toán tọa độ hành tinh hoàng đạo địa tâm chính xác đến từng giây cung bằng thư viện Swiss Ephemeris v2.10.3.2 (dựa trên ephemeris JPL DE431 của NASA).'
                  : 'Calculates sub-arcsecond geocentric ecliptic planetary coordinates using Swiss Ephemeris v2.10.3.2 (derived from NASA JPL DE431 ephemerides).'}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>{isVi ? 'Hệ Tọa Độ:' : 'Coordinate Frame:'}</strong> {isVi ? 'Hoàng Đạo Nhiệt Đới (Tropical Zodiac - Điểm Xuân Phân 0° Bạch Dương)' : 'Tropical Zodiac (0° Aries Vernal Equinox)'}</div>
                <div><strong>{isVi ? 'Hệ Thống Nhà:' : 'House System:'}</strong> {isVi ? 'Phân bán cung Placidus (với kiểm tra đối chiếu Whole Sign)' : 'Placidus Semi-Arc Trisection with Whole Sign secondary verification'}</div>
                <div><strong>{isVi ? 'Sai Số Góc Chiếu:' : 'Aspect Orbs:'}</strong> {isVi ? 'Trùng tụ (0°), Tam hợp (120°), Đối đỉnh (180°): ±8.0° | Vuông góc (90°): ±7.0° | Lục hợp (60°): ±6.0°' : 'Conjunction (0°), Trine (120°), Opposition (180°): ±8.0° | Square (90°): ±7.0° | Sextile (60°): ±6.0°'}</div>
                <div><strong>{isVi ? 'Quy Chuẩn Giờ:' : 'Time Standards:'}</strong> {isVi ? 'Ngày Julius thiên văn kết hợp Giờ Mặt Trời Trung Bình (LMT = Kinh độ / 15.0h) cho mốc lịch sử trước 1920' : 'Astronomical Julian Day with Local Mean Time (LMT = Longitude / 15.0 hrs) for pre-1920 historical benchmarks'}</div>
              </div>
            </article>

            {/* 2. BaZi Four Pillars */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '2. Bát Tự (Tứ Trụ) / Four Pillars of Destiny' : '2. Four Pillars of Destiny (BaZi / Tứ Trụ)'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Xác lập 10 Thiên Can và 12 Địa Chi dựa trên tọa độ kinh độ Mặt Trời thực tế qua 24 Tiết Khí thiên văn.'
                  : 'Calculates the 10 Heavenly Stems (*Thiên Can*) and 12 Earthly Branches (*Địa Chi*) based strictly on the Sun\'s apparent ecliptic longitude across 24 Solar Terms (*Jie Qi*).'}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>{isVi ? 'Khởi Đầu Năm:' : 'Year Boundary:'}</strong> {isVi ? 'Lập Xuân (Kinh độ Mặt Trời 315°), hoàn toàn độc lập với Tết Âm Lịch' : 'Lichun (Start of Spring, 315° Solar Longitude), strictly independent of the civil Lunar New Year'}</div>
                <div><strong>{isVi ? 'Hiệu Chỉnh Giờ Sinh:' : 'Hour Pillar Correction:'}</strong> {isVi ? 'Giờ Mặt Trời Thực (LST = Giờ đồng hồ + 4 × (Kinh độ địa phương - Kinh độ chuẩn) + EoT)' : 'True Solar Time (LST = Clock Time + 4 × (Local Longitude - Std Longitude) + EoT)'}</div>
                <div><strong>{isVi ? 'Phương Trình Thời Gian (EoT):' : 'Equation of Time (EoT):'}</strong> {isVi ? 'Bù trừ độ nghiêng trục và quỹ đạo elip của Trái Đất (±16 phút)' : 'Compensates for orbital eccentricity and axial tilt (±16 min)'}</div>
                <div><strong>{isVi ? 'Nhật Chủ & Thập Thần:' : 'Day Master & Ten Gods:'}</strong> {isVi ? 'Tương tác ngũ hành Thập Thần cổ điển (Ấn, Thực Thương, Tài, Quan)' : 'Classical Shi Shen elemental interactions (Resource, Output, Wealth, Officer)'}</div>
              </div>
            </article>

            {/* 3. Tu Vi Dau So */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '3. Ma Trận Thập Nhị Cung Tử Vi Đẩu Số' : '3. Tử Vi Đẩu Số Classical 12-Palace Matrix'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Lập lá số 12 cung và an sao chính phái theo thuật toán Lịch Vạn Niên Hồ Ngọc Đức và cổ thư đời Tống (Tử Vi Đẩu Số Toàn Thư).'
                  : 'Orthodox lunisolar palace chart and star assignment based on the Ho Ngoc Duc calendar algorithm and classical Song Dynasty canons (*Tử Vi Đẩu Số Toàn Thư*).'}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>{isVi ? 'Cơ Chế Âm Dương Lịch:' : 'Lunisolar Mechanics:'}</strong> {isVi ? 'Điểm Sóc thiên văn Jean Meeus xử lý chuẩn xác tháng nhuận' : 'Jean Meeus astronomical New Moon calculations resolving leap months (*tháng nhuận*)'}</div>
                <div><strong>{isVi ? 'Thiết Lập Cung:' : 'Palace Establishment:'}</strong> {isVi ? 'Cung Mệnh và Cung Thân an định theo tháng sinh âm lịch và Chi giờ sinh' : 'Life Palace (*Mệnh*) and Body Palace (*Thân*) established via lunar birth month and two-hour birth branch (*Chi giờ*)'}</div>
                <div><strong>{isVi ? 'Ngũ Hành Cục & An Sao:' : 'Bureau & Star Placement:'}</strong> {isVi ? '5 Cục số, sao Tử Vi, sao Thiên Phủ, phụ tinh và Tứ Hóa (Khoa, Quyền, Lộc, Kỵ)' : '5 Elemental Bureaus (*Cục*), Emperor Star (*Tử Vi*), Treasury Star (*Thiên Phủ*), Auxiliary Stars, and 4 Transformation Stars (*Tứ Hóa*: Khoa, Quyền, Lộc, Kỵ)'}</div>
                <div><strong>{isVi ? 'Chu Kỳ Đại Hạn:' : 'Decadal Luck:'}</strong> {isVi ? 'Đại hạn 10 năm chuyển thuận/nghịch theo Dương Nam Âm Nữ / Âm Nam Dương Nữ' : '10-Year Major Luck Cycles (*Đại Hạn*) moving clockwise for Yang Male/Yin Female, counter-clockwise for Yin Male/Yang Female'}</div>
              </div>
            </article>

            {/* 4. Numerology & Divination */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '4. Thần Số Học & Biểu Tượng Chiêm Đoán' : '4. Numerology & Symbolic Divination Canons'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Minh bạch hóa các trường phái toán học song song mà không áp đặt giáo điều chủ quan.'
                  : 'Rigorous multi-lineage exposure preserving mathematical heritage without arbitrary dogma.'}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>{isVi ? 'Thần Số Học Pythagore:' : 'Pythagorean Life Path Dual Standard:'}</strong> {isVi ? 'Tính song song Công thức A (Tổng chữ số giữ Master 11, 22, 33) và Công thức B (Rút gọn độc lập từng chu kỳ)' : 'Exposes both Formula A (Full Digit Sum preserving Master Numbers 11, 22, 33) and Formula B (Independent Period Reduction)'}</div>
                <div><strong>{isVi ? 'Ánh Xạ Quẻ Chu Dịch:' : 'I Ching Archetypal Mapping:'}</strong> {isVi ? 'Chuỗi biến dịch nhị phân 6-bit (2⁶ = 64 quẻ); minh bạch phân định là mô hình nghiên cứu thử nghiệm' : '6-bit binary progression states ($2^6 = 64$) of the *Zhouyi*; explicitly identified as an exploratory prototype model'}</div>
              </div>
            </article>

            {/* 5. Empirical Evaluation & Ledger Protocol */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '5. Giao Thức Đánh Giá Thực Nghiệm & Sổ Cái SHA-256' : '5. Empirical Evaluation Protocol & SHA-256 State Ledger'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Thực thi cơ chế khóa dự đoán triển vọng để triệt tiêu thiên lệch hồi tố, đo lường bằng quy tắc chấm điểm toán học.'
                  : 'Enforces strict prospective locking to eliminate hindsight bias, evaluated against proper scoring rules.'}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><strong>{isVi ? 'Sổ Cái Khóa Mật Mã:' : 'Prospective Ledger:'}</strong> {isVi ? 'Đăng ký trước dự đoán với mã băm SHA-256 trước khi khoảng thời gian quan sát bắt đầu' : 'Pre-registers predictive claims with SHA-256 digests before outcome windows open'}</div>
                <div><strong>{isVi ? 'Thang Đo Brier Loss:' : 'Proper Scoring Rule:'}</strong> Brier = (1/N) * Σ (f_t - o_t)² {isVi ? 'với hình phạt bình phương cho các nhận định tự tin thái quá nhưng sai lệch' : 'with quadratic penalties for overconfident failures'}</div>
                <div><strong>{isVi ? 'Đối Chiếu Baseline:' : 'Empirical Benchmark:'}</strong> {isVi ? 'So sánh với điểm ngẫu nhiên 0.2500 và tỷ lệ nền lịch sử' : 'Evaluated against the uncalibrated coin-flip null baseline (0.2500) and historical base rates'}</div>
              </div>
            </article>

            {/* 6. Public REST API Endpoints */}
            <article className="matrix-editorial-card">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--celestial-gold)', marginBottom: '0.75rem' }}>
                {isVi ? '6. Đặc Tả REST API Của Converglyph' : '6. Converglyph REST API Reference'}
              </h3>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/health</span> — {isVi ? 'Trạng thái động cơ, phiên bản Swiss Ephemeris và danh sách môn phái' : 'Engine status, Swiss Ephemeris version, and supported canons'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/methodologies</span> — {isVi ? 'Sổ quy chuẩn phương pháp với trích dẫn kinh điển' : 'Versioned methodology registry with canonical rule citations'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/calculate</span> — {isVi ? 'Tính toán hợp nhất 6 chủ đề và trích xuất mệnh đề nguyên tử' : 'Normalized 6-theme vectors and atomic canonical claims'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/compare</span> — {isVi ? 'Tổng hợp đối chiếu chuyên sâu Đông–Tây (Tử Vi & Chiêm Tinh)' : 'Deep East-West comparative synthesis (Tu Vi & Western Astrology)'}</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/tuvi</span> — {isVi ? 'Lập lá số 12 cung Tử Vi, an sao và chu kỳ đại hạn' : 'Authentic 12-palace calculation, stars, and major luck decades'}</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/astro</span> — {isVi ? 'Bản đồ sao phương Tây và hệ thống nhà Placidus chuẩn xác' : 'High-precision Western planetary chart and Placidus houses'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/outcomes</span> — {isVi ? 'Sổ cái dự đoán thực nghiệm, đường cong hiệu chuẩn & Brier loss' : 'Empirical prediction ledger, calibration curves & Brier score'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>POST /api/ledger/lock</span> — {isVi ? 'Khóa mật mã SHA-256 đăng ký dự đoán triển vọng' : 'Cryptographic SHA-256 prospective prediction registration'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/ledger/verify/:id</span> — {isVi ? 'Kiểm toán mật mã và tái tính toán mã băm tức thì' : 'Cryptographic audit and on-the-fly digest recomputation'}</div>
                <div><span style={{ color: 'var(--celestial-gold)' }}>GET  /api/articles</span> — {isVi ? 'Chuyên đề phương pháp luận nghiên cứu (song ngữ en/vi)' : 'Methodology monographs (bilingual en/vi)'}</div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
