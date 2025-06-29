# Huly News - AI Destekli Finans Haber Platformu

Küresel finans piyasalarına odaklanan, yapay zeka destekli profesyonel haber platformu. Gerçek zamanlı haberler, AI analizi, piyasa verileri ve akıllı yatırım önerileri sunar.

## 🚀 Özellikler

### 📰 Haber Yönetimi
- **Gerçek Zamanlı Haberler**: Guardian API ile güncel haberler
- **AI Önceliklendirme**: Yapay zeka ile haber önem sıralaması
- **Akıllı Filtreleme**: Kategori, önem derecesi ve AI puanına göre filtreleme
- **Çeviri Desteği**: MyMemory API ile Türkçe çeviri
- **Favoriler**: Haberleri favorilere ekleme ve yönetme

### 🤖 AI Analiz Sistemi
- **GPT-4 Finansal Analiz**: Derinlemesine finansal analiz ve piyasa yorumları
- **BERT Duygu Analizi**: Haber metinlerindeki piyasa duygusunu analiz
- **XGBoost Tahminleme**: Makine öğrenmesi ile sayısal tahminler
- **LSTM Zaman Serisi**: Derin öğrenme ile trend analizi
- **Transformer Trend Analizi**: Son teknoloji ile piyasa trend tespiti

### 💼 Finansal Dashboard
- **Günlük Analiz Raporları**: Sabah ve akşam analiz raporları
- **Risk Değerlendirmesi**: Yüksek, orta, düşük risk kategorileri
- **Yatırım Önerileri**: AI destekli aksiyon önerileri
- **Piyasa Etkisi**: Haberlerin piyasalara olası etkileri
- **Teknik Göstergeler**: Sentiment, volatilite, momentum analizi

### 📊 Gelişmiş Analitik
- **Haber Önceliklendirme**: 5 kritere göre analiz
  - Güncellik ve Zamanlama
  - Etki Alanı ve Kapsam
  - İçerik Kalitesi
  - Okuyucu İlgisi
  - Rekabet Analizi/Özgünlük
- **Görselleştirme**: Grafikler ve tablolarla sonuç sunumu
- **Güven Aralıkları**: Hata payları ile birlikte tahminler

### 🎨 Kullanıcı Deneyimi
- **Modern Tasarım**: Apple seviyesinde tasarım estetiği
- **Responsive**: Mobil ve masaüstü uyumlu
- **Dark Mode**: Karanlık tema desteği
- **PWA**: Progressive Web App özellikleri
- **Offline Çalışma**: Çevrimdışı erişim desteği

## 🛠️ Teknolojiler

### Frontend
- **React 18**: Modern React hooks ve context API
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Hızlı build tool

### AI & Analytics
- **GPT-4 API**: Finansal analiz ve doğal dil işleme
- **BERT Model**: Sentiment analizi
- **XGBoost**: Makine öğrenmesi tahminleri
- **LSTM Networks**: Zaman serisi analizi
- **Transformer Models**: Trend analizi

### API'ler
- **Guardian API**: Haber kaynağı
- **TwelveData API**: Piyasa verileri
- **MyMemory API**: Çeviri servisi
- **OpenWeatherMap API**: Hava durumu

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd huly-news
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env
```

4. **API anahtarlarını yapılandırın:**
```env
VITE_GUARDIAN_API_KEY=your_guardian_api_key
VITE_TWELVE_DATA_KEY=your_twelve_data_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

## 🔧 API Anahtarları

### Guardian API (Ücretsiz)
- **URL**: https://open-platform.theguardian.com/access/
- **Limit**: Günlük 5000 istek
- **Kullanım**: Haber içeriği

### TwelveData API (Freemium)
- **URL**: https://twelvedata.com/
- **Limit**: Günlük 800 istek (ücretsiz)
- **Kullanım**: Piyasa verileri

### OpenWeatherMap API (Freemium)
- **URL**: https://openweathermap.org/api
- **Limit**: Dakikada 60 istek (ücretsiz)
- **Kullanım**: Hava durumu

## 🤖 AI Model Kullanımı

### Model Seçimi
```typescript
// AI model seçimi
const selectedModels = [
  'gpt4-financial',     // GPT-4 Finansal Analiz
  'bert-sentiment',     // BERT Duygu Analizi
  'xgboost-prediction'  // XGBoost Tahminleme
];
```

### Analiz Başlatma
```typescript
// AI analizi başlatma
const results = await performAIAnalysis(newsItems, selectedModels);
```

### Sonuç Yorumlama
```typescript
// Analiz sonuçlarını yorumlama
results.forEach(result => {
  console.log(`Model: ${result.modelName}`);
  console.log(`Güven: %${result.confidence}`);
  console.log(`Risk: ${result.results.riskLevel}`);
  console.log(`Öneri: ${result.results.recommendation}`);
});
```

## 📊 Haber Önceliklendirme

### Kriterlerin Ağırlıkları
- **Güncellik**: %25
- **Etki Alanı**: %30
- **Kalite**: %20
- **Okuyucu İlgisi**: %15
- **Özgünlük**: %10

### Puanlama Sistemi
```typescript
// Öncelik puanı hesaplama
const priorityScore = 
  (timeliness * 0.25) +
  (impact * 0.30) +
  (quality * 0.20) +
  (engagement * 0.15) +
  (uniqueness * 0.10);
```

## 🎯 Kullanım Senaryoları

### Finansal Profesyoneller
- Günlük piyasa analizi
- Risk değerlendirmesi
- Yatırım kararı desteği
- Trend takibi

### Haber Editörleri
- Haber önceliklendirme
- İçerik kalite analizi
- Okuyucu ilgi tahmini
- Rekabet analizi

### Bireysel Yatırımcılar
- Piyasa duygusu takibi
- Basit yatırım önerileri
- Haber filtreleme
- Trend analizi

## 🚀 Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Production Deployment
```bash
# Netlify, Vercel veya benzeri platformlarda deploy
# dist/ klasörünü upload edin
```

## 🔒 Güvenlik

- **API Key Güvenliği**: Environment variables kullanımı
- **Rate Limiting**: API isteklerinde sınırlama
- **Input Sanitization**: Kullanıcı girdilerinin temizlenmesi
- **CORS Handling**: Cross-origin isteklerin yönetimi

## 📱 PWA Özellikleri

- **Offline Çalışma**: Service Worker ile cache
- **Ana Ekrana Ekleme**: Install prompt
- **Push Notifications**: Bildirim desteği
- **Background Sync**: Arka plan senkronizasyonu

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Blue (600-900)
- **Secondary**: Purple (600-900)
- **Accent**: Green, Orange, Red
- **Neutral**: Gray (50-900)

### Typography
- **Headings**: Font weight 600-700
- **Body**: Font weight 400-500
- **Captions**: Font weight 300-400

### Spacing
- **Grid**: 8px base unit
- **Components**: 4px, 8px, 16px, 24px, 32px
- **Layout**: 48px, 64px, 96px

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Bilinen Sorunlar

- AI model yanıt süreleri değişkenlik gösterebilir
- Bazı API'lerde rate limiting uygulanabilir
- Çeviri servisi bazen yavaş yanıt verebilir

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Huly News** - AI destekli finans haber platformu 🤖📰💼