'use client';

import React from 'react';
import { DomainScore } from '@/lib/types';

interface RadarChartProps {
  scores: Record<string, DomainScore>;
  activeTraditions: { w: boolean; b: boolean; t: boolean; n: boolean };
}

const LIFE_THEMES = [
  "Intellect & First Principles",
  "Vocation & Autonomy",
  "Material Resources",
  "Personal Well-being",
  "Partnership & Covenant",
  "Inner Transformation"
];

export const RadarChart: React.FC<RadarChartProps> = ({ scores, activeTraditions }) => {
  const radius = 135;
  const numAxes = LIFE_THEMES.length;
  const angleStep = (Math.PI * 2) / numAxes;

  const rings = [0.25, 0.5, 0.75, 1.0];

  const layers: Array<{ key: 'w' | 'b' | 't' | 'n'; color: string; fill: string }> = [
    { key: 'w', color: '#B9A3FF', fill: 'rgba(185, 163, 255, 0.12)' },
    { key: 'b', color: '#D9C18F', fill: 'rgba(217, 193, 143, 0.12)' },
    { key: 't', color: '#E6A8C3', fill: 'rgba(230, 168, 195, 0.10)' },
    { key: 'n', color: '#8AE0DB', fill: 'rgba(138, 224, 219, 0.10)' }
  ];

  return (
    <div style={{ width: '100%', height: '340px' }}>
      <svg
        id="main-radar-svg"
        viewBox="-220 -220 440 440"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        role="img"
        aria-label="Multi-tradition polar radar chart comparing Western, BaZi, Tu Vi, and Numerology across six life themes"
      >
        {/* Concentric Web Rings */}
        {rings.map((rScale, idx) => {
          const pts = LIFE_THEMES.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * (radius * rScale);
            const y = Math.sin(angle) * (radius * rScale);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          return (
            <polygon
              key={`ring-${idx}`}
              points={pts}
              fill={idx === rings.length - 1 ? 'rgba(18, 24, 36, 0.45)' : 'none'}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes and Labels */}
        {LIFE_THEMES.map((theme, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const labelX = Math.cos(angle) * (radius + 24);
          const labelY = Math.sin(angle) * (radius + 18);

          return (
            <g key={`axis-${theme}`}>
              <line
                x1="0"
                y1="0"
                x2={x.toFixed(1)}
                y2={y.toFixed(1)}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="2 2"
              />
              <text
                x={labelX.toFixed(1)}
                y={labelY.toFixed(1)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="10px"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {theme}
              </text>
            </g>
          );
        })}

        {/* Tradition Polygon Layers */}
        {layers.map(layer => {
          if (!activeTraditions[layer.key]) return null;

          const polyPoints = LIFE_THEMES.map((theme, i) => {
            const scoreObj = scores[theme] || { w: 0.75, b: 0.75, t: 0.75, n: 0.75 };
            const val = scoreObj[layer.key] ?? 0.75;
            const angle = i * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * (radius * val);
            const y = Math.sin(angle) * (radius * val);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          return (
            <g key={`layer-${layer.key}`}>
              <polygon
                points={polyPoints}
                fill={layer.fill}
                stroke={layer.color}
                strokeWidth="1.6"
              />
              {LIFE_THEMES.map((theme, i) => {
                const scoreObj = scores[theme] || { w: 0.75, b: 0.75, t: 0.75, n: 0.75 };
                const val = scoreObj[layer.key] ?? 0.75;
                const angle = i * angleStep - Math.PI / 2;
                const x = Math.cos(angle) * (radius * val);
                const y = Math.sin(angle) * (radius * val);

                return (
                  <circle
                    key={`dot-${layer.key}-${i}`}
                    cx={x.toFixed(1)}
                    cy={y.toFixed(1)}
                    r="2.5"
                    fill={layer.color}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
