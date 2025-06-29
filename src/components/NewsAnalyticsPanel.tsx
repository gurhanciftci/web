import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types/news';
import { prioritizationEngine, NewsAnalytics } from '../utils/newsPrioritization';

interface NewsAnalyticsPanelProps {
  news: NewsItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsAnalyticsPanel({ news, isOpen, onClose }: NewsAnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState<NewsAnalytics | null>(null);

  useEffect(() => {
    if (isOpen && news.length > 0) {
      const result = prioritizationEngine.analyzeNewsBatch(news);
      setAnalytics(result);
    }
  }, [isOpen, news]);

  const handleNewsSelect = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    const newsAnalytics = prioritizationEngine.analyzeNews(newsItem);
    setSelectedAnalytics(newsAnalytics);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'breaking': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'important': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'standard': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'low-priority': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors['standard'];
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 dark:text-green-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            📊 Haber Önceliklendirme Analizi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sol Panel - Genel İstatistikler */}
          <div className="w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {analytics && (
              <>
                {/* Genel Özet */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📈 Genel Özet
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Puan</div>
                      <div className={`text-2xl font-bold ${getScoreColor(analytics.summary.averageScore)}`}>
                        {analytics.summary.averageScore.toFixed(2)}/5
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Haber</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {news.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kategori Dağılımı */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🏷️ Öncelik Dağılımı
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.summary.categoryDistribution).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                          {category === 'breaking' ? 'Son Dakika' :
                           category === 'important' ? 'Önemli' :
                           category === 'standard' ? 'Standart' : 'Düşük Öncelik'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Öneriler */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    💡 Öncelikli İyileştirmeler
                  </h3>
                  <div className="space-y-2">
                    {analytics.summary.topRecommendations.map((recommendation: string, index: number) => (
                      <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="text-sm text-yellow-800 dark:text-yellow-300">
                          {recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Orta Panel - Haber Listesi */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📰 Haber Listesi
              </h3>
              <div className="space-y-2">
                {analytics?.analytics.map((item: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleNewsSelect(item.newsItem)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedNews === item.newsItem
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category === 'breaking' ? 'Son Dakika' :
                         item.category === 'important' ? 'Önemli' :
                         item.category === 'standard' ? 'Standart' : 'Düşük'}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(item.priorityScore)}`}>
                        {item.priorityScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {item.newsItem.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.newsItem.source} • {item.estimatedEngagement} engagement
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Detaylı Analiz */}
          <div className="w-1/3 p-6 overflow-y-auto">
            {selectedNews && selectedAnalytics ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔍 Detaylı Analiz
                </h3>
                
                {/* Haber Başlığı */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Haber Başlığı</h4>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {selectedNews.title}
                  </p>
                </div>

                {/* Kriter Puanları */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Kriter Puanları</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedAnalytics.criteria).map(([key, value]) => {
                      const labels = {
                        timeliness: 'Güncellik',
                        impact: 'Etki Alanı',
                        quality: 'Kalite',
                        engagement: 'Okuyucu İlgisi',
                        uniqueness: 'Özgünlük'
                      };
                      
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {labels[key as keyof typeof labels]}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getScoreColor(value).includes('green') ? 'bg-green-500' : 
                                  getScoreColor(value).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${(value / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                              {value.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Genel Değerlendirme */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Genel Değerlendirme</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Puan</span>
                      <span className={`text-lg font-bold ${getScoreColor(selectedAnalytics.priorityScore)}`}>
                        {selectedAnalytics.priorityScore.toFixed(2)}/5
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Kategori</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedAnalytics.category)}`}>
                        {selectedAnalytics.category === 'breaking' ? 'Son Dakika' :
                         selectedAnalytics.category === 'important' ? 'Önemli' :
                         selectedAnalytics.category === 'standard' ? 'Standart' : 'Düşük Öncelik'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tahmini Etkileşim</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAnalytics.estimatedEngagement === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        selectedAnalytics.estimatedEngagement === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {selectedAnalytics.estimatedEngagement === 'high' ? 'Yüksek' :
                         selectedAnalytics.estimatedEngagement === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Öneriler */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    💡 İyileştirme Önerileri
                  </h4>
                  <div className="space-y-2">
                    {selectedAnalytics.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          {recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Detaylı analiz için bir haber seçin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}