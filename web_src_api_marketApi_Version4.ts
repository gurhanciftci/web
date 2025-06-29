import axios from "axios";

const TWELVE_DATA_KEY = "3dd8fc65d4af49bf95872f70c8a04c9d";
const BASE_TWELVE = `https://api.twelvedata.com/price?apikey=${TWELVE_DATA_KEY}`;

const queries = [
  { key: "S&P 500", symbol: "SPX" },
  { key: "NASDAQ", symbol: "IXIC" },
  { key: "USD/EUR", symbol: "USDEUR" },
  { key: "Altın", symbol: "XAU/USD" },
  { key: "Brent Petrol", symbol: "BRN" },
  { key: "Gümüş", symbol: "XAG/USD" }
];

export async function fetchMarketData(): Promise<string> {
  const results = await Promise.all(
    queries.map(async ({ key, symbol }) => {
      try {
        const res = await axios.get(`${BASE_TWELVE}&symbol=${encodeURIComponent(symbol)}`);
        return `${key}: ${res.data.price ?? "?"}`;
      } catch {
        return `${key}: ?`;
      }
    })
  );
  return results.join("  |  ");
}