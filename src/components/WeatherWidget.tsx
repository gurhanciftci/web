import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import { cache, persistentCache } from '../utils/cache';

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

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

      try {
        // Only try real API if we have a valid key
        if (API_CONFIG.OPENWEATHER_API_KEY && API_CONFIG.OPENWEATHER_API_KEY !== 'demo_key') {
          const response = await fetch(
            `${API_CONFIG.OPENWEATHER_BASE_URL}/weather?q=Istanbul&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=tr`,
            { timeout: 5000 }
          );
          
          if (response.ok) {
            const data = await response.json();
            const weatherData = {
              temperature: Math.round(data.main.temp),
              description: data.weather[0].description,
              city: data.name,
              icon: data.weather[0].icon
            };
            
            setWeather(weatherData);
            cache.set(cacheKey, weatherData, 30 * 60 * 1000); // 30 minutes
            persistentCache.set(cacheKey, weatherData, 2 * 60 * 60 * 1000); // 2 hours
            setLoading(false);
            return;
          }
        }
        
        throw new Error('API key not available or invalid');
      } catch (error) {
        // Fallback to demo data
        const demoWeather = {
          temperature: 18,
          description: 'parçalı bulutlu',
          city: 'İstanbul',
          icon: '02d'
        };
        
        setWeather(demoWeather);
        cache.set(cacheKey, demoWeather, 30 * 60 * 1000);
        setLoading(false);
      }
    };

    fetchWeather();
    // Optimized interval - 30 minutes instead of 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
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

  if (!weather) return null;

  const getWeatherEmoji = (icon: string) => {
    if (icon.includes('01')) return '☀️';
    if (icon.includes('02')) return '⛅';
    if (icon.includes('03') || icon.includes('04')) return '☁️';
    if (icon.includes('09') || icon.includes('10')) return '🌧️';
    if (icon.includes('11')) return '⛈️';
    if (icon.includes('13')) return '❄️';
    if (icon.includes('50')) return '🌫️';
    return '🌤️';
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
    </div>
  );
}