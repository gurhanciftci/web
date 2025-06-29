# Global News - Küresel Haber Uygulaması

Modern ve kullanıcı dostu bir haber uygulaması. Gerçek zamanlı haberler, piyasa verileri ve çeviri özellikleri ile donatılmış.

## 🚀 Özellikler

- **Gerçek Zamanlı Haberler**: Guardian API ile güncel haberler
- **Piyasa Verileri**: Canlı borsa ve kripto para verileri
- **Çeviri Desteği**: MyMemory API ile Türkçe çeviri
- **Favoriler**: Haberleri favorilere ekleme ve yönetme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Dark Mode**: Karanlık tema desteği
- **Hava Durumu**: Anlık hava durumu bilgisi
- **Resim Önizleme**: Hover ile resim büyütme
- **Akıllı Filtreleme**: Kategori ve önem derecesine göre filtreleme

## 🛠️ Teknolojiler

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **API'ler**: 
  - Guardian API (Haberler)
  - TwelveData API (Piyasa Verileri)
  - MyMemory API (Çeviri)
  - OpenWeatherMap API (Hava Durumu)

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd global-news-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın

## 🔧 Yapılandırma

### API Anahtarları

Uygulamanın tam işlevsellik için aşağıdaki API anahtarlarını yapılandırmanız gerekir:

1. **Guardian API**: `src/api/newsApi.ts` dosyasında `GUARDIAN_API_KEY`
2. **TwelveData API**: `src/api/marketApi.ts` dosyasında `TWELVE_DATA_KEY`
3. **OpenWeatherMap API**: `src/components/WeatherWidget.tsx` dosyasında `API_KEY`

### API Key Alma

- **Guardian API**: [https://open-platform.theguardian.com/access/](https://open-platform.theguardian.com/access/) (Ücretsiz - Günlük 5000 istek)
- **TwelveData API**: [https://twelvedata.com/](https://twelvedata.com/) (Ücretsiz plan mevcut)
- **OpenWeatherMap API**: [https://openweathermap.org/api](https://openweathermap.org/api) (Ücretsiz plan mevcut)

## 📱 Kullanım

### Ana Özellikler

- **Haber Listesi**: Ana sayfada kategorilere göre düzenlenmiş haberler
- **Arama**: Haberlerde anahtar kelime arama
- **Filtreleme**: Kategori ve önem derecesine göre filtreleme
- **Favoriler**: Beğendiğiniz haberleri favorilere ekleme
- **Çeviri**: Haberleri Türkçeye çevirme
- **Paylaşım**: Twitter ve WhatsApp'ta paylaşım

### Kısayollar

- **F**: Favoriler sayfasına git
- **H**: Ana sayfaya dön
- **T**: Tema değiştir

## 🏗️ Proje Yapısı

```
src/
├── api/                 # API servisleri
│   ├── newsApi.ts      # Haber API'si
│   └── marketApi.ts    # Piyasa verileri API'si
├── components/         # React bileşenleri
│   ├── Header.tsx      # Üst başlık
│   ├── NewsList.tsx    # Haber listesi
│   ├── FavoritesPage.tsx # Favoriler sayfası
│   └── ...
├── contexts/           # React context'leri
│   └── ThemeContext.tsx # Tema yönetimi
├── types/              # TypeScript tipleri
│   └── news.ts
├── utils/              # Yardımcı fonksiyonlar
│   ├── favorites.ts    # Favori yönetimi
│   └── translation.ts  # Çeviri işlemleri
└── ...
```

## 🎨 Tasarım Sistemi

- **Renkler**: Tailwind CSS renk paleti
- **Tipografi**: System font stack
- **Spacing**: 8px grid sistemi
- **Breakpoints**: Responsive tasarım için standart breakpoint'ler

## 🚀 Deployment

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Netlify Deploy

Proje Netlify'da deploy edilmeye hazır. `dist` klasörünü upload edin.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Bilinen Sorunlar

- Bazı haber resimlerinde CORS hatası olabilir
- API limitlerinde dikkatli olunmalı
- Çeviri servisi bazen yavaş yanıt verebilir

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Global News** - Modern haber deneyimi için tasarlandı 📰✨