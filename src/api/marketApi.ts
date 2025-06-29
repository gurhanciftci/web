import axios from "axios";
import { MarketData } from "../types/news";

const TWELVE_DATA_KEY = "3dd8fc65d4af49bf95872f70c8a04c9d";
const BASE_TWELVE = `https://api.twelvedata.com/price?apikey=${TWELVE_DATA_KEY}`;

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
  const results = await Promise.all(
    queries.map(async ({ key, symbol }) => {
      try {
        const res = await axios.get(`${BASE_TWELVE}&symbol=${encodeURIComponent(symbol)}`);
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
  return results.join("  |  ");
}

export async function fetchDetailedMarketData(): Promise<MarketData[]> {
  const results = await Promise.all(
    queries.map(async ({ key, symbol }) => {
      try {
        const res = await axios.get(`${BASE_TWELVE}&symbol=${encodeURIComponent(symbol)}`);
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
  return results;
}