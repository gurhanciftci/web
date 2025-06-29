import axios from "axios";
import { NewsItem, ApiKeyStatus } from "../types/news";
import { API_CONFIG } from "../config/api";
import { sanitizeNewsContent, rateLimiter } from "../utils/security";
import { cache, persistentCache } from "../utils/cache";

const CATEGORY_MAP: Record<string, string> = {
  world: "dünya",
  politics: "siyaset",
  business: "finans",
  money: "finans",
  economics: "finans",
  technology: "dünya",
  science: "dünya",
  environment: "dünya",
  sport: "dünya",
  culture: "dünya",
  lifeandstyle: "dünya",
  commentisfree: "dünya"
};

export function getApiKeyStatus(): ApiKeyStatus {
  const hasValidKey = API_CONFIG.GUARDIAN_API_KEY && API_CONFIG.GUARDIAN_API_KEY !== "YOUR_GUARDIAN_API_KEY_HERE";
  
  return {
    hasCustomKey: hasValidKey,
    isValid: hasValidKey
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  const cacheKey = 'guardian-news';
  
  // Check cache first
  const cachedNews = cache.get<NewsItem[]>(cacheKey);
  if (cachedNews) {
    return cachedNews;
  }

  // Check persistent cache
  const persistentNews = persistentCache.get<NewsItem[]>(cacheKey);
  if (persistentNews) {
    cache.set(cacheKey, persistentNews, 5 * 60 * 1000); // 5 minutes in memory
    return persistentNews;
  }

  // Rate limiting check
  if (!rateLimiter.canMakeRequest('guardian-api', 10, 60 * 1000)) {
    throw new Error("API rate limit exceeded. Please wait a moment.");
  }

  return fetchFromGuardian();
}

async function fetchFromGuardian(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${API_CONFIG.GUARDIAN_BASE_URL}/search`, {
      params: {
        'api-key': API_CONFIG.GUARDIAN_API_KEY,
        'show-fields': 'headline,trailText,thumbnail,short-url',
        'show-tags': 'contributor',
        'order-by': 'newest',
        'page-size': 30, // Reduced from 50 to save bandwidth
        'q': 'NOT sport', 
        'section': 'world|politics|business|technology|science|environment'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.data.response?.results) {
      throw new Error("API'den haber verisi alınamadı");
    }

    const news = response.data.response.results.map((article: any) => ({
      title: sanitizeNewsContent(article.fields?.headline || article.webTitle || "Başlık bulunamadı"),
      description: sanitizeNewsContent(article.fields?.trailText || "Açıklama bulunamadı"),
      url: article.fields?.shortUrl || article.webUrl || "#",
      category: getCategoryFromSection(article.sectionId),
      importance: getImportanceScore(article.fields?.headline || article.webTitle, article.fields?.trailText || ""),
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail,
      source: "The Guardian",
      id: article.id
    }));

    // Cache the results
    cache.set('guardian-news', news, 15 * 60 * 1000); // 15 minutes in memory
    persistentCache.set('guardian-news', news, 60 * 60 * 1000); // 1 hour persistent

    return news;
  } catch (error: any) {
    console.error("Guardian API hatası:", error);
    
    // Try to return cached data on error
    const fallbackNews = persistentCache.get<NewsItem[]>('guardian-news');
    if (fallbackNews) {
      return fallbackNews;
    }
    
    if (error.response?.status === 401) {
      throw new Error("API anahtarı geçersiz. Lütfen Guardian API anahtarınızı kontrol edin.");
    }
    if (error.response?.status === 429) {
      throw new Error("API limit aşıldı. Günlük 5000 istek limitiniz dolmuş.");
    }
    if (error.response?.status === 403) {
      throw new Error("API erişimi reddedildi. API anahtarınızın geçerli olduğundan emin olun.");
    }
    
    throw new Error("Haberler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.");
  }
}

function getCategoryFromSection(sectionId: string): string {
  return CATEGORY_MAP[sectionId] || "dünya";
}

function getImportanceScore(title: string, description: string): number {
  const content = `${title} ${description}`.toLowerCase();
  
  const criticalKeywords = ['breaking', 'urgent', 'crisis', 'emergency', 'war', 'attack', 'disaster', 'death', 'killed'];
  const importantKeywords = ['major', 'significant', 'important', 'critical', 'election', 'president', 'minister', 'government'];
  const moderateKeywords = ['new', 'report', 'study', 'announce', 'reveals', 'investigation'];
  
  if (criticalKeywords.some(keyword => content.includes(keyword))) {
    return 5;
  }
  if (importantKeywords.some(keyword => content.includes(keyword))) {
    return 4;
  }
  if (moderateKeywords.some(keyword => content.includes(keyword))) {
    return 3;
  }
  
  return 2;
}