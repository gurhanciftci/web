import React, { useEffect, useState } from "react";
import TickerBar from "./components/TickerBar";
import NewsList from "./components/NewsList";
import { fetchNews } from "./api/newsApi";

export default function App() {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    fetchNews().then(setNews);
  }, []);
  return (
    <div>
      <TickerBar />
      <div className="container mx-auto mt-4">
        <NewsList news={news} />
      </div>
    </div>
  );
}