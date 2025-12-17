const FAVORITES_KEY = 'favorites:v1';
const RECENT_KEY = 'recent:v1';
const MAX_RECENT = 30;

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

export function addFavorite(itemId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

export function removeFavorite(itemId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(id => id !== itemId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function isFavorite(itemId: string): boolean {
  return getFavorites().includes(itemId);
}

export function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading recent:', error);
    return [];
  }
}

export function addRecent(itemId: string): void {
  if (typeof window === 'undefined') return;
  try {
    let recent = getRecent();
    
    // Remove if already exists
    recent = recent.filter(id => id !== itemId);
    
    // Add to the beginning
    recent.unshift(itemId);
    
    // Keep only MAX_RECENT items
    if (recent.length > MAX_RECENT) {
      recent = recent.slice(0, MAX_RECENT);
    }
    
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (error) {
    console.error('Error adding recent:', error);
  }
}

export function clearRecent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing recent:', error);
  }
}

