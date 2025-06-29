import React, { useEffect, useState } from "react";
import { fetchMarketData } from "../api/marketApi";
import { API_CONFIG } from "../config/api";

export default function TickerBar() {
  const [text, setText] = useState("Piyasa verileri yükleniyor...");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setError(null);
        const data = await fetchMarketData();
        setText(data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Market data error:", error);
        setError("Piyasa verileri yüklenemedi");
        setText("Piyasa verileri geçici olarak kullanılamıyor");
        setIsLoading(false);
      }
    };

    loadMarketData();
    // Optimized interval - 5 minutes instead of 1 minute
    const interval = setInterval(loadMarketData, API_CONFIG.MARKET_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 text-yellow-300 overflow-hidden whitespace-nowrap py-3 border-b-2 border-yellow-400">
      <div className="inline-block animate-ticker min-w-full">
        <span className="mr-8 text-yellow-400 font-semibold">
          📈 CANLI PİYASA VERİLERİ:
        </span>
        {isLoading ? (
          <span className="animate-pulse">Yükleniyor...</span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          <span>{text}</span>
        )}
        {!isLoading && !error && (
          <span className="ml-8 text-gray-400 text-sm">
            • Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
          </span>
        )}
      </div>
    </div>
  );
}