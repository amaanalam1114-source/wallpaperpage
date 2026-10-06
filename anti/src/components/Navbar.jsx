import React from 'react';
import { Monitor, Smartphone, Layers, Key, Heart, Sparkles } from 'lucide-react';

export default function Navbar({
  deviceFilter,
  setDeviceFilter,
  favoritesCount,
  onOpenFavorites,
  onOpenApiKeyModal,
  isLiveApi
}) {
  return (
    <header className="navbar">
      {/* Top Bar on Mobile / Full Bar on Desktop */}
      <div className="navbar-top-row">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => setDeviceFilter('all')}>
          <div className="brand-logo-icon">
            <Sparkles size={18} />
          </div>
          <div className="brand-text-container">
            <span className="brand-title">LUMINA</span>
            <span className="brand-subtitle">Studio</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="navbar-actions">
          {/* Pexels API status badge */}
          <button
            type="button"
            className="api-status-badge"
            onClick={onOpenApiKeyModal}
            title="Configure Pexels API Key"
          >
            <span className={`status-dot ${isLiveApi ? 'active' : 'demo'}`} />
            <Key size={13} />
            <span className="nav-label-desktop">{isLiveApi ? 'Pexels API Live' : 'Pexels Key'}</span>
            <span className="nav-label-mobile">{isLiveApi ? 'Live' : 'Key'}</span>
          </button>

          {/* Favorites Drawer Toggle */}
          <button
            type="button"
            className="icon-btn fav-nav-btn"
            onClick={onOpenFavorites}
            title="View saved wallpapers"
          >
            <Heart
              size={15}
              color={favoritesCount > 0 ? '#f43f5e' : 'currentColor'}
              fill={favoritesCount > 0 ? '#f43f5e' : 'none'}
            />
            <span className="nav-label-desktop">Favorites</span>
            {favoritesCount > 0 && (
              <span className="fav-count-pill">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Symmetrical Segmented Device Switcher */}
      <nav className="device-toggle-bar" aria-label="Device Wallpaper Filter">
        <button
          type="button"
          className={`device-toggle-btn ${deviceFilter === 'all' ? 'active' : ''}`}
          onClick={() => setDeviceFilter('all')}
          title="Browse all wallpaper formats"
        >
          <Layers size={14} />
          <span className="nav-label-desktop">All Formats</span>
          <span className="nav-label-mobile">All</span>
        </button>

        <button
          type="button"
          className={`device-toggle-btn ${deviceFilter === 'landscape' ? 'active desktop' : ''}`}
          onClick={() => setDeviceFilter('landscape')}
          title="Filter landscape 4K & Ultrawide Desktop wallpapers"
        >
          <Monitor size={14} />
          <span className="nav-label-desktop">Desktop 4K</span>
          <span className="nav-label-mobile">Desktop</span>
        </button>

        <button
          type="button"
          className={`device-toggle-btn ${deviceFilter === 'portrait' ? 'active mobile' : ''}`}
          onClick={() => setDeviceFilter('portrait')}
          title="Filter portrait 9:16 OLED Mobile wallpapers"
        >
          <Smartphone size={14} />
          <span className="nav-label-desktop">Mobile OLED</span>
          <span className="nav-label-mobile">Mobile</span>
        </button>
      </nav>
    </header>
  );
}
