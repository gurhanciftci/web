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
import { API_CONFIG, validateApiKeys, getEnvironmentInfo } from "./config/api";
import { useServiceWorker } from "./hooks/useServiceWorker";

function AppContent() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'news' | 'favorites'>('news');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const { isRegistered, isWaiting, updateServiceWorker } = useServiceWorker();

  const loadNews = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🔄 Haberler yükleniyor...');
      const newsData = await fetchNews();
      
      console.log(`✅ ${newsData.length} haber başarıyla yüklendi`);
      setNews(newsData);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err: any) {
      console.error("❌ Haber yükleme hatası:", err);
      
      const errorMessage = err.message || "Haberler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      setError(errorMessage);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
      
      // If we have cached news, show them with error
      if (news.length === 0) {
        // Try to get any cached data as fallback
        try {
          const fallbackNews = await fetchNews();
          if (fallbackNews.length > 0) {
            setNews(fallbackNews);
            console.log('📰 Fallback veriler kullanıldı');
          }
        } catch (fallbackError) {
          console.error('❌ Fallback veriler de yüklenemedi:', fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadNews(false); // Don't show loading spinner for refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetry = () => {
    console.log(`🔄 Yeniden deneme #${retryCount + 1}`);
    loadNews();
  };

  useEffect(() => {
    // Log environment info on startup
    const envInfo = getEnvironmentInfo();
    const apiValidation = validateApiKeys();
    
    console.log('🚀 Global News App başlatılıyor...');
    console.log('🔧 Environment:', envInfo);
    console.log('🔑 API Validation:', apiValidation);

    if (currentPage === 'news') {
      loadNews();
      
      // Get user preferences for auto-refresh
      const preferences = localStorage.getItem('user-preferences');
      const autoRefresh = preferences ? JSON.parse(preferences).autoRefresh !== false : true;
      
      if (autoRefresh && !error) {
        const interval = setInterval(() => {
          // Only auto-refresh if no error and not manually refreshing
          if (!error && !isRefreshing) {
            console.log('🔄 Otomatik yenileme...');
            loadNews(false);
          }
        }, API_CONFIG.NEWS_REFRESH_INTERVAL);
        
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
      const updateApp = () => {
        updateServiceWorker();
        window.location.reload();
      };
      
      console.log('🔄 Yeni sürüm mevcut! Güncelleme için tıklayın.');
    }
  }, [isWaiting, updateServiceWorker]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 İnternet bağlantısı kuruldu');
      if (currentPage === 'news' && (error || news.length === 0)) {
        loadNews();
      }
    };

    const handleOffline = () => {
      console.log('📴 İnternet bağlantısı kesildi');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentPage, error, news.length]);

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
                {error && (
                  <div className="container mx-auto px-4 py-6">
                    <ErrorMessage 
                      message={error} 
                      onRetry={handleRetry}
                      showDebugInfo={getEnvironmentInfo().isDevelopment}
                    />
                  </div>
                )}
                {!loading && <NewsList news={news} />}
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
            
            {/* Status Info */}
            <div className="mt-4 text-xs text-gray-500">
              <span className="hidden md:inline">
                Kısayollar: F (Favoriler) • H (Ana Sayfa) • P (Tercihler) • R (Yenile)
              </span>
              {getEnvironmentInfo().isDevelopment && (
                <div className="mt-2">
                  <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                    DEV MODE
                  </span>
                </div>
              )}
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