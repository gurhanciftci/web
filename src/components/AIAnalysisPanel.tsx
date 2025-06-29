import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types/news';
import AIModelSelector, { AIModel } from './AIModelSelector';
import AIAnalysisResults, { AIAnalysisResult } from './AIAnalysisResults';
import { useToast } from '../contexts/ToastContext';

interface AIAnalysisPanelProps {
  news: NewsItem[];
  isOpen: boolean;
  onClose: () => void;
}

// Mock AI analysis function - In real implementation, this would call actual AI services
const performAIAnalysis = async (
  newsItems: NewsItem[], 
  selectedModels: string[]
): Promise<AIAnalysisResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  const modelConfigs: Record<string, { name: string; baseAccuracy: number }> = {
    'gpt4-financial': { name: 'GPT-4 Finansal Analiz', baseAccuracy: 92 },
    'bert-sentiment': { name: 'BERT Duygu Analizi', baseAccuracy: 89 },
    'xgboost-prediction': { name: 'XGBoost Tahminleme', baseAccuracy: 85 },
    'lstm-timeseries': { name: 'LSTM Zaman Serisi', baseAccuracy: 87 },
    'transformer-trend': { name: 'Transformer Trend Analizi', baseAccuracy: 90 }
  };

  return selectedModels.map(modelId => {
    const config = modelConfigs[modelId];
    const confidence = config.baseAccuracy + Math.random() * 8 - 4; // ±4% variation
    
    // Generate mock analysis based on model type
    let results: any = {
      summary: '',
      keyInsights: [],
      riskLevel: 'medium' as const,
      recommendation: ''
    };

    switch (modelId) {
      case 'gpt4-financial':
        results = {
          summary: `GPT-4 analizi ${newsItems.length} haberi inceledi. Genel piyasa duygusu orta seviyede pozitif görünüyor. Finansal göstergeler karışık sinyaller veriyor ancak uzun vadeli trend pozitif yönde.`,
          keyInsights: [
            'Merkez bankası politikalarında değişiklik beklentisi artıyor',
            'Teknoloji sektöründe güçlü momentum devam ediyor',
            'Enflasyon verilerinde iyileşme sinyalleri görülüyor',
            'Jeopolitik riskler sınırlı seviyede kalıyor'
          ],
          riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
          recommendation: 'Mevcut portföy ağırlıklarını koruyun. Teknoloji ve sağlık sektörlerinde seçici yaklaşım benimseyin. Risk yönetimini artırın.',
          technicalIndicators: {
            sentiment: (Math.random() - 0.5) * 1.5,
            volatility: Math.random() * 0.8 + 0.1,
            momentum: (Math.random() - 0.5) * 1.2,
            trend: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.25 ? 'bearish' : 'neutral'
          },
          predictions: {
            shortTerm: 'Önümüzdeki hafta içinde %2-4 aralığında dalgalanma bekleniyor. Volatilite artabilir.',
            mediumTerm: 'Ay sonuna kadar pozitif trend devam edebilir. Seçici yatırım yaklaşımı öneriliyor.',
            longTerm: 'Uzun vadede büyüme potansiyeli mevcut. Makroekonomik veriler destekleyici.'
          }
        };
        break;

      case 'bert-sentiment':
        results = {
          summary: `BERT duygu analizi ${newsItems.length} haber metnini analiz etti. Genel sentiment skoru ${(Math.random() * 0.6 + 0.2).toFixed(2)} seviyesinde pozitif.`,
          keyInsights: [
            'Haber başlıklarında %68 pozitif duygu tespit edildi',
            'Finansal terimler ağırlıklı olarak iyimser tonlarda',
            'Risk kelimelerinin kullanım sıklığı düşük seviyede',
            'Sosyal medya sentiment\'i ile uyumlu sonuçlar'
          ],
          riskLevel: 'low',
          recommendation: 'Piyasa duygusu destekleyici. Pozisyon artırımı için uygun ortam.',
          technicalIndicators: {
            sentiment: Math.random() * 0.8 + 0.1,
            volatility: Math.random() * 0.4 + 0.1,
            momentum: Math.random() * 0.6 + 0.2,
            trend: 'bullish'
          }
        };
        break;

      case 'xgboost-prediction':
        results = {
          summary: `XGBoost modeli ${newsItems.length} haberdeki sayısal verileri analiz etti. Tahmin doğruluğu %${(85 + Math.random() * 10).toFixed(1)} seviyesinde.`,
          keyInsights: [
            'Fiyat hedefleri %95 güven aralığında hesaplandı',
            'Volatilite tahminleri geçmiş verilerle uyumlu',
            'Risk-getiri oranı optimal seviyede',
            'Makroekonomik faktörler modele dahil edildi'
          ],
          riskLevel: 'medium',
          recommendation: 'Sayısal veriler karışık sinyaller veriyor. Dikkatli pozisyon alımı öneriliyor.',
          predictions: {
            shortTerm: `Kısa vadede %${(Math.random() * 6 + 2).toFixed(1)} hareket bekleniyor`,
            mediumTerm: `Orta vadede trend ${Math.random() > 0.5 ? 'pozitif' : 'nötr'} yönde`,
            longTerm: 'Uzun vadeli tahminler için daha fazla veri gerekli'
          }
        };
        break;

      case 'lstm-timeseries':
        results = {
          summary: `LSTM zaman serisi analizi geçmiş ${newsItems.length * 7} günlük veriyi inceledi. Döngüsel paternler tespit edildi.`,
          keyInsights: [
            'Haftalık döngülerde güçlü pattern tespit edildi',
            'Sezonsal etkiler modele dahil edildi',
            'Trend kırılma noktaları belirlendi',
            'Volatilite kümelenmesi gözlemlendi'
          ],
          riskLevel: 'medium',
          recommendation: 'Zaman serisi analizi orta vadeli pozisyon alımını destekliyor.',
          technicalIndicators: {
            sentiment: (Math.random() - 0.5) * 0.8,
            volatility: Math.random() * 0.6 + 0.2,
            momentum: (Math.random() - 0.5) * 1.0,
            trend: Math.random() > 0.4 ? 'bullish' : 'neutral'
          }
        };
        break;

      case 'transformer-trend':
        results = {
          summary: `Transformer modeli ${newsItems.length} haberdeki trend sinyallerini analiz etti. Güçlü momentum göstergeleri tespit edildi.`,
          keyInsights: [
            'Trend değişim sinyalleri güçleniyor',
            'Momentum göstergeleri pozitif yönde',
            'Reversal sinyalleri henüz görülmüyor',
            'Piyasa döngüsü analizi tamamlandı'
          ],
          riskLevel: Math.random() > 0.7 ? 'high' : 'medium',
          recommendation: 'Trend analizi pozisyon artırımını destekliyor. Stop-loss seviyelerini güncelleyin.',
          technicalIndicators: {
            sentiment: Math.random() * 0.6 + 0.2,
            volatility: Math.random() * 0.5 + 0.3,
            momentum: Math.random() * 0.8 + 0.1,
            trend: 'bullish'
          }
        };
        break;
    }

    return {
      modelId,
      modelName: config.name,
      confidence: Math.round(confidence),
      processingTime: Math.round(1000 + Math.random() * 3000),
      results,
      metadata: {
        timestamp: new Date().toISOString(),
        dataPoints: newsItems.length * Math.round(Math.random() * 50 + 10),
        accuracy: Math.round(config.baseAccuracy + Math.random() * 6 - 3)
      }
    };
  });
};

export default function AIAnalysisPanel({ news, isOpen, onClose }: AIAnalysisPanelProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt4-financial']);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    if (isOpen && news.length > 0) {
      // Select top 10 most important news by default
      const topNews = news
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 10);
      setSelectedNews(topNews);
    }
  }, [isOpen, news]);

  const handleStartAnalysis = async () => {
    if (selectedModels.length === 0) {
      showError('Model Seçimi Gerekli', 'Lütfen en az bir AI model seçin');
      return;
    }

    if (selectedNews.length === 0) {
      showError('Haber Seçimi Gerekli', 'Lütfen analiz edilecek haberleri seçin');
      return;
    }

    setIsAnalyzing(true);
    showInfo('Analiz Başlatıldı', `${selectedModels.length} model ile ${selectedNews.length} haber analiz ediliyor`);

    try {
      const results = await performAIAnalysis(selectedNews, selectedModels);
      setAnalysisResults(results);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        models: selectedModels,
        newsCount: selectedNews.length,
        results: results.length
      };
      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

      showSuccess('Analiz Tamamlandı', `${results.length} model sonucu hazır`);
    } catch (error) {
      showError('Analiz Hatası', 'AI analizi sırasında bir hata oluştu');
      console.error('AI Analysis Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportResults = (format: 'pdf' | 'excel' | 'json') => {
    showInfo('Export İşlemi', `Sonuçlar ${format.toUpperCase()} formatında hazırlanıyor`);
    // In real implementation, this would generate and download the file
  };

  const handleNewsSelection = (newsItem: NewsItem, selected: boolean) => {
    if (selected) {
      setSelectedNews(prev => [...prev, newsItem]);
    } else {
      setSelectedNews(prev => prev.filter(item => item.id !== newsItem.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🤖 AI Analiz Merkezi</h2>
              <p className="text-purple-100 text-sm">
                Gelişmiş yapay zeka modelleri ile haber analizi ve piyasa öngörüleri
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Toplam Haber</div>
                <div className="font-bold text-lg">{news.length}</div>
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
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sol Panel - Konfigürasyon */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Model Seçimi */}
              <AIModelSelector
                selectedModels={selectedModels}
                onModelChange={setSelectedModels}
                maxSelections={3}
              />

              {/* Haber Seçimi */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📰 Haber Seçimi
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedNews.length}/{news.length} seçili
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedNews(news.slice(0, 10))}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Top 10
                      </button>
                      <button
                        onClick={() => setSelectedNews([])}
                        className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                  {news.slice(0, 20).map((newsItem, index) => (
                    <label key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedNews.some(item => item.id === newsItem.id)}
                        onChange={(e) => handleNewsSelection(newsItem, e.target.checked)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {newsItem.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {newsItem.source} • Önem: {newsItem.importance}/5
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Analiz Geçmişi */}
              {analysisHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Son Analizler
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {analysisHistory.map((entry) => (
                      <div key={entry.id} className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {entry.models.length} model • {entry.newsCount} haber
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analiz Başlat */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || selectedModels.length === 0 || selectedNews.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isAnalyzing || selectedModels.length === 0 || selectedNews.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analiz Yapılıyor...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🚀</span>
                      AI Analizi Başlat
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sağ Panel - Sonuçlar */}
          <div className="w-2/3 overflow-y-auto">
            <AIAnalysisResults
              results={analysisResults}
              newsItem={selectedNews[0]}
              isLoading={isAnalyzing}
              onExport={handleExportResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}