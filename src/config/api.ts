// API Configuration with environment variables and fallbacks
export const API_CONFIG = {
  GUARDIAN_API_KEY: import.meta.env.VITE_GUARDIAN_API_KEY || '',
  TWELVE_DATA_KEY: import.meta.env.VITE_TWELVE_DATA_KEY || '',
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  
  // Rate limiting - more conservative defaults
  NEWS_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_NEWS_REFRESH_INTERVAL || '900000'), // 15 minutes
  MARKET_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_MARKET_REFRESH_INTERVAL || '300000'), // 5 minutes
  WEATHER_REFRESH_INTERVAL: parseInt(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL || '1800000'), // 30 minutes
  
  // API Endpoints - Use proxy paths in development, direct URLs in production
  GUARDIAN_BASE_URL: import.meta.env.DEV ? '/api/guardian' : 'https://content.guardianapis.com',
  TWELVE_DATA_BASE_URL: import.meta.env.DEV ? '/api/twelvedata' : 'https://api.twelvedata.com',
  TRANSLATION_API_URL: 'https://api.mymemory.translated.net/get',
  OPENWEATHER_BASE_URL: import.meta.env.DEV ? '/api/openweather' : 'https://api.openweathermap.org/data/2.5'
};

// Validate API keys and provide helpful feedback
export function validateApiKeys(): { 
  isValid: boolean; 
  missing: string[]; 
  warnings: string[];
  recommendations: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Guardian API Key Check - More thorough validation
  if (!API_CONFIG.GUARDIAN_API_KEY || 
      API_CONFIG.GUARDIAN_API_KEY === 'YOUR_GUARDIAN_API_KEY_HERE' ||
      API_CONFIG.GUARDIAN_API_KEY === 'your_guardian_api_key_here' ||
      API_CONFIG.GUARDIAN_API_KEY.length < 10) {
    missing.push('Guardian API Key');
    recommendations.push('Guardian API key almak için: https://open-platform.theguardian.com/access/');
  } else {
    warnings.push('Guardian API key mevcut - haberler aktif');
  }
  
  // TwelveData API Key Check
  if (!API_CONFIG.TWELVE_DATA_KEY || 
      API_CONFIG.TWELVE_DATA_KEY === 'YOUR_TWELVE_DATA_KEY_HERE' ||
      API_CONFIG.TWELVE_DATA_KEY === 'your_twelve_data_key_here') {
    missing.push('TwelveData API Key');
    recommendations.push('TwelveData API key almak için: https://twelvedata.com/');
  } else {
    warnings.push('TwelveData API key mevcut - piyasa verileri aktif');
  }
  
  // OpenWeather API Key Check
  if (!API_CONFIG.OPENWEATHER_API_KEY || 
      API_CONFIG.OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY_HERE' ||
      API_CONFIG.OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
    missing.push('OpenWeather API Key');
    recommendations.push('OpenWeather API key almak için: https://openweathermap.org/api');
  } else {
    warnings.push('OpenWeather API key mevcut - hava durumu aktif');
  }
  
  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    recommendations
  };
}

// Environment check for debugging
export function getEnvironmentInfo() {
  return {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    baseUrl: import.meta.env.BASE_URL,
    mode: import.meta.env.MODE,
    hasGuardianKey: !!API_CONFIG.GUARDIAN_API_KEY && 
                   API_CONFIG.GUARDIAN_API_KEY !== 'YOUR_GUARDIAN_API_KEY_HERE' &&
                   API_CONFIG.GUARDIAN_API_KEY !== 'your_guardian_api_key_here' &&
                   API_CONFIG.GUARDIAN_API_KEY.length > 10,
    hasTwelveDataKey: !!API_CONFIG.TWELVE_DATA_KEY && 
                     API_CONFIG.TWELVE_DATA_KEY !== 'YOUR_TWELVE_DATA_KEY_HERE' &&
                     API_CONFIG.TWELVE_DATA_KEY !== 'your_twelve_data_key_here',
    hasWeatherKey: !!API_CONFIG.OPENWEATHER_API_KEY && 
                  API_CONFIG.OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY_HERE' &&
                  API_CONFIG.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here'
  };
}