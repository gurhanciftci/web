import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import TickerBar from "./components/TickerBar";
import NewsList from "./components/NewsList";
import FavoritesPage from "./components/FavoritesPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import FloatingClock from "./components/FloatingClock";
import { fetchNews } from "./api/newsApi";
import { NewsItem } from "./types/news";
import { API_CONFIG } from "./config/api";

function AppContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'news' | 'favorites'>('news');

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (err: any) {
      setError(err.message || "Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      console.error("Haber yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'news') {
      loadNews();
      
      // Optimized refresh interval - 15 minutes instead of 5
      const interval = setInterval(loadNews, API_CONFIG.NEWS_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header onPageChange={setCurrentPage} currentPage={currentPage} />
        {currentPage === 'news' && <TickerBar />}
        
        {/* Responsive Floating Clock */}
        <FloatingClock />
        
        <main className="pb-8">
          {currentPage === 'news' ? (
            <>
              {loading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} onRetry={loadNews} />}
              {!loading && !error && <NewsList news={news} />}
            </>
          ) : (
            <FavoritesPage />
          )}
        </main>
        
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              © 2025 Global News. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Haberler çeşitli kaynaklardan otomatik olarak toplanmaktadır.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Çeviri: MyMemory API • Favoriler: Yerel Depolama • Güvenli ve Optimize Edilmiş
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}