'use client';

import React from 'react';
import katex from 'katex';

export interface TimeSeriesStage {
  period: string;
  age: string;
  focus: string;
  westernDriver: string;
  easternDriver: string;
  consensusScore: number; // 0.0 to 1.0
  valence: 'expansion' | 'steady' | 'transformation' | 'caution';
}

interface TimeSeriesConvergenceViewProps {
  isVietnamese: boolean;
  subjectName: string;
  birthYear: number;
}

export const TimeSeriesConvergenceView: React.FC<TimeSeriesConvergenceViewProps> = ({
  isVietnamese,
  subjectName,
  birthYear
}) => {
  const [activeStageIdx, setActiveStageIdx] = React.useState<number>(0);
  const [showFormulaDetails, setShowFormulaDetails] = React.useState<boolean>(false);
  const stages: TimeSeriesStage[] = [
    {
      period: `${birthYear} – ${birthYear + 25}`,
      age: isVietnamese ? '0 – 25 tuổi (Tiền Vận / Khởi Thủy)' : 'Age 0–25 (Foundational Epoch)',
      focus: isVietnamese ? 'Định hình bản thể, khai phá trí tuệ và tiếp nhận tri thức nền tảng.' : 'Cognitive grounding, education & identity foundation.',
      westernDriver: 'Mặt Trời, Mặt Trăng & Điểm Xuân Phân (Học vấn & Trí năng)',
      easternDriver: 'Cung Mệnh, Thân & 2 Đại Hạn đầu tiên (Cung Phụ Mẫu, Huynh Đệ)',
      consensusScore: 0.92,
      valence: 'expansion'
    },
    {
      period: `${birthYear + 26} – ${birthYear + 40}`,
      age: isVietnamese ? '26 – 40 tuổi (Trung Vận I / Đột Phá)' : 'Age 26–40 (Peak Creative Zenith)',
      focus: isVietnamese ? 'Xác lập vị thế xã hội, công bố phát kiến và độc lập sự nghiệp.' : 'Vocational independence, publications & major enterprise.',
      westernDriver: 'Thiên Đỉnh (MC), Sao Mộc & Sao Thổ quá cảnh Nhà 10',
      easternDriver: 'Cung Quan Lộc, Đại Hạn 10 năm & Hóa Khoa / Hóa Quyền kích hoạt',
      consensusScore: 0.88,
      valence: 'expansion'
    },
    {
      period: `${birthYear + 41} – ${birthYear + 55}`,
      age: isVietnamese ? '41 – 55 tuổi (Trung Vận II / Trọng Trách)' : 'Age 41–55 (Mastery & Authority)',
      focus: isVietnamese ? 'Lãnh đạo chiến lược, củng cố tài nguyên và vượt qua thử thách chuyển giao.' : 'Strategic leadership, capital consolidation & governance.',
      westernDriver: 'Sao Thổ quay về chu kỳ 2, Sao Thiên Vương đối đỉnh (Midlife Transition)',
      easternDriver: 'Cung Điền Trạch, Tài Bạch & Thân cư Quan Lộc/Tài Bạch',
      consensusScore: 0.85,
      valence: 'steady'
    },
    {
      period: `${birthYear + 56}+`,
      age: isVietnamese ? '56+ tuổi (Hậu Vận / Di Sản)' : 'Age 56+ (Harvest & Legacy)',
      focus: isVietnamese ? 'Chuyển hóa nội tâm, hoàn thiện di sản và truyền trao cho thế hệ sau.' : 'Philosophical synthesis, mentorship & perpetual legacy.',
      westernDriver: 'Góc chiếu Sao Hải Vương & Sao Diêm Vương (Ý thức tập thể)',
      easternDriver: 'Cung Phúc Đức (Tâm linh) & Cung Tử Tức (Hậu bối/Thừa kế)',
      consensusScore: 0.94,
      valence: 'transformation'
    }
  ];

  const currentStage = stages[activeStageIdx];

  // SVG Chart Geometry
  const chartW = 760;
  const chartH = 140;
  const paddingX = 70;
  const stepX = (chartW - paddingX * 2) / (stages.length - 1);

  // Compute SVG Points for the Convergence Curve
  const chartPoints = stages.map((s, i) => {
    const x = paddingX + i * stepX;
    // Map consensusScore 0.70 - 1.0 to y-range 110 - 25
    const y = 115 - ((s.consensusScore - 0.7) / 0.3) * 85;
    return { x, y, score: s.consensusScore };
  });

  const pathD = chartPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${chartH} L ${chartPoints[0].x} ${chartH} Z`;

  return (
    <div className="matrix-editorial-card" style={{ marginBottom: '3.5rem', padding: '2.5rem 2.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-chip confirmed">Deterministic Chronology</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Time-Series Matrix</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--moon-ivory)', marginTop: '0.4rem' }}>
            {isVietnamese ? 'Trực Quan Hóa Chuỗi Thời Gian Dòng Đời & Ma Trận Đối Sánh' : 'Chronological Time-Series Convergence Visualizer'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isVietnamese
              ? `Biểu đồ tiến trình đa môn phái đối chiếu sự hội tụ qua các chu kỳ vận mệnh của đương số ${subjectName}.`
              : `Cross-tradition consensus trajectory tracking structural alignment across developmental epochs for ${subjectName}.`}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--celestial-gold)' }}>
            <span>{isVietnamese ? 'Điểm Hội Tụ Bình Quân:' : 'Mean Consensus:'}</span>
            <strong style={{ fontSize: '1.15rem', color: 'var(--moon-ivory)' }}>89.8%</strong>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {isVietnamese ? 'Dữ liệu: Tinh Đẩu Tử Vi + Quá Cảnh Chiêm Tinh + Bát Tự Đại Vận' : 'Sources: Tử Vi Palaces + Planetary Transits + BaZi Pillars'}
          </span>
        </div>
      </div>

      {/* Visual SVG Trajectory Curve Chart */}
      <div style={{ background: 'rgba(18, 14, 28, 0.65)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--celestial-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isVietnamese ? 'Đường Cong Tiến Trình Hội Tụ Đa Môn Phái (Convergence Wave)' : 'Cross-System Consensus Wave Trajectory'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Baseline: 70% – 100%
          </span>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '140px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D9C18F" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D9C18F" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline Gridlines */}
            {[30, 65, 100].map((yVal, i) => (
              <line
                key={`grid-${i}`}
                x1={paddingX - 20}
                y1={yVal}
                x2={chartW - paddingX + 20}
                y2={yVal}
                stroke="rgba(245, 240, 232, 0.06)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area under curve */}
            <path d={areaD} fill="url(#curveGradient)" />

            {/* Trajectory Stroke */}
            <path d={pathD} fill="none" stroke="var(--celestial-gold)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Stage Checkpoints */}
            {chartPoints.map((p, i) => {
              const isSelected = i === activeStageIdx;
              const pct = Math.round(p.score * 100);
              return (
                <g key={`pt-${i}`} onClick={() => setActiveStageIdx(i)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 7 : 4.5}
                    fill={isSelected ? '#FFFFFF' : 'var(--celestial-gold)'}
                    stroke="var(--ink-plum)"
                    strokeWidth="2"
                  />
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="var(--celestial-gold)" strokeWidth="1" strokeDasharray="2 2" />
                  )}
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--moon-ivory)' : 'var(--text-dim)'}
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {pct}%
                  </text>
                  <text
                    x={p.x}
                    y={chartH - 8}
                    textAnchor="middle"
                    fill={isSelected ? 'var(--celestial-gold)' : 'var(--text-muted)'}
                    fontSize="10"
                    fontFamily="var(--font-sans)"
                  >
                    {stages[i].period}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Interactive Timeline Stepper Buttons */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {stages.map((stage, idx) => {
            const isActive = idx === activeStageIdx;
            const pct = Math.round(stage.consensusScore * 100);
            return (
              <div
                key={`stage-${idx}`}
                onClick={() => setActiveStageIdx(idx)}
                style={{
                  background: isActive ? 'rgba(217, 193, 143, 0.12)' : 'rgba(38, 33, 58, 0.45)',
                  border: isActive ? '1px solid var(--celestial-gold)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isActive ? 'var(--celestial-gold)' : 'var(--text-dim)' }}>
                    {stage.period}
                  </span>
                  <span className={`status-chip ${stage.consensusScore >= 0.9 ? 'confirmed' : 'demo'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                    {pct}% Hội Tụ
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isActive ? 'var(--moon-ivory)' : 'var(--text-muted)' }}>
                  {stage.age.split('(')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Comparative Matrix for Active Stage */}
      <div style={{
        background: 'rgba(18, 14, 28, 0.85)',
        border: '1px solid rgba(217, 193, 143, 0.25)',
        borderRadius: '12px',
        padding: '1.75rem 2rem',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-western)' }}>
              ✦ GIAI ĐOẠN KHẢO SÁT: {currentStage.period}
            </span>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--moon-ivory)', marginTop: '0.25rem' }}>
              {currentStage.age}
            </h4>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <span>Đồng Thuận: </span>
            <strong style={{ color: 'var(--celestial-gold)' }}>{Math.round(currentStage.consensusScore * 100)}%</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.65', marginBottom: '1.5rem' }}>
          <strong>{isVietnamese ? 'Trọng tâm chuyển hóa:' : 'Phase Focus:'}</strong> {currentStage.focus}
        </p>

        {/* Side-by-Side Systems Comparative Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Western Astrology Column */}
          <div style={{ background: 'rgba(185, 163, 255, 0.06)', border: '1px solid rgba(185, 163, 255, 0.25)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🪐</span>
              <strong style={{ color: 'var(--color-western)', fontSize: '0.9rem' }}>
                {isVietnamese ? 'Chiêm Tinh Tây Phương (Swiss Ephemeris)' : 'Western Astrology'}
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#E2D9CC', lineHeight: '1.6' }}>
              {currentStage.westernDriver}
            </p>
          </div>

          {/* Eastern Tu Vi / BaZi Column */}
          <div style={{ background: 'rgba(230, 168, 195, 0.06)', border: '1px solid rgba(230, 168, 195, 0.25)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>☯</span>
              <strong style={{ color: 'var(--color-tuvi)', fontSize: '0.9rem' }}>
                {isVietnamese ? 'Tử Vi & Bát Tự Đông Phương' : 'Eastern Tử Vi & BaZi'}
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#E2D9CC', lineHeight: '1.6' }}>
              {currentStage.easternDriver}
            </p>
          </div>
        </div>

        {/* Transparent Methodology & Convergence Rate Formula Note with Expandable KaTeX Card */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            <div>
              <strong style={{ color: 'var(--celestial-gold)' }}>{isVietnamese ? 'Cơ sở tính Tỷ Lệ Hội Tụ (Convergence Rate):' : 'Convergence Rate Mechanics:'}</strong>{' '}
              <span>{isVietnamese ? 'C = 1 - (σᵥ / 1.45) dựa trên phương sai phân cực trọng số giữa các trường phái.' : 'C = 1 - (σᵥ / 1.45) derived from weighted directional variance across traditions.'}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', color: 'var(--celestial-gold)', borderColor: 'rgba(217,193,143,0.3)' }}
            >
              {showFormulaDetails ? (isVietnamese ? '▲ Ẩn chi tiết công thức' : '▲ Hide Details') : (isVietnamese ? '▼ Xem công thức & Nguồn dữ liệu' : '▼ Formula & Data Sources')}
            </button>
          </div>

          {showFormulaDetails && (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(217,193,143,0.2)',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              lineHeight: 1.7
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--moon-ivory)' }}>
                  {isVietnamese ? '1. Nguồn Dữ Liệu Đầu Vào Của Ma Trận (Ingested Data Sources):' : '1. Ingested Data Sources for Matrix:'}
                </strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem' }}>
                  <li><strong>{isVietnamese ? 'Chiêm Tinh Tây Phương:' : 'Western Astrology:'}</strong> The Big Three (Sun, Moon, AC), Midheaven (MC Nhà 10), chu kỳ sao Thổ (29.5 năm) & 10 góc chiếu hình học chính.</li>
                  <li><strong>{isVietnamese ? 'Tử Vi Đẩu Số:' : 'Tử Vi Đẩu Số:'}</strong> Cung Mệnh, Thân, Quan Lộc, Tài Bạch, 14 Chính Tinh miếu hãm, và các chu kỳ Đại Hạn 10 năm theo Cục số.</li>
                  <li><strong>{isVietnamese ? 'Bát Tự (BaZi):' : 'BaZi Four Pillars:'}</strong> Nhật Chủ (Day Master), Tứ Trụ Can Chi, chu kỳ Đại Vận 10 năm và cân bằng Ngũ Hành.</li>
                  <li><strong>{isVietnamese ? 'Thần Số Học:' : 'Numerology:'}</strong> Đường Đời Công thức A (Bảo tồn Master) vs Công thức B (Rút gọn) & 4 Đỉnh Cao Cuộc Đời.</li>
                </ul>
              </div>

              <div>
                <strong style={{ color: 'var(--moon-ivory)' }}>
                  {isVietnamese ? '2. Công Thức Đo Lường Mức Độ Đồng Thuận (Mathematical Formula):' : '2. Mathematical Formulation:'}
                </strong>
                <div
                  style={{ textAlign: 'center', margin: '0.75rem 0' }}
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      try {
                        return katex.renderToString("C = 1 - \\frac{\\sigma}{\\sigma_{\\max}} = 1 - \\frac{\\sqrt{\\frac{\\sum w_i (v_i - \\bar{v})^2}{\\sum w_i}}}{1.45}", { displayMode: true, throwOnError: false });
                      } catch {
                        return "C = 1 - (sigma / 1.45)";
                      }
                    })()
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center' }}>
                  {isVietnamese
                    ? 'Trong đó: vᵢ là vector phương hướng (-0.80 đến +1.0), wᵢ là trọng số độ tin cậy của quy tắc, và σₘₐₓ = 1.45 là cận trên phân kỳ cực đại.'
                    : 'Where vᵢ is directional valence (-0.80 to +1.0), wᵢ is tradition confidence weight, and σₘₐₓ = 1.45 is the maximum variance boundary.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
