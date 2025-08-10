import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Louis Pasteur - Saygıyla Andıklarımız',
  description: 'Modern mikrobiyolojinin babası, pastörizasyon yönteminin mucidi Louis Pasteur\'ün hayatı ve başarıları',
}

export default function LouisPasteurPage() {
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
              <Link href="/saygiyla" className="hover:text-primary">Saygıyla Andıklarımız</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">Louis Pasteur</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            {/* Portrait Placeholder */}
            <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">LP</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">
              Louis Pasteur
            </h1>
            <p className="text-xl text-primary mb-2">1822 - 1895</p>
            <p className="text-lg text-gray-600">Modern Mikrobiyolojinin Babası</p>
          </div>

          {/* Famous Quote */}
          <div className="bg-primary/5 rounded-xl p-6 text-center">
            <blockquote className="text-lg italic text-gray-700">
              "Şans, hazırlıklı zihinleri tercih eder."
            </blockquote>
            <cite className="text-sm text-gray-600 mt-2 block">
              - Louis Pasteur
            </cite>
          </div>
        </header>

        {/* Content */}
        <article className="prose max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Yaşam Öyküsü</h2>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Mütevazı Başlangıçlar</h3>
              <p className="text-gray-700 mb-3">
                Louis Pasteur, 27 Aralık 1822'de Fransa'nın Dole kentinde dünyaya geldi. Babası deri tabakçısı 
                olan Pasteur, nispeten fakir bir aileden geliyordu. Ancak ailesi, oğullarının eğitimine büyük 
                önem verdi.
              </p>
              <p className="text-gray-700">
                Çocukluğunda ortalama bir öğrenci olan Pasteur, resim yapmayı severdi. Ancak fen bilimlerine 
                olan ilgisi zamanla arttı ve 1847'de École Normale Supérieure'den fizik ve kimya alanında 
                doktora derecesi aldı.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Akademik Kariyer</h3>
              <p className="text-gray-700 mb-3">
                Doktorasını tamamladıktan sonra, Strasbourg Üniversitesi'nde kimya profesörü olarak çalışmaya 
                başladı. 1849'da üniversite rektörünün kızı Marie Laurent ile evlendi.
              </p>
              <p className="text-gray-700">
                Evliliklerinden beş çocukları oldu, ancak sadece ikisi yetişkinliğe ulaşabildi. Çocuklarının 
                hastalıklardan kaybı, Pasteur'ü mikroplar ve hastalıklar üzerine araştırma yapmaya yöneltti.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Bilimsel Keşifler</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Moleküler Asimetri</h3>
              <p className="text-gray-700 mb-3">
                Pasteur'ün ilk önemli keşfi, tartarik asit kristallerinde moleküler asimetriyi bulmasıydı. 
                Bu keşif, stereokimya alanının temellerini attı.
              </p>
              <p className="text-gray-700">
                26 yaşındayken yaptığı bu keşif, onun bilim dünyasında tanınmasını sağladı ve gelecekteki 
                çalışmaları için zemin hazırladı.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Fermantasyon ve Mikroplar</h3>
              <p className="text-gray-700 mb-3">
                1857'de fermantasyonun mikroorganizmalar tarafından gerçekleştirildiğini kanıtladı. Bu keşif, 
                bira ve şarap endüstrisinde devrim yarattı.
              </p>
              <p className="text-gray-700">
                Ayrıca, kendiliğinden oluşum (spontane jenerasyon) teorisini çürüttü. Ünlü kuğu boyunlu 
                şişe deneyleriyle, mikropların havadan geldiğini ve kendiliğinden oluşmadığını gösterdi.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Pastörizasyon</h3>
              <p className="text-gray-700 mb-3">
                1864'te geliştirdiği pastörizasyon yöntemi, gıdaların bozulmasını önleyen devrim niteliğinde 
                bir tekniktir. İlk olarak şarap ve bira için geliştirilen bu yöntem, daha sonra süt ve diğer 
                gıdalara uygulandı.
              </p>
              <p className="text-gray-700">
                Pastörizasyon, gıdayı belirli bir sıcaklıkta kısa süre ısıtarak zararlı mikroorganizmaları 
                öldürür, ancak gıdanın besin değerini korur.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Hastalıklarla Mücadele</h2>
            
            <div className="space-y-6">
              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="text-xl font-semibold mb-2">İpek Böceği Hastalıkları</h3>
                <p className="text-gray-700">
                  1865'te Fransa'nın ipek endüstrisini tehdit eden ipek böceği hastalıklarını araştırdı. 
                  Hastalıkların mikroplardan kaynaklandığını buldu ve çözüm yöntemleri geliştirerek 
                  Fransız ipek endüstrisini kurtardı.
                </p>
              </div>

              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="text-xl font-semibold mb-2">Tavuk Kolerası Aşısı</h3>
                <p className="text-gray-700">
                  1879'da tavuk kolerası üzerinde çalışırken, zayıflatılmış mikropların bağışıklık 
                  sağladığını keşfetti. Bu, modern aşı biliminin temelini oluşturdu.
                </p>
              </div>

              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="text-xl font-semibold mb-2">Şarbon Aşısı</h3>
                <p className="text-gray-700">
                  1881'de şarbon hastalığına karşı aşı geliştirdi. Pouilly-le-Fort'da yapılan dramatik 
                  halka açık deneyinde, aşılanan hayvanların hayatta kaldığını göstererek büyük başarı kazandı.
                </p>
              </div>

              <div className="bg-white border-l-4 border-primary pl-6 py-4">
                <h3 className="text-xl font-semibold mb-2">Kuduz Aşısı</h3>
                <p className="text-gray-700">
                  1885'te kuduz aşısını geliştirdi. İlk kez 9 yaşındaki Joseph Meister'a uyguladığı 
                  aşı başarılı oldu. Bu, Pasteur'ün en ünlü başarılarından biri oldu.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Pasteur Enstitüsü</h2>
            
            <div className="bg-primary/5 rounded-xl p-6">
              <p className="text-gray-700 mb-3">
                1888'de Paris'te Pasteur Enstitüsü'nü kurdu. Bu enstitü, kuduz araştırmaları ve aşı üretimi 
                için kurulmuş olsa da, zamanla dünyanın en önemli mikrobiyoloji araştırma merkezlerinden 
                biri haline geldi.
              </p>
              <p className="text-gray-700">
                Günümüzde hala faaliyette olan Pasteur Enstitüsü, 10 Nobel Ödülü sahibi bilim insanı 
                yetiştirmiş ve HIV, Ebola, Zika gibi hastalıkların araştırılmasında öncü rol oynamıştır.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Mirası ve Etkisi</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">Bilimsel Miras</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Mikrop teorisinin kurucusu</li>
                  <li>• Modern aşı biliminin öncüsü</li>
                  <li>• Stereokimyanın babası</li>
                  <li>• Gıda güvenliğinin koruyucusu</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary">Toplumsal Etki</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Milyonlarca hayat kurtardı</li>
                  <li>• Gıda endüstrisini dönüştürdü</li>
                  <li>• Hastane hijyenini geliştirdi</li>
                  <li>• Veteriner tıbbını ilerletti</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Son Yılları</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700 mb-3">
                1868'de geçirdiği felç sonucu sol tarafı kısmen felç olan Pasteur, araştırmalarına devam etti. 
                1887'de ikinci bir felç geçirmesine rağmen, çalışmalarını sürdürdü.
              </p>
              <p className="text-gray-700 mb-3">
                28 Eylül 1895'te Saint-Cloud, Fransa'da hayatını kaybetti. Cenazesi ulusal tören ile 
                kaldırıldı ve Pasteur Enstitüsü'nün altındaki özel bir mezara defnedildi.
              </p>
              <p className="text-gray-700">
                Ölümünden önce şu sözleri söylemiştir: "Çalışın, çalışın, çalışın. İnsanlığa hizmet etmenin 
                en büyük mutluluğu budur."
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Günümüze Yansımaları</h2>
            
            <div className="bg-blue-50 rounded-xl p-8">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Pastörizasyon günümüzde hala gıda güvenliğinin temel taşıdır</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Aşı geliştirme prensipleri modern aşı biliminin temelini oluşturur</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Pasteur Enstitüleri dünya çapında hastalıklarla mücadeleye devam ediyor</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mikrop teorisi, modern tıbbın ve hijyenin temelini oluşturuyor</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 italic">
              Louis Pasteur, bilimin pratik uygulamalarla birleştirilmesinin en güzel örneklerinden birini 
              sunmuştur. Onun "Bilim hiçbir vatana ait değildir, çünkü bilgi insanlığa aittir" sözü, 
              bilimin evrensel değerini vurgular.
            </p>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/saygiyla/dr-jonas-salk"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dr. Jonas Salk
          </Link>
          <Link
            href="/saygiyla"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Tüm Anmalar
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}