import React, { useState, useEffect } from 'react';
import { FavoriteNews, TranslatedContent } from '../types/news';
import { getFavorites, removeFromFavorites } from '../utils/favorites';
import ShareButtons from './ShareButtons';
import TranslationButton from './TranslationButton';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteNews[]>([]);
  const [translations, setTranslations] = useState<Record<string, TranslatedContent>>({});

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemoveFavorite = (newsItem: FavoriteNews) => {
    removeFromFavorites(newsItem);
    setFavorites(getFavorites());
  };

  const handleTranslation = (newsId: string, translation: TranslatedContent | null) => {
    setTranslations(prev => {
      const newTranslations = { ...prev };
      if (translation) {
        newTranslations[newsId] = translation;
      } else {
        delete newTranslations[newsId];
      }
      return newTranslations;
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Henüz Favori Haber Yok</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Beğendiğiniz haberleri favorilere ekleyerek buradan kolayca erişebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Favori Haberlerim</h1>
        <p className="text-gray-600 dark:text-gray-400">{favorites.length} favori haber</p>
      </div>

      <div className="grid gap-6">
        {favorites.map((item) => {
          const newsId = item.id || item.url;
          const translation = translations[newsId];
          const displayTitle = translation?.title || item.title;
          const displayDescription = translation?.description || item.description;

          return (
            <article key={newsId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {item.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    Favori
                  </span>
                  {item.source && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {item.source}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    Eklenme: {new Date(item.addedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {displayTitle}
                  </a>
                </h2>
                
                {displayDescription && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {displayDescription.length > 200 
                      ? `${displayDescription.substring(0, 200)}...` 
                      : displayDescription
                    }
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                      Haberi Oku
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TranslationButton
                      newsItem={item}
                      onTranslate={(translation) => handleTranslation(newsId, translation)}
                      isTranslated={!!translation}
                    />
                    <button
                      onClick={() => handleRemoveFavorite(item)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                      title="Favorilerden çıkar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <ShareButtons title={displayTitle} url={item.url} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}