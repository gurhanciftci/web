import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types/news';
import { useToast } from '../contexts/ToastContext';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  category: 'language' | 'analysis' | 'prediction' | 'specialized';
  capabilities: string[];
  accuracy: number;
  speed: 'fast' | 'medium' | 'slow';
  cost: 'free' | 'low' | 'medium' | 'high';
  isAvailable: boolean;
}

interface AnalysisParameters {
  depth: 'basic' | 'detailed' | 'comprehensive';
  focus: string[];
  referencePoints: string[];
  outputFormat: 'summary' | 'detailed' | 'technical';
  language: 'tr' | 'en';
  includeCharts: boolean;
  includeRecommendations: boolean;
  confidenceThreshold: number;
}

interface AnalysisResult {
  modelId: string;
  modelName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  startTime: string;
  endTime?: string;
  results?: {
    summary: string;
    keyFindings: string[];
    confidence: number;
    riskAssessment: string;
    recommendations: string[];
    technicalMetrics: Record<string, number>;
    charts?: any[];
    rawData?: any;
  };
  error?: string;
}

interface ComprehensiveAIAnalysisPanelProps {
  news: NewsItem[];
  isOpen: boolean;
  onClose: () => void;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'chatgpt-4',
    name: 'ChatGPT-4',
    provider: 'OpenAI',
    description: 'En gelişmiş dil modeli, derinlemesine analiz ve yaratıcı çözümler',
    icon: '🤖',
    category: 'language',
    capabilities: ['Metin Analizi', 'Finansal Yorumlama', 'Risk Değerlendirmesi', 'Strateji Önerileri'],
    accuracy: 95,
    speed: 'medium',
    cost: 'medium',
    isAvailable: true
  },
  {
    id: 'claude-3',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Güvenli ve tutarlı AI asistanı, etik analiz ve objektif değerlendirme',
    icon: '🎭',
    category: 'language',
    capabilities: ['Etik Analiz', 'Objektif Değerlendirme', 'Risk Analizi', 'Politika İncelemesi'],
    accuracy: 93,
    speed: 'fast',
    cost: 'medium',
    isAvailable: true
  },
  {
    id: 'deepseek-v2',
    name: 'DeepSeek V2',
    provider: 'DeepSeek',
    description: 'Matematiksel ve mantıksal analiz odaklı, sayısal veriler için optimize',
    icon: '🔬',
    category: 'analysis',
    capabilities: ['Matematiksel Analiz', 'Sayısal Modelleme', 'Trend Analizi', 'Tahminleme'],
    accuracy: 91,
    speed: 'fast',
    cost: 'low',
    isAvailable: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Multimodal AI, görsel ve metin analizi, kapsamlı veri işleme',
    icon: '💎',
    category: 'analysis',
    capabilities: ['Multimodal Analiz', 'Görsel İşleme', 'Veri Entegrasyonu', 'Trend Tespiti'],
    accuracy: 92,
    speed: 'medium',
    cost: 'medium',
    isAvailable: true
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    provider: 'GitHub/OpenAI',
    description: 'Kod analizi ve teknik değerlendirme, sistem optimizasyonu',
    icon: '👨‍💻',
    category: 'specialized',
    capabilities: ['Kod Analizi', 'Teknik Değerlendirme', 'Sistem Optimizasyonu', 'Güvenlik Analizi'],
    accuracy: 88,
    speed: 'fast',
    cost: 'low',
    isAvailable: true
  },
  {
    id: 'bert-financial',
    name: 'BERT Finansal',
    provider: 'Custom',
    description: 'Finansal metinler için özelleştirilmiş BERT modeli',
    icon: '📊',
    category: 'specialized',
    capabilities: ['Finansal Sentiment', 'Piyasa Analizi', 'Risk Skorlama', 'Volatilite Tahmini'],
    accuracy: 89,
    speed: 'fast',
    cost: 'free',
    isAvailable: true
  },
  {
    id: 'xgboost-predictor',
    name: 'XGBoost Tahminleyici',
    provider: 'Custom',
    description: 'Makine öğrenmesi tabanlı sayısal tahminleme sistemi',
    icon: '🎯',
    category: 'prediction',
    capabilities: ['Fiyat Tahmini', 'Trend Projeksiyonu', 'Risk Metrikleri', 'Performans Analizi'],
    accuracy: 85,
    speed: 'fast',
    cost: 'free',
    isAvailable: true
  },
  {
    id: 'lstm-timeseries',
    name: 'LSTM Zaman Serisi',
    provider: 'Custom',
    description: 'Derin öğrenme ile zaman serisi analizi ve gelecek projeksiyonları',
    icon: '📈',
    category: 'prediction',
    capabilities: ['Zaman Serisi', 'Döngü Analizi', 'Sezonallik', 'Uzun Vadeli Tahmin'],
    accuracy: 87,
    speed: 'slow',
    cost: 'free',
    isAvailable: true
  }
];

const FOCUS_AREAS = [
  { id: 'performance', label: 'Performans Analizi', icon: '⚡' },
  { id: 'security', label: 'Güvenlik Değerlendirmesi', icon: '🔒' },
  { id: 'compatibility', label: 'Uyumluluk Kontrolü', icon: '🔗' },
  { id: 'market-impact', label: 'Piyasa Etkisi', icon: '📊' },
  { id: 'risk-assessment', label: 'Risk Değerlendirmesi', icon: '⚠️' },
  { id: 'trend-analysis', label: 'Trend Analizi', icon: '📈' },
  { id: 'sentiment', label: 'Duygu Analizi', icon: '😊' },
  { id: 'technical', label: 'Teknik Analiz', icon: '🔧' }
];

export default function ComprehensiveAIAnalysisPanel({ news, isOpen, onClose }: ComprehensiveAIAnalysisPanelProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(['chatgpt-4', 'claude-3']);
  const [analysisParams, setAnalysisParams] = useState<AnalysisParameters>({
    depth: 'detailed',
    focus: ['market-impact', 'risk-assessment'],
    referencePoints: [],
    outputFormat: 'detailed',
    language: 'tr',
    includeCharts: true,
    includeRecommendations: true,
    confidenceThreshold: 0.7
  });
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);

  const { showSuccess, showError, showInfo } = useToast();

  // Mock AI analysis function
  const performAIAnalysis = async (modelId: string, newsData: NewsItem[], params: AnalysisParameters): Promise<any> => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) throw new Error('Model bulunamadı');

    // Simulate different processing times based on model speed
    const processingTime = {
      fast: 2000 + Math.random() * 2000,
      medium: 3000 + Math.random() * 4000,
      slow: 5000 + Math.random() * 6000
    }[model.speed];

    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate mock results based on model capabilities
    const confidence = (model.accuracy / 100) + (Math.random() * 0.1 - 0.05);
    
    return {
      summary: `${model.name} analizi tamamlandı. ${newsData.length} haber incelendi ve ${params.focus.length} odak alanında değerlendirme yapıldı.`,
      keyFindings: [
        `${model.provider} modeli %${model.accuracy} doğruluk oranıyla analiz gerçekleştirdi`,
        `${params.depth === 'comprehensive' ? 'Kapsamlı' : params.depth === 'detailed' ? 'Detaylı' : 'Temel'} seviyede inceleme yapıldı`,
        `${params.focus.length} farklı kriterde değerlendirme tamamlandı`,
        `Güven eşiği %${(params.confidenceThreshold * 100).toFixed(0)} olarak belirlendi`
      ],
      confidence: Math.round(confidence * 100),
      riskAssessment: confidence > 0.8 ? 'Düşük Risk' : confidence > 0.6 ? 'Orta Risk' : 'Yüksek Risk',
      recommendations: [
        `${model.name} önerisi: Mevcut analiz sonuçlarını dikkate alın`,
        'Diğer modellerle karşılaştırmalı değerlendirme yapın',
        'Güven aralıklarını göz önünde bulundurarak karar verin',
        'Düzenli aralıklarla analizi tekrarlayın'
      ],
      technicalMetrics: {
        processingTime: processingTime,
        dataPoints: newsData.length * Math.round(Math.random() * 50 + 10),
        accuracy: model.accuracy + Math.round(Math.random() * 6 - 3),
        coverage: Math.round(Math.random() * 30 + 70)
      },
      charts: params.includeCharts ? [
        { type: 'line', title: 'Trend Analizi', data: [] },
        { type: 'bar', title: 'Risk Dağılımı', data: [] },
        { type: 'pie', title: 'Kategori Analizi', data: [] }
      ] : []
    };
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleStartAnalysis = async () => {
    if (selectedModels.length === 0) {
      showError('Model Seçimi Gerekli', 'Lütfen en az bir AI model seçin');
      return;
    }

    if (news.length === 0) {
      showError('Veri Bulunamadı', 'Analiz edilecek haber verisi bulunamadı');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);
    
    // Initialize results
    const initialResults: AnalysisResult[] = selectedModels.map(modelId => ({
      modelId,
      modelName: AI_MODELS.find(m => m.id === modelId)?.name || modelId,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString()
    }));
    
    setAnalysisResults(initialResults);
    showInfo('Analiz Başlatıldı', `${selectedModels.length} model ile analiz başlatılıyor`);

    try {
      // Process each model
      for (let i = 0; i < selectedModels.length; i++) {
        const modelId = selectedModels[i];
        setCurrentStep(i + 1);
        
        // Update status to running
        setAnalysisResults(prev => prev.map(result => 
          result.modelId === modelId 
            ? { ...result, status: 'running', progress: 0 }
            : result
        ));

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setAnalysisResults(prev => prev.map(result => 
            result.modelId === modelId && result.status === 'running'
              ? { ...result, progress: Math.min(result.progress + Math.random() * 20, 90) }
              : result
          ));
        }, 500);

        try {
          const results = await performAIAnalysis(modelId, news, analysisParams);
          
          clearInterval(progressInterval);
          
          // Update with completed results
          setAnalysisResults(prev => prev.map(result => 
            result.modelId === modelId 
              ? { 
                  ...result, 
                  status: 'completed', 
                  progress: 100, 
                  endTime: new Date().toISOString(),
                  results 
                }
              : result
          ));

        } catch (error) {
          clearInterval(progressInterval);
          
          setAnalysisResults(prev => prev.map(result => 
            result.modelId === modelId 
              ? { 
                  ...result, 
                  status: 'error', 
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Bilinmeyen hata'
                }
              : result
          ));
        }
      }

      // Add to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        models: selectedModels,
        parameters: analysisParams,
        newsCount: news.length,
        results: analysisResults.filter(r => r.status === 'completed').length
      };
      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      showSuccess('Analiz Tamamlandı', 'Tüm seçili modeller analizi tamamladı');
      
    } catch (error) {
      showError('Analiz Hatası', 'Analiz sırasında bir hata oluştu');
    } finally {
      setIsAnalyzing(false);
      setCurrentStep(0);
    }
  };

  const handleExportResults = (format: 'pdf' | 'excel' | 'json') => {
    const completedResults = analysisResults.filter(r => r.status === 'completed');
    if (completedResults.length === 0) {
      showError('Export Hatası', 'Export edilecek tamamlanmış analiz bulunamadı');
      return;
    }

    showInfo('Export İşlemi', `${completedResults.length} analiz sonucu ${format.toUpperCase()} formatında hazırlanıyor`);
    
    // Mock export process
    setTimeout(() => {
      showSuccess('Export Tamamlandı', `Sonuçlar ${format.toUpperCase()} formatında indirildi`);
    }, 2000);
  };

  const getModelsByCategory = (category: string) => {
    return AI_MODELS.filter(model => model.category === category);
  };

  const getOverallProgress = () => {
    if (analysisResults.length === 0) return 0;
    const totalProgress = analysisResults.reduce((sum, result) => sum + result.progress, 0);
    return Math.round(totalProgress / analysisResults.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🤖 Kapsamlı AI Analiz Merkezi</h2>
              <p className="text-purple-100 text-sm">
                Çoklu AI modeli ile gelişmiş haber analizi ve karşılaştırmalı değerlendirme
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAnalyzing && (
                <div className="text-right">
                  <div className="text-sm opacity-90">Analiz İlerlemesi</div>
                  <div className="font-bold text-lg">{getOverallProgress()}%</div>
                </div>
              )}
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🤖 AI Model Seçimi
                </h3>
                
                {/* Model Kategorileri */}
                {['language', 'analysis', 'prediction', 'specialized'].map(category => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                      {category === 'language' ? '🗣️ Dil Modelleri' :
                       category === 'analysis' ? '📊 Analiz Modelleri' :
                       category === 'prediction' ? '🔮 Tahmin Modelleri' : '🎯 Özel Modeller'}
                    </h4>
                    <div className="space-y-2">
                      {getModelsByCategory(category).map(model => (
                        <label key={model.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedModels.includes(model.id)}
                            onChange={() => handleModelToggle(model.id)}
                            disabled={!model.isAvailable}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{model.icon}</span>
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {model.name}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                model.cost === 'free' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                model.cost === 'low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                model.cost === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {model.cost === 'free' ? 'Ücretsiz' : 
                                 model.cost === 'low' ? 'Düşük' :
                                 model.cost === 'medium' ? 'Orta' : 'Yüksek'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {model.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-500">Doğruluk: %{model.accuracy}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">
                                Hız: {model.speed === 'fast' ? 'Hızlı' : model.speed === 'medium' ? 'Orta' : 'Yavaş'}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Analiz Parametreleri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ⚙️ Analiz Parametreleri
                </h3>
                
                <div className="space-y-4">
                  {/* Analiz Derinliği */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Analiz Derinliği
                    </label>
                    <select
                      value={analysisParams.depth}
                      onChange={(e) => setAnalysisParams(prev => ({ ...prev, depth: e.target.value as any }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="basic">Temel - Hızlı genel bakış</option>
                      <option value="detailed">Detaylı - Kapsamlı analiz</option>
                      <option value="comprehensive">Kapsamlı - Derinlemesine inceleme</option>
                    </select>
                  </div>

                  {/* Odak Alanları */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Odak Alanları
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {FOCUS_AREAS.map(area => (
                        <label key={area.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={analysisParams.focus.includes(area.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAnalysisParams(prev => ({ 
                                  ...prev, 
                                  focus: [...prev.focus, area.id] 
                                }));
                              } else {
                                setAnalysisParams(prev => ({ 
                                  ...prev, 
                                  focus: prev.focus.filter(f => f !== area.id) 
                                }));
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="flex items-center gap-1">
                            <span>{area.icon}</span>
                            <span className="text-gray-700 dark:text-gray-300">{area.label}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Çıktı Formatı */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Çıktı Formatı
                    </label>
                    <select
                      value={analysisParams.outputFormat}
                      onChange={(e) => setAnalysisParams(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="summary">Özet - Ana bulgular</option>
                      <option value="detailed">Detaylı - Kapsamlı rapor</option>
                      <option value="technical">Teknik - Sayısal veriler</option>
                    </select>
                  </div>

                  {/* Gelişmiş Ayarlar */}
                  <div>
                    <button
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <svg className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Gelişmiş Ayarlar
                    </button>
                    
                    {showAdvancedSettings && (
                      <div className="mt-3 space-y-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="includeCharts"
                            checked={analysisParams.includeCharts}
                            onChange={(e) => setAnalysisParams(prev => ({ ...prev, includeCharts: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeCharts" className="text-sm text-gray-700 dark:text-gray-300">
                            Grafikler dahil et
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="includeRecommendations"
                            checked={analysisParams.includeRecommendations}
                            onChange={(e) => setAnalysisParams(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeRecommendations" className="text-sm text-gray-700 dark:text-gray-300">
                            Öneriler dahil et
                          </label>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Güven Eşiği: {(analysisParams.confidenceThreshold * 100).toFixed(0)}%
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="0.95"
                            step="0.05"
                            value={analysisParams.confidenceThreshold}
                            onChange={(e) => setAnalysisParams(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
                  disabled={isAnalyzing || selectedModels.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isAnalyzing || selectedModels.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analiz Yapılıyor... ({currentStep}/{selectedModels.length})
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🚀</span>
                      Kapsamlı AI Analizi Başlat
                    </div>
                  )}
                </button>
                
                {selectedModels.length === 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
                    Lütfen en az bir AI model seçin
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Panel - Sonuçlar */}
          <div className="w-2/3 overflow-y-auto">
            <div className="p-6">
              {isAnalyzing && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ⏳ Analiz İlerlemesi
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.map((result) => (
                      <div key={result.modelId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {result.modelName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            result.status === 'running' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            result.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {result.status === 'completed' ? 'Tamamlandı' :
                             result.status === 'running' ? 'Çalışıyor' :
                             result.status === 'error' ? 'Hata' : 'Bekliyor'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              result.status === 'completed' ? 'bg-green-500' :
                              result.status === 'running' ? 'bg-blue-500' :
                              result.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${result.progress}%` }}
                          ></div>
                        </div>
                        {result.error && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                            Hata: {result.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResults.filter(r => r.status === 'completed').length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      📊 Analiz Sonuçları
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportResults('pdf')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportResults('excel')}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                      >
                        📊 Excel
                      </button>
                      <button
                        onClick={() => handleExportResults('json')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                      >
                        📋 JSON
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {analysisResults
                      .filter(result => result.status === 'completed' && result.results)
                      .map((result) => (
                        <div key={result.modelId} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {result.modelName} Sonuçları
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.results!.confidence >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                result.results!.confidence >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                Güven: %{result.results!.confidence}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {Math.round(result.results!.technicalMetrics.processingTime / 1000)}s
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">📝 Özet</h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                {result.results!.summary}
                              </p>

                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">🔍 Ana Bulgular</h5>
                              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                {result.results!.keyFindings.map((finding, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{finding}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">⚠️ Risk Değerlendirmesi</h5>
                              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                                result.results!.riskAssessment === 'Düşük Risk' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                result.results!.riskAssessment === 'Orta Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {result.results!.riskAssessment}
                              </div>

                              {result.results!.recommendations.length > 0 && (
                                <>
                                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">💡 Öneriler</h5>
                                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                    {result.results!.recommendations.slice(0, 3).map((rec, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">✓</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Teknik Metrikler */}
                          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-3">📊 Teknik Metrikler</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(result.results!.technicalMetrics).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {typeof value === 'number' ? 
                                      (key === 'processingTime' ? `${Math.round(value / 1000)}s` : 
                                       key.includes('accuracy') || key.includes('coverage') ? `%${value}` : 
                                       value.toLocaleString()) : 
                                      value}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {!isAnalyzing && analysisResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    AI Analiz Sistemi Hazır
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Sol panelden AI modellerini seçin ve analiz parametrelerini ayarlayın
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}