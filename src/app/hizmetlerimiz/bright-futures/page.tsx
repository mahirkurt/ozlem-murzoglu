import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bright Futures - Sağlıklı Çocuk İzlemi',
  description: 'Amerikan Pediatri Akademisi\'nin Bright Futures programı ile kapsamlı çocuk sağlığı takibi',
}

export default function BrightFuturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
          Bright Futures® Sağlıklı Çocuk İzlemi Programı
        </h1>
        
        <div className="prose max-w-none">
          <section className="mb-12">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Bright Futures, Amerikan Pediatri Akademisi (AAP) tarafından geliştirilen, 
              doğumdan ergenlik döneminin sonuna kadar çocukların sağlık bakımı için 
              kanıta dayalı rehberlik sağlayan kapsamlı bir programdır.
            </p>
            
            <div className="bg-primary/5 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">Program Nedir?</h2>
              <p className="text-gray-700 mb-4">
                Bright Futures, çocukların ve gençlerin fiziksel, duygusal, sosyal ve 
                bilişsel gelişimlerini desteklemek için tasarlanmış, önleyici sağlık 
                hizmetlerine odaklanan bir yaklaşımdır. Program, her yaş dönemine özel 
                değerlendirme ve öneriler sunar.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Programın Özellikleri</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-primary">Kapsamlı Değerlendirme</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Büyüme ve gelişim takibi</li>
                  <li>• Fiziksel muayene</li>
                  <li>• Gelişimsel tarama testleri</li>
                  <li>• Davranışsal değerlendirme</li>
                  <li>• Beslenme değerlendirmesi</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-primary">Yaşa Özel Rehberlik</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Güvenlik önerileri</li>
                  <li>• Beslenme rehberliği</li>
                  <li>• Uyku düzeni önerileri</li>
                  <li>• Aktivite ve egzersiz</li>
                  <li>• Ekran süresi yönetimi</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Ziyaret Süreci</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Ziyaret Öncesi Hazırlık</h3>
                  <p className="text-gray-700">
                    Randevunuzdan önce size gönderilen yaşa özel formları doldurmanız istenir. 
                    Bu formlar, çocuğunuzun gelişimi, davranışları ve sağlık durumu hakkında 
                    önemli bilgiler toplar.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Kapsamlı Muayene (En Az 1 Saat)</h3>
                  <p className="text-gray-700">
                    Çocuğunuzun tüm gelişimsel alanları detaylıca değerlendirilir. 
                    Fiziksel muayenenin yanı sıra, duygusal ve sosyal gelişim, 
                    dil gelişimi ve motor beceriler de incelenir.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Ziyaret Sonrası Takip</h3>
                  <p className="text-gray-700">
                    Muayene sonrasında size özel hazırlanan bilgilendirme föyleri verilir. 
                    Bu föyler, çocuğunuzun mevcut durumu ve gelecek dönem için öneriler içerir.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Yaş Gruplarına Göre Ziyaretler</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-primary">0-12 Ay</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Yenidoğan (3-5 gün)</li>
                    <li>• 1 aylık</li>
                    <li>• 2 aylık</li>
                    <li>• 4 aylık</li>
                    <li>• 6 aylık</li>
                    <li>• 9 aylık</li>
                    <li>• 12 aylık</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-primary">1-4 Yaş</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 15 aylık</li>
                    <li>• 18 aylık</li>
                    <li>• 24 aylık</li>
                    <li>• 30 aylık</li>
                    <li>• 3 yaş</li>
                    <li>• 4 yaş</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-primary">5-21 Yaş</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 5-6 yaş</li>
                    <li>• 7-8 yaş</li>
                    <li>• 9-10 yaş</li>
                    <li>• 11-14 yaş</li>
                    <li>• 15-17 yaş</li>
                    <li>• 18-21 yaş</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Programın Faydaları</h2>
            
            <div className="space-y-4">
              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="font-semibold mb-2">Erken Tanı ve Müdahale</h3>
                <p className="text-gray-700">
                  Gelişimsel gecikmelerin ve sağlık sorunlarının erken dönemde tespit edilmesi, 
                  daha etkili tedavi ve müdahale imkanı sağlar.
                </p>
              </div>
              
              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="font-semibold mb-2">Bütüncül Yaklaşım</h3>
                <p className="text-gray-700">
                  Sadece hastalıklara odaklanmak yerine, çocuğun tüm gelişim alanlarını 
                  kapsayan bir değerlendirme yapılır.
                </p>
              </div>
              
              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="font-semibold mb-2">Ebeveyn Eğitimi</h3>
                <p className="text-gray-700">
                  Aileler, çocuklarının gelişimini desteklemek için ihtiyaç duydukları 
                  bilgi ve becerileri kazanır.
                </p>
              </div>
              
              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="font-semibold mb-2">Önleyici Sağlık Hizmeti</h3>
                <p className="text-gray-700">
                  Hastalıklar oluşmadan önce risk faktörlerinin belirlenmesi ve 
                  önleyici tedbirlerin alınması sağlanır.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">Neden Bright Futures?</h2>
              <p className="text-gray-700 mb-4">
                Bright Futures programı, dünya çapında kabul görmüş, kanıta dayalı bir yaklaşımdır. 
                Bu program sayesinde çocuğunuzun sağlık ve gelişim sürecinin her aşamasında, 
                en güncel ve güvenilir bilgilere dayalı bakım almasını sağlıyoruz.
              </p>
              <p className="text-gray-700">
                Kliniğimizde bu programı tam olarak uygulayarak, çocuğunuzun potansiyelini 
                en üst düzeye çıkarmasına yardımcı oluyoruz.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}