import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types/news';
import { financialAnalyzer, FinancialNewsAnalysis } from '../utils/financialAnalysis';

interface FinancialDashboardProps {
  news: NewsItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FinancialDashboard({ news, isOpen, onClose }: FinancialDashboardProps) {
  const [analyses, setAnalyses] = useState<FinancialNewsAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FinancialNewsAnalysis | null>(null);
  const [viewMode, setViewMode] = useState<'morning' | 'evening' | 'all'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [dailyReport, setDailyReport] = useState<any>(null);

  useEffect(() => {
    if (isOpen && news.length > 0) {
      const financialNews = news.filter(item => 
        item.category === 'finans' || 
        item.title.toLowerCase().includes('market') ||
        item.title.toLowerCase().includes('economy') ||
        item.title.toLowerCase().includes('piyasa') ||
        item.title.toLowerCase().includes('ekonomi')
      );
      
      const newsAnalyses = financialNews.map(item => financialAnalyzer.analyzeFinancialNews(item));
      setAnalyses(newsAnalyses);
      
      const report = financialAnalyzer.generateDailyReport(financialNews);
      setDailyReport(report);
    }
  }, [isOpen, news]);

  const getImpactColor = (level: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200',
      low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200'
    };
    return colors[level];
  };

  const getActionColor = (action: string) => {
    const colors = {
      buy: 'bg-green-500 text-white',
      sell: 'bg-red-500 text-white',
      hold: 'bg-blue-500 text-white',
      watch: 'bg-yellow-500 text-white',
      avoid: 'bg-gray-500 text-white'
    };
    return colors[action as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const filteredAnalyses = analyses.filter(analysis => {
    if (filterRisk !== 'all' && analysis.riskLevel !== filterRisk) return false;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">💼 Finansal Analiz Merkezi</h2>
            <p className="text-blue-100 text-sm mt-1">
              Günlük Haber Analizi ve Yatırım Değerlendirmesi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-90">Son Güncelleme</div>
              <div className="font-semibold">{new Date().toLocaleTimeString('tr-TR')}</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-100px)]">
          {/* Sol Panel - Günlük Özet */}
          <div className="w-1/4 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Günlük Özet
            </h3>
            
            {dailyReport && (
              <>
                {/* Genel İstatistikler */}
                <div className="space-y-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Yüksek Etkili Haberler</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {dailyReport.summary.highImpactNews}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Risk Seviyesi</div>
                    <div className={`text-lg font-bold ${
                      dailyReport.summary.averageRiskLevel === 'high' ? 'text-red-600' :
                      dailyReport.summary.averageRiskLevel === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {dailyReport.summary.averageRiskLevel === 'high' ? 'Yüksek' :
                       dailyReport.summary.averageRiskLevel === 'medium' ? 'Orta' : 'Düşük'}
                    </div>
                  </div>
                </div>

                {/* Piyasa Görünümü */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Piyasa Görünümü</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {dailyReport.summary.marketOutlook}
                    </p>
                  </div>
                </div>

                {/* Top Öneriler */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Öncelikli Öneriler</h4>
                  <div className="space-y-2">
                    {dailyReport.summary.topRecommendations.slice(0, 3).map((rec: string, index: number) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-xs text-green-800 dark:text-green-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Orta Panel - Haber Listesi */}
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {/* Filtreler */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zaman Dilimi
                  </label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">Tüm Gün</option>
                    <option value="morning">Sabah (09:00)</option>
                    <option value="evening">Akşam (18:00)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Risk Seviyesi
                  </label>
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value as any)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">Tümü</option>
                    <option value="high">🔴 Yüksek</option>
                    <option value="medium">🟡 Orta</option>
                    <option value="low">🟢 Düşük</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Haber Listesi */}
            <div className="p-4 space-y-3">
              {filteredAnalyses.map((analysis, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                    selectedAnalysis === analysis
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(analysis.riskLevel)}`}>
                        {analysis.riskLevel === 'high' ? '🔴 Yüksek Risk' :
                         analysis.riskLevel === 'medium' ? '🟡 Orta Risk' : '🟢 Düşük Risk'}
                      </span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {analysis.importance}/5
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(analysis.investmentRecommendation.action)}`}>
                      {analysis.investmentRecommendation.action.toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {analysis.summary}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{analysis.investmentRecommendation.timeframe}</span>
                    <span>Güven: {analysis.investmentRecommendation.confidence}/5</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sağ Panel - Detaylı Analiz */}
          <div className="w-1/4 p-6 overflow-y-auto">
            {selectedAnalysis ? (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🔍 Detaylı Analiz
                </h3>
                
                {/* Yatırım Önerisi */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">💰 Yatırım Önerisi</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Aksiyon</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(selectedAnalysis.investmentRecommendation.action)}`}>
                        {selectedAnalysis.investmentRecommendation.action.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mb-2">
                      <strong>Gerekçe:</strong> {selectedAnalysis.investmentRecommendation.reasoning}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Zaman Dilimi:</strong> {selectedAnalysis.investmentRecommendation.timeframe}
                    </div>
                  </div>
                </div>

                {/* Piyasa Etkisi */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">📈 Piyasa Etkisi</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {selectedAnalysis.marketImpact}
                    </p>
                  </div>
                </div>

                {/* Anahtar Metrikler */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">📊 Anahtar Metrikler</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Volatilite Etkisi</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-red-500"
                            style={{ width: `${(selectedAnalysis.keyMetrics.volatilityImpact / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedAnalysis.keyMetrics.volatilityImpact}/5</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Likidite Etkisi</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${(selectedAnalysis.keyMetrics.liquidityImpact / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedAnalysis.keyMetrics.liquidityImpact}/5</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment Etkisi</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${(selectedAnalysis.keyMetrics.sentimentImpact / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{selectedAnalysis.keyMetrics.sentimentImpact}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* İlgili Varlıklar */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">🎯 İlgili Varlıklar</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.relatedAssets.map((asset, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Özel Analizler */}
                {selectedAnalysis.financialImpact && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">💼 Finansal Etki</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="text-sm space-y-1">
                        <div><strong>Etki Seviyesi:</strong> {selectedAnalysis.financialImpact.impactLevel}</div>
                        <div><strong>Zaman Dilimi:</strong> {selectedAnalysis.financialImpact.timeHorizon}</div>
                        <div><strong>Güven Seviyesi:</strong> {selectedAnalysis.financialImpact.confidence}/5</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAnalysis.politicalImpact && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">🏛️ Politik Etki</h4>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <div className="text-sm space-y-1">
                        <div><strong>Etki Seviyesi:</strong> {selectedAnalysis.politicalImpact.impactLevel}</div>
                        <div><strong>Risk Değerlendirmesi:</strong> {selectedAnalysis.politicalImpact.riskAssessment}</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAnalysis.globalImpact && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">🌍 Küresel Etki</h4>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <div className="text-sm space-y-1">
                        <div><strong>Kategori:</strong> {selectedAnalysis.globalImpact.category}</div>
                        <div><strong>Şiddet:</strong> {selectedAnalysis.globalImpact.severity}/5</div>
                        <div><strong>Kapsam:</strong> {selectedAnalysis.globalImpact.globalReach}</div>
                        <div><strong>Volatilite:</strong> {selectedAnalysis.globalImpact.marketVolatility}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💼</div>
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