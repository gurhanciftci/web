import React from 'react';
import { NewsItem } from '../types/news';
import { addToFavorites, removeFromFavorites, isFavorite } from '../utils/favorites';

interface FavoriteButtonProps {
  newsItem: NewsItem;
  onToggle?: () => void;
}

export default function FavoriteButton({ newsItem, onToggle }: FavoriteButtonProps) {
  const isItemFavorite = isFavorite(newsItem);

  const handleToggle = () => {
    if (isItemFavorite) {
      removeFromFavorites(newsItem);
    } else {
      addToFavorites(newsItem);
    }
    onToggle?.();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 ${
        isItemFavorite
          ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
      }`}
      title={isItemFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <svg className="w-4 h-4" fill={isItemFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}