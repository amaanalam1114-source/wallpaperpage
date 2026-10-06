import React from 'react';
import { X, Heart, Trash2, Download, ExternalLink, Monitor, Smartphone } from 'lucide-react';

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onSelectWallpaper,
  onRemoveFavorite,
  onClearAll,
  onDownload
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-logo-icon" style={{ width: '32px', height: '32px', background: '#f43f5e' }}>
              <Heart size={16} fill="#ffffff" color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Saved Favorites
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                {favorites.length} {favorites.length === 1 ? 'wallpaper' : 'wallpapers'} saved
              </p>
            </div>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="drawer-list">
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Heart size={44} color="var(--text-dim)" style={{ marginBottom: '16px', opacity: 0.4 }} />
              <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>No favorites yet</h4>
              <p style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Tap the heart icon on any desktop or mobile wallpaper to build your personal aesthetic gallery.
              </p>
            </div>
          ) : (
            favorites.map((item) => {
              const isLandscape = item.orientation === 'landscape';
              const thumbSrc = item.src.tiny || item.src.small || item.src.medium;

              return (
                <div
                  key={item.id}
                  className="fav-item-card"
                  onClick={() => {
                    onSelectWallpaper(item);
                    onClose();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={thumbSrc}
                    alt={item.alt || 'Favorite wallpaper'}
                    className="fav-item-thumb"
                  />

                  <div className="fav-item-info">
                    <div className="fav-item-photographer">{item.photographer}</div>
                    <div className="fav-item-orientation" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      {isLandscape ? <Monitor size={11} /> : <Smartphone size={11} />}
                      <span>{isLandscape ? '4K Desktop' : 'OLED Mobile'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="icon-btn"
                      style={{ padding: '6px' }}
                      onClick={() => onDownload(item, 'original')}
                      title="Download 4K"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      style={{ padding: '6px', color: '#f43f5e' }}
                      onClick={() => onRemoveFavorite(item.id)}
                      title="Remove from favorites"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {favorites.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(15, 20, 31, 0.9)' }}>
            <button
              type="button"
              className="icon-btn"
              style={{ width: '100%', justifyContent: 'center', color: '#f87171' }}
              onClick={onClearAll}
            >
              <Trash2 size={14} />
              <span>Clear All Favorites</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
