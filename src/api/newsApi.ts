import axios from "axios";
import { NewsItem } from "../types/news";

// NewsAPI kullanarak güvenilir kaynaklardan haber çekme
const NEWS_API_KEY = "U6jRdWC3PanPPlgEPqRc2eRQnLpefYfT185naPWDtcNsg_AW";
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

// API key kontrolü
function checkApiKey(): boolean {
  return NEWS_API_KEY && NEWS_API_KEY !== "YOUR_NEWS_API_KEY_HERE";
}

export async function fetchNews(): Promise<NewsItem[]> {
  if (!checkApiKey()) {
    console.error("NewsAPI key bulunamadı. Lütfen src/api/newsApi.ts dosyasında NEWS_API_KEY değişkenini güncelleyin.");
    return getMockNews(); // API key yoksa örnek haberler döndür
  }

  try {
    // Güvenilir kaynaklardan genel haberler
    const generalResponse = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        apiKey: NEWS_API_KEY,
        sources: RELIABLE_SOURCES.slice(0, 10).join(','), // İlk 10 kaynağı kullan
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
      .slice(0, 50); // En fazla 50 haber göster

  } catch (error) {
    console.error("NewsAPI hatası:", error);
    return getMockNews(); // Hata durumunda örnek haberler döndür
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

// API key yoksa gösterilecek örnek haberler
function getMockNews(): NewsItem[] {
  return [
    {
      title: "NewsAPI Key Gerekli",
      description: "Gerçek haberleri görmek için NewsAPI key'inizi src/api/newsApi.ts dosyasında NEWS_API_KEY değişkenine ekleyin. NewsAPI.org'dan ücretsiz key alabilirsiniz.",
      url: "https://newsapi.org/register",
      category: "dünya",
      importance: 5,
      publishedAt: new Date().toISOString(),
      source: "System"
    },
    {
      title: "Güvenilir Haber Kaynakları",
      description: "Bu uygulama BBC, CNN, Reuters, Bloomberg, Financial Times gibi güvenilir kaynaklardan haber çeker. API key ekledikten sonra gerçek haberler görünecektir.",
      url: "https://newsapi.org/docs",
      category: "dünya",
      importance: 4,
      publishedAt: new Date().toISOString(),
      source: "System"
    },
    {
      title: "API Key Nasıl Alınır?",
      description: "1. NewsAPI.org'a gidin 2. Ücretsiz hesap oluşturun 3. API key'inizi alın 4. src/api/newsApi.ts dosyasında NEWS_API_KEY değişkenini güncelleyin",
      url: "https://newsapi.org/register",
      category: "dünya",
      importance: 3,
      publishedAt: new Date().toISOString(),
      source: "System"
    }
  ];
}

// API key durumunu kontrol etmek için yardımcı fonksiyon
export function getApiKeyStatus(): { hasKey: boolean; message: string } {
  const hasKey = checkApiKey();
  return {
    hasKey,
    message: hasKey 
      ? "NewsAPI bağlantısı aktif" 
      : "NewsAPI key gerekli - lütfen src/api/newsApi.ts dosyasını güncelleyin"
  };
}