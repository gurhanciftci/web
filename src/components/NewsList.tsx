import React, { useState } from "react";
import { NewsItem, TranslatedContent } from "../types/news";
import SearchBar from "./SearchBar";
import ShareButtons from "./ShareButtons";
import FavoriteButton from "./FavoriteButton";
import TranslationButton from "./TranslationButton";
import ImageWithFallback from "./ImageWithFallback";
import EnhancedSkeletonLoader from "./EnhancedSkeletonLoader";
import AdvancedSearch from "./AdvancedSearch";
import VirtualScrollList from "./VirtualScrollList";
import NewsAnalyticsPanel from "./NewsAnalyticsPanel";
import { getApiKeyStatus } from "../api/newsApi";
import { useToast } from "../contexts/ToastContext";
import { prioritizationEngine } from "../utils/newsPrioritization";

const getImportanceLabel = (importance: number) => {
  if (importance >= 5) return "Çok Önemli";
  if (importance >= 4) return "Önemli";
  if (importance >= 3) return "Orta";
  return "Normal";
};

const getImportanceColor = (importance: number) => {
  if (importance >= 5) return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  if (importance >= 4) return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
  if (importance >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    dünya: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    siyaset: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    finans: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
};

interface NewsListProps {
  news: NewsItem[];
}

export default function NewsList({ news }: NewsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"importance" | "date" | "priority">("priority");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [translations, setTranslations] = useState<Record<string, TranslatedContent>>({});
  const [favoritesUpdate, setFavoritesUpdate] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [useVirtualScroll, setUseVirtualScroll] = useState(false);
  
  const apiStatus = getApiKeyStatus();
  const { showSuccess, showInfo } = useToast();

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "dünya", label: "Dünya" },
    { value: "finans", label: "Finans" },
    { value: "siyaset", label: "Siyaset" }
  ];

  // Enhanced filtering and sorting with prioritization
  const filteredNews = news
    .filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const analyticsA = prioritizationEngine.analyzeNews(a);
        const analyticsB = prioritizationEngine.analyzeNews(b);
        return analyticsB.priorityScore - analyticsA.priorityScore;
      } else if (sortBy === "importance") {
        return b.importance - a.importance;
      }
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });

  const handleTranslation = (newsUrl: string, translation: TranslatedContent | null) => {
    setTranslations(prev => {
      const newTranslations = { ...prev };
      if (translation) {
        newTranslations[newsUrl] = translation;
      } else {
        delete newTranslations[newsUrl];
      }
      return newTranslations;
    });
  };

  const handleFavoriteToggle = () => {
    setFavoritesUpdate(prev => prev + 1);
    showSuccess('Favori Güncellendi', 'Haber favorilerinize eklendi/çıkarıldı');
  };

  const handleAdvancedSearch = (filters: any) => {
    setSearchTerm(filters.query);
    setSelectedCategory(filters.category);
    setSortBy(filters.sortBy === 'relevance' ? 'priority' : filters.sortBy);
    showInfo('Arama Uygulandı', 'Gelişmiş arama filtreleri uygulandı');
  };

  const renderNewsItem = (item: NewsItem, index: number) => {
    const translation = translations[item.url];
    const displayTitle = translation?.title || item.title;
    const displayDescription = translation?.description || item.description;
    const imageKey = `${item.url}-${index}`;
    
    // Get prioritization analytics
    const analytics = prioritizationEngine.analyzeNews(item);
    const priorityColor = analytics.priorityScore >= 4 ? 'border-l-red-500' :
                         analytics.priorityScore >= 3.5 ? 'border-l-orange-500' :
                         analytics.priorityScore >= 2.5 ? 'border-l-blue-500' : 'border-l-gray-300';

    return (
      <article key={item.id || index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 border-l-4 ${priorityColor} group`}>
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Optimized Image Component */}
            <div className="relative flex-shrink-0">
              <div 
                className="relative"
                onMouseEnter={() => item.imageUrl && setHoveredImage(imageKey)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                  fallbackClassName="w-16 h-16 rounded-lg"
                />
                
                {/* Enhanced Hover Preview */}
                {hoveredImage === imageKey && item.imageUrl && (
                  <div className="absolute z-50 left-20 top-0 pointer-events-none">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600 p-2 transform transition-all duration-200 animate-in fade-in zoom-in-95">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-64 h-40 object-cover rounded-lg"
                        fallbackClassName="w-64 h-40 rounded-lg"
                      />
                      <div className="mt-2 p-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {displayTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Haber İçeriği */}
            <div className="flex-1 min-w-0">
              {/* Enhanced Tags with Priority Score */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)} transition-colors`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(item.importance)} transition-colors`}>
                  {getImportanceLabel(item.importance)}
                </span>
                {/* Priority Score Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  analytics.priorityScore >= 4 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  analytics.priorityScore >= 3.5 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  analytics.priorityScore >= 2.5 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  📊 {analytics.priorityScore.toFixed(1)}
                </span>
                {analytics.category === 'breaking' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                    🚨 SON DAKİKA
                  </span>
                )}
                {item.source && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-colors">
                    {item.source}
                  </span>
                )}
                {translation && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 transition-colors">
                    Çevrildi
                  </span>
                )}
                {item.imageUrl && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 transition-colors">
                    📷 Resimli
                  </span>
                )}
                {item.publishedAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              
              {/* Enhanced Title */}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {displayTitle}
                </a>
              </h2>
              
              {/* Enhanced Description */}
              {displayDescription && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
                  {displayDescription.length > 150 
                    ? `${displayDescription.substring(0, 150)}...` 
                    : displayDescription
                  }
                </p>
              )}
              
              {/* Enhanced Actions */}
              <div className="flex items-center justify-between">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors group-hover:text-blue-700"
                >
                  Haberi Oku
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <div className="flex items-center gap-2">
                  <FavoriteButton 
                    newsItem={item} 
                    onToggle={handleFavoriteToggle}
                  />
                  <TranslationButton
                    newsItem={item}
                    onTranslate={(translation) => handleTranslation(item.url, translation)}
                    isTranslated={!!translation}
                  />
                  <ShareButtons title={displayTitle} url={item.url} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  if (news.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Haberler Yükleniyor</h2>
          <p className="text-gray-500 dark:text-gray-400">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* API Key Durumu */}
      {!apiStatus.hasCustomKey && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 dark:text-yellow-400 text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">API Key Gerekli</h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                Gerçek haberleri görmek için <a href="https://open-platform.theguardian.com/access/" target="_blank" rel="noopener noreferrer" className="underline font-medium">Guardian API</a>'dan ücretsiz API key alın ve .env dosyasında VITE_GUARDIAN_API_KEY değişkenini güncelleyin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sıralama:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "importance" | "date" | "priority")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="priority">AI Öncelik Puanı</option>
              <option value="importance">Önem Derecesi</option>
              <option value="date">Tarih</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Gelişmiş
            </button>
            <button
              onClick={() => setUseVirtualScroll(!useVirtualScroll)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                useVirtualScroll 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200'
              }`}
              title="Sanal kaydırma (büyük listeler için)"
            >
              {useVirtualScroll ? '📜 Sanal' : '📄 Normal'}
            </button>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowAnalytics(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analiz
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <EnhancedSkeletonLoader variant="news-card" count={5} />
      )}

      {/* News List */}
      {!isLoading && (
        <>
          {useVirtualScroll && filteredNews.length > 20 ? (
            <VirtualScrollList
              items={filteredNews}
              itemHeight={200}
              containerHeight={800}
              renderItem={renderNewsItem}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            />
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item, i) => renderNewsItem(item, i))}
            </div>
          )}
        </>
      )}

      {/* Enhanced Empty State */}
      {filteredNews.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Haber Bulunamadı</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? `"${searchTerm}" araması için sonuç bulunamadı.` : "Seçilen kategoride haber bulunmuyor."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aramayı Temizle
            </button>
          )}
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        initialFilters={{
          query: searchTerm,
          category: selectedCategory,
          sortBy: sortBy === 'priority' ? 'importance' : sortBy
        }}
      />

      {/* Analytics Panel */}
      <NewsAnalyticsPanel
        news={filteredNews}
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </div>
  );
}