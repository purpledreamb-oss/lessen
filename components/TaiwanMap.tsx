'use client';

import { useState } from 'react';
import { TAIWAN_MAP_REGIONS, TAIWAN_MAP_VIEWBOX } from '@/lib/taiwan-map-data';

interface TaiwanMapProps {
  selectedCity: string | null;
  helperCounts: Record<string, number>;
  onCitySelect: (city: string | null) => void;
}

export default function TaiwanMap({ selectedCity, helperCounts, onCitySelect }: TaiwanMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="taiwan-map-container">
      <svg
        viewBox={TAIWAN_MAP_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        className="taiwan-map-svg"
        role="img"
        aria-label="台灣地圖 — 點選縣市篩選幫手"
      >
        {TAIWAN_MAP_REGIONS.map((region) => {
          const isSelected = selectedCity === region.name;
          const isHovered = hoveredCity === region.name;
          const count = helperCounts[region.name] || 0;

          return (
            <g
              key={region.name}
              onClick={() => onCitySelect(isSelected ? null : region.name)}
              onMouseEnter={() => setHoveredCity(region.name)}
              onMouseLeave={() => setHoveredCity(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCitySelect(isSelected ? null : region.name);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${region.name}（${count} 位幫手）`}
              aria-pressed={isSelected}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <path
                d={region.path}
                fill={isSelected ? 'var(--sage)' : isHovered ? 'var(--sage-light)' : '#e8e0d4'}
                stroke="var(--sage)"
                strokeWidth={isSelected || isHovered ? 2 : 1}
                style={{ transition: 'fill 0.2s, stroke-width 0.2s' }}
              />
              {(isHovered || isSelected) && (
                <text
                  x={region.labelX}
                  y={region.labelY - 12}
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="600"
                  fill="var(--text)"
                  pointerEvents="none"
                >
                  {region.name}
                  {count > 0 && ` (${count})`}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {selectedCity && (
        <button
          className="map-clear-btn"
          onClick={() => onCitySelect(null)}
        >
          清除選擇：{selectedCity} ✕
        </button>
      )}
    </div>
  );
}
