// API Configuration with environment variables
export const API_CONFIG = {
  GUARDIAN_API_KEY: import.meta.env.VITE_GUARDIAN_API_KEY || '',
  TWELVE_DATA_KEY: import.meta.env.VITE_TWELVE_DATA_KEY || '',
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  
  // Rate limiting
  NEWS_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_NEWS_REFRESH_INTERVAL || '300000'),
  MARKET_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_MARKET_REFRESH_INTERVAL || '60000'),
  
  // API Endpoints
  GUARDIAN_BASE_URL: 'https://content.guardianapis.com',
  TWELVE_DATA_BASE_URL: 'https://api.twelvedata.com',
  TRANSLATION_API_URL: 'https://api.mymemory.translated.net/get',
  OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5'
};

// Validate API keys
export function validateApiKeys(): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!API_CONFIG.GUARDIAN_API_KEY) missing.push('Guardian API Key');
  if (!API_CONFIG.TWELVE_DATA_KEY) missing.push('TwelveData API Key');
  if (!API_CONFIG.OPENWEATHER_API_KEY) missing.push('OpenWeather API Key');
  
  return {
    isValid: missing.length === 0,
    missing
  };
}