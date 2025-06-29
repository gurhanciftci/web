import { TranslatedContent } from '../types/news';
import { rateLimiter } from './security';
import { cache, persistentCache } from './cache';
import { API_CONFIG } from '../config/api';

export async function translateText(text: string, targetLang: string = 'tr'): Promise<string> {
  try {
    // Eğer metin zaten Türkçe karakterler içeriyorsa çevirme
    if (containsTurkishChars(text)) {
      return text;
    }

    // Rate limiting check
    if (!rateLimiter.canMakeRequest('translation-api', 5, 60 * 1000)) {
      throw new Error('Çeviri servisi rate limit aşıldı. Lütfen bekleyin.');
    }

    const response = await fetch(
      `${API_CONFIG.TRANSLATION_API_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
      { timeout: 10000 }
    );
    
    if (!response.ok) {
      throw new Error('Çeviri servisi yanıt vermedi');
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    
    throw new Error('Çeviri yapılamadı');
  } catch (error) {
    console.error('Çeviri hatası:', error);
    throw new Error('Çeviri yapılırken hata oluştu');
  }
}

export async function translateNewsContent(title: string, description: string): Promise<TranslatedContent> {
  const cacheKey = `translation-${btoa(title).substring(0, 32)}`;
  
  // Check cache first
  const cachedTranslation = cache.get<TranslatedContent>(cacheKey);
  if (cachedTranslation) {
    return cachedTranslation;
  }

  // Check persistent cache
  const persistentTranslation = persistentCache.get<TranslatedContent>(cacheKey);
  if (persistentTranslation) {
    cache.set(cacheKey, persistentTranslation, 60 * 60 * 1000); // 1 hour in memory
    return persistentTranslation;
  }

  try {
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateText(title),
      translateText(description)
    ]);
    
    const translation: TranslatedContent = {
      title: translatedTitle,
      description: translatedDescription,
      isTranslated: true
    };

    // Cache the translation
    cache.set(cacheKey, translation, 60 * 60 * 1000); // 1 hour
    persistentCache.set(cacheKey, translation, 7 * 24 * 60 * 60 * 1000); // 7 days
    
    return translation;
  } catch (error) {
    console.error('Haber çevirisi hatası:', error);
    throw error;
  }
}

function containsTurkishChars(text: string): boolean {
  const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/;
  return turkishChars.test(text);
}

// Legacy functions for backward compatibility
export function getCachedTranslation(originalTitle: string): TranslatedContent | null {
  const cacheKey = `translation-${btoa(originalTitle).substring(0, 32)}`;
  return persistentCache.get<TranslatedContent>(cacheKey);
}

export function setCachedTranslation(originalTitle: string, translation: TranslatedContent): void {
  const cacheKey = `translation-${btoa(originalTitle).substring(0, 32)}`;
  persistentCache.set(cacheKey, translation, 7 * 24 * 60 * 60 * 1000); // 7 days
}