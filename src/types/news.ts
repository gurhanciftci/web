export interface NewsItem {
  title: string;
  description: string;
  url: string;
  category: string;
  importance: number;
  publishedAt?: string;
  imageUrl?: string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change?: string;
  changePercent?: string;
}