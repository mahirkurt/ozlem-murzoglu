import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Saygıyla Andıklarımız',
  description: 'Tıp tarihine yön veren, insanlığa hizmet eden değerli bilim insanları',
}

const tributes = [
  {
    slug: 'dr-jonas-salk',
    name: 'Dr. Jonas Salk',
    title: 'Çocuk Felci Aşısının Mucidi',
    years: '1914 - 1995',
    image: '/images/tributes/jonas-salk.jpg',
    excerpt: 'Polio aşısını geliştirerek milyonlarca çocuğun hayatını kurtaran, aşıyı patentlemeyi reddederek insanlığa armağan eden büyük bilim insanı.',
    achievements: ['Polio Aşısı', 'Salk Enstitüsü', 'Başkanlık Özgürlük Madalyası'],
  },
  {
    slug: 'louis-pasteur',
    name: 'Louis Pasteur',
    title: 'Modern Mikrobiyolojinin Babası',
    years: '1822 - 1895',
    image: '/images/tributes/louis-pasteur.jpg',
    excerpt: 'Pastörizasyon yöntemini geliştiren, kuduz aşısını bulan ve mikrop teorisini kanıtlayarak modern tıbbın temellerini atan öncü bilim insanı.',
    achievements: ['Pastörizasyon', 'Kuduz Aşısı', 'Mikrop Teorisi'],
  },
  {
    slug: 'dr-waldo-nelson',
    name: 'Dr. Waldo Nelson',
    title: 'Pediatrinin Babası',
    years: '1898 - 1997',
    image: '/images/tributes/waldo-nelson.jpg',
    excerpt: 'Modern pediatrinin kurucularından, Nelson Textbook of Pediatrics kitabının yazarı ve sayısız pediatristin öğretmeni.',
    achievements: ['Nelson Pediatri Kitabı', 'Temple Üniversitesi', 'Pediatri Eğitimi'],
  },
  {
    slug: 'florence-nightingale',
    name: 'Florence Nightingale',
    title: 'Modern Hemşireliğin Kurucusu',
    years: '1820 - 1910',
    image: '/images/tributes/florence-nightingale.jpg',
    excerpt: 'Hemşirelik mesleğini profesyonelleştiren, hastane hijyeni ve hasta bakımı standartlarını oluşturan öncü sağlık çalışanı.',
    achievements: ['Hemşirelik Eğitimi', 'Hastane Reformu', 'Sağlık İstatistikleri'],
  },
  {
    slug: 'dr-virginia-apgar',
    name: 'Dr. Virginia Apgar',
    title: 'APGAR Skorunun Yaratıcısı',
    years: '1909 - 1974',
    image: '/images/tributes/virginia-apgar.jpg',
    excerpt: 'Yenidoğan değerlendirmesinde devrim yaratan APGAR skorunu geliştirerek bebek ölüm oranlarının azalmasına katkıda bulunan anestezi uzmanı.',
    achievements: ['APGAR Skoru', 'Perinatal Tıp', 'Anesteziyoloji'],
  },
]

export default function SaygiylePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Saygıyla Andıklarımız
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tıp tarihine yön veren, insanlığın sağlığı için ömürlerini adayan, 
            bugün hala eserlerinden ve öğretilerinden faydalandığımız değerli bilim insanları.
          </p>
        </div>

        {/* Quote */}
        <div className="bg-primary/5 rounded-2xl p-8 mb-12 text-center">
          <blockquote className="text-lg italic text-gray-700">
            "Bilim, insanlığın ortak mirasıdır. Bir bilim insanının keşfi, tüm insanlığa aittir."
          </blockquote>
          <cite className="text-sm text-gray-600 mt-2 block">- Marie Curie</cite>
        </div>

        {/* Tributes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tributes.map((person) => (
            <Link
              key={person.slug}
              href={`/saygiyla/${person.slug}`}
              className="group"
            >
              <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image Placeholder */}
                <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/80 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-white font-medium">{person.years}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-primary transition-colors">
                    {person.name}
                  </h2>
                  <p className="text-sm text-primary mb-3">{person.title}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {person.excerpt}
                  </p>

                  {/* Achievements */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {person.achievements.slice(0, 2).map((achievement, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {achievement}
                      </span>
                    ))}
                    {person.achievements.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{person.achievements.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>Hikayesini Oku</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Additional Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4 text-primary text-center">
            Neden Hatırlıyoruz?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Bilimsel Miras</h3>
              <p className="text-sm text-gray-600">
                Bıraktıkları bilimsel miras, bugün hala tıp eğitiminin ve pratiğinin temelini oluşturuyor.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">İnsanlık Sevgisi</h3>
              <p className="text-sm text-gray-600">
                Kendi çıkarlarını değil, insanlığın faydasını düşünerek hareket ettiler.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">İlham Kaynağı</h3>
              <p className="text-sm text-gray-600">
                Yeni nesil sağlık çalışanlarına ilham vererek, daha iyi bir gelecek inşa etmemizi sağlıyorlar.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Bu büyük insanların hayatları ve başarıları hakkında daha fazla bilgi edinmek için 
            bireysel sayfalarını ziyaret edebilirsiniz.
          </p>
          <Link
            href="/makaleler"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Makalelerimize Göz Atın
          </Link>
        </div>
      </div>
    </div>
  )
}