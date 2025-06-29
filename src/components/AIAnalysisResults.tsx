import React, { useState } from 'react';
import { NewsItem } from '../types/news';

export interface AIAnalysisResult {
  modelId: string;
  modelName: string;
  confidence: number;
  processingTime: number;
  results: {
    summary: string;
    keyInsights: string[];
    riskLevel: 'low' | 'medium' | 'high';
    recommendation: string;
    technicalIndicators?: {
      sentiment: number; // -1 to 1
      volatility: number; // 0 to 1
      momentum: number; // -1 to 1
      trend: 'bullish' | 'bearish' | 'neutral';
    };
    predictions?: {
      shortTerm: string;
      mediumTerm: string;
      longTerm: string;
    };
    charts?: {
      type: 'line' | 'bar' | 'pie' | 'scatter';
      data: any[];
      title: string;
    }[];
  };
  metadata: {
    timestamp: string;
    dataPoints: number;
    accuracy: number;
  };
}

interface AIAnalysisResultsProps {
  results: AIAnalysisResult[];
  newsItem?: NewsItem;
  isLoading?: boolean;
  onExport?: (format: 'pdf' | 'excel' | 'json') => void;
}

export default function AIAnalysisResults({ 
  results, 
  newsItem, 
  isLoading = false,
  onExport 
}: AIAnalysisResultsProps) {
  const [selectedResult, setSelectedResult] = useState<AIAnalysisResult | null>(
    results.length > 0 ? results[0] : null
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'predictions' | 'charts'>('overview');

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const formatSentiment = (sentiment: number) => {
    if (sentiment > 0.3) return { label: 'Pozitif', color: 'text-green-600' };
    if (sentiment < -0.3) return { label: 'Negatif', color: 'text-red-600' };
    return { label: 'Nötr', color: 'text-gray-600' };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                AI Analiz Yapılıyor...
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <span>Veriler işleniyor</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <span>Modeller çalışıyor</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span>Sonuçlar hazırlanıyor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Henüz Analiz Sonucu Yok
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            AI modelleri seçin ve analiz başlatın
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🤖 AI Analiz Sonuçları</h3>
            {newsItem && (
              <p className="text-blue-100 text-sm line-clamp-1">
                {newsItem.title}
              </p>
            )}
          </div>
          {onExport && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExport('pdf')}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
              >
                📄 PDF
              </button>
              <button
                onClick={() => onExport('excel')}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
              >
                📊 Excel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-96">
        {/* Sol Panel - Model Listesi */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Analiz Modelleri ({results.length})
            </h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedResult(result)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedResult === result
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {result.modelName}
                    </span>
                    <span className={`text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                      %{result.confidence}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${getRiskColor(result.results.riskLevel)}`}>
                      {result.results.riskLevel === 'low' ? 'Düşük Risk' :
                       result.results.riskLevel === 'medium' ? 'Orta Risk' : 'Yüksek Risk'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {result.processingTime}ms
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Panel - Detaylı Sonuçlar */}
        <div className="w-2/3 flex flex-col">
          {selectedResult && (
            <>
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex">
                  {[
                    { id: 'overview', label: 'Genel Bakış', icon: '📋' },
                    { id: 'technical', label: 'Teknik', icon: '📊' },
                    { id: 'predictions', label: 'Tahminler', icon: '🔮' },
                    { id: 'charts', label: 'Grafikler', icon: '📈' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{tab.icon}</span>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Özet */}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">📝 Analiz Özeti</h5>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {selectedResult.results.summary}
                        </p>
                      </div>
                    </div>

                    {/* Anahtar Bulgular */}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">🔍 Anahtar Bulgular</h5>
                      <div className="space-y-2">
                        {selectedResult.results.keyInsights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                              {index + 1}.
                            </span>
                            <span className="text-blue-800 dark:text-blue-300 text-sm">
                              {insight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Öneri */}
                    <div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3">💡 Öneri</h5>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-green-800 dark:text-green-300 text-sm">
                          {selectedResult.results.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'technical' && selectedResult.results.technicalIndicators && (
                  <div className="space-y-6">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-4">📊 Teknik Göstergeler</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Sentiment */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Piyasa Duygusu</div>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${formatSentiment(selectedResult.results.technicalIndicators.sentiment).color}`}>
                            {formatSentiment(selectedResult.results.technicalIndicators.sentiment).label}
                          </span>
                          <span className="text-lg">
                            {selectedResult.results.technicalIndicators.sentiment > 0 ? '😊' : 
                             selectedResult.results.technicalIndicators.sentiment < 0 ? '😟' : '😐'}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedResult.results.technicalIndicators.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.abs(selectedResult.results.technicalIndicators.sentiment) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Volatilite */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Volatilite</div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {(selectedResult.results.technicalIndicators.volatility * 100).toFixed(1)}%
                          </span>
                          <span className="text-lg">📊</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-orange-500"
                            style={{ 
                              width: `${selectedResult.results.technicalIndicators.volatility * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Momentum */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Momentum</div>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${
                            selectedResult.results.technicalIndicators.momentum > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedResult.results.technicalIndicators.momentum > 0 ? 'Pozitif' : 'Negatif'}
                          </span>
                          <span className="text-lg">⚡</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedResult.results.technicalIndicators.momentum > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.abs(selectedResult.results.technicalIndicators.momentum) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Trend Yönü</div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {selectedResult.results.technicalIndicators.trend === 'bullish' ? 'Yükseliş' :
                             selectedResult.results.technicalIndicators.trend === 'bearish' ? 'Düşüş' : 'Yatay'}
                          </span>
                          <span className="text-lg">
                            {getTrendIcon(selectedResult.results.technicalIndicators.trend)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'predictions' && selectedResult.results.predictions && (
                  <div className="space-y-6">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-4">🔮 Tahminler</h5>
                    
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">⚡</span>
                          <h6 className="font-medium text-gray-900 dark:text-white">Kısa Vadeli (1-7 gün)</h6>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedResult.results.predictions.shortTerm}
                        </p>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">📅</span>
                          <h6 className="font-medium text-gray-900 dark:text-white">Orta Vadeli (1-4 hafta)</h6>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedResult.results.predictions.mediumTerm}
                        </p>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🗓️</span>
                          <h6 className="font-medium text-gray-900 dark:text-white">Uzun Vadeli (1-6 ay)</h6>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          {selectedResult.results.predictions.longTerm}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'charts' && (
                  <div className="space-y-6">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-4">📈 Görselleştirmeler</h5>
                    
                    {selectedResult.results.charts && selectedResult.results.charts.length > 0 ? (
                      <div className="grid gap-4">
                        {selectedResult.results.charts.map((chart, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h6 className="font-medium text-gray-900 dark:text-white mb-3">
                              {chart.title}
                            </h6>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
                              <div className="text-center text-gray-500 dark:text-gray-400">
                                <div className="text-3xl mb-2">📊</div>
                                <div className="text-sm">
                                  {chart.type.toUpperCase()} Grafik
                                </div>
                                <div className="text-xs mt-1">
                                  {chart.data.length} veri noktası
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Bu model için grafik verisi bulunmuyor
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer - Metadata */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>⏱️ {new Date(selectedResult.metadata.timestamp).toLocaleString('tr-TR')}</span>
                    <span>📊 {selectedResult.metadata.dataPoints} veri noktası</span>
                    <span>🎯 %{selectedResult.metadata.accuracy} doğruluk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Analiz tamamlandı</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}