'use client';

import React from 'react';
import Link from 'next/link';
import katex from 'katex';
import { ClientNavbarWrapper } from '@/components/layout/ClientNavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PrototypeNotice } from '@/components/layout/PrototypeNotice';
import { useLocale } from '@/lib/LocaleContext';

function MathBlock({ formula }: { formula: string }) {
  let html = '';
  try {
    html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
  } catch {
    html = `<div style="font-family: var(--font-mono); color: var(--celestial-gold); text-align: center;">${formula}</div>`;
  }
  return <div style={{ overflowX: 'auto', margin: '0.85rem 0' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function DocumentationPage() {
  const { locale } = useLocale();
  const isVi = (locale === 'vi');

  return (
    <>
      <PrototypeNotice />
      <ClientNavbarWrapper />

      <main className="section">
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Section Header */}
          <div className="section-editorial-header" style={{ marginBottom: '3rem' }}>
            <span className="section-editorial-eyebrow">
              {isVi ? 'CONVERGLYPH RESEARCH • HỆ THỐNG KỸ THUẬT & TOÁN HỌC' : 'Converglyph Research • Mathematical & Technical Specifications'}
            </span>
            <h1 className="section-editorial-title">
              {isVi ? 'Đặc Tả Kỹ Thuật Động Cơ & Công Thức Tính Toán' : 'Algorithmic Canons, Formulas & Engine Specifications'}
            </h1>
            <p className="section-editorial-desc">
              {isVi
                ? 'Tài liệu chi tiết về toàn bộ công thức toán học, cơ chế thiên văn học, thuật toán chu kỳ và giao thức đo lường định lượng được triển khai trên nền tảng Converglyph Research.'
                : 'Exhaustive documentation covering astronomical coordinate conversions, lunisolar calendar mechanics, sexagenary modulo arithmetic, and quantitative convergence vector scoring.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* 1. Astronomical Foundation & Julian Day */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '1. Nền Tảng Thiên Văn Học & Ngày Julius (Julian Day)' : '1. Astronomical Time Standards & Julian Day (JD)'}
                </h3>
                <span className="status-chip confirmed">Jean Meeus Standards</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Mọi vị trí hành tinh và tiết khí đều được quy đổi sang Ngày Julius thiên văn (Julian Ephemeris Day) theo công thức của nhà thiên văn Jean Meeus:'
                  : 'All orbital positions, solar terms, and day pillars are referenced against the Julian Ephemeris Day count calculated via Jean Meeus trigonometric algorithms:'}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Công thức Ngày Julius:' : 'Julian Day Equation:'}</strong>
                </div>
                <MathBlock formula="JD = \lfloor 365.25(Y' + 4716) \rfloor + \lfloor 30.6001(M' + 1) \rfloor + D + B - 1524.5 + \frac{UT}{24.0}" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {isVi
                    ? 'Với B là hệ số bù trừ thế kỷ Gregorian: B = 2 - A + ⌊A / 4⌋ (A = ⌊Y\' / 100⌋). Nếu tháng M ≤ 2: Y\' = Y - 1, M\' = M + 12.'
                    : 'Where B is the Gregorian century correction factor: B = 2 - A + ⌊A / 4⌋ (A = ⌊Y\' / 100⌋). If month M ≤ 2: Y\' = Y - 1, M\' = M + 12.'}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Giờ Mặt Trời Trung Bình Lịch Sử (LMT):' : 'Historical Local Mean Time (LMT):'}</strong>
                </div>
                <MathBlock formula="LMT = UTC + \frac{\lambda_{\text{east}}}{15.0^\circ} \text{ hours}" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {isVi
                    ? 'Trước khi múi giờ chuẩn quốc tế ra đời (giai đoạn 1884–1920), đồng hồ vận hành theo kinh độ địa phương: 1 giờ lệch tương ứng 15° kinh độ.'
                    : 'Prior to international standard timezones (1884–1920), clocks operated on local meridian transit: 1 hour corresponds to 15° of longitude.'}
                </div>
              </div>
            </article>

            {/* 2. Western Ephemeris & House Cusps */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '2. Chiêm Tinh Tây Phương (`pyswisseph`) & Góc Chiếu' : '2. Western Ephemeris Engine & Geometric Aspect Geometry'}
                </h3>
                <span className="status-chip confirmed">Swiss Ephemeris v2.10.3</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Tọa độ kinh độ hoàng đạo địa tâm dọc theo Tropical Zodiac, neo tại điểm Xuân Phân 0° Bạch Dương, áp dụng phân bán cung Placidus và sai số nghiêm ngặt:'
                  : 'Calculates sub-arcsecond geocentric ecliptic coordinates along the Tropical Zodiac anchored at 0° Aries, evaluated against Placidus semi-arc trisections:'}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Khoảng Cách Góc Chiếu (Angular Aspect Separation):' : 'Aspect Separation & Classical Orbs:'}</strong>
                </div>
                <MathBlock formula="\Delta \theta = \min(|\lambda_1 - \lambda_2|, \, 360^\circ - |\lambda_1 - \lambda_2|), \quad |\Delta \theta - \theta_{\text{target}}| \le \text{Orb}_{\max}" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
                  <div>• Conjunction (0°): ±8.0°</div>
                  <div>• Sextile (60°): ±6.0°</div>
                  <div>• Square (90°): ±7.0°</div>
                  <div>• Trine (120°): ±8.0°</div>
                  <div>• Opposition (180°): ±8.0°</div>
                </div>
              </div>
            </article>

            {/* 3. BaZi Solar Terms & True Solar Time */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '3. Bát Tự Tứ Trụ: 24 Tiết Khí & Giờ Mặt Trời Thực' : '3. Four Pillars of Destiny: True Solar Time & Solar Terms'}
                </h3>
                <span className="status-chip confirmed">Astronomical Solar Longitude</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Bát Tự thực chất là hệ thống lịch dương thiên văn dựa trên kinh độ của Mặt Trời. Điểm khởi đầu năm mới bắt đầu tại thời điểm Lập Xuân:'
                  : 'BaZi operates on the apparent ecliptic longitude of the Sun. The year transition strictly commences at the astronomical onset of Lichun:'}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Phương Trình Thời Gian (EoT) & Giờ Mặt Trời Thực (LST):' : 'Equation of Time (EoT) & Local Solar Time (LST):'}</strong>
                </div>
                <MathBlock formula="\text{LST} = \text{Clock Time} + 4 \times (\lambda_{\text{local}} - \lambda_{\text{standard}}) + \text{EoT}" />
                <MathBlock formula="\text{EoT} \approx 9.87 \sin(2B) - 7.53 \cos(B) - 1.5 \sin(B) \quad \left(B = \frac{360^\circ}{365}(d - 81)\right)" />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Số Dư Trụ Ngày (Day Pillar Sexagenary Modulo):' : 'Day Pillar Modulo Cycle:'}</strong>
                </div>
                <MathBlock formula="\text{Day Index} = (\lfloor JD \rfloor + 1) \pmod{60}, \quad \text{Stem} = \text{Index} \pmod{10}, \quad \text{Branch} = \text{Index} \pmod{12}" />
              </div>
            </article>

            {/* 4. Tu Vi Dau So Classical Matrix */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '4. Tử Vi Đẩu Số: Thuật Toán An 12 Cung & Sao Tử Vi' : '4. Tử Vi Đẩu Số: 12 Palaces & Star Placement Matrix'}
                </h3>
                <span className="status-chip confirmed">Ho Ngoc Duc Lunisolar Engine</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Vận hành trên lịch âm dương thiên văn (điểm Sóc Jean Meeus xử lý tháng nhuận). Cung Mệnh và Cung Thân được tính toán chính xác:'
                  : 'Operates on astronomical lunisolar New Moon conjunctions resolving leap months. Life and Body palaces are established deterministically:'}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Vị Trí Cung Mệnh & Thân:' : 'Life & Body Palace Formulas:'}</strong>
                </div>
                <MathBlock formula="\text{Branch}_{\text{Menh}} = (M_{\text{lunar}} - H_{\text{branch}} + 12) \pmod{12}" />
                <MathBlock formula="\text{Branch}_{\text{Than}} = (M_{\text{lunar}} + H_{\text{branch}}) \pmod{12}" />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'An Sao Tử Vi Theo Cục Số (Bureau Cục):' : 'Emperor Star (Tử Vi) Placement via Bureau:'}</strong>
                </div>
                <MathBlock formula="k = \lceil D / \text{Cuc} \rceil, \quad r = k \times \text{Cuc} - D, \quad \text{Pos} = (k \pm r) \pmod{12}" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {isVi
                    ? 'Với Cục ∈ {2 (Thủy), 3 (Mộc), 4 (Kim), 5 (Thổ), 6 (Hỏa)}. Nếu số dư r chẵn cộng vào k; nếu lẻ trừ đi r.'
                    : 'With Bureau ∈ {2, 3, 4, 5, 6}. If remainder r is even: add r to k; if odd: subtract r from k.'}
                </div>
              </div>
            </article>

            {/* 5. Pythagorean Numerology Dual Linage */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '5. Thần Số Học Pythagore: Hai Trường Phái Song Song' : '5. Pythagorean Numerology: Dual Linage Formulations'}
                </h3>
                <span className="status-chip confirmed">Dual Reduction Standards</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Công Thức A (Bảo Tồn Số Master 11, 22, 33):' : 'Formula A (Full Digit Sum / Master Preservation):'}</strong>
                </div>
                <MathBlock formula="S = \sum d_i \quad \text{nếu } S \in \{11, 22, 33\} \implies \text{Life Path} = S" />
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Công Thức B (Rút Gọn Độc Lập Từng Chu Kỳ):' : 'Formula B (Independent Period Reduction):'}</strong>
                </div>
                <MathBlock formula="\text{Life Path}_B = \text{reduce}(\text{reduce}(Y) + \text{reduce}(M) + \text{reduce}(D)) \in [1, 9]" />
              </div>
            </article>

            {/* 6. Convergence Matrix Mathematical Synthesis */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '6. Ma Trận Hội Tụ: Đo Lường Điểm Đồng Thuận & Brier Loss' : '6. Convergence Matrix Scoring & Empirical Brier Loss'}
                </h3>
                <span className="status-chip confirmed">Proper Scoring Rules</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1rem' }}>
                {isVi
                  ? 'Đo lường mức độ đồng thuận giữa các hệ thống biểu tượng dựa trên phương sai phân cực trọng số vector:'
                  : 'Measures multi-tradition directional alignment using weighted vector standard deviation across domains:'}
              </p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Chỉ Số Đồng Thuận Ý Nghĩa (Consensus Index C):' : 'Consensus Index Formula (C):'}</strong>
                </div>
                <MathBlock formula="C = 1 - \frac{\sigma_v}{\sigma_{\max}} = 1 - \frac{\sqrt{\frac{\sum w_i (v_i - \bar{v})^2}{\sum w_i}}}{1.45}" />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {isVi
                    ? 'Với vᵢ ∈ [-0.80, +1.00] là vector phương hướng năng lượng, wᵢ là trọng số tin cậy của quy tắc, và σₘₐₓ = 1.45 là biên độ phân kỳ cực đại.'
                    : 'Where vᵢ ∈ [-0.80, +1.00] is directional valence, wᵢ is tradition confidence weight, and σₘₐₓ = 1.45 is the maximum variance boundary.'}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
                  <strong>{isVi ? 'Thang Đo Dự Báo Thực Nghiệm (Brier Score Loss):' : 'Empirical Forecast Scoring Rule (Brier Loss):'}</strong>
                </div>
                <MathBlock formula="\text{Brier Score} = \frac{1}{N} \sum_{t=1}^N (f_t - o_t)^2, \quad \text{Baseline Null} = 0.2500" />
              </div>
            </article>

            {/* 7. Public REST API Endpoints */}
            <article className="matrix-editorial-card" style={{ padding: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--celestial-gold)' }}>
                  {isVi ? '7. Danh Mục Endpoint REST API Toàn Diện' : '7. Complete Converglyph REST API Gateway'}
                </h3>
                <span className="status-chip confirmed">RESTful OpenAPI Spec</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.8' }}>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/health</span> — {isVi ? 'Trạng thái động cơ, phiên bản Swiss Ephemeris và danh sách môn phái' : 'Engine status, Swiss Ephemeris version, and supported canons'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>GET  /api/methodologies</span> — {isVi ? 'Sổ quy chuẩn phương pháp với trích dẫn kinh điển' : 'Versioned methodology registry with canonical rule citations'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/calculate</span> — {isVi ? 'Tính toán hợp nhất 6 chủ đề, chữ ký SHA-256 và mệnh đề nguyên tử' : 'Normalized 6-theme vectors, SHA-256 digest and atomic canonical claims'}</div>
                <div><span style={{ color: 'var(--color-western)' }}>POST /api/compare</span> — {isVi ? 'Tổng hợp đối chiếu chuyên sâu Đông–Tây (Tử Vi & Chiêm Tinh)' : 'Deep East-West comparative synthesis (Tu Vi & Western Astrology)'}</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/tuvi</span> — {isVi ? 'Lập lá số 12 cung Tử Vi, an sao và chu kỳ đại hạn' : 'Authentic 12-palace calculation, stars, and major luck decades'}</div>
                <div><span style={{ color: 'var(--color-bazi)' }}>POST /api/astro</span> — {isVi ? 'Bản đồ sao phương Tây và hệ thống nhà Placidus chuẩn xác' : 'High-precision Western planetary chart and Placidus houses'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/profiles</span> — {isVi ? 'Danh sách hồ sơ tính toán đã lưu trong cơ sở dữ liệu SQLite' : 'List saved calculation runs from SQLite database'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/profile/load/:id</span> — {isVi ? 'Tải lại kết quả tính toán chi tiết đã lưu' : 'Load stored calculation payload without recalculating'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/outcomes</span> — {isVi ? 'Sổ cái dự đoán thực nghiệm, đường cong hiệu chuẩn & Brier loss' : 'Empirical prediction ledger, calibration curves & Brier score'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>POST /api/ledger/lock</span> — {isVi ? 'Khóa mật mã SHA-256 đăng ký dự đoán triển vọng' : 'Cryptographic SHA-256 prospective prediction registration'}</div>
                <div><span style={{ color: 'var(--emerald-accent)' }}>GET  /api/ledger/verify/:id</span> — {isVi ? 'Kiểm toán mật mã và tái tính toán mã băm tức thì' : 'Cryptographic audit and on-the-fly digest recomputation'}</div>
                <div><span style={{ color: 'var(--celestial-gold)' }}>POST /api/ai/reasoning</span> — {isVi ? 'Cổng suy luận AI Groq LPU có kiểm soát ranh giới deterministic' : 'Gated Groq LPU AI Reasoning Proxy with deterministic confinement'}</div>
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
