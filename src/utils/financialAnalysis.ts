import { NewsItem } from '../types/news';

export interface FinancialImpactAnalysis {
  impactLevel: 'high' | 'medium' | 'low';
  marketSectors: string[];
  riskLevel: 'high' | 'medium' | 'low';
  timeHorizon: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  confidence: number; // 1-5
}

export interface PoliticalImpactAnalysis {
  impactLevel: 'high' | 'medium' | 'low';
  affectedMarkets: string[];
  policyImplications: string[];
  timeframe: string;
  riskAssessment: string;
}

export interface GlobalEventAnalysis {
  category: 'geopolitical' | 'trade' | 'commodity' | 'economic';
  severity: number; // 1-5
  globalReach: 'global' | 'regional' | 'local';
  economicSectors: string[];
  marketVolatility: 'high' | 'medium' | 'low';
}

export interface InvestmentRecommendation {
  action: 'buy' | 'sell' | 'hold' | 'watch' | 'avoid';
  reasoning: string;
  timeframe: string;
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number; // 1-5
}

export interface FinancialNewsAnalysis {
  importance: number; // 1-5
  summary: string;
  marketImpact: string;
  investmentRecommendation: InvestmentRecommendation;
  riskLevel: 'high' | 'medium' | 'low';
  financialImpact?: FinancialImpactAnalysis;
  politicalImpact?: PoliticalImpactAnalysis;
  globalImpact?: GlobalEventAnalysis;
  keyMetrics: {
    volatilityImpact: number; // 1-5
    liquidityImpact: number; // 1-5
    sentimentImpact: number; // 1-5
  };
  relatedAssets: string[];
  updateTime: string;
}

export class FinancialNewsAnalyzer {
  private readonly centralBankKeywords = [
    'fed', 'federal reserve', 'ecb', 'european central bank', 'boe', 'bank of england',
    'boj', 'bank of japan', 'pboc', 'tcmb', 'merkez bankası', 'faiz', 'interest rate',
    'monetary policy', 'para politikası', 'qe', 'quantitative easing'
  ];

  private readonly macroEconomicKeywords = [
    'gdp', 'inflation', 'unemployment', 'cpi', 'ppi', 'retail sales',
    'gsyh', 'enflasyon', 'işsizlik', 'tüfe', 'üfe', 'perakende satış',
    'trade balance', 'current account', 'budget deficit', 'debt'
  ];

  private readonly corporateKeywords = [
    'earnings', 'revenue', 'profit', 'loss', 'merger', 'acquisition',
    'kazanç', 'gelir', 'kâr', 'zarar', 'birleşme', 'satın alma',
    'ipo', 'dividend', 'buyback', 'restructuring', 'bankruptcy'
  ];

  private readonly geopoliticalKeywords = [
    'war', 'conflict', 'sanctions', 'trade war', 'tariff', 'embargo',
    'savaş', 'çatışma', 'yaptırım', 'ticaret savaşı', 'gümrük vergisi',
    'election', 'referendum', 'coup', 'terrorism', 'seçim'
  ];

  private readonly commodityKeywords = [
    'oil', 'gold', 'silver', 'copper', 'wheat', 'corn', 'natural gas',
    'petrol', 'altın', 'gümüş', 'bakır', 'buğday', 'mısır', 'doğal gaz',
    'crude', 'brent', 'wti', 'opec'
  ];

  analyzeFinancialNews(newsItem: NewsItem): FinancialNewsAnalysis {
    const importance = this.calculateImportance(newsItem);
    const summary = this.generateSummary(newsItem);
    const marketImpact = this.assessMarketImpact(newsItem);
    const investmentRecommendation = this.generateInvestmentRecommendation(newsItem);
    const riskLevel = this.assessRiskLevel(newsItem);
    const keyMetrics = this.calculateKeyMetrics(newsItem);
    const relatedAssets = this.identifyRelatedAssets(newsItem);

    let financialImpact, politicalImpact, globalImpact;

    if (this.isFinancialNews(newsItem)) {
      financialImpact = this.analyzeFinancialImpact(newsItem);
    }

    if (this.isPoliticalNews(newsItem)) {
      politicalImpact = this.analyzePoliticalImpact(newsItem);
    }

    if (this.isGlobalEvent(newsItem)) {
      globalImpact = this.analyzeGlobalEvent(newsItem);
    }

    return {
      importance,
      summary,
      marketImpact,
      investmentRecommendation,
      riskLevel,
      financialImpact,
      politicalImpact,
      globalImpact,
      keyMetrics,
      relatedAssets,
      updateTime: new Date().toISOString()
    };
  }

  private calculateImportance(newsItem: NewsItem): number {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    let score = 2; // Base score

    // Central bank decisions - highest importance
    if (this.containsKeywords(content, this.centralBankKeywords)) {
      score += 2;
    }

    // Macro economic data
    if (this.containsKeywords(content, this.macroEconomicKeywords)) {
      score += 1.5;
    }

    // Corporate news
    if (this.containsKeywords(content, this.corporateKeywords)) {
      score += 1;
    }

    // Geopolitical events
    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      score += 1.5;
    }

    // Breaking news bonus
    if (content.includes('breaking') || content.includes('son dakika')) {
      score += 1;
    }

    // Market-moving numbers
    const hasSignificantNumbers = /(\d+\.?\d*)\s*(billion|million|trillion|milyar|milyon|trilyon)/i.test(content);
    if (hasSignificantNumbers) {
      score += 0.5;
    }

    return Math.max(1, Math.min(5, score));
  }

  private generateSummary(newsItem: NewsItem): string {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    if (this.containsKeywords(content, this.centralBankKeywords)) {
      return `Merkez bankası kararı: ${newsItem.title.substring(0, 100)}...`;
    }
    
    if (this.containsKeywords(content, this.macroEconomicKeywords)) {
      return `Makroekonomik veri: ${newsItem.title.substring(0, 100)}...`;
    }
    
    if (this.containsKeywords(content, this.corporateKeywords)) {
      return `Şirket haberi: ${newsItem.title.substring(0, 100)}...`;
    }

    return newsItem.description.length > 150 
      ? `${newsItem.description.substring(0, 150)}...`
      : newsItem.description;
  }

  private assessMarketImpact(newsItem: NewsItem): string {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    if (this.containsKeywords(content, this.centralBankKeywords)) {
      if (content.includes('rate') || content.includes('faiz')) {
        return 'Faiz oranı değişikliği tüm piyasaları etkileyebilir. Tahvil, döviz ve hisse senedi piyasalarında volatilite beklenir.';
      }
      return 'Merkez bankası politika değişikliği piyasa likiditesini ve risk iştahını etkileyecektir.';
    }

    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      return 'Jeopolitik gelişme risk iştahını azaltabilir. Güvenli liman varlıklarına yönelim artabilir.';
    }

    if (this.containsKeywords(content, this.macroEconomicKeywords)) {
      return 'Makroekonomik veri piyasa beklentilerini etkileyebilir. Sektörel rotasyon gözlenebilir.';
    }

    return 'Piyasalar üzerinde sınırlı etki beklenmektedir.';
  }

  private generateInvestmentRecommendation(newsItem: NewsItem): InvestmentRecommendation {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    const importance = this.calculateImportance(newsItem);

    if (this.containsKeywords(content, this.centralBankKeywords)) {
      if (content.includes('rate cut') || content.includes('faiz indirimi')) {
        return {
          action: 'buy',
          reasoning: 'Faiz indirimi hisse senetleri için pozitif. Büyüme hisselerine odaklanın.',
          timeframe: 'Kısa-orta vadeli (1-6 ay)',
          riskLevel: 'medium',
          confidence: 4
        };
      } else if (content.includes('rate hike') || content.includes('faiz artırımı')) {
        return {
          action: 'hold',
          reasoning: 'Faiz artırımı volatilite yaratabilir. Savunma sektörlerini tercih edin.',
          timeframe: 'Kısa vadeli (1-3 ay)',
          riskLevel: 'high',
          confidence: 4
        };
      }
    }

    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      return {
        action: 'watch',
        reasoning: 'Jeopolitik risk artışı. Güvenli liman varlıklarını izleyin.',
        timeframe: 'Anlık-kısa vadeli',
        riskLevel: 'high',
        confidence: 3
      };
    }

    if (importance >= 4) {
      return {
        action: 'watch',
        reasoning: 'Yüksek önemli gelişme. Piyasa tepkisini bekleyin.',
        timeframe: 'Anlık',
        riskLevel: 'medium',
        confidence: 3
      };
    }

    return {
      action: 'hold',
      reasoning: 'Mevcut pozisyonları koruyun. Gelişmeleri takip edin.',
      timeframe: 'Orta vadeli',
      riskLevel: 'low',
      confidence: 2
    };
  }

  private assessRiskLevel(newsItem: NewsItem): 'high' | 'medium' | 'low' {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    const importance = this.calculateImportance(newsItem);

    if (importance >= 4.5) return 'high';
    if (this.containsKeywords(content, this.geopoliticalKeywords)) return 'high';
    if (this.containsKeywords(content, this.centralBankKeywords)) return 'medium';
    if (importance >= 3) return 'medium';
    
    return 'low';
  }

  private calculateKeyMetrics(newsItem: NewsItem) {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    let volatilityImpact = 2;
    let liquidityImpact = 2;
    let sentimentImpact = 2;

    // Volatility impact
    if (this.containsKeywords(content, this.centralBankKeywords)) volatilityImpact += 2;
    if (this.containsKeywords(content, this.geopoliticalKeywords)) volatilityImpact += 1.5;
    if (content.includes('surprise') || content.includes('unexpected')) volatilityImpact += 1;

    // Liquidity impact
    if (content.includes('liquidity') || content.includes('likidite')) liquidityImpact += 2;
    if (this.containsKeywords(content, this.centralBankKeywords)) liquidityImpact += 1.5;
    if (content.includes('crisis') || content.includes('kriz')) liquidityImpact += 1;

    // Sentiment impact
    if (content.includes('positive') || content.includes('pozitif')) sentimentImpact += 1;
    if (content.includes('negative') || content.includes('negatif')) sentimentImpact -= 1;
    if (this.containsKeywords(content, this.geopoliticalKeywords)) sentimentImpact += 1.5;

    return {
      volatilityImpact: Math.max(1, Math.min(5, volatilityImpact)),
      liquidityImpact: Math.max(1, Math.min(5, liquidityImpact)),
      sentimentImpact: Math.max(1, Math.min(5, sentimentImpact))
    };
  }

  private identifyRelatedAssets(newsItem: NewsItem): string[] {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    const assets: string[] = [];

    if (this.containsKeywords(content, this.centralBankKeywords)) {
      assets.push('Tahviller', 'Döviz', 'Bankacılık Hisseleri');
    }

    if (this.containsKeywords(content, this.commodityKeywords)) {
      assets.push('Emtia ETF\'leri', 'Enerji Hisseleri', 'Maden Hisseleri');
    }

    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      assets.push('Altın', 'Güvenli Liman Tahvilleri', 'Savunma Hisseleri');
    }

    if (content.includes('tech') || content.includes('teknoloji')) {
      assets.push('Teknoloji Hisseleri', 'NASDAQ');
    }

    if (content.includes('inflation') || content.includes('enflasyon')) {
      assets.push('TIPS', 'Emtia', 'REITs');
    }

    return assets.length > 0 ? assets : ['Genel Piyasa'];
  }

  private analyzeFinancialImpact(newsItem: NewsItem): FinancialImpactAnalysis {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    let impactLevel: 'high' | 'medium' | 'low' = 'medium';
    let riskLevel: 'high' | 'medium' | 'low' = 'medium';
    let timeHorizon: 'immediate' | 'short-term' | 'medium-term' | 'long-term' = 'short-term';

    if (this.containsKeywords(content, this.centralBankKeywords)) {
      impactLevel = 'high';
      timeHorizon = 'immediate';
    }

    const marketSectors = this.identifyAffectedSectors(content);
    const confidence = this.calculateImportance(newsItem);

    return {
      impactLevel,
      marketSectors,
      riskLevel,
      timeHorizon,
      confidence
    };
  }

  private analyzePoliticalImpact(newsItem: NewsItem): PoliticalImpactAnalysis {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    let impactLevel: 'high' | 'medium' | 'low' = 'medium';
    
    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      impactLevel = 'high';
    }

    return {
      impactLevel,
      affectedMarkets: ['Döviz', 'Tahvil', 'Hisse Senedi'],
      policyImplications: ['Monetary Policy', 'Fiscal Policy', 'Trade Policy'],
      timeframe: 'Kısa-orta vadeli',
      riskAssessment: 'Piyasa volatilitesi artabilir'
    };
  }

  private analyzeGlobalEvent(newsItem: NewsItem): GlobalEventAnalysis {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    
    let category: 'geopolitical' | 'trade' | 'commodity' | 'economic' = 'economic';
    let severity = 3;
    let globalReach: 'global' | 'regional' | 'local' = 'regional';

    if (this.containsKeywords(content, this.geopoliticalKeywords)) {
      category = 'geopolitical';
      severity = 4;
      globalReach = 'global';
    } else if (this.containsKeywords(content, this.commodityKeywords)) {
      category = 'commodity';
      globalReach = 'global';
    }

    return {
      category,
      severity,
      globalReach,
      economicSectors: this.identifyAffectedSectors(content),
      marketVolatility: severity >= 4 ? 'high' : severity >= 3 ? 'medium' : 'low'
    };
  }

  private identifyAffectedSectors(content: string): string[] {
    const sectors: string[] = [];
    
    if (content.includes('bank') || content.includes('banka')) sectors.push('Bankacılık');
    if (content.includes('tech') || content.includes('teknoloji')) sectors.push('Teknoloji');
    if (content.includes('energy') || content.includes('enerji')) sectors.push('Enerji');
    if (content.includes('retail') || content.includes('perakende')) sectors.push('Perakende');
    if (content.includes('auto') || content.includes('otomotiv')) sectors.push('Otomotiv');
    if (content.includes('real estate') || content.includes('gayrimenkul')) sectors.push('Gayrimenkul');
    
    return sectors.length > 0 ? sectors : ['Genel Piyasa'];
  }

  private isFinancialNews(newsItem: NewsItem): boolean {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    return this.containsKeywords(content, [...this.centralBankKeywords, ...this.macroEconomicKeywords, ...this.corporateKeywords]);
  }

  private isPoliticalNews(newsItem: NewsItem): boolean {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    return newsItem.category === 'siyaset' || this.containsKeywords(content, this.geopoliticalKeywords);
  }

  private isGlobalEvent(newsItem: NewsItem): boolean {
    const content = `${newsItem.title} ${newsItem.description}`.toLowerCase();
    return this.containsKeywords(content, [...this.geopoliticalKeywords, ...this.commodityKeywords]) ||
           content.includes('global') || content.includes('international') || content.includes('küresel');
  }

  private containsKeywords(content: string, keywords: string[]): boolean {
    return keywords.some(keyword => content.includes(keyword.toLowerCase()));
  }

  // Batch analysis for daily reports
  generateDailyReport(newsItems: NewsItem[]): {
    morningReport: FinancialNewsAnalysis[];
    eveningReport: FinancialNewsAnalysis[];
    summary: {
      highImpactNews: number;
      averageRiskLevel: string;
      topRecommendations: string[];
      marketOutlook: string;
    };
  } {
    const analyses = newsItems.map(item => this.analyzeFinancialNews(item));
    
    // Separate morning and evening reports based on time
    const now = new Date();
    const morningCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0);
    
    const morningReport = analyses.filter(analysis => 
      new Date(analysis.updateTime) < morningCutoff
    );
    
    const eveningReport = analyses.filter(analysis => 
      new Date(analysis.updateTime) >= morningCutoff
    );

    const highImpactNews = analyses.filter(a => a.importance >= 4).length;
    const riskLevels = analyses.map(a => a.riskLevel);
    const highRisk = riskLevels.filter(r => r === 'high').length;
    const mediumRisk = riskLevels.filter(r => r === 'medium').length;
    
    let averageRiskLevel = 'low';
    if (highRisk > analyses.length * 0.3) averageRiskLevel = 'high';
    else if (mediumRisk > analyses.length * 0.4) averageRiskLevel = 'medium';

    const topRecommendations = analyses
      .filter(a => a.investmentRecommendation.confidence >= 4)
      .map(a => a.investmentRecommendation.reasoning)
      .slice(0, 5);

    const marketOutlook = this.generateMarketOutlook(analyses);

    return {
      morningReport,
      eveningReport,
      summary: {
        highImpactNews,
        averageRiskLevel,
        topRecommendations,
        marketOutlook
      }
    };
  }

  private generateMarketOutlook(analyses: FinancialNewsAnalysis[]): string {
    const highImpactCount = analyses.filter(a => a.importance >= 4).length;
    const highRiskCount = analyses.filter(a => a.riskLevel === 'high').length;
    
    if (highRiskCount > analyses.length * 0.4) {
      return 'Yüksek volatilite beklentisi. Savunma pozisyonu önerilir.';
    } else if (highImpactCount > analyses.length * 0.3) {
      return 'Orta düzey volatilite. Seçici yaklaşım önerilir.';
    } else {
      return 'Düşük volatilite ortamı. Büyüme fırsatları değerlendirilebilir.';
    }
  }
}

export const financialAnalyzer = new FinancialNewsAnalyzer();