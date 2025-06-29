import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import { cache, persistentCache } from '../utils/cache';
import { rateLimiter } from '../utils/security';

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = 'weather-data';
      
      // Check cache first
      const cachedWeather = cache.get<WeatherData>(cacheKey);
      if (cachedWeather) {
        setWeather(cachedWeather);
        setLoading(false);
        return;
      }

      // Check persistent cache
      const persistentWeather = persistentCache.get<WeatherData>(cacheKey);
      if (persistentWeather) {
        setWeather(persistentWeather);
        setLoading(false);
        cache.set(cacheKey, persistentWeather, 30 * 60 * 1000); // 30 minutes in memory
        return;
      }

      // Rate limiting check
      if (!rateLimiter.canMakeRequest('weather-api', 10, 60 * 1000)) {
        const fallbackWeather = persistentCache.get<WeatherData>(cacheKey);
        if (fallbackWeather) {
          setWeather(fallbackWeather);
          setLoading(false);
          return;
        }
        setError("Hava durumu API rate limit aşıldı");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Check if we have a valid API key
        if (!API_CONFIG.OPENWEATHER_API_KEY || API_CONFIG.OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
          throw new Error('OpenWeather API key not configured');
        }

        const response = await fetch(
          `${API_CONFIG.OPENWEATHER_BASE_URL}/weather?q=Istanbul,TR&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=tr`,
          { 
            signal: AbortSignal.timeout(8000) // 8 second timeout
          }
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Geçersiz API anahtarı');
          } else if (response.status === 429) {
            throw new Error('API limit aşıldı');
          } else {
            throw new Error(`API hatası: ${response.status}`);
          }
        }
        
        const data = await response.json();
        
        const weatherData: WeatherData = {
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          city: data.name,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind?.speed * 3.6) || 0, // m/s to km/h
          feelsLike: Math.round(data.main.feels_like)
        };
        
        setWeather(weatherData);
        
        // Cache the results
        cache.set(cacheKey, weatherData, 30 * 60 * 1000); // 30 minutes
        persistentCache.set(cacheKey, weatherData, 2 * 60 * 60 * 1000); // 2 hours
        
      } catch (error: any) {
        console.error('Hava durumu API hatası:', error);
        setError(error.message || 'Hava durumu verisi alınamadı');
        
        // Try to use cached data on error
        const fallbackWeather = persistentCache.get<WeatherData>(cacheKey);
        if (fallbackWeather) {
          setWeather(fallbackWeather);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Use configured refresh interval
    const interval = setInterval(fetchWeather, API_CONFIG.WEATHER_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <span className="text-xs">⚠️</span>
        <span className="text-xs">Hava durumu yüklenemedi</span>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherEmoji = (icon: string) => {
    const iconMap: Record<string, string> = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[icon] || '🌤️';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl">
        {getWeatherEmoji(weather.icon)}
      </div>
      <div>
        <div className="text-sm font-semibold">
          {weather.temperature}°C
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
          {weather.description}
        </div>
      </div>
      
      {/* Enhanced weather info on hover */}
      <div className="hidden md:block">
        <div className="group relative">
          <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            ℹ️
          </button>
          <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-48">
            <div className="text-sm space-y-1">
              <div className="font-semibold text-gray-900 dark:text-white">{weather.city}</div>
              <div className="text-gray-600 dark:text-gray-400">
                Hissedilen: {weather.feelsLike}°C
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Nem: %{weather.humidity}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Rüzgar: {weather.windSpeed} km/h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-600">
                Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}