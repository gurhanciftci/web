import React, { useState, useEffect } from 'react';

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
      try {
        // OpenWeatherMap ücretsiz API kullanıyoruz
        // Bu örnek için İstanbul'un hava durumunu gösteriyoruz
        const API_KEY = 'demo'; // Gerçek kullanımda API key gerekli
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=${API_KEY}&units=metric&lang=tr`
        );
        
        if (!response.ok) {
          throw new Error('Hava durumu alınamadı');
        }
        
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          city: data.name,
          icon: data.weather[0].icon
        });
      } catch (error) {
        // Demo verisi göster
        setWeather({
          temperature: 18,
          description: 'parçalı bulutlu',
          city: 'İstanbul',
          icon: '02d'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Her 30 dakikada bir güncelle
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

  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl">
        {weather.icon.includes('01') ? '☀️' : 
         weather.icon.includes('02') ? '⛅' :
         weather.icon.includes('03') || weather.icon.includes('04') ? '☁️' :
         weather.icon.includes('09') || weather.icon.includes('10') ? '🌧️' :
         weather.icon.includes('11') ? '⛈️' :
         weather.icon.includes('13') ? '❄️' :
         weather.icon.includes('50') ? '🌫️' : '🌤️'}
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