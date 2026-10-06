import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Moon, 
  Trees, 
  Compass, 
  Feather, 
  Building, 
  Flame, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { CATEGORIES, COLOR_PALETTES } from '../data/curatedWallpapers';

const iconMap = {
  Sparkles,
  Zap,
  Moon,
  Trees,
  Compass,
  Feather,
  Building,
  Flame
};

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  totalResults,
  isLiveApi,
  onResetFilters
}) {
  const hasActiveFilters = selectedCategory !== 'all' || selectedColor !== '';

  return (
    <div className="filter-container">
      <div className="filter-bar-card">
        {/* Categories Pills */}
        <div className="categories-scroll">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-bar: Color filter and result stats */}
        <div className="filter-sub-bar">
          <div className="color-chips-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={14} color="var(--text-dim)" />
              <span className="color-label">Color Mood:</span>
            </div>

            {COLOR_PALETTES.map((colorItem) => {
              const isSelected = selectedColor === colorItem.value;
              return (
                <button
                  key={colorItem.name}
                  type="button"
                  className={`color-chip ${isSelected ? 'active' : ''} ${!colorItem.value ? 'color-chip-all' : ''}`}
                  style={colorItem.hex ? { backgroundColor: colorItem.hex } : {}}
                  onClick={() => setSelectedColor(colorItem.value)}
                  title={colorItem.name}
                />
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="icon-btn"
                style={{ padding: '4px 10px', fontSize: '11px', marginLeft: '6px' }}
                title="Reset filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="filter-results-info">
            <span className={`source-badge ${isLiveApi ? 'live' : 'curated'}`}>
              {isLiveApi ? 'Live Pexels Feed' : 'Curated Master Collection'}
            </span>
            <span>
              <strong>{totalResults}</strong> wallpapers found
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
