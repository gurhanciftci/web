import axios from "axios";
import { NewsItem } from "../types/news";

const API_KEY = "U6jRdWC3PanPPlgEPqRc2eRQnLpefYfT185naPWDtcNsg_AW";
const BASE_URL = "https://api.currentsapi.services/v1/latest-news";

const CATEGORY_MAP: Record<string, string> = {
  world: "dünya",
  politics: "siyaset",
  business: "finans",
  finance: "finans",
  economy: "finans",
  technology: "dünya",
  health: "dünya",
  sports: "dünya",
  entertainment: "dünya"
};

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: API_KEY
      },
      params: {
        language: "tr"
      }
    });

    if (!response.data?.news) {
      throw new Error("Haber verisi alınamadı");
    }

    return response.data.news.map((item: any) => ({
      title: item.title || "Başlık bulunamadı",
      description: item.description || "Açıklama bulunamadı",
      url: item.url || "#",
      category: CATEGORY_MAP[item.category] || "dünya",
      importance: getImportanceScore(item),
      publishedAt: item.published,
      imageUrl: item.image
    }));
  } catch (error) {
    console.error("Haber API hatası:", error);
    return [];
  }
}

function getImportanceScore(item: any): number {
  const title = item.title?.toLowerCase() || "";
  const description = item.description?.toLowerCase() || "";
  
  const veryImportantWords = ["deprem", "terör", "felaket", "ölüm", "yangın"];
  const importantWords = ["acil", "son dakika", "kriz", "alarm", "savaş", "seçim"];
  const moderateWords = ["önemli", "büyük", "kritik"];
  
  if (veryImportantWords.some(word => title.includes(word) || description.includes(word))) {
    return 5;
  }
  if (importantWords.some(word => title.includes(word) || description.includes(word))) {
    return 4;
  }
  if (moderateWords.some(word => title.includes(word) || description.includes(word))) {
    return 3;
  }
  
  return 2;
}