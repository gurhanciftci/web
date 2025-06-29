import React from 'react';
import { validateApiKeys, getEnvironmentInfo } from '../config/api';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showDebugInfo?: boolean;
}

export default function ErrorMessage({ message, onRetry, showDebugInfo = false }: ErrorMessageProps) {
  const apiValidation = validateApiKeys();
  const envInfo = getEnvironmentInfo();

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="text-center">
        <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Hata Oluştu</h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        
        {/* API Key Durumu */}
        {!apiValidation.isValid && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              🔑 API Key Durumu
            </h4>
            {apiValidation.missing.length > 0 && (
              <div className="text-left">
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                  Eksik API Keys: {apiValidation.missing.join(', ')}
                </p>
                <div className="space-y-1">
                  {apiValidation.recommendations.map((rec, index) => (
                    <p key={index} className="text-xs text-yellow-600 dark:text-yellow-500">
                      • {rec}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {apiValidation.warnings.length > 0 && (
              <div className="text-left mt-2">
                {apiValidation.warnings.map((warning, index) => (
                  <p key={index} className="text-xs text-green-600 dark:text-green-500">
                    ✓ {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Debug Bilgileri */}
        {showDebugInfo && envInfo.isDevelopment && (
          <details className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔧 Debug Bilgileri (Geliştirici Modu)
            </summary>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Environment: {envInfo.mode}</div>
              <div>Base URL: {envInfo.baseUrl}</div>
              <div>Guardian API: {envInfo.hasGuardianKey ? '✅ Mevcut' : '❌ Eksik'}</div>
              <div>TwelveData API: {envInfo.hasTwelveDataKey ? '✅ Mevcut' : '❌ Eksik'}</div>
              <div>Weather API: {envInfo.hasWeatherKey ? '✅ Mevcut' : '❌ Eksik'}</div>
              <div>User Agent: {navigator.userAgent}</div>
              <div>Online: {navigator.onLine ? '✅' : '❌'}</div>
            </div>
          </details>
        )}

        {/* Çözüm Önerileri */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            💡 Çözüm Önerileri
          </h4>
          <div className="text-left text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <p>• İnternet bağlantınızı kontrol edin</p>
            <p>• Sayfayı yenilemeyi deneyin</p>
            <p>• Tarayıcı cache'ini temizleyin</p>
            {!apiValidation.isValid && (
              <p>• API anahtarlarınızı .env dosyasında yapılandırın</p>
            )}
            <p>• Sorun devam ederse demo veriler kullanılacaktır</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
            >
              🔄 Tekrar Dene
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
          >
            🔄 Sayfayı Yenile
            </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors font-medium"
          >
            🗑️ Cache Temizle
          </button>
        </div>

        {/* Demo Mode Notice */}
        {!apiValidation.isValid && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400">
              📱 Demo modu aktif - Örnek haberler gösteriliyor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}