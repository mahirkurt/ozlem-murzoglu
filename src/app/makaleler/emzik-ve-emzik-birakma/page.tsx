import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Emzikler ve Emzik Bırakma',
  description: 'Emzik kullanımının faydaları, potansiyel zararları ve emzik bırakma sürecini yönetme stratejileri',
}

export default function EmzikPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/makaleler" className="hover:text-primary">Makaleler</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">Emzikler ve Emzik Bırakma</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Bebek Bakımı
            </span>
            <span className="text-sm text-gray-500">7 dk okuma süresi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Emzikler ve Emzik Bırakma
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span>Dr. Özlem Murzoğlu</span>
              <span className="mx-2">•</span>
              <span>10 Ocak 2024</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose max-w-none">
          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <p className="text-lg font-medium text-gray-900 mb-0">
              Emzikler, bebeklerin doğal emme içgüdüsünü tatmin eder ve onları sakinleştirmeye yardımcı olur. 
              Ancak uzun süreli kullanımı bazı olumsuz etkilere neden olabilir.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Emzik Kullanımının Faydaları</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-700">Kısa Vadeli Faydalar</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Bebeği sakinleştirir ve rahatlatır</li>
                <li>• Uyumaya yardımcı olur</li>
                <li>• Ağrılı durumlarda (aşı, kan alma) dikkat dağıtır</li>
                <li>• Emme ihtiyacını karşılar</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Sağlık Açısından Faydalar</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 1-6 ay arası SIDS riskini azaltabilir</li>
                <li>• Prematüre bebeklerde emme-yutma koordinasyonunu geliştirir</li>
                <li>• Hastanede yatan bebeklerde stresi azaltır</li>
                <li>• Anne memesinden bağımsız rahatlama sağlar</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Potansiyel Olumsuz Etkiler</h2>

          <div className="space-y-4 mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 pl-6 py-4">
              <h3 className="text-lg font-semibold mb-2">6 Aydan Sonra Orta Kulak Enfeksiyonu Riski</h3>
              <p className="text-gray-700">
                6 aydan sonra emzik kullanımı, orta kulak enfeksiyonu riskini artırabilir. 
                Bu nedenle 6 aydan sonra kullanımın azaltılması önerilir.
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 pl-6 py-4">
              <h3 className="text-lg font-semibold mb-2">Konuşma ve Dil Gelişimi</h3>
              <p className="text-gray-700">
                Uzun süreli emzik kullanımı, çocuğun konuşma pratiği yapmasını engelleyebilir 
                ve dil gelişiminde gecikmelere neden olabilir.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 pl-6 py-4">
              <h3 className="text-lg font-semibold mb-2">Diş ve Çene Problemleri</h3>
              <p className="text-gray-700">
                2 yaşından sonra devam eden emzik kullanımı, dişlerde çapraşıklık, 
                açık kapanış ve çene deformitelerine yol açabilir.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Önerilen Kullanım Süreleri</h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  0-6
                </div>
                <div>
                  <h3 className="font-semibold mb-1">0-6 Ay</h3>
                  <p className="text-gray-700">
                    Güvenle kullanılabilir. SIDS riskini azaltmaya yardımcı olabilir. 
                    Emzirme düzeni oturduktan sonra verilebilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                  6-12
                </div>
                <div>
                  <h3 className="font-semibold mb-1">6-12 Ay</h3>
                  <p className="text-gray-700">
                    Kullanımı azaltmaya başlayın. Gündüz kullanımını sınırlayın, 
                    sadece uyku zamanı ve özel durumlarda kullanın.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  1-2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">1-2 Yaş</h3>
                  <p className="text-gray-700">
                    İdeal bırakma zamanı. Çocuk anlayabilir ve işbirliği yapabilir. 
                    Alternatif rahatlatma yöntemleri öğretilebilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  2+
                </div>
                <div>
                  <h3 className="font-semibold mb-1">2 Yaş ve Üzeri</h3>
                  <p className="text-gray-700">
                    Mutlaka bırakılmalı. Diş ve çene problemleri riski yüksek. 
                    Sosyal ve duygusal gelişim açısından da olumsuz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Emzik Bırakma Stratejileri</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">1. Doğru Zamanı Seçin</h3>
              <p className="text-gray-700 mb-3">
                Stresli dönemlerden kaçının. Kardeş doğumu, eve taşınma, kreşe başlama gibi 
                büyük değişiklikler sırasında bırakmaya çalışmayın.
              </p>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Çocuk sağlıklı ve mutlu olduğu bir dönem seçin</li>
                <li>• Tatil veya uzun hafta sonu gibi zamanınız olduğu dönemler ideal</li>
                <li>• Çocuğun yaşına uygun bir yaklaşım belirleyin</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">2. Kademeli Azaltma</h3>
              <p className="text-gray-700 mb-3">
                Aniden kesmek yerine yavaş yavaş azaltın. Bu hem çocuk hem de ebeveyn için daha kolaydır.
              </p>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Önce gündüz kullanımını sınırlayın</li>
                <li>• Sadece öğle uykusu ve gece için bırakın</li>
                <li>• Son olarak gece kullanımını da kaldırın</li>
                <li>• Her aşamada en az 3-5 gün bekleyin</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">3. Alternatif Rahatlatma Yöntemleri</h3>
              <p className="text-gray-700 mb-3">
                Emzik yerine başka rahatlatma yöntemleri sunun.
              </p>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Yumuşak oyuncak veya battaniye (güvenlik objesi)</li>
                <li>• Ninni söyleme, sallama</li>
                <li>• Hikaye okuma, sakin müzik</li>
                <li>• Sarılma ve sevgi gösterme</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary">4. Pozitif Pekiştirme</h3>
              <p className="text-gray-700 mb-3">
                Emziksiz geçen zamanları ödüllendirin ve övün.
              </p>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• "Büyüdün" vurgusu yapın</li>
                <li>• Başarı tablosu veya çıkartma kullanın</li>
                <li>• Küçük ödüller verin (ekstra hikaye, özel aktivite)</li>
                <li>• Aile büyüklerinden övgü almasını sağlayın</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Yaratıcı Yöntemler</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-700">Emzik Perisi</h3>
              <p className="text-gray-700">
                Emzik perisinin emzikleri bebeklere götürdüğünü anlatın. 
                Karşılığında küçük bir hediye bırakabilirsiniz.
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-pink-700">Veda Töreni</h3>
              <p className="text-gray-700">
                Emzikle vedalaşma töreni düzenleyin. Balon ile uçurun 
                veya özel bir kutuya koyup saklayın.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-700">Kademeli Kesme</h3>
              <p className="text-gray-700">
                Emziğin ucunu günde biraz kesin. Çocuk rahatsız olunca 
                "bozulmuş" diyerek atabilirsiniz.
              </p>
            </div>

            <div className="bg-teal-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-teal-700">Takas Sistemi</h3>
              <p className="text-gray-700">
                Emziği çok istediği bir oyuncak veya aktivite ile takas edin. 
                Seçim hakkı vermek işbirliğini artırır.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Karşılaşılabilecek Zorluklar</h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3">Yaygın Sorunlar ve Çözümleri</h3>
            <div className="space-y-3">
              <div className="border-l-3 border-gray-400 pl-4">
                <p className="font-medium">Uyku Problemleri</p>
                <p className="text-sm text-gray-700">
                  İlk birkaç gece zor olabilir. Tutarlı olun ve alternatif rahatlatma yöntemlerini deneyin.
                </p>
              </div>
              <div className="border-l-3 border-gray-400 pl-4">
                <p className="font-medium">Huzursuzluk ve Ağlama</p>
                <p className="text-sm text-gray-700">
                  Normal bir tepkidir. Sakin kalın, sevgi gösterin ama kararlı olun.
                </p>
              </div>
              <div className="border-l-3 border-gray-400 pl-4">
                <p className="font-medium">Parmak Emme</p>
                <p className="text-sm text-gray-700">
                  Bazı çocuklar emzik yerine parmak emmeye başlayabilir. Bu da ayrıca ele alınmalıdır.
                </p>
              </div>
              <div className="border-l-3 border-gray-400 pl-4">
                <p className="font-medium">Geri Dönüş İsteği</p>
                <p className="text-sm text-gray-700">
                  Kararlı olun. Bir kez bıraktıktan sonra geri vermeyin.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Önemli Hatırlatmalar</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Her çocuk farklıdır, sabırlı olun</li>
              <li>✓ Tutarlılık başarının anahtarıdır</li>
              <li>✓ Ceza veya alay etme kullanmayın</li>
              <li>✓ Çocuğun duygularını kabul edin</li>
              <li>✓ Gerekirse profesyonel destek alın</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 italic">
              Emzik bırakma süreci hem çocuk hem de ebeveyn için zorlu olabilir. 
              Sabır, tutarlılık ve sevgi ile bu süreci başarıyla atlatabilirsiniz. 
              Zorlandığınız durumlarda çocuk doktorunuzdan destek alabilirsiniz.
            </p>
          </div>
        </article>

        {/* Author Box */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">DÖM</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Dr. Özlem Murzoğlu</h3>
              <p className="text-gray-600 text-sm mb-2">Çocuk Sağlığı ve Hastalıkları Uzmanı</p>
              <p className="text-gray-700 text-sm">
                Sosyal Pediatri Doktoru ve Çocuk Gelişimci. Bebek ve çocuk gelişiminde 
                ailelere kanıta dayalı, güncel bilgilerle destek oluyorum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}