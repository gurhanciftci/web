import React, { useState } from "react";
import { NewsItem } from "../types/news";

const getImportanceLabel = (importance: number) => {
  if (importance >= 5) return "Çok Önemli";
  if (importance >= 4) return "Önemli";
  if (importance >= 3) return "Orta";
  return "Normal";
};

const getImportanceColor = (importance: number) => {
  if (importance >= 5) return "bg-red-100 text-red-800 border-red-200";
  if (importance >= 4) return "bg-orange-100 text-orange-800 border-orange-200";
  if (importance >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    dünya: "bg-blue-100 text-blue-800",
    siyaset: "bg-purple-100 text-purple-800",
    finans: "bg-green-100 text-green-800",
    teknoloji: "bg-indigo-100 text-indigo-800",
    sağlık: "bg-pink-100 text-pink-800",
    spor: "bg-orange-100 text-orange-800",
    eğlence: "bg-yellow-100 text-yellow-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

interface NewsListProps {
  news: NewsItem[];
}

export default function NewsList({ news }: NewsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"importance" | "date">("importance");

  const categories = ["all", ...Array.from(new Set(news.map(item => item.category)))];

  const filteredNews = news
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
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
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Haberler Yükleniyor</h2>
          <p className="text-gray-500">Lütfen bekleyin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filtreler */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "importance" | "date")}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <article key={i} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(item.importance)}`}>
                  {getImportanceLabel(item.importance)}
                </span>
                {item.publishedAt && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h2>
              
              {item.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
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
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Haberi Oku
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Haber Bulunamadı</h3>
          <p className="text-gray-500">Seçilen kategoride haber bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}