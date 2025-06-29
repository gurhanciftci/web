import React, { useState } from 'react';

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'analysis' | 'sentiment' | 'prediction' | 'trend';
  capabilities: string[];
  accuracy: number;
  speed: 'fast' | 'medium' | 'slow';
  complexity: 'basic' | 'intermediate' | 'advanced';
}

interface AIModelSelectorProps {
  selectedModels: string[];
  onModelChange: (modelIds: string[]) => void;
  maxSelections?: number;
  category?: 'analysis' | 'sentiment' | 'prediction' | 'trend' | 'all';
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt4-financial',
    name: 'GPT-4 Finansal Analiz',
    description: 'Gelişmiş dil modeli ile derinlemesine finansal analiz ve piyasa yorumları',
    icon: '🧠',
    category: 'analysis',
    capabilities: ['Metin Analizi', 'Piyasa Yorumu', 'Risk Değerlendirmesi', 'Strateji Önerileri'],
    accuracy: 92,
    speed: 'medium',
    complexity: 'advanced'
  },
  {
    id: 'bert-sentiment',
    name: 'BERT Duygu Analizi',
    description: 'Haber metinlerindeki piyasa duygusunu ve yatırımcı sentiment\'ini analiz eder',
    icon: '😊',
    category: 'sentiment',
    capabilities: ['Duygu Tespiti', 'Sentiment Skoru', 'Piyasa Psikolojisi', 'Sosyal Medya Analizi'],
    accuracy: 89,
    speed: 'fast',
    complexity: 'intermediate'
  },
  {
    id: 'xgboost-prediction',
    name: 'XGBoost Tahminleme',
    description: 'Makine öğrenmesi ile sayısal veriler üzerinden piyasa tahminleri',
    icon: '📊',
    category: 'prediction',
    capabilities: ['Fiyat Tahmini', 'Volatilite Analizi', 'Risk Metrikleri', 'Performans Tahmini'],
    accuracy: 85,
    speed: 'fast',
    complexity: 'intermediate'
  },
  {
    id: 'lstm-timeseries',
    name: 'LSTM Zaman Serisi',
    description: 'Derin öğrenme ile zaman serisi analizi ve gelecek trend tahminleri',
    icon: '📈',
    category: 'trend',
    capabilities: ['Trend Analizi', 'Zaman Serisi', 'Döngü Tespiti', 'Sezonallik Analizi'],
    accuracy: 87,
    speed: 'slow',
    complexity: 'advanced'
  },
  {
    id: 'transformer-trend',
    name: 'Transformer Trend Analizi',
    description: 'Son teknoloji transformer modelleri ile piyasa trend analizi',
    icon: '🔄',
    category: 'trend',
    capabilities: ['Trend Tespiti', 'Momentum Analizi', 'Reversal Sinyalleri', 'Piyasa Döngüleri'],
    accuracy: 90,
    speed: 'medium',
    complexity: 'advanced'
  }
];

export default function AIModelSelector({ 
  selectedModels, 
  onModelChange, 
  maxSelections = 3,
  category = 'all'
}: AIModelSelectorProps) {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const filteredModels = category === 'all' 
    ? AI_MODELS 
    : AI_MODELS.filter(model => model.category === category);

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelChange(selectedModels.filter(id => id !== modelId));
    } else if (selectedModels.length < maxSelections) {
      onModelChange([...selectedModels, modelId]);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSpeedColor = (speed: string) => {
    if (speed === 'fast') return 'text-green-600 dark:text-green-400';
    if (speed === 'medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity === 'basic') return 'text-green-600 dark:text-green-400';
    if (complexity === 'intermediate') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-purple-600 dark:text-purple-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🤖 AI Model Seçimi
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {selectedModels.length}/{maxSelections} seçili
        </div>
      </div>

      <div className="grid gap-4">
        {filteredModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          const isExpanded = expandedModel === model.id;
          const canSelect = selectedModels.length < maxSelections || isSelected;

          return (
            <div
              key={model.id}
              className={`border rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } ${!canSelect ? 'opacity-50' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{model.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {model.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          model.category === 'analysis' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          model.category === 'sentiment' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          model.category === 'prediction' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}>
                          {model.category === 'analysis' ? 'Analiz' :
                           model.category === 'sentiment' ? 'Duygu' :
                           model.category === 'prediction' ? 'Tahmin' : 'Trend'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {model.description}
                      </p>
                      
                      {/* Model Metrikleri */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-400">Doğruluk:</span>
                          <span className={`font-medium ${getAccuracyColor(model.accuracy)}`}>
                            %{model.accuracy}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-400">Hız:</span>
                          <span className={`font-medium ${getSpeedColor(model.speed)}`}>
                            {model.speed === 'fast' ? 'Hızlı' : 
                             model.speed === 'medium' ? 'Orta' : 'Yavaş'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-400">Seviye:</span>
                          <span className={`font-medium ${getComplexityColor(model.complexity)}`}>
                            {model.complexity === 'basic' ? 'Temel' :
                             model.complexity === 'intermediate' ? 'Orta' : 'İleri'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedModel(isExpanded ? null : model.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Detayları göster"
                    >
                      <svg 
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleModelToggle(model.id)}
                      disabled={!canSelect}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : canSelect
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                      }`}
                    >
                      {isSelected ? 'Seçili' : 'Seç'}
                    </button>
                  </div>
                </div>

                {/* Genişletilmiş Detaylar */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Yetenekler:</h5>
                    <div className="flex flex-wrap gap-2">
                      {model.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                    
                    {/* Performans Göstergesi */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Performans Skoru</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            model.accuracy >= 90 ? 'bg-green-500' :
                            model.accuracy >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedModels.length === maxSelections && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-800 dark:text-yellow-300">
              Maksimum {maxSelections} model seçebilirsiniz. Yeni model seçmek için mevcut seçimlerden birini kaldırın.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}