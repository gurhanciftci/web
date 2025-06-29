import axios from "axios";
import { NewsItem, ApiKeyStatus } from "../types/news";

// Guardian API - Ücretsiz günlük 5000 istek
// https://open-platform.theguardian.com/access/ adresinden ücretsiz API key alabilirsiniz
const GUARDIAN_API_KEY = "079580be-8193-46b9-91ed-97794bf9317f";
const GUARDIAN_BASE_URL = "https://content.guardianapis.com";

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
  const hasValidKey = GUARDIAN_API_KEY !== "YOUR_GUARDIAN_API_KEY_HERE";
  
  return {
    hasCustomKey: hasValidKey,
    isValid: hasValidKey
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  return fetchFromGuardian();
}

// Guardian API (Günlük 5000 ücretsiz istek)
async function fetchFromGuardian(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${GUARDIAN_BASE_URL}/search`, {
      params: {
        'api-key': GUARDIAN_API_KEY,
        'show-fields': 'headline,trailText,thumbnail,short-url',
        'show-tags': 'contributor',
        'order-by': 'newest',
        'page-size': 50,
        'q': 'NOT sport', // Spor haberlerini filtrele
        'section': 'world|politics|business|technology|science|environment'
      }
    });

    if (!response.data.response?.results) {
      throw new Error("API'den haber verisi alınamadı");
    }

    return response.data.response.results.map((article: any) => ({
      title: article.fields?.headline || article.webTitle || "Başlık bulunamadı",
      description: article.fields?.trailText || "Açıklama bulunamadı",
      url: article.fields?.shortUrl || article.webUrl || "#",
      category: getCategoryFromSection(article.sectionId),
      importance: getImportanceScore(article.fields?.headline || article.webTitle, article.fields?.trailText || ""),
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail,
      source: "The Guardian"
    }));
  } catch (error: any) {
    console.error("Guardian API hatası:", error);
    
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