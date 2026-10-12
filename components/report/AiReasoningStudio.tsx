import React from 'react';

/**
 * Lightweight, resilient Markdown-to-HTML parser for AI Chain-of-Thought
 * Handles headers, bold/italics, code blocks, bullet points, and tables
 */
export function formatAiMarkdown(md: string): string {
  if (!md) return '';
  let html = md;

  // Protect newlines
  html = html.replace(/<br\s*\/?>/gi, '___AIMD_BR___');
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/___AIMD_BR___/g, '<br/>');

  // Code blocks
  html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gim, (_, __, code) => {
    return `<pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; margin: 1rem 0;"><code>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(217,193,143,0.15); color: var(--celestial-gold); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--celestial-gold); margin: 1.25rem 0 0.5rem;"><span style="color: var(--color-western);">✦</span> $1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--moon-ivory); margin: 1.5rem 0 0.65rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.4rem;"><span style="color: var(--celestial-gold);">⚜</span> $1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-family: var(--font-serif); font-size: 1.7rem; color: var(--moon-ivory); margin: 1.75rem 0 0.75rem;">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong style="color: var(--moon-ivory); font-weight: 600;">$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em style="color: var(--celestial-gold-bright);">$1</em>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--celestial-gold); padding: 0.5rem 1rem; margin: 0.75rem 0; background: rgba(217,193,143,0.06); font-style: italic; color: #E2D9CC;">$1</blockquote>');

  // Horizontal Rules
  html = html.replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid var(--border-subtle); margin: 1.5rem 0;" />');

  // Bullet Lists
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.35rem 0;"><span style="color: var(--celestial-gold);">•</span><span>$1</span></div>');

  // Numbered Lists
  html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div style="display: flex; gap: 0.5rem; margin: 0.35rem 0;"><span style="color: var(--color-western); font-weight: 600; font-family: var(--font-mono);">$1.</span><span>$2</span></div>');

  return html;
}

interface AiReasoningStudioProps {
  isVietnamese: boolean;
  subjectName: string;
  birthDateStr: string;
  locationName: string;
  synthesisData: any;
  onRunReasoning: (mode: 'all' | 'tuvi' | 'astro' | 'bazi' | 'convergence') => void;
  reasoningText: string;
  isLoading: boolean;
}

export const AiReasoningStudio: React.FC<AiReasoningStudioProps> = ({
  isVietnamese,
  subjectName,
  birthDateStr,
  locationName,
  synthesisData,
  onRunReasoning,
  reasoningText,
  isLoading
}) => {
  const [selectedAspect, setSelectedAspect] = React.useState<'all' | 'tuvi' | 'astro' | 'bazi' | 'convergence'>('all');

  const aspects = [
    { id: 'all', icon: '🌌', labelEn: 'Unified Convergence & Divergence', labelVi: 'Hợp Nhất Đa Môn Phái & Đối Sánh' },
    { id: 'tuvi', icon: '☯', labelEn: 'Tử Vi 12 Palaces & Star Lights', labelVi: 'Chi Tiết 12 Cung & Tinh Đạo Tử Vi' },
    { id: 'astro', icon: '🪐', labelEn: 'Western Planetary Wheel & Angles', labelVi: 'Bản Đồ Sao & Góc Chiếu Tây Phương' },
    { id: 'bazi', icon: '🎋', labelEn: 'BaZi Stems, Branches & Elements', labelVi: 'Bát Tự Tứ Trụ & Cân Bằng Ngũ Hành' },
    { id: 'convergence', icon: '⚖', labelEn: 'Quantitative Agreement & Conflict', labelVi: 'Định Lượng Đồng Thuận vs Mâu Thuẫn' }
  ] as const;

  return (
    <div className="matrix-editorial-card" style={{ marginBottom: '3.5rem', padding: '2.25rem' }}>
      {/* Studio Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-chip confirmed">Groq LPU 120B CoT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Chain-of-Thought Engine</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--moon-ivory)', marginTop: '0.4rem' }}>
            {isVietnamese ? 'Phòng Suy Luận Đa Hệ Thống & Đối Sánh Biểu Tượng' : 'Multi-Tradition AI Reasoning & Convergence Studio'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isVietnamese
              ? `Luận giải chuyên sâu theo từng trường phái hoặc hợp nhất toàn diện cho đương số ${subjectName} (${birthDateStr} • ${locationName}).`
              : `Deep Chain-of-Thought synthesis evaluating individual canons or unified cross-system convergence for ${subjectName}.`}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={isLoading}
          onClick={() => onRunReasoning(selectedAspect)}
          style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>{isLoading ? '⏳' : '🧠'}</span>
          <span>{isLoading ? (isVietnamese ? 'Đang suy luận đa tầng...' : 'Synthesizing Stream...') : (isVietnamese ? 'Khởi Chạy Suy Luận Sâu' : 'Run Deep Reasoning')}</span>
        </button>
      </div>

      {/* Aspect Switcher Tabs */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          {isVietnamese ? 'Chọn khía cạnh luận giải & kiểm tra:' : 'Select inquiry focus & canonical aspect:'}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {aspects.map((asp) => (
            <button
              key={asp.id}
              type="button"
              className={`btn-toggle-pill ${selectedAspect === asp.id ? 'active' : ''}`}
              onClick={() => setSelectedAspect(asp.id)}
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            >
              <span>{asp.icon}</span>{' '}
              <span>{isVietnamese ? asp.labelVi : asp.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stream / Rendered CoT View */}
      {reasoningText ? (
        <div
          style={{
            background: 'rgba(18, 14, 28, 0.75)',
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
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌌</div>
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--moon-ivory)', marginBottom: '0.5rem' }}>
            {isVietnamese ? 'Sẵn Sàng Khởi Chạy Suy Luận Đa Hệ Thống' : 'Ready for Multi-Tradition CoT Inference'}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
            {isVietnamese
              ? 'Mô hình sẽ thu thập dữ liệu tính toán chính xác từ 4 động cơ (Tử Vi, Chiêm Tinh Tây Phương, Bát Tự, Thần Số Học) để phân tích chi tiết từng góc cạnh, tìm ra điểm đồng thuận kỳ diệu và vạch rõ những mâu thuẫn cần lưu ý.'
              : 'The model ingests exact coordinate arrays from all active engines (Tu Vi, Western Astrodienst, BaZi, Numerology) to evaluate specific aspects, surface miraculous convergences, and delineate doctrinal divergences.'}
          </p>
        </div>
      )}
    </div>
  );
};
