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

// Mock data for demo purposes when API key is not available
const MOCK_NEWS_DATA: NewsItem[] = [
  {
    id: "mock-1",
    title: "Küresel Ekonomide Yeni Gelişmeler",
    description: "Dünya ekonomisinde yaşanan son gelişmeler piyasaları etkilemeye devam ediyor. Uzmanlar, önümüzdeki dönemde dikkatli olunması gerektiğini belirtiyor.",
    url: "https://example.com/news/1",
    category: "finans",
    importance: 4,
    publishedAt: new Date().toISOString(),
    imageUrl: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400",
    source: "Demo News"
  },
  {
    id: "mock-2",
    title: "Teknoloji Sektöründe Yenilikler",
    description: "Yapay zeka ve makine öğrenmesi alanındaki gelişmeler teknoloji sektörünü hızla dönüştürüyor. Yeni ürünler ve hizmetler piyasaya sürülmeye devam ediyor.",
    url: "https://example.com/news/2",
    category: "dünya",
    importance: 3,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
    source: "Tech News"
  },
  {
    id: "mock-3",
    title: "Siyasi Gelişmeler ve Piyasa Etkileri",
    description: "Son siyasi gelişmeler finansal piyasalarda dalgalanmalara neden oluyor. Yatırımcılar gelişmeleri yakından takip ediyor.",
    url: "https://example.com/news/3",
    category: "siyaset",
    importance: 5,
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=400",
    source: "Political News"
  },
  {
    id: "mock-4",
    title: "Çevre ve Sürdürülebilirlik Haberleri",
    description: "İklim değişikliği ve çevre koruma konularında alınan yeni kararlar küresel ölçekte etkili olmaya devam ediyor.",
    url: "https://example.com/news/4",
    category: "dünya",
    importance: 3,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
    source: "Environment News"
  },
  {
    id: "mock-5",
    title: "Finans Piyasalarında Son Durum",
    description: "Borsa endeksleri ve döviz kurlarında yaşanan hareketlilik yatırımcıların dikkatini çekiyor. Uzmanlar piyasa analizlerini paylaşıyor.",
    url: "https://example.com/news/5",
    category: "finans",
    importance: 4,
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400",
    source: "Finance News"
  }
];

export function getApiKeyStatus(): ApiKeyStatus {
  const hasValidKey = API_CONFIG.GUARDIAN_API_KEY && 
                     API_CONFIG.GUARDIAN_API_KEY !== "YOUR_GUARDIAN_API_KEY_HERE" &&
                     API_CONFIG.GUARDIAN_API_KEY !== "";
  
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
    console.log('📰 Haberler cache\'den yüklendi');
    return cachedNews;
  }

  // Check persistent cache
  const persistentNews = persistentCache.get<NewsItem[]>(cacheKey);
  if (persistentNews) {
    console.log('📰 Haberler persistent cache\'den yüklendi');
    cache.set(cacheKey, persistentNews, 5 * 60 * 1000); // 5 minutes in memory
    return persistentNews;
  }

  // Check API key status
  const apiStatus = getApiKeyStatus();
  
  if (!apiStatus.hasCustomKey) {
    console.log('⚠️ API key bulunamadı, demo veriler kullanılıyor');
    // Cache mock data for demo
    cache.set(cacheKey, MOCK_NEWS_DATA, 5 * 60 * 1000);
    persistentCache.set(cacheKey, MOCK_NEWS_DATA, 30 * 60 * 1000);
    return MOCK_NEWS_DATA;
  }

  // Rate limiting check
  if (!rateLimiter.canMakeRequest('guardian-api', 10, 60 * 1000)) {
    console.log('⚠️ API rate limit aşıldı, cache veriler kullanılıyor');
    const fallbackNews = persistentCache.get<NewsItem[]>(cacheKey);
    if (fallbackNews) return fallbackNews;
    
    // Return mock data as last resort
    return MOCK_NEWS_DATA;
  }

  try {
    return await fetchFromGuardian();
  } catch (error) {
    console.error('❌ Guardian API hatası:', error);
    
    // Try to return cached data on error
    const fallbackNews = persistentCache.get<NewsItem[]>(cacheKey);
    if (fallbackNews) {
      console.log('📰 Hata durumunda cache veriler kullanıldı');
      return fallbackNews;
    }
    
    // Return mock data as last resort
    console.log('📰 Hata durumunda demo veriler kullanıldı');
    return MOCK_NEWS_DATA;
  }
}

async function fetchFromGuardian(): Promise<NewsItem[]> {
  console.log('🔄 Guardian API\'den haberler yükleniyor...');
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_CONFIG.GUARDIAN_BASE_URL}/search?` + new URLSearchParams({
      'api-key': API_CONFIG.GUARDIAN_API_KEY,
      'show-fields': 'headline,trailText,thumbnail,short-url',
      'show-tags': 'contributor',
      'order-by': 'newest',
      'page-size': '30',
      'q': 'NOT sport',
      'section': 'world|politics|business|technology|science|environment'
    }), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GlobalNewsApp/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ Guardian API HTTP Error: ${response.status} - ${errorText}`);
      
      if (response.status === 401) {
        throw new Error("API anahtarı geçersiz. Lütfen Guardian API anahtarınızı kontrol edin.");
      }
      if (response.status === 429) {
        throw new Error("API limit aşıldı. Günlük 5000 istek limitiniz dolmuş.");
      }
      if (response.status === 403) {
        throw new Error("API erişimi reddedildi. API anahtarınızın geçerli olduğundan emin olun.");
      }
      
      throw new Error(`Guardian API hatası: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response?.results) {
      console.error('❌ Guardian API\'den geçersiz veri formatı:', data);
      throw new Error("API'den haber verisi alınamadı");
    }

    console.log(`✅ Guardian API\'den ${data.response.results.length} haber alındı`);

    const news = data.response.results.map((article: any) => ({
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

    console.log('✅ Haberler başarıyla cache\'lendi');
    return news;
    
  } catch (error: any) {
    console.error("❌ Guardian API fetch hatası:", error);
    
    if (error.name === 'AbortError') {
      throw new Error("API isteği zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.");
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error("İnternet bağlantısı sorunu. Lütfen bağlantınızı kontrol edin.");
    }
    
    // Re-throw known errors
    if (error.message.includes('API anahtarı') || 
        error.message.includes('API limit') || 
        error.message.includes('API erişimi')) {
      throw error;
    }
    
    throw new Error("Haberler yüklenirken beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
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