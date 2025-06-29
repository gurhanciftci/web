import React, { useEffect, useState } from "react";
import { fetchMarketData } from "../api/marketApi";

export default function TickerBar() {
  const [text, setText] = useState("Yükleniyor...");

  useEffect(() => {
    fetchMarketData().then(setText);
    const interval = setInterval(() => {
      fetchMarketData().then(setText);
    }, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-yellow-300 overflow-hidden whitespace-nowrap py-2">
      <div className="inline-block animate-ticker min-w-full">
        {text}
      </div>
    </div>
  );
}