import React from 'react';
import katex from 'katex';

/**
 * Robust Markdown-to-HTML Parser with Full LaTeX Math Support ($ and $$) and Table Support
 */
export function formatAiMarkdown(md: string): string {
  if (!md) return '';
  let html = md;
  // Sanitize unicode thin spaces often emitted by LLMs in LaTeX formulas
  html = html.replace(/[\u202F\u00A0\u200B]/g, ' ');

  // 1. Render Display Math: both $$...$$ and \[...\] with KaTeX before HTML character escaping
  html = html.replace(/\\\[([\s\S]+?)\\\]/g, (_, equation) => {
    try {
      return `<div class="katex-display-wrapper" style="overflow-x: auto; margin: 1rem 0; padding: 0.5rem 0; text-align: center;">${katex.renderToString(equation.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div style="text-align: center; font-family: var(--font-mono); margin: 0.75rem 0; color: var(--celestial-gold);">${equation}</div>`;
    }
  });
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, equation) => {
    try {
      return `<div class="katex-display-wrapper" style="overflow-x: auto; margin: 1rem 0; padding: 0.5rem 0; text-align: center;">${katex.renderToString(equation.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div style="text-align: center; font-family: var(--font-mono); margin: 0.75rem 0; color: var(--celestial-gold);">${equation}</div>`;
    }
  });

  // 2. Render Inline Math: both \(...\) and $...$ with KaTeX
  html = html.replace(/\\\(([\s\S]+?)\\\)/g, (_, equation) => {
    try {
      return katex.renderToString(equation.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<code style="font-family: var(--font-mono); color: var(--celestial-gold);">${equation}</code>`;
    }
  });
  html = html.replace(/\$([^\$\n]+?)\$/g, (_, equation) => {
    try {
      return katex.renderToString(equation.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `<code style="font-family: var(--font-mono); color: var(--celestial-gold);">${equation}</code>`;
    }
  });
  // Protect intentional line breaks
  html = html.replace(/<br\s*\/?>/gi, '___AIMD_BR___');

  // Fenced Code blocks
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gim, (_, __, code) => {
    const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; margin: 1rem 0;"><code>${escapedCode.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(217,193,143,0.15); color: var(--celestial-gold); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h5 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--celestial-gold); margin: 1.1rem 0 0.4rem;"><span style="color: var(--color-western);">▫</span> $1</h5>');
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--celestial-gold); margin: 1.45rem 0 0.55rem;"><span style="color: var(--color-western);">✦</span> $1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: var(--font-serif); font-size: 1.55rem; color: var(--moon-ivory); margin: 1.75rem 0 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.45rem;"><span style="color: var(--celestial-gold);">⚜</span> $1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--moon-ivory); margin: 2rem 0 0.95rem;">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="color: var(--moon-ivory); font-weight: 600;">$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em style="color: var(--celestial-gold-bright);">$1</em>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--celestial-gold); padding: 0.6rem 1rem; margin: 0.85rem 0; background: rgba(217,193,143,0.06); font-style: italic; color: #E2D9CC;">$1</blockquote>');

  // Horizontal Rules
  html = html.replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid var(--border-subtle); margin: 1.5rem 0;" />');

  // Process Markdown Tables
  function processMarkdownTables(text: string): string {
    const lines = text.split('\n');
    const out: string[] = [];
    let tableLines: string[] = [];
    let inTable = false;

    function isSeparatorLine(l: string) {
      return /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(l.trim());
    }

    function splitRow(row: string) {
      let s = row.trim();
      if (s.startsWith('|')) s = s.slice(1);
      if (s.endsWith('|')) s = s.slice(0, -1);
      return s.split('|').map(col => col.trim());
    }

    function renderTable(tLines: string[]): string {
      if (tLines.length < 2 || !isSeparatorLine(tLines[1])) {
        return tLines.join('\n');
      }
      const headerCols = splitRow(tLines[0]);
      const sepCols = splitRow(tLines[1]);
      const dataLines = tLines.slice(2);

      const aligns = sepCols.map(c => {
        const left = c.startsWith(':');
        const right = c.endsWith(':');
        if (left && right) return 'center';
        if (right) return 'right';
        return 'left';
      });

      let theadHtml = '<thead><tr>';
      headerCols.forEach((col, i) => {
        const align = aligns[i] || 'left';
        theadHtml += `<th style="text-align:${align}; padding: 0.75rem 0.95rem; border-bottom: 2px solid rgba(217,193,143,0.35); color: var(--celestial-gold); font-family: var(--font-mono); font-size: 0.8rem; background: rgba(38,33,58,0.5);">${col}</th>`;
      });
      theadHtml += '</tr></thead>';

      let tbodyHtml = '<tbody>';
      dataLines.forEach((row, rIdx) => {
        if (!row.trim()) return;
        const cols = splitRow(row);
        const bgRow = rIdx % 2 === 1 ? 'background: rgba(255,255,255,0.02);' : '';
        tbodyHtml += `<tr style="border-bottom: 1px solid rgba(245,240,232,0.08); ${bgRow}">`;
        headerCols.forEach((_, i) => {
          const align = aligns[i] || 'left';
          const val = cols[i] !== undefined ? cols[i] : '';
          tbodyHtml += `<td style="text-align:${align}; padding: 0.65rem 0.95rem; font-size: 0.85rem; color: #cbd5e1; line-height: 1.5;">${val}</td>`;
        });
        tbodyHtml += '</tr>';
      });
      tbodyHtml += '</tbody>';

      return `<div style="overflow-x: auto; margin: 1.5rem 0; border: 1px solid var(--border-subtle); border-radius: 10px; background: rgba(0,0,0,0.35); box-shadow: 0 4px 16px rgba(0,0,0,0.3);"><table style="width: 100%; border-collapse: collapse; text-align: left;">${theadHtml}${tbodyHtml}</table></div>`;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const isTableRow = trimmed.length > 0 && trimmed.includes('|') && !trimmed.startsWith('<h') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<pre') && !trimmed.startsWith('<div');

      if (isTableRow) {
        tableLines.push(line);
        inTable = true;
      } else {
        if (inTable) {
          out.push(renderTable(tableLines));
          tableLines = [];
          inTable = false;
        }
        out.push(line);
      }
    }
    if (inTable) {
      out.push(renderTable(tableLines));
    }
    return out.join('\n');
  }

  html = processMarkdownTables(html);

  // Bullet Lists
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<div style="display: flex; gap: 0.6rem; margin: 0.45rem 0; align-items: baseline;"><span style="color: var(--celestial-gold); font-size: 0.85em;">•</span><div style="flex: 1;">$1</div></div>');

  // Numbered Lists
  html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div style="display: flex; gap: 0.6rem; margin: 0.45rem 0; align-items: baseline;"><span style="color: var(--color-western); font-weight: 600; font-family: var(--font-mono); font-size: 0.85em;">$1.</span><div style="flex: 1;">$2</div></div>');

  html = html.replace(/___AIMD_BR___/g, '<br/>');

  return html;
}

export interface AiReasoningStudioProps {
  isVietnamese: boolean;
  subjectName: string;
  birthDateStr: string;
  locationName: string;
  synthesisData: any;
  activeMethodsCount: number;
  onRunReasoning: (params: {
    method: 'unified' | 'tuvi' | 'astro' | 'bazi' | 'numerology';
    aspect: string;
    model: string;
    aiLang: 'vi' | 'en';
    timeHorizon: 'whole_life' | 'youth' | 'middle_age' | 'senior' | 'current_decade' | 'upcoming_year';
  }) => void;
  reasoningText: string;
  isLoading: boolean;
}

export const AiReasoningStudio: React.FC<AiReasoningStudioProps> = ({
  isVietnamese,
  subjectName,
  birthDateStr,
  locationName,
  synthesisData,
  activeMethodsCount,
  onRunReasoning,
  reasoningText,
  isLoading
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'unified' | 'tuvi' | 'astro' | 'bazi' | 'numerology'>('unified');
  const [selectedAspect, setSelectedAspect] = React.useState<string>('all');
  const [selectedModel, setSelectedModel] = React.useState<string>('openai/gpt-oss-120b');
  const [aiLang, setAiLang] = React.useState<'vi' | 'en'>(isVietnamese ? 'vi' : 'en');
  const [timeHorizon, setTimeHorizon] = React.useState<'whole_life' | 'youth' | 'middle_age' | 'senior' | 'current_decade' | 'upcoming_year'>('whole_life');

  // Aspect options tailored to each method
  const methodAspects: Record<string, Array<{ id: string; labelEn: string; labelVi: string }>> = {
    unified: [
      { id: 'all', labelEn: 'Complete Convergence & Divergence Matrix', labelVi: 'Hợp Nhất Toàn Diện Ma Trận Đồng Thuận & Phân Kỳ' },
      { id: 'career_wealth', labelEn: 'Vocation, Authority & Wealth Consensus', labelVi: 'Đồng Thuận Sự Nghiệp, Quyền Uy & Tài Bạch' },
      { id: 'intellect_innovation', labelEn: 'Cognitive Architecture & First Principles', labelVi: 'Trí Tuệ Sáng Tạo & Nguyên Lý Cốt Lõi' },
      { id: 'partnership_relationships', labelEn: 'Relational Contracts & Tension Points', labelVi: 'Hôn Nhân & Điểm Mâu Thuẫn Tình Duyên' },
      { id: 'vitality_pacing', labelEn: 'Somatic Vitality & Energetic Rhythm', labelVi: 'Sức Khỏe Thể Chất & Nhịp Điệu Năng Lượng' }
    ],
    tuvi: [
      { id: 'all', labelEn: 'Full 12 Palaces Matrix Overview', labelVi: 'Toàn Bộ Thập Nhị Cung Tinh Bàn' },
      { id: 'menh_than', labelEn: 'Life & Body Palaces (Mệnh & Thân)', labelVi: 'Cung Mệnh & Cung Thân (Bản Thể Cốt Lõi)' },
      { id: 'career_quan', labelEn: 'Career Palace & Command Stars (Quan Lộc)', labelVi: 'Cung Quan Lộc & Các Sao Quyền Tinh' },
      { id: 'wealth_tai', labelEn: 'Wealth Palace & Cash Flow (Tài Bạch)', labelVi: 'Cung Tài Bạch & Kho Tàng Tài Lộc' },
      { id: 'spouse_phu', labelEn: 'Spouse & Marriage Contracts (Phu Thê)', labelVi: 'Cung Phu Thê & Duyên Nợ Phối Ngẫu' },
      { id: 'mind_phuc', labelEn: 'Ancestral Mind & Spirit (Phúc Đức)', labelVi: 'Cung Phúc Đức & Tâm Thức Di Sản' },
      { id: 'decadal_cycles', labelEn: '10-Year Major Luck Cycles (Đại Hạn)', labelVi: 'Vận Trình 10 Năm Đại Hạn & Tiểu Hạn' }
    ],
    astro: [
      { id: 'all', labelEn: 'Full Astrodienst Wheel & Big Three', labelVi: 'Bản Đồ Sao Tây Phương & The Big Three' },
      { id: 'big_three', labelEn: 'Sun, Moon, Ascendant Core Dynamics', labelVi: 'Mặt Trời, Mặt Trăng & Cung Mọc (AC)' },
      { id: 'midheaven_zenith', labelEn: 'Midheaven (MC) & 10th House Vocation', labelVi: 'Thiên Đỉnh (MC) & Vị Thế Công Chúng' },
      { id: 'aspects_matrix', labelEn: 'Geometric Aspects & Orbs Matrix', labelVi: 'Mạng Lưới Góc Chiếu Hình Học (Aspects)' },
      { id: 'houses_cusps', labelEn: '12 Placidus House Cusps Breakdown', labelVi: 'Phân Tích 12 Cung Địa Bàn Placidus' },
      { id: 'retrogrades', labelEn: 'Planetary Speeds & Retrogrades (℞)', labelVi: 'Hành Tinh Nghịch Hành & Tốc Độ Quỹ Đạo' }
    ],
    bazi: [
      { id: 'all', labelEn: 'Four Pillars & Elemental Dynamic Balance', labelVi: 'Bát Tự Tứ Trụ & Dòng Chảy Ngũ Hành' },
      { id: 'day_master', labelEn: 'Day Master (Nhật Chủ) Strength & Root', labelVi: 'Nhật Chủ, Can Chi & Thấu Can' },
      { id: 'elements_flow', labelEn: 'Five Elements Weighting (Ngũ Hành Khuyết/Vượng)', labelVi: 'Cân Bằng Ngũ Hành & Tỷ Lệ Sinh Khắc' },
      { id: 'ten_gods', labelEn: 'Classical Ten Gods (Thập Thần Cấu Trúc)', labelVi: 'Thập Thần (Ấn, Thực, Tài, Quan)' },
      { id: 'favorable_god', labelEn: 'Useful God (Dụng Thần & Hỷ Thần)', labelVi: 'Tìm Dụng Thần & Hỷ Thần Cải Vận' }
    ],
    numerology: [
      { id: 'all', labelEn: 'Life Path Dual Lineage & Core Numbers', labelVi: 'Đường Đời Song Song & Các Con Số Cốt Lõi' },
      { id: 'master_reduction', labelEn: 'Master Number 11/22/33 vs Period Reduction', labelVi: 'Đối Chiếu Bảo Tồn Master vs Rút Gọn Chu Kỳ' },
      { id: 'expression_soul', labelEn: 'Expression & Soul Urge Numbers', labelVi: 'Chỉ Số Sứ Mệnh & Khao Khát Linh Hồn' },
      { id: 'personal_years', labelEn: 'Pinnacles, Challenges & Personal Year Cycles', labelVi: '4 Đỉnh Cao Cuộc Đời & Năm Cá Nhân' }
    ]
  };

  const timeHorizons = [
    { id: 'whole_life', labelEn: 'Entire Lifetime Continuum (Toàn Bộ Cuộc Đời)', labelVi: 'Toàn Bộ Dòng Đời (Tổng Quan)' },
    { id: 'youth', labelEn: 'Foundational Years (0 – 25 years old)', labelVi: 'Tiền Vận / Giai Đoạn Đầu (0 – 25 tuổi)' },
    { id: 'middle_age', labelEn: 'Peak Manifestation (26 – 50 years old)', labelVi: 'Trung Vận / Đỉnh Cao Sự Nghiệp (26 – 50 tuổi)' },
    { id: 'senior', labelEn: 'Legacy & Harvest (51+ years old)', labelVi: 'Hậu Vận / An Hưởng & Di Sản (51+ tuổi)' },
    { id: 'current_decade', labelEn: 'Active 10-Year Epoch / Major Luck Cycle', labelVi: 'Đại Hạn 10 Năm Hiện Tại' },
    { id: 'upcoming_year', labelEn: 'Immediate Annual Window (Năm Trước Mắt)', labelVi: 'Tiểu Hạn / Vận Trình Năm Tới' }
  ] as const;

  const models = [
    { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B (Deep CoT Reasoning - Recommended)' },
    { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B (Fast Inference)' },
    { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B (High-Precision Multilingual)' }
  ];

  const currentAspectList = methodAspects[selectedMethod] || methodAspects.unified;
  const isUnifiedLocked = selectedMethod === 'unified' && activeMethodsCount < 2;

  const handleRun = () => {
    onRunReasoning({
      method: selectedMethod,
      aspect: selectedAspect,
      model: selectedModel,
      aiLang: aiLang,
      timeHorizon: timeHorizon
    });
  };

  return (
    <div className="matrix-editorial-card" style={{ marginBottom: '3.5rem', padding: '2.5rem 2.25rem' }}>
      {/* Studio Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-chip confirmed">Groq LPU CoT Studio</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Cross-Tradition Synthesis & Time-Series Engine</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--moon-ivory)', marginTop: '0.4rem' }}>
            {isVietnamese ? 'Phòng Nghiên Cứu Suy Luận AI & Hợp Nhất Đa Hệ Thống' : 'Multi-Tradition AI Reasoning & Convergence Studio'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isVietnamese
              ? `Đối sánh đa môn phái theo chuỗi thời gian dòng đời (Time Series) cho ${subjectName} (${birthDateStr} • ${locationName}).`
              : `Deep Chain-of-Thought cross-examination across life stages and canonical aspects for ${subjectName}.`}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={isLoading || isUnifiedLocked}
          onClick={handleRun}
          style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>{isLoading ? '⏳' : '🧠'}</span>
          <span>{isLoading ? (isVietnamese ? 'Đang suy luận...' : 'Synthesizing...') : (isVietnamese ? 'Khởi Chạy Suy Luận' : 'Run Deep Reasoning')}</span>
        </button>
      </div>

      {/* Control Grid: Method, Aspect, Time-Series Horizon, Model, and Language */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Control 1: Method Selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '1. Chọn Hệ Thống Luận Giải' : '1. Select Calculation Method'}
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => {
              const m = e.target.value as any;
              setSelectedMethod(m);
              setSelectedAspect('all');
            }}
            className="select-editorial"
            style={{ width: '100%' }}
          >
            <option value="unified">🌌 Hợp Nhất Đa Môn Phái (Convergence Matrix - ≥2 methods)</option>
            <option value="tuvi">☯ Tử Vi Đẩu Số 12 Cung (Song Dynasty Matrix)</option>
            <option value="astro">🪐 Chiêm Tinh Tây Phương (Swiss Ephemeris Wheel)</option>
            <option value="bazi">🎋 Bát Tự Tứ Trụ (Solar Terms & Ten Gods)</option>
            <option value="numerology">🔢 Thần Số Học (Pythagorean Dual Lineage)</option>
          </select>
        </div>

        {/* Control 2: Specific Aspect */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '2. Khía Cạnh Trọng Tâm' : '2. Specific Aspect to Deep-Dive'}
          </label>
          <select
            value={selectedAspect}
            onChange={(e) => setSelectedAspect(e.target.value)}
            className="select-editorial"
            style={{ width: '100%' }}
          >
            {currentAspectList.map(a => (
              <option key={a.id} value={a.id}>
                {isVietnamese ? a.labelVi : a.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Control 3: Time-Series Horizon */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '3. Chu Kỳ Dòng Đời (Time Series)' : '3. Life Stage / Time Series Horizon'}
          </label>
          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value as any)}
            className="select-editorial"
            style={{ width: '100%' }}
          >
            {timeHorizons.map(th => (
              <option key={th.id} value={th.id}>
                {isVietnamese ? th.labelVi : th.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Control 4: Model Selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '4. Chọn Mô Hình LLM' : '4. Choose Reasoning Model'}
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="select-editorial"
            style={{ width: '100%' }}
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Control 5: AI Language */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '5. Ngôn Ngữ Phản Hồi AI' : '5. AI Output Language'}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn-toggle-pill ${aiLang === 'vi' ? 'active' : ''}`}
              onClick={() => setAiLang('vi')}
              style={{ flex: 1, padding: '0.45rem' }}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              type="button"
              className={`btn-toggle-pill ${aiLang === 'en' ? 'active' : ''}`}
              onClick={() => setAiLang('en')}
              style={{ flex: 1, padding: '0.45rem' }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Warning if Unified mode selected with < 2 methods available */}
      {isUnifiedLocked && (
        <div style={{
          background: 'rgba(217, 193, 143, 0.1)',
          border: '1px solid rgba(217, 193, 143, 0.35)',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          fontSize: '0.825rem',
          color: 'var(--celestial-gold-bright)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span>⚠</span>
          <span>
            {isVietnamese
              ? `Hiện tại bạn đang bật ${activeMethodsCount} môn phái. Tính năng Hợp Nhất Đa Hệ Thống yêu cầu kết quả từ ít nhất 2 môn phái trở lên để đối chiếu mức độ đồng thuận/mâu thuẫn. Vui lòng bật thêm phương pháp ở góc trên hoặc chọn luận giải riêng lẻ theo từng trường phái.`
              : `Currently only ${activeMethodsCount} method is active. Multi-Tradition Convergence requires at least 2 active methods to compute cross-system agreement and divergence. Enable additional traditions above or select a single canon to deep-dive.`}
          </span>
        </div>
      )}

      {/* Stream / Rendered CoT View */}
      {reasoningText ? (
        <div
          style={{
            background: 'rgba(18, 14, 28, 0.85)',
            border: '1px solid rgba(217, 193, 143, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            fontSize: '0.925rem',
            color: 'var(--moon-ivory)',
            lineHeight: 1.8,
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.4)',
            overflowX: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: formatAiMarkdown(reasoningText) }}
        />
      ) : (
        <div style={{
          background: 'rgba(26, 21, 40, 0.45)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            {selectedMethod === 'tuvi' ? '☯' : selectedMethod === 'astro' ? '🪐' : selectedMethod === 'bazi' ? '🎋' : selectedMethod === 'numerology' ? '🔢' : '🌌'}
          </div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
            {isVietnamese ? 'Sẵn Sàng Khởi Chạy Suy Luận Đa Hệ Thống' : 'Ready for Multi-Tradition CoT Inference'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            {isVietnamese
              ? 'Chọn phương pháp, khía cạnh trọng tâm, chu kỳ thời gian (Time Series), mô hình LLM và ngôn ngữ bạn mong muốn ở trên, sau đó nhấn "Khởi Chạy Suy Luận" để nhận bản luận giải chuyên sâu với công thức toán học KaTeX và bảng đối sánh Markdown hoàn chỉnh.'
              : 'Configure your method, specific aspect, life stage time-series, LLM model, and response language above, then tap "Run Deep Reasoning" to stream comprehensive Chain-of-Thought synthesis with KaTeX-rendered mathematics and styled comparison tables.'}
          </p>
        </div>
      )}
    </div>
  );
};
