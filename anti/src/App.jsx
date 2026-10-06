import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import WallpaperCard from './components/WallpaperCard';
import WallpaperModal from './components/WallpaperModal';
import ApiKeyModal from './components/ApiKeyModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import Toast from './components/Toast';
import { fetchWallpapers, getStoredApiKey } from './services/pexelsApi';
import { Sparkles, Loader2, ArrowUpRight, Heart, RefreshCw } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'lumina_wallpapers_favs';

export default function App() {
  // Filters & Search state
  const [deviceFilter, setDeviceFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('');

  // Feed & Pagination state
  const [wallpapers, setWallpapers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Modals & Drawers state
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback state
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  // Load Wallpapers
  const loadData = useCallback(async (isNewSearch = true, nextPage = 1) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetchWallpapers({
        query: searchQuery,
        orientation: deviceFilter,
        category: selectedCategory,
        color: selectedColor,
        page: nextPage,
        perPage: 16
      });

      if (isNewSearch) {
        setWallpapers(res.photos);
      } else {
        setWallpapers((prev) => {
          // Filter duplicates by id
          const existingIds = new Set(prev.map((p) => p.id));
          const newPhotos = res.photos.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPhotos];
        });
      }

      setPage(res.page);
      setTotalResults(res.totalResults);
      setIsLiveApi(res.isLiveApi);
    } catch (err) {
      console.error('Failed to load wallpapers:', err);
      addToast('Failed to fetch wallpapers. Using curated mode.', 'info');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, deviceFilter, selectedCategory, selectedColor, addToast]);

  // Trigger search on filter changes
  useEffect(() => {
    loadData(true, 1);
  }, [loadData]);

  // Check initial API key
  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setIsLiveApi(true);
    }
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (wallpaper) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === wallpaper.id);
      if (exists) {
        addToast('Removed from favorites', 'info');
        return prev.filter((p) => p.id !== wallpaper.id);
      } else {
        addToast('Saved to your favorites collection!');
        return [wallpaper, ...prev];
      }
    });
  };

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
    addToast('Removed from favorites', 'info');
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all saved favorites?')) {
      setFavorites([]);
      addToast('Favorites cleared', 'info');
    }
  };

  // High-res Download Handler
  const handleDownload = async (wallpaper, size = 'original') => {
    const url = wallpaper.src[size] || wallpaper.src.original || wallpaper.src.large;
    const isDesk = wallpaper.orientation === 'landscape';
    const filename = `Lumina_${isDesk ? 'Desktop4K' : 'MobileOLED'}_${wallpaper.id}.jpg`;

    addToast(`Starting download: ${size.toUpperCase()} resolution...`);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      addToast(`Downloaded ${filename} successfully!`);
    } catch (err) {
      // Fallback direct open in new window if CORS blocks blob download
      window.open(url, '_blank');
      addToast('Opened full resolution image in new tab.');
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('');
    setSearchQuery('');
    addToast('Filters reset to default', 'info');
  };

  return (
    <div className="app-container">
      {/* Ambient background glow orbs */}
      <div className="ambient-glow-wrapper" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <div className="tech-grid-overlay" aria-hidden="true" />

      {/* Main Navigation */}
      <Navbar
        deviceFilter={deviceFilter}
        setDeviceFilter={setDeviceFilter}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesDrawerOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isLiveApi={isLiveApi}
      />

      <main>
        {/* Expressive Hero */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={(query) => {
            setSearchQuery(query);
            loadData(true, 1);
          }}
          deviceFilter={deviceFilter}
          setDeviceFilter={setDeviceFilter}
        />

        {/* Categories, Colors, & Results Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          totalResults={totalResults}
          isLiveApi={isLiveApi}
          onResetFilters={handleResetFilters}
        />

        {/* Wallpaper Grid Viewport */}
        <section className="wallpapers-container" aria-label="Wallpapers Catalog">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 24px', color: 'var(--text-muted)' }}>
              <Loader2 size={40} className="spin" style={{ color: 'var(--accent-cyan)', margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600, color: '#fff' }}>
                Fetching ultra-HD wallpapers...
              </p>
            </div>
          ) : wallpapers.length === 0 ? (
            <div className="empty-state-card">
              <Sparkles className="empty-icon" />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                No wallpapers found
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                We couldn't find matching wallpapers for your current search and filters.
              </p>
              <button
                type="button"
                className="search-submit-btn"
                style={{ margin: '0 auto' }}
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`wallpapers-grid ${
                  deviceFilter === 'landscape'
                    ? 'desktop-mode'
                    : deviceFilter === 'portrait'
                    ? 'mobile-mode'
                    : 'all-mode'
                }`}
              >
                {wallpapers.map((wallpaper) => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isFavorite={favorites.some((f) => f.id === wallpaper.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectWallpaper={setSelectedWallpaper}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Load more pagination */}
              {wallpapers.length < totalResults && (
                <div className="load-more-section">
                  <button
                    type="button"
                    className="load-more-btn"
                    onClick={() => loadData(false, page + 1)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        <span>Loading More Wallpapers...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={18} />
                        <span>Load More {deviceFilter === 'landscape' ? 'Desktop' : deviceFilter === 'portrait' ? 'Mobile' : ''} Wallpapers</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Modal Inspector: Realistic Desktop & Phone Mockups */}
      {selectedWallpaper && (
        <WallpaperModal
          wallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          isFavorite={favorites.some((f) => f.id === selectedWallpaper.id)}
          onToggleFavorite={handleToggleFavorite}
          onDownload={handleDownload}
          onCopyLink={() => addToast('Image direct CDN URL copied to clipboard!')}
        />
      )}

      {/* Favorites slide drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favorites}
        onSelectWallpaper={setSelectedWallpaper}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
        onDownload={handleDownload}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(isValid) => {
          setIsLiveApi(isValid);
          addToast(isValid ? 'Live Pexels API feed activated!' : 'Switched to curated offline mode.', 'info');
          loadData(true, 1);
        }}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} />

      {/* Expressive Footer */}
      <footer className="app-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 800, letterSpacing: '1px', color: '#fff' }}>LUMINA WALLPAPER STUDIO</span>
          </div>
          <p>
            Curated high-resolution 4K Desktop wallpapers and OLED Mobile backgrounds powered by the{' '}
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer" className="footer-link">
              Pexels API
            </a>. Free for personal and commercial use.
          </p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Built with React, Vite & Vanilla CSS</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '12px' }}
            >
              Configure Pexels API
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
