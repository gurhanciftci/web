import React, { useState } from "react";
import { NewsItem } from "../types/news";
import SearchBar from "./SearchBar";
import ShareButtons from "./ShareButtons";
import { getApiKeyStatus } from "../api/newsApi";

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
  const [sortBy, setSortBy] = useState<"importance" | "date">("importance");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const apiStatus = getApiKeyStatus();

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "dünya", label: "Dünya" },
    { value: "finans", label: "Finans" },
    { value: "siyaset", label: "Siyaset" }
  ];

  const filteredNews = news
    .filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "importance") {
        return b.importance - a.importance;
      }
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });

  if (news.length === 0) {
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
                Gerçek haberleri görmek için <a href="https://newsapi.org/register" target="_blank" rel="noopener noreferrer" className="underline font-medium">NewsAPI.org</a>'dan ücretsiz API key alın ve src/api/newsApi.ts dosyasında NEWS_API_KEY değişkenini güncelleyin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Arama ve Filtreler */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              onChange={(e) => setSortBy(e.target.value as "importance" | "date")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="importance">Önem Derecesi</option>
              <option value="date">Tarih</option>
            </select>
          </div>
        </div>
      </div>

      {/* Haber Listesi */}
      <div className="grid gap-6">
        {filteredNews.map((item, i) => (
          <article key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {item.imageUrl && (
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(item.importance)}`}>
                  {getImportanceLabel(item.importance)}
                </span>
                {item.source && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {item.source}
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
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h2>
              
              {item.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {item.description.length > 200 
                    ? `${item.description.substring(0, 200)}...` 
                    : item.description
                  }
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  Haberi Oku
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <ShareButtons title={item.title} url={item.url} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Haber Bulunamadı</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? `"${searchTerm}" araması için sonuç bulunamadı.` : "Seçilen kategoride haber bulunmuyor."}
          </p>
        </div>
      )}
    </div>
  );
}