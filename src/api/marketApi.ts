import axios from "axios";
import { MarketData } from "../types/news";
import { API_CONFIG } from "../config/api";
import { rateLimiter } from "../utils/security";
import { cache, persistentCache } from "../utils/cache";

const queries = [
  { key: "S&P 500", symbol: "SPX" },
  { key: "NASDAQ", symbol: "IXIC" },
  { key: "USD/EUR", symbol: "USDEUR" },
  { key: "USD/TRY", symbol: "USDTRY" },
  { key: "Altın", symbol: "XAU/USD" },
  { key: "Brent Petrol", symbol: "BRN" },
  { key: "Gümüş", symbol: "XAG/USD" },
  { key: "Bitcoin", symbol: "BTC/USD" }
];

export async function fetchMarketData(): Promise<string> {
  const cacheKey = 'market-ticker';
  
  // Check cache first
  const cachedData = cache.get<string>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Rate limiting check
  if (!rateLimiter.canMakeRequest('market-api', 5, 60 * 1000)) {
    const fallbackData = persistentCache.get<string>(cacheKey);
    if (fallbackData) return fallbackData;
    throw new Error("Market API rate limit exceeded");
  }

  const results = await Promise.all(
    queries.slice(0, 6).map(async ({ key, symbol }) => { // Reduced to 6 items
      try {
        const res = await axios.get(`${API_CONFIG.TWELVE_DATA_BASE_URL}/price`, {
          params: {
            apikey: API_CONFIG.TWELVE_DATA_KEY,
            symbol: symbol
          },
          timeout: 5000
        });
        const price = res.data?.price;
        if (price) {
          return `${key}: $${parseFloat(price).toFixed(2)}`;
        }
        return `${key}: ?`;
      } catch (error) {
        console.error(`${key} verisi alınamadı:`, error);
        return `${key}: ?`;
      }
    })
  );

  const tickerText = results.join("  |  ");
  
  // Cache the results
  cache.set(cacheKey, tickerText, 5 * 60 * 1000); // 5 minutes
  persistentCache.set(cacheKey, tickerText, 30 * 60 * 1000); // 30 minutes

  return tickerText;
}

export async function fetchDetailedMarketData(): Promise<MarketData[]> {
  const cacheKey = 'detailed-market-data';
  
  // Check cache first
  const cachedData = cache.get<MarketData[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const results = await Promise.all(
    queries.map(async ({ key, symbol }) => {
      try {
        const res = await axios.get(`${API_CONFIG.TWELVE_DATA_BASE_URL}/price`, {
          params: {
            apikey: API_CONFIG.TWELVE_DATA_KEY,
            symbol: symbol
          },
          timeout: 5000
        });
        return {
          symbol,
          name: key,
          price: res.data?.price ? `$${parseFloat(res.data.price).toFixed(2)}` : "?",
        };
      } catch (error) {
        return {
          symbol,
          name: key,
          price: "?",
        };
      }
    })
  );

  // Cache the results
  cache.set(cacheKey, results, 5 * 60 * 1000); // 5 minutes
  persistentCache.set(cacheKey, results, 30 * 60 * 1000); // 30 minutes

  return results;
}