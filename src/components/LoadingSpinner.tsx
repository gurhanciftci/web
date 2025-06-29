import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export default function LoadingSpinner({ 
  message = "Yükleniyor...", 
  size = 'medium',
  showProgress = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const containerClasses = {
    small: 'py-4',
    medium: 'py-12',
    large: 'py-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      {/* Main Spinner */}
      <div className="relative">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400 ${sizeClasses[size]}`}></div>
        
        {/* Inner spinner for enhanced effect */}
        <div className={`absolute inset-2 animate-spin rounded-full border-t-2 border-blue-300 dark:border-blue-500 ${
          size === 'large' ? 'border-t-2' : 'border-t-1'
        }`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Loading Message */}
      <div className="mt-4 text-center">
        <span className="text-gray-600 dark:text-gray-300 font-medium">{message}</span>
        
        {/* Animated dots */}
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Progress indicator */}
      {showProgress && (
        <div className="mt-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      )}

      {/* Status messages */}
      <div className="mt-4 text-center max-w-md">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>📡 API bağlantısı kuruluyor...</div>
          <div>🔄 Veriler işleniyor...</div>
          <div>✨ İçerik hazırlanıyor...</div>
        </div>
      </div>
    </div>
  );
}