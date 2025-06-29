import { NewsItem, FavoriteNews } from '../types/news';

const FAVORITES_KEY = 'global-news-favorites';

export function getFavorites(): FavoriteNews[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Favoriler yüklenirken hata:', error);
    return [];
  }
}

export function addToFavorites(newsItem: NewsItem): void {
  try {
    const favorites = getFavorites();
    const newsId = generateNewsId(newsItem);
    
    // Zaten favorilerde var mı kontrol et
    if (favorites.some(fav => generateNewsId(fav) === newsId)) {
      return;
    }
    
    const favoriteItem: FavoriteNews = {
      ...newsItem,
      id: newsId,
      addedAt: new Date().toISOString()
    };
    
    favorites.unshift(favoriteItem); // En başa ekle
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Favorilere eklenirken hata:', error);
  }
}

export function removeFromFavorites(newsItem: NewsItem): void {
  try {
    const favorites = getFavorites();
    const newsId = generateNewsId(newsItem);
    const filtered = favorites.filter(fav => generateNewsId(fav) !== newsId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Favorilerden çıkarılırken hata:', error);
  }
}

export function isFavorite(newsItem: NewsItem): boolean {
  try {
    const favorites = getFavorites();
    const newsId = generateNewsId(newsItem);
    return favorites.some(fav => generateNewsId(fav) === newsId);
  } catch (error) {
    console.error('Favori kontrolü yapılırken hata:', error);
    return false;
  }
}

function generateNewsId(newsItem: NewsItem): string {
  // URL ve başlık kombinasyonundan unique ID oluştur
  return btoa(encodeURIComponent(`${newsItem.url}-${newsItem.title}`)).replace(/[^a-zA-Z0-9]/g, '');
}