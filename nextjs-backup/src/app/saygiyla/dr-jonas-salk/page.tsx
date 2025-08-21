import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dr. Jonas Salk - Saygıyla Andıklarımız',
  description: 'Çocuk felci aşısını geliştirerek milyonlarca hayat kurtaran Dr. Jonas Salk\'ın hayatı ve başarıları',
}

export default function DrJonasSalkPage() {
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
            <li className="text-gray-900">Dr. Jonas Salk</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="text-center mb-8">
            {/* Portrait Placeholder */}
            <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">JS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">
              Dr. Jonas Edward Salk
            </h1>
            <p className="text-xl text-primary mb-2">1914 - 1995</p>
            <p className="text-lg text-gray-600">Çocuk Felci Aşısının Mucidi</p>
          </div>

          {/* Famous Quote */}
          <div className="bg-primary/5 rounded-xl p-6 text-center">
            <blockquote className="text-lg italic text-gray-700">
              "Bu aşı halk içindir. Güneşi patentleyebilir misiniz?"
            </blockquote>
            <cite className="text-sm text-gray-600 mt-2 block">
              - Jonas Salk, aşıyı neden patentlemediği sorulduğunda
            </cite>
          </div>
        </header>

        {/* Content */}
        <article className="prose max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Yaşam Öyküsü</h2>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Erken Yaşam ve Eğitim</h3>
              <p className="text-gray-700 mb-3">
                Jonas Edward Salk, 28 Ekim 1914'te New York'ta Rus-Yahudi göçmeni bir ailenin çocuğu olarak dünyaya geldi. 
                Ailesinin maddi durumu iyi olmamasına rağmen, eğitime verdikleri önem sayesinde parlak bir akademik kariyer yaptı.
              </p>
              <p className="text-gray-700">
                New York Üniversitesi Tıp Fakültesi'nde tıp ve biyoloji eğitimi aldı. Mezuniyetinin ardından Michigan 
                Üniversitesi'nde ve Pittsburgh Üniversitesi Virüs Araştırma Laboratuvarı'nda çalıştı. 1947'de profesör 
                oldu ve Virüs Araştırma Merkezi'nin başına getirildi.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Polio ile Mücadele</h3>
              <p className="text-gray-700 mb-3">
                1952 yılında Amerika Birleşik Devletleri'nde şiddetli bir çocuk felci (polio) salgını yaşanıyordu. 
                Bu salgın sırasında 58.000 vaka bildirilmiş, 3.145 kişi hayatını kaybetmiş ve 21.269 kişi felç kalmıştı.
              </p>
              <p className="text-gray-700">
                Salk, öldürülmüş virüs kullanarak bir aşı geliştirme fikrini ortaya attı. Bu yaklaşım, o dönemde 
                canlı zayıflatılmış virüs kullanan geleneksel yöntemin aksine, daha güvenli bir alternatif sunuyordu.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Büyük Buluş: Polio Aşısı</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Cesur Deneme</h3>
              <p className="text-gray-700 mb-3">
                1952'de Salk, geliştirdiği aşıyı önce kendisi üzerinde denedi. Ardından eşi ve üç çocuğu üzerinde 
                test etti. Bu cesur hamle, basının önünde gerçekleştirildi ve büyük yankı uyandırdı.
              </p>
              <p className="text-gray-700">
                Aşının güvenli olduğunu kanıtladıktan sonra, daha geniş çaplı klinik denemeler başladı.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Tarihi Başarı</h3>
              <p className="text-gray-700 mb-3">
                1954-1955 yıllarında yapılan kapsamlı klinik denemeler, aşının etkili olduğunu kanıtladı. 
                12 Nisan 1955'te aşının güvenli ve etkili olduğu resmen açıklandı.
              </p>
              <p className="text-gray-700">
                1957 yılına gelindiğinde, Amerika'daki polio vakaları %80-90 oranında azalmıştı. Bu, modern 
                tıp tarihinin en büyük zaferlerinden biri olarak kabul edilir.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">İnsani Yaklaşım</h2>
            
            <div className="bg-primary/5 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Patent Reddi</h3>
              <p className="text-gray-700 mb-3">
                Salk'ın en unutulmaz kararlarından biri, polio aşısını patentlemeyi reddetmesiydi. Bu kararla 
                yaklaşık 7 milyar dolarlık bir gelirden feragat etti.
              </p>
              <p className="text-gray-700">
                Televizyonda Edward R. Murrow'un "Aşının patenti kime ait?" sorusuna verdiği cevap tarihe geçti: 
                "Halka ait diyebilirim. Patent yok. Güneşi patentleyebilir misiniz?"
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Sonraki Yıllar ve Miras</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Salk Enstitüsü</h3>
                <p className="text-gray-700 text-sm">
                  1963'te California'da Salk Biyolojik Araştırmalar Enstitüsü'nü kurdu. 
                  Bu enstitü bugün hala dünyanın önde gelen araştırma merkezlerinden biridir.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">AIDS Araştırmaları</h3>
                <p className="text-gray-700 text-sm">
                  Yaşamının son yıllarında AIDS aşısı üzerinde çalıştı. 
                  Her ne kadar başarıya ulaşamasa da, bu alandaki öncü çalışmaları önemliydi.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Yazarlık</h3>
                <p className="text-gray-700 text-sm">
                  1970'lerde bilim ve felsefe üzerine kitaplar yazdı. 
                  "Man Unfolding" ve "The Survival of the Wisest" başlıca eserleridir.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Onurlar</h3>
                <p className="text-gray-700 text-sm">
                  1977'de Başkanlık Özgürlük Madalyası aldı. 
                  Sayısız ödül ve onur derecesine layık görüldü.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Vefatı</h3>
              <p className="text-gray-700">
                Dr. Jonas Salk, 23 Haziran 1995'te San Diego, California'da kalp yetmezliğinden vefat etti. 
                80 yaşında hayata veda eden Salk, arkasında milyonlarca hayat kurtaran bir miras bıraktı.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Kalıcı Etkisi</h2>
            
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4">Günümüze Yansımaları</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Polio, gelişmiş ülkelerde neredeyse tamamen ortadan kalktı</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dünya Sağlık Örgütü'nün polio eradikasyon programının temelini oluşturdu</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>İnsani yaklaşımı, bilim etiği tartışmalarında örnek gösterilmeye devam ediyor</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Salk Enstitüsü, kanser, Alzheimer, diyabet gibi hastalıklar üzerinde çalışmaya devam ediyor</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 italic">
              Dr. Jonas Salk, sadece bir bilim insanı değil, aynı zamanda insanlığın iyiliği için çalışan 
              bir hümanistti. Onun mirası, bilimin toplum yararına kullanılması gerektiğini hatırlatmaya 
              devam ediyor.
            </p>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/saygiyla"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm Anmalar
          </Link>
          <Link
            href="/saygiyla/louis-pasteur"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            Louis Pasteur
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}