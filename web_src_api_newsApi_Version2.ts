import axios from "axios";

const API_KEY = "U6jRdWC3PanPPlgEPqRc2eRQnLpefYfT185naPWDtcNsg_AW";
const BASE_URL = "https://api.currentsapi.services/v1/latest-news";

const CATEGORY_MAP: Record<string, string> = {
  world: "dünya",
  politics: "siyaset",
  business: "finans",
  finance: "finans",
  economy: "finans"
};

export async function fetchNews() {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: API_KEY
    },
    params: {
      language: "tr"
    }
  });

  return response.data.news.map((item: any) => ({
    title: item.title,
    description: item.description,
    url: item.url,
    category: CATEGORY_MAP[item.category] || "dünya",
    importance: getImportanceScore(item)
  }));
}

function getImportanceScore(item: any): number {
  const importantWords = ["acil", "son dakika", "kriz", "alarm", "savaş"];
  const veryImportantWords = ["deprem", "terör", "felaket"];
  let score = 1;
  if (importantWords.some(word => item.title?.toLowerCase().includes(word))) score = 3;
  if (veryImportantWords.some(word => item.title?.toLowerCase().includes(word))) score = 5;
  return score;
}