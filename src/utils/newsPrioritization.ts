import { NewsItem } from '../types/news';

export interface PrioritizationCriteria {
  timeliness: number;        // 1-5: Güncellik ve zamanlama
  impact: number;           // 1-5: Etki alanı ve kapsam
  quality: number;          // 1-5: İçerik kalitesi
  engagement: number;       // 1-5: Okuyucu ilgisi
  uniqueness: number;       // 1-5: Rekabet analizi/özgünlük
}

export interface NewsAnalytics {
  priorityScore: number;
  criteria: PrioritizationCriteria;
  recommendations: string[];
  category: 'breaking' | 'important' | 'standard' | 'low-priority';
  estimatedEngagement: 'high' | 'medium' | 'low';
}

export class NewsPrioritizationEngine {
  private readonly weights = {
    timeliness: 0.25,    // 25% - Güncellik çok önemli
    impact: 0.30,        // 30% - Etki alanı en önemli
    quality: 0.20,       // 20% - Kalite önemli
    engagement: 0.15,    // 15% - Okuyucu ilgisi
    uniqueness: 0.10     // 10% - Özgünlük
  };

  analyzeNews(newsItem: NewsItem): NewsAnalytics {
    const criteria = this.evaluateCriteria(newsItem);
    const priorityScore = this.calculatePriorityScore(criteria);
    const category = this.categorizeNews(priorityScore);
    const estimatedEngagement = this.estimateEngagement(criteria);
    const recommendations = this.generateRecommendations(criteria, newsItem);

    return {
      priorityScore,
      criteria,
      recommendations,
      category,
      estimatedEngagement
    };
  }

  private evaluateCriteria(newsItem: NewsItem): PrioritizationCriteria {
    return {
      timeliness: this.evaluateTimeliness(newsItem),
      impact: this.evaluateImpact(newsItem),
      quality: this.evaluateQuality(newsItem),
      engagement: this.evaluateEngagement(newsItem),
      uniqueness: this.evaluateUniqueness(newsItem)
    };
  }

  // 1. Güncellik ve Zamanlama Değerlendirmesi
  private evaluateTimeliness(newsItem: NewsItem): number {
    if (!newsItem.publishedAt) return 2;

    const publishTime = new Date(newsItem.publishedAt).getTime();
    const now = Date.now();
    const hoursSincePublish = (now - publishTime) / (1000 * 60 * 60);

    // Breaking news keywords
    const breakingKeywords = [
      'breaking', 'urgent', 'just in', 'developing', 'live', 'now',
      'son dakika', 'acil', 'canlı', 'şimdi', 'gelişiyor'
    ];

    const title = newsItem.title.toLowerCase();
    const description = newsItem.description.toLowerCase();
    const hasBreakingKeywords = breakingKeywords.some(keyword => 
      title.includes(keyword) || description.includes(keyword)
    );

    let score = 3; // Base score

    // Zaman bazlı puanlama
    if (hoursSincePublish <= 1) score += 2;
    else if (hoursSincePublish <= 6) score += 1;
    else if (hoursSincePublish <= 24) score += 0;
    else if (hoursSincePublish <= 72) score -= 1;
    else score -= 2;

    // Breaking news bonus
    if (hasBreakingKeywords) score += 1;

    return Math.max(1, Math.min(5, score));
  }

  // 2. Etki Alanı ve Kapsam Değerlendirmesi
  private evaluateImpact(newsItem: NewsItem): number {
    const title = newsItem.title.toLowerCase();
    const description = newsItem.description.toLowerCase();
    const content = `${title} ${description}`;

    let score = 2; // Base score

    // Yüksek etki alanı keywords
    const highImpactKeywords = [
      'global', 'world', 'international', 'crisis', 'war', 'pandemic',
      'economy', 'market', 'government', 'president', 'minister',
      'küresel', 'dünya', 'uluslararası', 'kriz', 'savaş', 'pandemi',
      'ekonomi', 'piyasa', 'hükümet', 'başkan', 'bakan'
    ];

    // Orta etki alanı keywords
    const mediumImpactKeywords = [
      'national', 'country', 'city', 'regional', 'local',
      'ulusal', 'ülke', 'şehir', 'bölgesel', 'yerel'
    ];

    // Sayısal etki göstergeleri
    const impactNumbers = content.match(/(\d+)\s*(million|billion|thousand|milyon|milyar|bin)/gi);
    
    // Keyword analizi
    const highImpactCount = highImpactKeywords.filter(keyword => content.includes(keyword)).length;
    const mediumImpactCount = mediumImpactKeywords.filter(keyword => content.includes(keyword)).length;

    // Puanlama
    score += highImpactCount * 0.5;
    score += mediumImpactCount * 0.3;
    
    if (impactNumbers && impactNumbers.length > 0) {
      score += 1;
    }

    // Kategori bazlı bonus
    if (newsItem.category === 'finans') score += 0.5;
    if (newsItem.category === 'siyaset') score += 0.7;
    if (newsItem.category === 'dünya') score += 0.8;

    return Math.max(1, Math.min(5, score));
  }

  // 3. İçerik Kalitesi Değerlendirmesi
  private evaluateQuality(newsItem: NewsItem): number {
    let score = 3; // Base score

    // Kaynak güvenilirliği
    const reliableSources = [
      'reuters', 'bbc', 'guardian', 'associated press', 'bloomberg',
      'anadolu ajansı', 'trt', 'cnn', 'dha'
    ];

    const source = (newsItem.source || '').toLowerCase();
    if (reliableSources.some(reliable => source.includes(reliable))) {
      score += 1;
    }

    // İçerik uzunluğu ve detay
    const titleLength = newsItem.title.length;
    const descriptionLength = newsItem.description.length;

    if (titleLength > 50 && titleLength < 120) score += 0.3; // Optimal title length
    if (descriptionLength > 100) score += 0.5; // Detailed description
    if (descriptionLength > 300) score += 0.2; // Very detailed

    // Görsel içerik
    if (newsItem.imageUrl) score += 0.5;

    // İçerik yapısı analizi
    const hasQuotes = /[""]/.test(newsItem.description);
    const hasNumbers = /\d+/.test(newsItem.description);
    const hasProperNouns = /[A-Z][a-z]+/.test(newsItem.description);

    if (hasQuotes) score += 0.2;
    if (hasNumbers) score += 0.2;
    if (hasProperNouns) score += 0.1;

    return Math.max(1, Math.min(5, score));
  }

  // 4. Okuyucu İlgisi Değerlendirmesi
  private evaluateEngagement(newsItem: NewsItem): number {
    const title = newsItem.title.toLowerCase();
    const description = newsItem.description.toLowerCase();
    const content = `${title} ${description}`;

    let score = 2.5; // Base score

    // Yüksek ilgi çeken konular
    const highEngagementTopics = [
      'technology', 'ai', 'crypto', 'bitcoin', 'tesla', 'apple', 'google',
      'teknoloji', 'yapay zeka', 'kripto', 'bitcoin', 'tesla'
    ];

    // Duygusal tetikleyiciler
    const emotionalTriggers = [
      'shocking', 'amazing', 'incredible', 'breakthrough', 'revolutionary',
      'şaşırtıcı', 'inanılmaz', 'devrim', 'çığır açan'
    ];

    // Trend konular
    const trendingTopics = [
      'climate', 'election', 'covid', 'ukraine', 'inflation',
      'iklim', 'seçim', 'covid', 'ukrayna', 'enflasyon'
    ];

    // Puanlama
    const highEngagementCount = highEngagementTopics.filter(topic => content.includes(topic)).length;
    const emotionalCount = emotionalTriggers.filter(trigger => content.includes(trigger)).length;
    const trendingCount = trendingTopics.filter(trend => content.includes(trend)).length;

    score += highEngagementCount * 0.4;
    score += emotionalCount * 0.3;
    score += trendingCount * 0.5;

    // Başlık analizi
    if (title.includes('?')) score += 0.2; // Questions engage readers
    if (title.length > 60) score -= 0.3; // Too long titles
    if (title.length < 30) score -= 0.2; // Too short titles

    return Math.max(1, Math.min(5, score));
  }

  // 5. Rekabet Analizi ve Özgünlük
  private evaluateUniqueness(newsItem: NewsItem): number {
    let score = 3; // Base score

    const title = newsItem.title.toLowerCase();
    const description = newsItem.description.toLowerCase();

    // Özgün açı göstergeleri
    const uniqueAngles = [
      'exclusive', 'first', 'revealed', 'investigation', 'analysis',
      'özel', 'ilk', 'ortaya çıktı', 'araştırma', 'analiz'
    ];

    // Genel konular (düşük özgünlük)
    const commonTopics = [
      'weather', 'traffic', 'routine', 'regular', 'standard',
      'hava durumu', 'trafik', 'rutin', 'normal', 'standart'
    ];

    const uniqueCount = uniqueAngles.filter(angle => 
      title.includes(angle) || description.includes(angle)
    ).length;

    const commonCount = commonTopics.filter(topic => 
      title.includes(topic) || description.includes(topic)
    ).length;

    score += uniqueCount * 0.5;
    score -= commonCount * 0.3;

    // Kaynak çeşitliliği
    if (newsItem.source && !newsItem.source.includes('Reuters')) {
      score += 0.2; // Non-wire service bonus
    }

    return Math.max(1, Math.min(5, score));
  }

  private calculatePriorityScore(criteria: PrioritizationCriteria): number {
    return (
      criteria.timeliness * this.weights.timeliness +
      criteria.impact * this.weights.impact +
      criteria.quality * this.weights.quality +
      criteria.engagement * this.weights.engagement +
      criteria.uniqueness * this.weights.uniqueness
    );
  }

  private categorizeNews(score: number): 'breaking' | 'important' | 'standard' | 'low-priority' {
    if (score >= 4.5) return 'breaking';
    if (score >= 3.5) return 'important';
    if (score >= 2.5) return 'standard';
    return 'low-priority';
  }

  private estimateEngagement(criteria: PrioritizationCriteria): 'high' | 'medium' | 'low' {
    const engagementScore = (criteria.engagement + criteria.impact + criteria.timeliness) / 3;
    if (engagementScore >= 4) return 'high';
    if (engagementScore >= 3) return 'medium';
    return 'low';
  }

  private generateRecommendations(criteria: PrioritizationCriteria, newsItem: NewsItem): string[] {
    const recommendations: string[] = [];

    // Güncellik önerileri
    if (criteria.timeliness < 3) {
      recommendations.push('Daha güncel haberler öncelendirilmeli');
      recommendations.push('Breaking news etiketleri kullanılmalı');
    }

    // Etki alanı önerileri
    if (criteria.impact < 3) {
      recommendations.push('Haberin etki alanını genişletecek açılar bulunmalı');
      recommendations.push('Sayısal veriler ve istatistikler eklenmeli');
    }

    // Kalite önerileri
    if (criteria.quality < 3) {
      recommendations.push('Daha güvenilir kaynaklardan haberler tercih edilmeli');
      recommendations.push('Görsel içerik eklenmeli');
      recommendations.push('Haber detayları genişletilmeli');
    }

    // Okuyucu ilgisi önerileri
    if (criteria.engagement < 3) {
      recommendations.push('Başlık daha çekici hale getirilmeli');
      recommendations.push('Trend konularla bağlantı kurulmalı');
      recommendations.push('Duygusal bağ kuracak öğeler eklenmeli');
    }

    // Özgünlük önerileri
    if (criteria.uniqueness < 3) {
      recommendations.push('Habere özgün bir açı kazandırılmalı');
      recommendations.push('Eksklüzif bilgiler araştırılmalı');
      recommendations.push('Farklı kaynaklardan doğrulama yapılmalı');
    }

    // Genel optimizasyon önerileri
    if (newsItem.title.length > 100) {
      recommendations.push('Başlık kısaltılmalı (max 100 karakter)');
    }

    if (!newsItem.imageUrl) {
      recommendations.push('Görsel içerik eklenmeli');
    }

    if (newsItem.description.length < 100) {
      recommendations.push('Haber açıklaması genişletilmeli');
    }

    return recommendations;
  }

  // Toplu analiz için
  analyzeNewsBatch(newsItems: NewsItem[]): {
    analytics: (NewsAnalytics & { newsItem: NewsItem })[];
    summary: {
      averageScore: number;
      categoryDistribution: Record<string, number>;
      topRecommendations: string[];
    };
  } {
    const analytics = newsItems.map(newsItem => ({
      ...this.analyzeNews(newsItem),
      newsItem
    }));

    const averageScore = analytics.reduce((sum, item) => sum + item.priorityScore, 0) / analytics.length;
    
    const categoryDistribution = analytics.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allRecommendations = analytics.flatMap(item => item.recommendations);
    const recommendationCounts = allRecommendations.reduce((acc, rec) => {
      acc[rec] = (acc[rec] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRecommendations = Object.entries(recommendationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([rec]) => rec);

    return {
      analytics,
      summary: {
        averageScore,
        categoryDistribution,
        topRecommendations
      }
    };
  }
}

export const prioritizationEngine = new NewsPrioritizationEngine();