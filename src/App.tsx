import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import TickerBar from "./components/TickerBar";
import NewsList from "./components/NewsList";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { fetchNews } from "./api/newsApi";
import { NewsItem } from "./types/news";

function AppContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (err) {
      setError("Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      console.error("Haber yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    
    // Her 5 dakikada bir haberleri güncelle
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <TickerBar />
      
      <main>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={loadNews} />}
        {!loading && !error && <NewsList news={news} />}
      </main>
      
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 Global News. Tüm hakları saklıdır.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Haberler çeşitli kaynaklardan otomatik olarak toplanmaktadır.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}