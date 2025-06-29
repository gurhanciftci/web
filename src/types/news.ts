export interface NewsItem {
  title: string;
  description: string;
  url: string;
  category: string;
  importance: number;
  publishedAt?: string;
  imageUrl?: string;
  source?: string; // Haber kaynağı bilgisi eklendi
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change?: string;
  changePercent?: string;
}

export interface ApiKeyStatus {
  hasKey: boolean;
  message: string;
}