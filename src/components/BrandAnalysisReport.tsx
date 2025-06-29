import React, { useState } from 'react';

interface BrandAnalysisReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandAnalysisReport({ isOpen, onClose }: BrandAnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendations' | 'implementation'>('analysis');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎨 Huly News Marka Analizi</h2>
              <p className="text-cyan-100 text-sm">
                Görsel kimlik analizi ve geliştirme önerileri
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {[
              { id: 'analysis', label: 'Mevcut Analiz', icon: '🔍' },
              { id: 'recommendations', label: 'Geliştirme Önerileri', icon: '💡' },
              { id: 'implementation', label: 'Uygulama Planı', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'analysis' && (
            <div className="space-y-8">
              {/* Logo Analizi */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Mevcut Logo Analizi
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Güçlü Yönler */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                      <span>✅</span> Güçlü Yönler
                    </h4>
                    <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                      <li>• <strong>AI Beyin Sembolü:</strong> Yapay zeka odaklı yaklaşımı net şekilde yansıtıyor</li>
                      <li>• <strong>Finansal Grafikler:</strong> Büyüme ve analiz vurgusu güçlü</li>
                      <li>• <strong>Küresel Perspektif:</strong> Dünya haritası uluslararası odağı gösteriyor</li>
                      <li>• <strong>Renk Uyumu:</strong> Cyan-mavi paleti güven ve teknoloji çağrışımı</li>
                      <li>• <strong>Profesyonel Görünüm:</strong> Kurumsal kimlik için uygun</li>
                    </ul>
                  </div>

                  {/* Geliştirme Alanları */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
                      <span>🔄</span> Geliştirme Alanları
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-400">
                      <li>• <strong>Duygusal Bağ:</strong> Daha kişisel ve yakın hissettiren öğeler</li>
                      <li>• <strong>Hareket ve Dinamizm:</strong> Animasyon ve etkileşim potansiyeli</li>
                      <li>• <strong>Hikaye Anlatımı:</strong> Marka değerlerini destekleyen görsel metafor</li>
                      <li>• <strong>Mobil Uyumluluk:</strong> Küçük ekranlarda okunabilirlik</li>
                      <li>• <strong>Sosyal Medya Adaptasyonu:</strong> Platform özel varyasyonlar</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Renk Paleti Analizi */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🎨 Renk Paleti ve Psikolojik Etki
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                    <div className="w-full h-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded mb-3"></div>
                    <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-2">Ana Renk: Cyan</h4>
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">
                      Teknoloji, yenilik, güven ve profesyonellik çağrışımı. Fintech sektörü için ideal.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded mb-3"></div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Destekleyici: Mavi</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Güvenilirlik, istikrar ve kurumsal güven. Finansal hizmetlerde tercih edilen renk.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="w-full h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded mb-3"></div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2">Nötr: Gri</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      Denge, objektiflik ve profesyonellik. Haber platformları için uygun.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hedef Kitle Analizi */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  👥 Hedef Kitle ile İletişim
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Birincil Hedef Kitle</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3">
                        <h5 className="font-medium text-blue-800 dark:text-blue-300">Finansal Profesyoneller</h5>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Logo'nun teknik ve analitik vurgusu bu kitleye güçlü şekilde hitap ediyor.
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3">
                        <h5 className="font-medium text-green-800 dark:text-green-300">Teknoloji Meraklıları</h5>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          AI beyin sembolü ve modern tasarım bu segmente çekici geliyor.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">İkincil Hedef Kitle</h4>
                    <div className="space-y-3">
                      <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-3">
                        <h5 className="font-medium text-purple-800 dark:text-purple-300">Bireysel Yatırımcılar</h5>
                        <p className="text-sm text-purple-700 dark:text-purple-400">
                          Daha duygusal ve kişisel öğeler eklenerek bu kitleye daha iyi hitap edilebilir.
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-3">
                        <h5 className="font-medium text-orange-800 dark:text-orange-300">Haber Editörleri</h5>
                        <p className="text-sm text-orange-700 dark:text-orange-400">
                          Profesyonel görünüm uygun, ancak yaratıcılık vurgusu artırılabilir.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-8">
              {/* Duygusal Bağ Önerileri */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💝 Duygusal Bağ Güçlendirme
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6">
                    <h4 className="font-semibold text-pink-800 dark:text-pink-300 mb-4 flex items-center gap-2">
                      <span>🎯</span> Slogan Önerileri
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
                        <p className="font-medium text-gray-900 dark:text-white">"Geleceği Bugünden Gör"</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Öngörü ve vizyon vurgusu</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
                        <p className="font-medium text-gray-900 dark:text-white">"Akıllı Finans, Güvenilir Analiz"</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Teknoloji + güven kombinasyonu</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
                        <p className="font-medium text-gray-900 dark:text-white">"Veriden Değere, Analizden Aksiyona"</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Süreç ve sonuç odaklı</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                      <span>✨</span> Görsel Geliştirmeler
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                      <li>• <strong>Animasyonlu Logo:</strong> Nöral ağ bağlantıları canlanıyor</li>
                      <li>• <strong>Nabız Efekti:</strong> Canlılık ve dinamizm vurgusu</li>
                      <li>• <strong>Veri Akışı:</strong> Parçacık animasyonları ile hareket</li>
                      <li>• <strong>Hover Efektleri:</strong> Etkileşimli deneyim</li>
                      <li>• <strong>Renk Geçişleri:</strong> Gradient animasyonları</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Trend Uyumu */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📈 2025 Tasarım Trendleri ile Uyum
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">🤖 AI-First Design</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      Yapay zeka odaklı görsel dil, nöral ağ estetiği ve akıllı etkileşimler
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">🌱 Sürdürülebilirlik</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Çevre dostu finans, ESG yatırımları ve sürdürülebilir büyüme vurgusu
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">⚡ Hiper-Kişiselleştirme</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      Kullanıcı odaklı deneyim, adaptif arayüzler ve kişisel finans çözümleri
                    </p>
                  </div>
                </div>
              </div>

              {/* Duygusal Motivasyonlar */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🎭 Hedef Kitlenin Duygusal Motivasyonları
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">💪 Güçlenme ve Kontrol</h4>
                    <p className="text-blue-700 dark:text-blue-400 mb-3">
                      Kullanıcılar finansal kararlarında daha güçlü ve kontrolde hissetmek istiyor.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Tasarım Önerisi:</strong> "Kontrolü Elinize Alın" temalı görsel öğeler, 
                        kullanıcının merkeze alındığı kompozisyonlar
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">🎯 Başarı ve Büyüme</h4>
                    <p className="text-green-700 dark:text-green-400 mb-3">
                      Finansal hedeflere ulaşma, büyüme ve başarı hikayelerinin parçası olma arzusu.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Tasarım Önerisi:</strong> Yükselişi simgeleyen ok işaretleri, 
                        büyüme grafiklerinin daha belirgin kullanımı
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">🤝 Güven ve Güvenlik</h4>
                    <p className="text-purple-700 dark:text-purple-400 mb-3">
                      Finansal verilerinin güvende olduğunu bilme ve doğru kararlar alma güveni.
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Tasarım Önerisi:</strong> Kalkan simgeleri, şifreleme görselleri, 
                        güvenlik sertifikası rozetleri
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'implementation' && (
            <div className="space-y-8">
              {/* Uygulama Aşamaları */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🚀 Aşamalı Uygulama Planı
                </h3>
                
                <div className="space-y-6">
                  {/* Faz 1 */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <h4 className="text-lg font-semibold text-green-800 dark:text-green-300">
                        Faz 1: Animasyon ve Etkileşim (1-2 Hafta)
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">Teknik Geliştirmeler</h5>
                        <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
                          <li>• CSS animasyonları ile logo canlandırma</li>
                          <li>• Hover efektleri ve mikro-etkileşimler</li>
                          <li>• Loading animasyonları</li>
                          <li>• Responsive logo varyasyonları</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 dark:text-green-400 mb-2">Görsel İyileştirmeler</h5>
                        <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
                          <li>• Gradient geçişleri optimizasyonu</li>
                          <li>• Glow efektleri ekleme</li>
                          <li>• Pulse animasyonları</li>
                          <li>• Veri akışı parçacıkları</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Faz 2 */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                        Faz 2: Marka Genişletme (2-3 Hafta)
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Slogan Entegrasyonu</h5>
                        <ul className="text-sm text-blue-600 dark:text-blue-500 space-y-1">
                          <li>• A/B test ile slogan seçimi</li>
                          <li>• Tipografi optimizasyonu</li>
                          <li>• Çoklu dil desteği</li>
                          <li>• Bağlamsal slogan gösterimi</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Platform Adaptasyonu</h5>
                        <ul className="text-sm text-blue-600 dark:text-blue-500 space-y-1">
                          <li>• Sosyal medya profil görselleri</li>
                          <li>• Favicon ve app icon'ları</li>
                          <li>• Email imza şablonları</li>
                          <li>• Presentation template'leri</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Faz 3 */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                        Faz 3: Duygusal Bağ Güçlendirme (3-4 Hafta)
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-purple-700 dark:text-purple-400 mb-2">Kişiselleştirme</h5>
                        <ul className="text-sm text-purple-600 dark:text-purple-500 space-y-1">
                          <li>• Kullanıcı tercihlerine göre logo varyasyonları</li>
                          <li>• Dinamik renk paleti</li>
                          <li>• Kişisel dashboard temaları</li>
                          <li>• Başarı rozetleri ve gamification</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-700 dark:text-purple-400 mb-2">Hikaye Anlatımı</h5>
                        <ul className="text-sm text-purple-600 dark:text-purple-500 space-y-1">
                          <li>• Onboarding sürecinde marka hikayesi</li>
                          <li>• İnteraktif logo keşfi</li>
                          <li>• Değer önerisi animasyonları</li>
                          <li>• Kullanıcı başarı hikayeleri entegrasyonu</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ölçüm ve Optimizasyon */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Ölçüm ve Optimizasyon
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">📈 KPI'lar</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• <strong>Marka Tanınırlığı:</strong> Logo recall testleri</li>
                      <li>• <strong>Kullanıcı Etkileşimi:</strong> Logo hover/click oranları</li>
                      <li>• <strong>Duygusal Bağ:</strong> Net Promoter Score (NPS)</li>
                      <li>• <strong>Dönüşüm Oranları:</strong> Kayıt ve aktivasyon metrikleri</li>
                      <li>• <strong>Sosyal Paylaşım:</strong> Marka mention'ları</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">🔄 Optimizasyon Döngüsü</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>• <strong>Haftalık:</strong> Kullanıcı geri bildirimi toplama</li>
                      <li>• <strong>Aylık:</strong> A/B test sonuçları analizi</li>
                      <li>• <strong>Çeyreklik:</strong> Marka algısı araştırması</li>
                      <li>• <strong>Yıllık:</strong> Kapsamlı marka değerlendirmesi</li>
                      <li>• <strong>Sürekli:</strong> Trend takibi ve adaptasyon</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bütçe ve Kaynak Planlaması */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  💰 Kaynak ve Bütçe Planlaması
                </h3>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Düşük</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-500">
                        Mevcut logo animasyonu ve temel iyileştirmeler
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">Orta</div>
                      <div className="text-sm text-orange-700 dark:text-orange-500">
                        Slogan entegrasyonu ve platform adaptasyonu
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Yüksek</div>
                      <div className="text-sm text-red-700 dark:text-red-500">
                        Tam kişiselleştirme ve hikaye anlatımı sistemi
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">💡 Önerilen Başlangıç</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Faz 1</strong> ile başlayarak hızlı kazanımlar elde edin, 
                      kullanıcı geri bildirimlerine göre <strong>Faz 2</strong> ve <strong>Faz 3</strong>'ü planlayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}