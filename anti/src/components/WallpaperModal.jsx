import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Image as ImageIcon, 
  Download, 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  Wifi,
  Battery,
  Flashlight,
  Camera,
  Folder,
  Code2,
  Music,
  Globe,
  Terminal,
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WallpaperModal({
  wallpaper,
  onClose,
  isFavorite,
  onToggleFavorite,
  onDownload,
  onCopyLink
}) {
  if (!wallpaper) return null;

  const isDefaultLandscape = wallpaper.orientation === 'landscape';
  const [simulatorMode, setSimulatorMode] = useState(isDefaultLandscape ? 'desktop' : 'mobile');
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyHex = () => {
    if (wallpaper.avg_color) {
      navigator.clipboard.writeText(wallpaper.avg_color);
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    }
  };

  const handleCopyLinkClick = () => {
    const directUrl = wallpaper.src.original || wallpaper.src.large2x || wallpaper.src.large;
    navigator.clipboard.writeText(directUrl);
    setCopiedUrl(true);
    if (onCopyLink) onCopyLink();
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleFavorite = () => {
    onToggleFavorite(wallpaper);
    if (!isFavorite) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleDownloadClick = (size) => {
    onDownload(wallpaper, size);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  // Format current date and time for realistic mockup
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wallpaper-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-top">
            <h2 className="modal-header-title">
              {wallpaper.alt || 'Wallpaper Inspector'}
            </h2>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              title="Close inspector (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Symmetrical Simulator Mode Tabs */}
          <div className="simulator-mode-tabs">
            <button
              type="button"
              className={`simulator-mode-btn ${simulatorMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setSimulatorMode('desktop')}
              title="Preview on desktop computer display"
            >
              <Monitor size={14} />
              <span className="sim-tab-desktop">Desktop Setup</span>
              <span className="sim-tab-mobile">Desktop</span>
            </button>

            <button
              type="button"
              className={`simulator-mode-btn ${simulatorMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setSimulatorMode('mobile')}
              title="Preview on mobile smartphone screen"
            >
              <Smartphone size={14} />
              <span className="sim-tab-desktop">Phone Lockscreen</span>
              <span className="sim-tab-mobile">Phone</span>
            </button>

            <button
              type="button"
              className={`simulator-mode-btn ${simulatorMode === 'pure' ? 'active' : ''}`}
              onClick={() => setSimulatorMode('pure')}
              title="View clean high-resolution image"
            >
              <ImageIcon size={14} />
              <span className="sim-tab-desktop">Pure Canvas</span>
              <span className="sim-tab-mobile">Canvas</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Left: Viewport / Simulator */}
          <div className="modal-viewport">
            {/* 1. Desktop Mockup Simulator */}
            {simulatorMode === 'desktop' && (
              <div className="desktop-mockup-frame">
                <img
                  src={wallpaper.src.landscape || wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original}
                  alt={wallpaper.alt}
                  className="mockup-desktop-wallpaper"
                />

                {/* macOS / Modern OS top menubar */}
                <div className="desktop-menubar">
                  <div className="desktop-menubar-left">
                    <div className="desktop-window-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <span style={{ fontWeight: 700, marginLeft: '6px' }}> LuminaOS</span>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Display</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wifi size={12} />
                    <Battery size={13} />
                    <span>{timeString}</span>
                  </div>
                </div>

                {/* Desktop shortcut icons */}
                <div className="desktop-icons-area">
                  <div className="desktop-shortcut">
                    <div className="desktop-shortcut-icon">
                      <Folder size={18} />
                    </div>
                    <span className="desktop-shortcut-text">Projects</span>
                  </div>
                  <div className="desktop-shortcut">
                    <div className="desktop-shortcut-icon">
                      <Code2 size={18} color="#06b6d4" />
                    </div>
                    <span className="desktop-shortcut-text">Code</span>
                  </div>
                </div>

                {/* Floating dock */}
                <div className="desktop-dock">
                  <div className="dock-item" title="Finder"><Folder size={18} /></div>
                  <div className="dock-item" title="Browser"><Globe size={18} color="#f59e0b" /></div>
                  <div className="dock-item" title="Code"><Code2 size={18} color="#06b6d4" /></div>
                  <div className="dock-item" title="Music"><Music size={18} color="#ec4899" /></div>
                  <div className="dock-item" title="Terminal"><Terminal size={18} /></div>
                  <div className="dock-item" title="Settings"><Settings size={18} /></div>
                </div>
              </div>
            )}

            {/* 2. Mobile Phone Mockup Simulator */}
            {simulatorMode === 'mobile' && (
              <div className="phone-mockup-frame">
                <img
                  src={wallpaper.src.portrait || wallpaper.src.large || wallpaper.src.original}
                  alt={wallpaper.alt}
                  className="mockup-phone-wallpaper"
                />

                {/* Dynamic island notch */}
                <div className="phone-dynamic-island">
                  <div className="phone-camera-lens" />
                  <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 700 }}>●</span>
                </div>

                {/* Status bar */}
                <div className="phone-status-bar">
                  <span>9:41</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wifi size={12} />
                    <span style={{ fontSize: '10px' }}>5G</span>
                    <Battery size={13} />
                  </div>
                </div>

                {/* Lockscreen content */}
                <div className="phone-lockscreen-content">
                  <div className="phone-lock-date">{dateString}</div>
                  <div className="phone-lock-clock">{timeString}</div>

                  <div className="phone-notification-pill">
                    <div className="phone-notification-title">
                      <span>Lumina Wallpaper Applied</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>now</span>
                    </div>
                    <div className="phone-notification-body">
                      {wallpaper.photographer ? `Art by ${wallpaper.photographer}` : 'Looking stunning on OLED display'}
                    </div>
                  </div>
                </div>

                {/* Bottom lockscreen buttons */}
                <div className="phone-bottom-actions">
                  <div className="phone-quick-btn" title="Flashlight">
                    <Flashlight size={16} />
                  </div>
                  <div className="phone-quick-btn" title="Camera">
                    <Camera size={16} />
                  </div>
                </div>

                {/* Home Indicator bar */}
                <div className="phone-home-indicator" />
              </div>
            )}

            {/* 3. Pure Image Preview */}
            {simulatorMode === 'pure' && (
              <div className="pure-preview-wrapper">
                <img
                  src={wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original}
                  alt={wallpaper.alt}
                  className="pure-preview-img"
                />
              </div>
            )}
          </div>

          {/* Right: Details & Downloads Sidebar */}
          <div className="modal-sidebar">
            {/* Top quick actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`icon-btn ${isFavorite ? 'active' : ''}`}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  background: isFavorite ? '#f43f5e' : undefined,
                  borderColor: isFavorite ? '#f43f5e' : undefined,
                  color: isFavorite ? '#fff' : undefined
                }}
                onClick={handleFavorite}
              >
                <Heart size={16} fill={isFavorite ? '#ffffff' : 'none'} color={isFavorite ? '#ffffff' : 'currentColor'} />
                <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                type="button"
                className="icon-btn"
                style={{ padding: '8px 12px' }}
                onClick={handleCopyLinkClick}
                title="Copy Direct Image CDN Link"
              >
                {copiedUrl ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Download Options */}
            <div>
              <div className="sidebar-section-title">Download Resolutions</div>
              <div className="download-options-group">
                <button
                  type="button"
                  className="download-option-btn primary"
                  onClick={() => handleDownloadClick('original')}
                >
                  <div>
                    <div className="res-name">Ultra HD (Original)</div>
                    <div className="res-dimensions">
                      {wallpaper.width} × {wallpaper.height} Max Res
                    </div>
                  </div>
                  <Download size={18} />
                </button>

                <button
                  type="button"
                  className="download-option-btn"
                  onClick={() => handleDownloadClick('large2x')}
                >
                  <div>
                    <div className="res-name">2K QHD (Desktop 1440p)</div>
                    <div className="res-dimensions">2560 × 1440 HiDPI</div>
                  </div>
                  <Download size={16} />
                </button>

                <button
                  type="button"
                  className="download-option-btn"
                  onClick={() => handleDownloadClick('portrait')}
                >
                  <div>
                    <div className="res-name">Mobile OLED (Portrait)</div>
                    <div className="res-dimensions">1080 × 1920 Phone</div>
                  </div>
                  <Download size={16} />
                </button>

                <button
                  type="button"
                  className="download-option-btn"
                  onClick={() => handleDownloadClick('large')}
                >
                  <div>
                    <div className="res-name">Full HD (Standard 1080p)</div>
                    <div className="res-dimensions">1920 × 1080 Web</div>
                  </div>
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Dominant Color Palette */}
            <div>
              <div className="sidebar-section-title">Color Palette</div>
              <div className="palette-swatches-box" onClick={handleCopyHex} title="Click to copy HEX color">
                <div
                  className="dominant-color-preview"
                  style={{ backgroundColor: wallpaper.avg_color || '#1e293b' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {wallpaper.avg_color || '#1e293b'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Dominant average shade
                  </div>
                </div>
                {copiedHex ? (
                  <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={13} /> Copied!
                  </span>
                ) : (
                  <Copy size={14} color="var(--text-dim)" />
                )}
              </div>
            </div>

            {/* Specs Grid */}
            <div>
              <div className="sidebar-section-title">Wallpaper Specs</div>
              <div className="spec-grid">
                <div className="spec-box">
                  <div className="spec-label">Orientation</div>
                  <div className="spec-val">
                    {wallpaper.orientation === 'landscape' ? '🖥️ Desktop (16:9)' : '📱 Mobile (9:16)'}
                  </div>
                </div>

                <div className="spec-box">
                  <div className="spec-label">Format</div>
                  <div className="spec-val">JPEG Ultra High-Q</div>
                </div>

                <div className="spec-box">
                  <div className="spec-label">License</div>
                  <div className="spec-val">Free for use</div>
                </div>

                <div className="spec-box">
                  <div className="spec-label">Source</div>
                  <div className="spec-val">Pexels Platform</div>
                </div>
              </div>
            </div>

            {/* Photographer Credits */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
              <div className="sidebar-section-title">Photographer</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                    {wallpaper.photographer}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    Verified Pexels Artist
                  </div>
                </div>

                <a
                  href={wallpaper.photographer_url || wallpaper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-btn"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <span>Pexels Profile</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
