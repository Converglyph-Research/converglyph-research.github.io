import React from 'react';

/**
 * Robust Markdown-to-HTML Parser with Table Support
 */
export function formatAiMarkdown(md: string): string {
  if (!md) return '';
  let html = md;

  // Protect intentional line breaks
  html = html.replace(/<br\s*\/?>/gi, '___AIMD_BR___');
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/___AIMD_BR___/g, '<br/>');

  // Fenced Code blocks
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gim, (_, __, code) => {
    return `<pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; margin: 1rem 0;"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(217,193,143,0.15); color: var(--celestial-gold); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h5 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--celestial-gold); margin: 1rem 0 0.4rem;"><span style="color: var(--color-western);">▫</span> $1</h5>');
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--celestial-gold); margin: 1.35rem 0 0.5rem;"><span style="color: var(--color-western);">✦</span> $1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--moon-ivory); margin: 1.6rem 0 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;"><span style="color: var(--celestial-gold);">⚜</span> $1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--moon-ivory); margin: 1.85rem 0 0.85rem;">$1</h2>');

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
        theadHtml += `<th style="text-align:${align}; padding: 0.65rem 0.85rem; border-bottom: 2px solid rgba(217,193,143,0.3); color: var(--celestial-gold); font-family: var(--font-mono); font-size: 0.8rem;">${col}</th>`;
      });
      theadHtml += '</tr></thead>';

      let tbodyHtml = '<tbody>';
      dataLines.forEach(row => {
        if (!row.trim()) return;
        const cols = splitRow(row);
        tbodyHtml += '<tr style="border-bottom: 1px solid rgba(245,240,232,0.08);">';
        headerCols.forEach((_, i) => {
          const align = aligns[i] || 'left';
          const val = cols[i] !== undefined ? cols[i] : '';
          tbodyHtml += `<td style="text-align:${align}; padding: 0.6rem 0.85rem; font-size: 0.85rem; color: #cbd5e1;">${val}</td>`;
        });
        tbodyHtml += '</tr>';
      });
      tbodyHtml += '</tbody>';

      return `<div style="overflow-x: auto; margin: 1.25rem 0; border: 1px solid var(--border-subtle); border-radius: 8px; background: rgba(0,0,0,0.25);"><table style="width: 100%; border-collapse: collapse;">${theadHtml}${tbodyHtml}</table></div>`;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const isTableRow = trimmed.length > 0 && trimmed.includes('|') && !trimmed.startsWith('<h') && !trimmed.startsWith('<blockquote') && !trimmed.startsWith('<pre');

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
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.4rem 0;"><span style="color: var(--celestial-gold);">•</span><span>$1</span></div>');

  // Numbered Lists
  html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.4rem 0;"><span style="color: var(--color-western); font-weight: 600; font-family: var(--font-mono);">$1.</span><span>$2</span></div>');

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
  // Method selection (user picks 1 method or unified synthesis)
  const [selectedMethod, setSelectedMethod] = React.useState<'unified' | 'tuvi' | 'astro' | 'bazi' | 'numerology'>('unified');
  const [selectedAspect, setSelectedAspect] = React.useState<string>('all');
  const [selectedModel, setSelectedModel] = React.useState<string>('openai/gpt-oss-120b');
  const [aiLang, setAiLang] = React.useState<'vi' | 'en'>(isVietnamese ? 'vi' : 'en');

  // Aspect options tailored to each method
  const methodAspects: Record<string, Array<{ id: string; labelEn: string; labelVi: string }>> = {
    unified: [
      { id: 'all', labelEn: 'Complete Convergence & Divergence', labelVi: 'Hợp Nhất Toàn Diện 4 Hệ Thống' },
      { id: 'career', labelEn: 'Vocation & Wealth Consensus', labelVi: 'Đồng Thuận Sự Nghiệp & Tài Bạch' },
      { id: 'intellect', labelEn: 'Cognitive Architecture & Philosophy', labelVi: 'Trí Tuệ & Thế Giới Quan Cốt Lõi' },
      { id: 'relationships', labelEn: 'Relational Contracts & Tension', labelVi: 'Tình Duyên & Điểm Mâu Thuẫn Hợp Đồng' }
    ],
    tuvi: [
      { id: 'all', labelEn: 'Full 12 Palaces Matrix', labelVi: 'Toàn Diện Thập Nhị Cung Tử Vi' },
      { id: 'menh_than', labelEn: 'Life & Body Palaces (Mệnh & Thân)', labelVi: 'Cung Mệnh & Cung Thân' },
      { id: 'career_wealth', labelEn: 'Career & Wealth (Quan Lộc & Tài Bạch)', labelVi: 'Cung Quan Lộc & Tài Bạch' },
      { id: 'marriage', labelEn: 'Spouse & Partnership (Phu Thê)', labelVi: 'Cung Phu Thê & Vận Tình Duyên' },
      { id: 'luck_cycles', labelEn: '10-Year Major Luck Cycles (Đại Hạn)', labelVi: 'Chu Kỳ Đại Hạn 10 Năm' }
    ],
    astro: [
      { id: 'all', labelEn: 'Planetary Wheel & Big Three', labelVi: 'Bản Đồ Sao & Bộ Ba Big Three' },
      { id: 'big_three', labelEn: 'Sun, Moon, Ascendant Dynamics', labelVi: 'Mặt Trời, Mặt Trăng & Cung Mọc' },
      { id: 'aspects', labelEn: 'Geometric Aspects & Orbs Matrix', labelVi: 'Mạng Lưới Góc Chiếu Hình Học' },
      { id: 'midheaven', labelEn: 'Midheaven (MC) & Vocational Zenith', labelVi: 'Thiên Đỉnh (MC) & Đỉnh Cao Vận Mệnh' },
      { id: 'houses', labelEn: '12 Placidus House Cusps', labelVi: 'Phân Tích 12 Cung Địa Bàn (Placidus)' }
    ],
    bazi: [
      { id: 'all', labelEn: 'Four Pillars & Elemental Flow', labelVi: 'Bát Tự Tứ Trụ & Dòng Chảy Ngũ Hành' },
      { id: 'day_master', labelEn: 'Day Master (Nhật Chủ) & Polarity', labelVi: 'Nhật Chủ & Khí Phách Bản Thể' },
      { id: 'elements_balance', labelEn: 'Five Elements Weighting (Ngũ Hành)', labelVi: 'Tỷ Lệ Phân Bổ Ngũ Hành & Dụng Thần' },
      { id: 'ten_gods', labelEn: 'Classical Ten Gods (Thập Thần)', labelVi: 'Thập Thần & Cơ Cấu Quyền Lực/Tài Lộc' }
    ],
    numerology: [
      { id: 'all', labelEn: 'Life Path Dual Linage & Expression', labelVi: 'Đường Đời Song Song & Con Số Biểu Đạt' },
      { id: 'master_vs_reduced', labelEn: 'Master Preservation vs Period Reduction', labelVi: 'Đối Chiếu Master 33/22/11 vs Rút Gọn' }
    ]
  };

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
      aiLang: aiLang
    });
  };

  return (
    <div className="matrix-editorial-card" style={{ marginBottom: '3.5rem', padding: '2.5rem 2.25rem' }}>
      {/* Studio Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-chip confirmed">Groq LPU CoT Studio</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Cross-Tradition Synthesis Engine</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--moon-ivory)', marginTop: '0.4rem' }}>
            {isVietnamese ? 'Phòng Nghiên Cứu Suy Luận AI & Hợp Nhất Đa Hệ Thống' : 'Multi-Tradition AI Reasoning & Convergence Studio'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isVietnamese
              ? `Khám phá chi tiết từng phương pháp hoặc hợp nhất dữ liệu từ nhiều trường phái cho ${subjectName} (${birthDateStr} • ${locationName}).`
              : `Deep Chain-of-Thought reasoning for individual canons or integrated cross-system convergence for ${subjectName}.`}
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

      {/* Control Grid: Method, Model, Language, and Aspect */}
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
            <option value="unified">🌌 Hợp Nhất Đa Môn Phái (Convergence Matrix)</option>
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

        {/* Control 3: Model Selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '3. Chọn Mô Hình LLM' : '3. Choose Reasoning Model'}
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

        {/* Control 4: AI Language */}
        <div>
          <label className="form-label" style={{ fontSize: '0.72rem' }}>
            {isVietnamese ? '4. Ngôn Ngữ Phản Hồi AI' : '4. AI Output Language'}
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
              ? 'Tính năng Hợp Nhất Đa Hệ Thống đòi hỏi kết quả từ ít nhất 2 môn phái trở lên để đối chiếu mức độ đồng thuận/mâu thuẫn. Vui lòng bật thêm phương pháp hoặc chọn luận giải riêng lẻ theo từng trường phái.'
              : 'Multi-Tradition Convergence requires results from at least 2 methods to compute cross-system agreement and divergence. Enable additional traditions or select a specific individual method above.'}
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
              ? 'Chọn phương pháp, khía cạnh trọng tâm, mô hình LLM và ngôn ngữ bạn mong muốn ở trên, sau đó nhấn "Khởi Chạy Suy Luận" để nhận bản luận giải chuyên sâu với bảng đối sánh Markdown hoàn chỉnh.'
              : 'Configure your method, specific aspect, LLM model, and response language above, then tap "Run Deep Reasoning" to stream comprehensive Chain-of-Thought synthesis with fully styled Markdown tables.'}
          </p>
        </div>
      )}
    </div>
  );
};
