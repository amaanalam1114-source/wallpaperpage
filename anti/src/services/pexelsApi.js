import { CURATED_WALLPAPERS } from '../data/curatedWallpapers';

const STORAGE_KEY = 'lumina_pexels_api_key';

export function getStoredApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredApiKey(key) {
  try {
    if (!key) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  } catch (e) {
    console.error('Failed to store Pexels API key:', e);
  }
}

/**
 * Validates a Pexels API key by making a test request
 */
export async function validatePexelsApiKey(key) {
  if (!key || !key.trim()) {
    return { valid: false, message: 'Please enter a valid key' };
  }
  try {
    const res = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
      headers: {
        Authorization: key.trim()
      }
    });

    if (res.ok) {
      return { valid: true, message: 'API key validated successfully!' };
    } else if (res.status === 401) {
      return { valid: false, message: 'Invalid API key (401 Unauthorized)' };
    } else {
      return { valid: false, message: `Pexels API returned status ${res.status}` };
    }
  } catch (err) {
    return { valid: false, message: `Network error: ${err.message}` };
  }
}

/**
 * Fetches wallpapers from live Pexels API or falls back to curated library
 */
export async function fetchWallpapers({
  query = '',
  orientation = 'all', // 'all', 'landscape', 'portrait'
  category = 'all',
  color = '',
  page = 1,
  perPage = 20
}) {
  const apiKey = getStoredApiKey();

  // If live API key is set, try fetching from Pexels API
  if (apiKey) {
    try {
      let endpoint = '';
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString()
      });

      if (orientation && orientation !== 'all') {
        params.append('orientation', orientation);
      }
      if (color) {
        params.append('color', color);
      }

      // Build search query if user entered text, category is chosen, or orientation is specified
      let searchQuery = query.trim();
      if (!searchQuery && category && category !== 'all') {
        searchQuery = `${category} wallpaper 4k`;
      } else if (!searchQuery && orientation !== 'all') {
        searchQuery = orientation === 'landscape' ? 'desktop wallpaper 4k' : 'phone wallpaper oled';
      }

      if (searchQuery) {
        params.append('query', searchQuery);
        endpoint = `https://api.pexels.com/v1/search?${params.toString()}`;
      } else {
        // General curated
        endpoint = `https://api.pexels.com/v1/curated?${params.toString()}`;
      }

      const res = await fetch(endpoint, {
        headers: {
          Authorization: apiKey
        }
      });

      if (!res.ok) {
        throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      const photos = (data.photos || []).map((photo) => {
        const isLandscape = photo.width >= photo.height;
        return {
          id: photo.id,
          width: photo.width,
          height: photo.height,
          url: photo.url,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          photographer_id: photo.photographer_id,
          avg_color: photo.avg_color || '#121620',
          orientation: isLandscape ? 'landscape' : 'portrait',
          category: category !== 'all' ? category : (isLandscape ? 'Desktop 4K' : 'Mobile OLED'),
          tags: [isLandscape ? 'desktop' : 'mobile', '4k', 'pexels'],
          alt: photo.alt || (isLandscape ? 'High resolution 4K desktop wallpaper' : 'AMOLED mobile lockscreen wallpaper'),
          src: photo.src
        };
      });

      return {
        photos,
        page: data.page || page,
        perPage: data.per_page || perPage,
        totalResults: data.total_results || photos.length,
        isLiveApi: true
      };
    } catch (err) {
      console.warn('Live Pexels fetch failed, falling back to curated feed:', err);
      // Fall through to curated library fallback
    }
  }

  // Fallback: Filter from high-definition curated dataset
  let results = [...CURATED_WALLPAPERS];

  // 1. Orientation filter
  if (orientation && orientation !== 'all') {
    results = results.filter((p) => p.orientation === orientation);
  }

  // 2. Category filter
  if (category && category !== 'all') {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Search query filter
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((p) => {
      const matchAlt = p.alt.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchPhotographer = p.photographer.toLowerCase().includes(q);
      const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchAlt || matchCat || matchPhotographer || matchTags;
    });
  }

  // 4. Color filter (approximate by avg_color or tags)
  if (color) {
    results = results.filter((p) => {
      // Check tags or average color approximate
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      if (tags.includes(color.toLowerCase())) return true;
      if (color === 'black' && ['#0a0c14', '#0b0c16', '#111116', '#080a14'].includes(p.avg_color)) return true;
      if (color === 'blue' && ['#182030', '#131b26', '#1d2b38', '#18202b'].includes(p.avg_color)) return true;
      if (color === 'violet' && ['#1e1338', '#281c30', '#1f0d2c', '#180c21'].includes(p.avg_color)) return true;
      if (color === 'green' && ['#1c2826', '#182e2f', '#1a2c1e'].includes(p.avg_color)) return true;
      return true; // Don't over-restrict curated
    });
  }

  const totalResults = results.length;
  const startIndex = (page - 1) * perPage;
  const paginatedPhotos = results.slice(startIndex, startIndex + perPage);

  return {
    photos: paginatedPhotos,
    page,
    perPage,
    totalResults,
    isLiveApi: false
  };
}
