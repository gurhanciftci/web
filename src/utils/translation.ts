import { TranslatedContent } from '../types/news';

// Ücretsiz çeviri servisi - MyMemory API (günlük 10,000 ücretsiz çeviri)
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string, targetLang: string = 'tr'): Promise<string> {
  try {
    // Eğer metin zaten Türkçe karakterler içeriyorsa çevirme
    if (containsTurkishChars(text)) {
      return text;
    }

    const response = await fetch(
      `${TRANSLATION_API_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
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
  try {
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateText(title),
      translateText(description)
    ]);
    
    return {
      title: translatedTitle,
      description: translatedDescription,
      isTranslated: true
    };
  } catch (error) {
    console.error('Haber çevirisi hatası:', error);
    throw error;
  }
}

function containsTurkishChars(text: string): boolean {
  const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/;
  return turkishChars.test(text);
}

// Çeviri durumunu localStorage'da sakla
const TRANSLATION_CACHE_KEY = 'translation-cache';

export function getCachedTranslation(originalTitle: string): TranslatedContent | null {
  try {
    const cache = localStorage.getItem(TRANSLATION_CACHE_KEY);
    if (!cache) return null;
    
    const translations = JSON.parse(cache);
    return translations[originalTitle] || null;
  } catch (error) {
    return null;
  }
}

export function setCachedTranslation(originalTitle: string, translation: TranslatedContent): void {
  try {
    const cache = localStorage.getItem(TRANSLATION_CACHE_KEY);
    const translations = cache ? JSON.parse(cache) : {};
    
    translations[originalTitle] = translation;
    
    // Cache boyutunu sınırla (son 100 çeviri)
    const keys = Object.keys(translations);
    if (keys.length > 100) {
      const oldestKeys = keys.slice(0, keys.length - 100);
      oldestKeys.forEach(key => delete translations[key]);
    }
    
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(translations));
  } catch (error) {
    console.error('Çeviri cache hatası:', error);
  }
}