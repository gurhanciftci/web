import React, { useEffect, useState } from "react";
import { fetchMarketData } from "../api/marketApi";

export default function TickerBar() {
  const [text, setText] = useState("Piyasa verileri yükleniyor...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const data = await fetchMarketData();
        setText(data);
        setIsLoading(false);
      } catch (error) {
        setText("Piyasa verileri yüklenemedi");
        setIsLoading(false);
      }
    };

    loadMarketData();
    const interval = setInterval(loadMarketData, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-black text-yellow-300 overflow-hidden whitespace-nowrap py-3 border-b-2 border-yellow-400">
      <div className="inline-block animate-ticker min-w-full">
        <span className="mr-8 text-yellow-400 font-semibold">📈 CANLI PİYASA VERİLERİ:</span>
        {isLoading ? (
          <span className="animate-pulse">Yükleniyor...</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
}