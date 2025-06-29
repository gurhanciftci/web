export interface NewsItem {
  title: string;
  description: string;
  url: string;
  category: string;
  importance: number;
  publishedAt?: string;
  imageUrl?: string;
  source?: string;
  id?: string; // Favoriler için unique ID
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change?: string;
  changePercent?: string;
}

export interface ApiKeyStatus {
  hasCustomKey: boolean;
  isValid: boolean;
}

export interface FavoriteNews extends NewsItem {
  addedAt: string;
}

export interface TranslatedContent {
  title: string;
  description: string;
  isTranslated: boolean;
}