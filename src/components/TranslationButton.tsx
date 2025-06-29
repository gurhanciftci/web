import React, { useState } from 'react';
import { NewsItem, TranslatedContent } from '../types/news';
import { translateNewsContent, getCachedTranslation, setCachedTranslation } from '../utils/translation';

interface TranslationButtonProps {
  newsItem: NewsItem;
  onTranslate: (translation: TranslatedContent | null) => void;
  isTranslated: boolean;
}

export default function TranslationButton({ newsItem, onTranslate, isTranslated }: TranslationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (isTranslated) {
      // Orijinal metne dön
      onTranslate(null);
      return;
    }

    setIsLoading(true);
    
    try {
      // Önce cache'den kontrol et
      const cached = getCachedTranslation(newsItem.title);
      if (cached) {
        onTranslate(cached);
        setIsLoading(false);
        return;
      }

      // Çeviri yap
      const translation = await translateNewsContent(newsItem.title, newsItem.description);
      
      // Cache'e kaydet
      setCachedTranslation(newsItem.title, translation);
      
      onTranslate(translation);
    } catch (error) {
      console.error('Çeviri hatası:', error);
      alert('Çeviri yapılırken hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTranslate}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isTranslated
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isTranslated ? 'Orijinal metni göster' : 'Türkçeye çevir'}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )}
    </button>
  );
}