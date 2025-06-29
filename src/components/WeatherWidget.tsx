import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import { cache, persistentCache } from '../utils/cache';
import { rateLimiter } from '../utils/security';

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
  country: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  lat: number;
  lon: number;
}

interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

type LocationPermission = 'granted' | 'denied' | 'prompt' | 'unavailable';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<LocationPermission>('prompt');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Check geolocation support
  const isGeolocationSupported = 'geolocation' in navigator;

  // Get user's current position
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!isGeolocationSupported) {
        reject(new Error('Geolocation desteklenmiyor'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000 // 5 minutes
        }
      );
    });
  };

  // Reverse geocoding to get city name from coordinates
  const getCityFromCoordinates = async (lat: number, lon: number): Promise<LocationData> => {
    const cacheKey = `location-${lat.toFixed(2)}-${lon.toFixed(2)}`;
    
    // Check cache first
    const cachedLocation = persistentCache.get<LocationData>(cacheKey);
    if (cachedLocation) {
      return cachedLocation;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER_API_KEY}`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (!response.ok) {
        throw new Error('Konum bilgisi alınamadı');
      }

      const data = await response.json();
      
      const locationData: LocationData = {
        lat,
        lon,
        city: data.name || 'Bilinmeyen Şehir',
        country: data.sys?.country || 'TR'
      };

      // Cache location data for 24 hours
      persistentCache.set(cacheKey, locationData, 24 * 60 * 60 * 1000);
      
      return locationData;
    } catch (error) {
      console.error('Reverse geocoding hatası:', error);
      return {
        lat,
        lon,
        city: 'Mevcut Konum',
        country: 'TR'
      };
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowLocationPrompt(false);

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Get city name from coordinates
      const locationData = await getCityFromCoordinates(latitude, longitude);
      
      setUserLocation(locationData);
      setLocationPermission('granted');
      
      // Save user preference
      localStorage.setItem('weather-location-preference', 'user-location');
      
      // Fetch weather for user location
      await fetchWeatherForLocation(locationData);
      
    } catch (error: any) {
      console.error('Konum alma hatası:', error);
      
      if (error.code === 1) { // PERMISSION_DENIED
        setLocationPermission('denied');
        setError('Konum izni reddedildi. Varsayılan şehir kullanılıyor.');
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        setError('Konum bilgisi alınamadı. Varsayılan şehir kullanılıyor.');
      } else if (error.code === 3) { // TIMEOUT
        setError('Konum alma zaman aşımı. Varsayılan şehir kullanılıyor.');
      } else {
        setError('Konum alınırken hata oluştu. Varsayılan şehir kullanılıyor.');
      }
      
      // Fallback to default city
      await fetchWeatherForDefaultCity();
    }
  };

  // Use default city (Istanbul)
  const useDefaultCity = async () => {
    setShowLocationPrompt(false);
    localStorage.setItem('weather-location-preference', 'default-city');
    await fetchWeatherForDefaultCity();
  };

  // Fetch weather for specific location
  const fetchWeatherForLocation = async (location: LocationData) => {
    const cacheKey = `weather-${location.lat.toFixed(2)}-${location.lon.toFixed(2)}`;
    
    // Check cache first
    const cachedWeather = cache.get<WeatherData>(cacheKey);
    if (cachedWeather) {
      setWeather(cachedWeather);
      setLoading(false);
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
      throw new Error("Hava durumu API rate limit aşıldı");
    }

    try {
      const response = await fetch(
        `${API_CONFIG.OPENWEATHER_BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=tr`,
        { signal: AbortSignal.timeout(8000) }
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
        city: location.city,
        country: location.country,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind?.speed * 3.6) || 0,
        feelsLike: Math.round(data.main.feels_like),
        lat: location.lat,
        lon: location.lon
      };
      
      setWeather(weatherData);
      
      // Cache the results
      cache.set(cacheKey, weatherData, 30 * 60 * 1000); // 30 minutes
      persistentCache.set(cacheKey, weatherData, 2 * 60 * 60 * 1000); // 2 hours
      
    } catch (error: any) {
      console.error('Hava durumu API hatası:', error);
      throw error;
    }
  };

  // Fetch weather for default city (Istanbul)
  const fetchWeatherForDefaultCity = async () => {
    const defaultLocation: LocationData = {
      lat: 41.0082,
      lon: 28.9784,
      city: 'İstanbul',
      country: 'TR'
    };
    
    try {
      await fetchWeatherForLocation(defaultLocation);
    } catch (error: any) {
      setError(error.message || 'Hava durumu verisi alınamadı');
      
      // Try to use any cached data
      const fallbackWeather = persistentCache.get<WeatherData>('weather-data');
      if (fallbackWeather) {
        setWeather(fallbackWeather);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Main weather fetch function
  const fetchWeather = async () => {
    if (!API_CONFIG.OPENWEATHER_API_KEY || API_CONFIG.OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
      setError('OpenWeather API key yapılandırılmamış');
      setLoading(false);
      return;
    }

    const locationPreference = localStorage.getItem('weather-location-preference');
    
    if (locationPreference === 'user-location' && userLocation) {
      // Use saved user location
      try {
        await fetchWeatherForLocation(userLocation);
      } catch (error) {
        await fetchWeatherForDefaultCity();
      }
    } else if (locationPreference === 'default-city') {
      // Use default city
      await fetchWeatherForDefaultCity();
    } else if (isGeolocationSupported) {
      // Show location prompt for first time users
      setShowLocationPrompt(true);
      setLoading(false);
    } else {
      // No geolocation support, use default city
      await fetchWeatherForDefaultCity();
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Set up refresh interval
    const interval = setInterval(() => {
      if (userLocation) {
        fetchWeatherForLocation(userLocation).catch(() => {
          fetchWeatherForDefaultCity();
        });
      } else {
        fetchWeatherForDefaultCity();
      }
    }, API_CONFIG.WEATHER_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [userLocation]);

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

  // Location permission prompt
  if (showLocationPrompt) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 max-w-xs">
        <div className="text-center">
          <div className="text-2xl mb-2">📍</div>
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Konum İzni
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
            Size özel hava durumu bilgisi için konumunuzu kullanabilir miyiz?
          </p>
          <div className="flex gap-2">
            <button
              onClick={requestLocationPermission}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded transition-colors"
            >
              İzin Ver
            </button>
            <button
              onClick={useDefaultCity}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-2 rounded transition-colors"
            >
              İstanbul Kullan
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs">Hava durumu yükleniyor...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <span className="text-xs">⚠️</span>
        <span className="text-xs">Hava durumu yüklenemedi</span>
        {isGeolocationSupported && (
          <button
            onClick={requestLocationPermission}
            className="text-xs underline hover:no-underline"
            title="Konumu tekrar dene"
          >
            🔄
          </button>
        )}
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl">
        {getWeatherEmoji(weather.icon)}
      </div>
      <div>
        <div className="text-sm font-semibold flex items-center gap-1">
          {weather.temperature}°C
          {userLocation && (
            <span className="text-xs text-green-600 dark:text-green-400" title="Konumunuz kullanılıyor">
              📍
            </span>
          )}
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
          <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-52">
            <div className="text-sm space-y-1">
              <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                {weather.city}, {weather.country}
                {userLocation && (
                  <span className="text-xs text-green-600 dark:text-green-400" title="Mevcut konumunuz">
                    📍
                  </span>
                )}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Hissedilen: {weather.feelsLike}°C
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Nem: %{weather.humidity}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Rüzgar: {weather.windSpeed} km/h
              </div>
              {error && (
                <div className="text-xs text-amber-600 dark:text-amber-400 pt-1 border-t border-gray-200 dark:border-gray-600">
                  ⚠️ {error}
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-500 pt-1 border-t border-gray-200 dark:border-gray-600">
                Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
              </div>
              {isGeolocationSupported && !userLocation && (
                <button
                  onClick={requestLocationPermission}
                  className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mt-2 transition-colors"
                >
                  📍 Konumumu Kullan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}