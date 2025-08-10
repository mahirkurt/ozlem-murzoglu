import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Makaleler',
  description: 'Çocuk sağlığı ve gelişimi hakkında uzman makaleler',
}

const articles = [
  {
    slug: 'guvenli-uyku',
    title: 'Güvenli Uyku ve Ani Bebek Ölümünden Korunma',
    excerpt: 'Bebeğinizin güvenli uyuması için alınması gereken önlemler ve SIDS riskini azaltma yöntemleri hakkında detaylı bilgiler.',
    category: 'Bebek Sağlığı',
    readTime: '5 dk',
    date: '2024-01-15',
  },
  {
    slug: 'emzik-ve-emzik-birakma',
    title: 'Emzikler ve Emzik Bırakma',
    excerpt: 'Emzik kullanımının faydaları, potansiyel zararları ve emzik bırakma sürecini yönetme stratejileri.',
    category: 'Bebek Bakımı',
    readTime: '7 dk',
    date: '2024-01-10',
  },
  {
    slug: 'dis-cikarma',
    title: 'Diş Çıkarma Süreci',
    excerpt: 'Bebeklerde diş çıkarma belirtileri, bu dönemde yaşanan zorluklar ve ebeveynlere öneriler.',
    category: 'Bebek Gelişimi',
    readTime: '6 dk',
    date: '2024-01-05',
  },
  {
    slug: 'tuvalet-egitimi',
    title: 'Tuvalet Eğitimi Rehberi',
    excerpt: 'Çocuğunuzun tuvalet eğitimine hazır olduğunu gösteren işaretler ve başarılı bir tuvalet eğitimi için ipuçları.',
    category: 'Çocuk Gelişimi',
    readTime: '8 dk',
    date: '2023-12-20',
  },
  {
    slug: 'kardes-kiskanciligi',
    title: 'Kardeş Kıskançlığı ile Başa Çıkma',
    excerpt: 'Yeni kardeş geldiğinde büyük çocukta görülen kıskançlık davranışları ve bunlarla başa çıkma yöntemleri.',
    category: 'Aile Dinamikleri',
    readTime: '6 dk',
    date: '2023-12-15',
  },
  {
    slug: 'akran-zorbaliği',
    title: 'Akran Zorbalığı ve Korunma Yolları',
    excerpt: 'Çocuklarda zorbalık davranışlarını tanıma, önleme ve zorbalığa maruz kalan çocuklara destek olma.',
    category: 'Sosyal Gelişim',
    readTime: '10 dk',
    date: '2023-12-10',
  },
]

const categories = [
  'Tümü',
  'Bebek Sağlığı',
  'Bebek Bakımı',
  'Bebek Gelişimi',
  'Çocuk Gelişimi',
  'Aile Dinamikleri',
  'Sosyal Gelişim',
]

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Makaleler
          </h1>
          <p className="text-xl text-gray-600">
            Çocuk sağlığı ve gelişimi hakkında uzman görüşleri ve güncel bilgiler
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'Tümü'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/makaleler/${article.slug}`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 text-gray-900 hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-primary font-medium text-sm flex items-center gap-1">
                      Devamını Oku
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Bilgilendirme Bültenimize Katılın
            </h2>
            <p className="text-gray-600 mb-6">
              Çocuk sağlığı ve gelişimi hakkında en güncel bilgileri ve makaleleri doğrudan e-posta adresinize alın.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}