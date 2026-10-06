import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { POPULAR_TAGS } from '../data/curatedWallpapers';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  onSearch,
  deviceFilter,
  setDeviceFilter
}) {
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localInput);
  };

  const handleClear = () => {
    setLocalInput('');
    onSearch('');
  };

  const handleTagClick = (tag) => {
    setLocalInput(tag);
    onSearch(tag);
  };

  const getPlaceholder = () => {
    if (deviceFilter === 'landscape') return 'Search 4K desktop wallpapers...';
    if (deviceFilter === 'portrait') return 'Search OLED phone wallpapers...';
    return 'Search wallpapers (e.g. Cyberpunk, OLED)...';
  };

  return (
    <section className="hero-section">
      <div className="hero-pill-badge">
        <Sparkles size={13} />
        <span>Pexels 4K UHD & OLED Mobile</span>
      </div>

      <h1 className="hero-title">
        Breathtaking Wallpapers for{' '}
        <span className="hero-title-highlight">Every Display.</span>
      </h1>

      <p className="hero-description">
        Immerse your desktop in crystal-clear 4K landscapes and upgrade your smartphone with ultra-deep OLED blacks.
      </p>

      {/* Expressive Search Bar */}
      <form onSubmit={handleSubmit} className="search-container">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={getPlaceholder()}
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
          />
          {localInput && (
            <button
              type="button"
              onClick={handleClear}
              className="search-clear-btn"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
          <button type="submit" className="search-submit-btn">
            <span>Explore</span>
          </button>
        </div>
      </form>

      {/* Popular quick tags */}
      <div className="quick-tags-wrapper">
        <span className="quick-tag-label">Trending:</span>
        <div className="quick-tags-scroll">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`quick-tag-pill ${searchQuery.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
