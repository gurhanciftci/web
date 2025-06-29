import axios from "axios";
import { NewsItem, ApiKeyStatus } from "../types/news";

// GNews API - Ücretsiz günlük 100 istek
// https://gnews.io/ adresinden ücretsiz API key alabilirsiniz
const GNEWS_API_KEY = "YOUR_GNEWS_API_KEY_HERE";
const GNEWS_BASE_URL = "https://gnews.io/api/v4";

// The Guardian API - Tamamen ücretsiz
// https://open-platform.theguardian.com/access/ adresinden ücretsiz API key alabilirsiniz
const GUARDIAN_API_KEY = "YOUR_GUARDIAN_API_KEY_HERE";
const GUARDIAN_BASE_URL = "https://content.guardianapis.com";

// Currents API - Günlük 600 ücretsiz istek
// https://currentsapi.services/en adresinden ücretsiz API key alabilirsiniz
const CURRENTS_API_KEY = "YOUR_CURRENTS_API_KEY_HERE";
const CURRENTS_BASE_URL = "https://api.currentsapi.services/v1";

// Aktif API seçimi (değiştirilebilir)
const ACTIVE_API = "guardian"; // "gnews", "guardian", "currents" veya "rss"

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
  let hasValidKey = false;
  
  switch (ACTIVE_API) {
    case "gnews":
      hasValidKey = GNEWS_API_KEY !== "YOUR_GNEWS_API_KEY_HERE";
      break;
    case "guardian":
      hasValidKey = GUARDIAN_API_KEY !== "YOUR_GUARDIAN_API_KEY_HERE";
      break;
    case "currents":
      hasValidKey = CURRENTS_API_KEY !== "YOUR_CURRENTS_API_KEY_HERE";
      break;
    case "rss":
      hasValidKey = true; // RSS için API key gerekmez
      break;
  }
  
  return {
    hasCustomKey: hasValidKey,
    isValid: hasValidKey
  };
}

export async function fetchNews(): Promise<NewsItem[]> {
  switch (ACTIVE_API) {
    case "gnews":
      return fetchFromGNews();
    case "guardian":
      return fetchFromGuardian();
    case "currents":
      return fetchFromCurrents();
    case "rss":
      return fetchFromRSS();
    default:
      return fetchFromRSS(); // Fallback to RSS
  }
}

// GNews API (Günlük 100 ücretsiz istek)
async function fetchFromGNews(): Promise<NewsItem[]> {
  if (GNEWS_API_KEY === "YOUR_GNEWS_API_KEY_HERE") {
    throw new Error("GNews API anahtarı ayarlanmamış. https://gnews.io/ adresinden ücretsiz API key alın.");
  }

  try {
    const response = await axios.get(`${GNEWS_BASE_URL}/top-headlines`, {
      params: {
        token: GNEWS_API_KEY,
        lang: "en",
        country: "us",
        max: 50
      }
    });

    return response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      category: getCategoryFromContent(article.title, article.description),
      importance: getImportanceScore(article.title, article.description),
      publishedAt: article.publishedAt,
      imageUrl: article.image,
      source: article.source.name
    }));
  } catch (error: any) {
    console.error("GNews API hatası:", error);
    throw new Error("Haberler yüklenirken hata oluştu. API limitiniz dolmuş olabilir.");
  }
}

// The Guardian API (Tamamen ücretsiz)
async function fetchFromGuardian(): Promise<NewsItem[]> {
  if (GUARDIAN_API_KEY === "YOUR_GUARDIAN_API_KEY_HERE") {
    throw new Error("Guardian API anahtarı ayarlanmamış. https://open-platform.theguardian.com/access/ adresinden ücretsiz API key alın.");
  }

  try {
    const response = await axios.get(`${GUARDIAN_BASE_URL}/search`, {
      params: {
        "api-key": GUARDIAN_API_KEY,
        "show-fields": "headline,trailText,thumbnail,short-url",
        "page-size": 50,
        "order-by": "newest"
      }
    });

    return response.data.response.results.map((article: any) => ({
      title: article.fields?.headline || article.webTitle,
      description: article.fields?.trailText || "Açıklama mevcut değil",
      url: article.fields?.shortUrl || article.webUrl,
      category: getCategoryFromSection(article.sectionName),
      importance: getImportanceFromGuardian(article),
      publishedAt: article.webPublicationDate,
      imageUrl: article.fields?.thumbnail,
      source: "The Guardian"
    }));
  } catch (error: any) {
    console.error("Guardian API hatası:", error);
    throw new Error("Guardian'dan haberler yüklenirken hata oluştu.");
  }
}

// Currents API (Günlük 600 ücretsiz istek)
async function fetchFromCurrents(): Promise<NewsItem[]> {
  if (CURRENTS_API_KEY === "YOUR_CURRENTS_API_KEY_HERE") {
    throw new Error("Currents API anahtarı ayarlanmamış. https://currentsapi.services/en adresinden ücretsiz API key alın.");
  }

  try {
    const response = await axios.get(`${CURRENTS_BASE_URL}/latest-news`, {
      headers: {
        Authorization: CURRENTS_API_KEY
      },
      params: {
        language: "en",
        page_size: 50
      }
    });

    return response.data.news.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      category: CATEGORY_MAP[article.category] || "dünya",
      importance: getImportanceScore(article.title, article.description),
      publishedAt: article.published,
      imageUrl: article.image,
      source: "Currents API"
    }));
  } catch (error: any) {
    console.error("Currents API hatası:", error);
    throw new Error("Currents'tan haberler yüklenirken hata oluştu.");
  }
}

// RSS Feed'lerden haber çekme (Tamamen ücretsiz, API key gerektirmez)
async function fetchFromRSS(): Promise<NewsItem[]> {
  const rssFeeds = [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "BBC World", category: "dünya" },
    { url: "https://www.theguardian.com/world/rss", source: "Guardian World", category: "dünya" },
    { url: "https://feeds.reuters.com/reuters/businessNews", source: "Reuters Business", category: "finans" },
    { url: "https://feeds.reuters.com/Reuters/PoliticsNews", source: "Reuters Politics", category: "siyaset" }
  ];

  try {
    // RSS-to-JSON API kullanarak RSS feed'leri JSON'a çeviriyoruz
    const allNews: NewsItem[] = [];
    
    for (const feed of rssFeeds) {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json`, {
          params: {
            rss_url: feed.url,
            api_key: "public", // Ücretsiz public API
            count: 10
          }
        });

        if (response.data.status === "ok") {
          const items = response.data.items.map((item: any) => ({
            title: item.title,
            description: item.description?.replace(/<[^>]*>/g, '') || "Açıklama mevcut değil",
            url: item.link,
            category: feed.category,
            importance: getImportanceScore(item.title, item.description),
            publishedAt: item.pubDate,
            imageUrl: item.enclosure?.link || item.thumbnail,
            source: feed.source
          }));
          allNews.push(...items);
        }
      } catch (feedError) {
        console.warn(`RSS feed hatası (${feed.source}):`, feedError);
      }
    }

    return allNews.slice(0, 50);
  } catch (error: any) {
    console.error("RSS feed hatası:", error);
    throw new Error("RSS feed'lerden haberler yüklenirken hata oluştu.");
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

function getCategoryFromSection(section: string): string {
  const sectionLower = section.toLowerCase();
  if (sectionLower.includes('politic')) return "siyaset";
  if (sectionLower.includes('business') || sectionLower.includes('money')) return "finans";
  return "dünya";
}

function getImportanceScore(title: string, description: string): number {
  const content = `${title} ${description}`.toLowerCase();
  
  const criticalKeywords = ['breaking', 'urgent', 'crisis', 'emergency', 'war', 'attack', 'disaster'];
  const importantKeywords = ['major', 'significant', 'important', 'critical', 'election', 'president'];
  
  if (criticalKeywords.some(keyword => content.includes(keyword))) {
    return 5;
  }
  if (importantKeywords.some(keyword => content.includes(keyword))) {
    return 4;
  }
  return 3;
}

function getImportanceFromGuardian(article: any): number {
  // Guardian'ın kendi önem sıralamasını kullan
  if (article.fields?.headline?.toLowerCase().includes('breaking')) return 5;
  if (article.sectionName === 'World news' || article.sectionName === 'Politics') return 4;
  return 3;
}