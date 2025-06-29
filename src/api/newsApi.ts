import axios from "axios";
import { NewsItem, ApiKeyStatus } from "../types/news";

// GNews API - Ücretsiz günlük 100 istek
// https://gnews.io/ adresinden ücretsiz API key alabilirsiniz
const GNEWS_API_KEY = "8d769ac11bd5613228512c93495af650";
const GNEWS_BASE_URL = "https://gnews.io/api/v4";

// Aktif API seçimi
const ACTIVE_API = "gnews";

const CATEGORY_MAP: Record<string, string> = {
  general: "dünya",
  world: "dünya",
  politics: "siyaset",
  business: "finans",
  finance: "finans",
  economy: "finans",
  technology: "dünya",
  health: "dünya",
  sports: "dünya",
  entertainment: "dünya",
  science: "dünya"
};

export function getApiKeyStatus(): ApiKeyStatus {
  const hasValidKey = GNEWS_API_KEY !== "YOUR_GNEWS_API_KEY_HERE";
  
  return {
    hasCustomKey: hasValidKey,
    isValid: hasValidKey
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  return fetchFromGNews();
}

// GNews API (Günlük 100 ücretsiz istek)
async function fetchFromGNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
      params: {
        token: GNEWS_API_KEY,
        lang: "en",
        country: "us",
        max: 50
      }
    });

    if (!response.data.articles) {
      throw new Error("API'den haber verisi alınamadı");
    }

    return response.data.articles.map((article: any) => ({
      title: article.title || "Başlık bulunamadı",
      description: article.description || "Açıklama bulunamadı",
      url: article.url || "#",
      category: getCategoryFromContent(article.title, article.description),
      importance: getImportanceScore(article.title, article.description),
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      source: article.source?.name || "GNews"
    }));
  } catch (error: any) {
    console.error("GNews API hatası:", error);
    
    if (error.response?.status === 401) {
      throw new Error("API anahtarı geçersiz. Lütfen GNews API anahtarınızı kontrol edin.");
    }
    if (error.response?.status === 429) {
      throw new Error("API limit aşıldı. Günlük 100 istek limitiniz dolmuş.");
    }
    
    throw new Error("Haberler yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin.");
  }
}

function getCategoryFromContent(title: string, description: string): string {
  const content = `${title} ${description}`.toLowerCase();
  
  if (content.includes('politic') || content.includes('government') || content.includes('election')) {
    return "siyaset";
  }
  if (content.includes('business') || content.includes('economy') || content.includes('market') || content.includes('finance')) {
    return "finans";
  }
  return "dünya";
}

function getImportanceScore(title: string, description: string): number {
  const content = `${title} ${description}`.toLowerCase();
  
  const criticalKeywords = ['breaking', 'urgent', 'crisis', 'emergency', 'war', 'attack', 'disaster'];
  const importantKeywords = ['major', 'significant', 'important', 'critical', 'election', 'president'];
  const moderateKeywords = ['new', 'report', 'study', 'announce'];
  
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