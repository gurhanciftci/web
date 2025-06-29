import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import TickerBar from "./components/TickerBar";
import NewsList from "./components/NewsList";
import FavoritesPage from "./components/FavoritesPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import FloatingClock from "./components/FloatingClock";
import PullToRefresh from "./components/PullToRefresh";
import OfflineIndicator from "./components/OfflineIndicator";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import UserPreferencesPanel from "./components/UserPreferencesPanel";
import { fetchNews } from "./api/newsApi";
import { NewsItem } from "./types/news";
import { API_CONFIG } from "./config/api";
import { useServiceWorker } from "./hooks/useServiceWorker";

function AppContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'news' | 'favorites'>('news');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { isRegistered, isWaiting, updateServiceWorker } = useServiceWorker();

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadNews();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'news') {
      loadNews();
      
      // Get user preferences for auto-refresh
      const preferences = localStorage.getItem('user-preferences');
      const autoRefresh = preferences ? JSON.parse(preferences).autoRefresh !== false : true;
      
      if (autoRefresh) {
        const interval = setInterval(loadNews, API_CONFIG.NEWS_REFRESH_INTERVAL);
        return () => clearInterval(interval);
      }
    }
  }, [currentPage]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // Ignore if Ctrl/Cmd is pressed
      
      switch (e.key.toLowerCase()) {
        case 'f':
          setCurrentPage('favorites');
          break;
        case 'h':
          setCurrentPage('news');
          break;
        case 't':
          // Theme toggle is handled in ThemeContext
          break;
        case 'p':
          setShowPreferences(true);
          break;
        case 'r':
          if (currentPage === 'news') {
            handleRefresh();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  // Service Worker update notification
  useEffect(() => {
    if (isWaiting) {
      // Show update notification
      const updateApp = () => {
        updateServiceWorker();
        window.location.reload();
      };
      
      // You could show a toast notification here
      console.log('New version available! Click to update.');
    }
  }, [isWaiting, updateServiceWorker]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <OfflineIndicator />
        
        <Header 
          onPageChange={setCurrentPage} 
          currentPage={currentPage}
          onOpenPreferences={() => setShowPreferences(true)}
        />
        
        {currentPage === 'news' && <TickerBar />}
        
        <FloatingClock />
        
        <PullToRefresh onRefresh={handleRefresh} disabled={currentPage !== 'news'}>
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
        </PullToRefresh>
        
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300">
              © 2025 Global News. Tüm hakları saklıdır.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Haberler çeşitli kaynaklardan otomatik olarak toplanmaktadır.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              PWA Destekli • Çevrimdışı Çalışır • Güvenli ve Optimize Edilmiş
            </p>
            
            {/* Keyboard shortcuts info */}
            <div className="mt-4 text-xs text-gray-500">
              <span className="hidden md:inline">
                Kısayollar: F (Favoriler) • H (Ana Sayfa) • P (Tercihler) • R (Yenile)
              </span>
            </div>
          </div>
        </footer>
        
        <PWAInstallPrompt />
        
        <UserPreferencesPanel 
          isOpen={showPreferences} 
          onClose={() => setShowPreferences(false)} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}