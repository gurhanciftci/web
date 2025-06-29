import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Hata Oluştu</h3>
      <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Tekrar Dene
        </button>
      )}
    </div>
  );
}