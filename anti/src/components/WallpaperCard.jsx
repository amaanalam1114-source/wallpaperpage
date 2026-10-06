import React, { useState } from 'react';
import { Monitor, Smartphone, Heart, Download, Maximize2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WallpaperCard({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onSelectWallpaper,
  onDownload
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isLandscape = wallpaper.orientation === 'landscape';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(wallpaper);
    if (!isFavorite) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#fda4af']
      });
    }
  };

  const handleQuickDownload = (e) => {
    e.stopPropagation();
    onDownload(wallpaper, 'original');
  };

  const imageSrc = isLandscape
    ? (wallpaper.src.landscape || wallpaper.src.large || wallpaper.src.medium)
    : (wallpaper.src.portrait || wallpaper.src.large || wallpaper.src.medium);

  return (
    <div
      className={`wallpaper-card ${isLandscape ? 'is-landscape' : 'is-portrait'}`}
      onClick={() => onSelectWallpaper(wallpaper)}
      style={{
        '--card-glow': wallpaper.avg_color || '#1e293b'
      }}
    >
      <div
        className="wallpaper-card-image-wrap"
        style={{ backgroundColor: wallpaper.avg_color || '#111827' }}
      >
        {/* Badges on top-left */}
        <div className="card-top-badges">
          <span className={`card-badge ${isLandscape ? 'desktop' : 'mobile'}`}>
            {isLandscape ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Monitor size={11} />
                <span className="badge-text-desktop">4K Desktop</span>
                <span className="badge-text-mobile">4K</span>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Smartphone size={11} />
                <span className="badge-text-desktop">OLED Mobile</span>
                <span className="badge-text-mobile">OLED</span>
              </span>
            )}
          </span>
          {wallpaper.width && (
            <span className="card-badge res badge-text-desktop">
              {wallpaper.width}×{wallpaper.height}
            </span>
          )}
        </div>

        {/* Floating actions on top-right */}
        <div className="card-top-actions">
          <button
            type="button"
            className={`card-action-btn ${isFavorite ? 'is-fav' : ''}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Favorite wallpaper"
          >
            <Heart size={15} fill={isFavorite ? '#ffffff' : 'none'} color={isFavorite ? '#ffffff' : 'currentColor'} />
          </button>
          <button
            type="button"
            className="card-action-btn card-inspect-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectWallpaper(wallpaper);
            }}
            title="Inspect device preview"
            aria-label="Inspect preview"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Image */}
        <img
          src={imageSrc}
          alt={wallpaper.alt || 'Pexels wallpaper'}
          className="wallpaper-card-img"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0.4 }}
        />

        {/* Rich Hover Overlay */}
        <div className="card-hover-overlay">
          <h3 className="card-overlay-title">
            {wallpaper.alt || `${wallpaper.category || 'High Res'} Wallpaper`}
          </h3>

          <div className="card-overlay-meta">
            <div className="photographer-info">
              <span>By</span>
              <a
                href={wallpaper.photographer_url}
                target="_blank"
                rel="noreferrer"
                className="photographer-link"
                onClick={(e) => e.stopPropagation()}
              >
                {wallpaper.photographer}
              </a>
            </div>

            <button
              type="button"
              className="quick-download-btn"
              onClick={handleQuickDownload}
              title="Download Ultra HD"
            >
              <Download size={13} />
              <span>Get 4K</span>
            </button>
          </div>
        </div>
      </div>

      {/* Symmetrical Bottom Info Strip */}
      <div className="card-bottom-info">
        <div className="card-bottom-left">
          <div
            className="card-color-swatch"
            style={{ backgroundColor: wallpaper.avg_color }}
            title={`Dominant color: ${wallpaper.avg_color}`}
          />
          <span className="card-photographer-text">
            {wallpaper.photographer}
          </span>
        </div>
        <button
          type="button"
          className="card-touch-dl-btn"
          onClick={handleQuickDownload}
          title="Download Wallpaper"
          aria-label="Download wallpaper"
        >
          <Download size={13} />
        </button>
      </div>
    </div>
  );
}
