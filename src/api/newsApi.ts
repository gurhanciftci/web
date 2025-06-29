import axios from "axios";
import { NewsItem, ApiKeyStatus } from "../types/news";

// NewsAPI kullanarak güvenilir kaynaklardan haber çekme
// IMPORTANT: Replace this with your own API key from https://newsapi.org/register
const NEWS_API_KEY = "YOUR_API_KEY_HERE";
const BASE_URL = "https://newsapi.org/v2";

// Güvenilir dünya haber kaynakları
const RELIABLE_SOURCES = [
  'bbc-news',
  'cnn',
  'reuters',
  'associated-press',
  'the-guardian-uk',
  'the-new-york-times',
  'the-washington-post',
  'bloomberg',
  'financial-times',
  'al-jazeera-english',
  'abc-news',
  'cbs-news',
  'nbc-news',
  'fox-news',
  'usa-today',
  'time',
  'newsweek',
  'the-economist',
  'wall-street-journal'
];

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
  const isDefaultKey = NEWS_API_KEY === "YOUR_API_KEY_HERE" || NEWS_API_KEY === "c990a5ee0860494f86d5fa803e2f9084";
  return {
    hasCustomKey: !isDefaultKey,
    isValid: !isDefaultKey // Only valid if not using default key
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  // Check if API key is set
  if (NEWS_API_KEY === "YOUR_API_KEY_HERE" || NEWS_API_KEY === "c990a5ee0860494f86d5fa803e2f9084") {
    throw new Error("API anahtarı ayarlanmamış. Lütfen NewsAPI.org'dan ücretsiz bir API anahtarı alın ve src/api/newsApi.ts dosyasındaki NEWS_API_KEY değerini güncelleyin.");
  }

  try {
    // Güvenilir kaynaklardan genel haberler
    const generalResponse = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        sources: RELIABLE_SOURCES.slice(0, 10).join(','),
        pageSize: 20,
        language: 'en'
      }
    });

    // İş/finans haberleri
    const businessResponse = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        category: 'business',
        sources: 'bloomberg,financial-times,wall-street-journal',
        pageSize: 10,
        language: 'en'
      }
    });

    // Siyaset haberleri
    const politicsResponse = await axios.get(`${BASE_URL}/everything`, {
      params: {
        apiKey: NEWS_API_KEY,
        q: 'politics OR government OR election',
        sources: 'bbc-news,cnn,reuters,the-guardian-uk,the-washington-post',
        pageSize: 10,
        language: 'en',
        sortBy: 'publishedAt'
      }
    });

    const allArticles = [
      ...(generalResponse.data?.articles || []),
      ...(businessResponse.data?.articles || []),
      ...(politicsResponse.data?.articles || [])
    ];

    return allArticles
      .filter((article: any) => article.title && article.description && article.url)
      .map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        category: getCategoryFromArticle(article),
        importance: getImportanceScore(article),
        publishedAt: article.publishedAt,
        imageUrl: article.urlToImage,
        source: article.source?.name || 'Unknown'
      }))
      .slice(0, 50);

  } catch (error: any) {
    console.error("NewsAPI hatası:", error);
    
    // Handle specific error codes
    if (error.response?.status === 426) {
      throw new Error("API anahtarı geçersiz veya yükseltme gerekiyor. Lütfen NewsAPI.org'dan geçerli bir API anahtarı alın.");
    } else if (error.response?.status === 401) {
      throw new Error("API anahtarı geçersiz. Lütfen NewsAPI.org'dan geçerli bir API anahtarı alın.");
    } else if (error.response?.status === 429) {
      throw new Error("API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.");
    } else if (error.response?.status === 500) {
      throw new Error("NewsAPI sunucu hatası. Lütfen daha sonra tekrar deneyin.");
    }
    
    throw error;
  }
}

function getCategoryFromArticle(article: any): string {
  const title = article.title?.toLowerCase() || "";
  const description = article.description?.toLowerCase() || "";
  const source = article.source?.name?.toLowerCase() || "";
  
  // Finans kaynakları
  if (source.includes('bloomberg') || source.includes('financial') || source.includes('wall street')) {
    return "finans";
  }
  
  // Siyaset anahtar kelimeleri
  const politicsKeywords = ['politics', 'government', 'election', 'president', 'minister', 'parliament', 'congress', 'senate'];
  if (politicsKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return "siyaset";
  }
  
  // Finans anahtar kelimeleri
  const financeKeywords = ['economy', 'market', 'stock', 'finance', 'business', 'trade', 'investment', 'bank'];
  if (financeKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return "finans";
  }
  
  return "dünya";
}

function getImportanceScore(article: any): number {
  const title = article.title?.toLowerCase() || "";
  const description = article.description?.toLowerCase() || "";
  const source = article.source?.name?.toLowerCase() || "";
  
  // Kaynak güvenilirliği puanı
  let sourceScore = 2;
  if (['bbc', 'reuters', 'associated press', 'cnn'].some(s => source.includes(s))) {
    sourceScore = 4;
  } else if (['bloomberg', 'financial times', 'wall street journal'].some(s => source.includes(s))) {
    sourceScore = 4;
  }
  
  // Önemli anahtar kelimeler
  const criticalKeywords = ['breaking', 'urgent', 'crisis', 'emergency', 'war', 'attack', 'disaster'];
  const importantKeywords = ['major', 'significant', 'important', 'critical', 'key', 'election', 'president'];
  
  if (criticalKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return Math.min(5, sourceScore + 1);
  }
  if (importantKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return Math.min(4, sourceScore);
  }
  
  return sourceScore;
}