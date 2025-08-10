import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Güvenli Uyku ve Ani Bebek Ölümünden Korunma',
  description: 'SIDS riskini azaltma ve bebeğinizin güvenli uyuması için alınması gereken önlemler',
}

export default function GuvenliUykuPage() {
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
            <li className="text-gray-900">Güvenli Uyku</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Bebek Sağlığı
            </span>
            <span className="text-sm text-gray-500">5 dk okuma süresi</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Güvenli Uyku ve Ani Bebek Ölümünden Korunma
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span>Dr. Özlem Murzoğlu</span>
              <span className="mx-2">•</span>
              <span>15 Ocak 2024</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose max-w-none">
          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <p className="text-lg font-medium text-gray-900 mb-0">
              Ani Bebek Ölüm Sendromu (SIDS), yaşamın ilk yılında 5000 bebekten 1'inde görülür. 
              Doğru önlemlerle bu risk önemli ölçüde azaltılabilir.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Güvenli Uyku İçin Kritik Öneriler</h2>

          <div className="space-y-6 mb-8">
            <div className="bg-white border-l-4 border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold mb-2">1. Her Zaman Sırtüstü Yatırın</h3>
              <p className="text-gray-700">
                Bebeğinizi uyurken mutlaka sırtüstü yatırın. Bu tek başına SIDS riskini %50 oranında azaltır. 
                Yan veya yüzüstü pozisyonlar güvenli değildir ve solunum yollarının tıkanmasına neden olabilir.
              </p>
            </div>

            <div className="bg-white border-l-4 border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold mb-2">2. Asla Aynı Yatakta Uyumayın</h3>
              <p className="text-gray-700">
                Bebeğiniz mutlaka kendi yatağında uyumalıdır. İlk 6 ay aynı odada ancak ayrı yataklarda 
                uyumanız önerilir. Bu hem güvenliği sağlar hem de emzirme için pratiktir.
              </p>
            </div>

            <div className="bg-white border-l-4 border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold mb-2">3. Güvenli Beşik Standartları</h3>
              <ul className="space-y-2 text-gray-700 mt-3">
                <li>• Sert ve düz bir yatak kullanın</li>
                <li>• Yastık, battaniye veya yumuşak oyuncak koymayın</li>
                <li>• Battaniye yerine uyku tulumu tercih edin</li>
                <li>• Beşik parmaklıkları arası maksimum 6 cm olmalı</li>
                <li>• Yatak ile beşik kenarı arasında boşluk olmamalı</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Ek Güvenlik Önlemleri</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-primary">Ortam Koşulları</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Oda sıcaklığı 20-24°C arasında olmalı</li>
                <li>• Aşırı giydirmekten kaçının</li>
                <li>• Odada hava sirkülasyonu sağlayın</li>
                <li>• Sigara dumanından uzak tutun</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-primary">Koruyucu Faktörler</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• İlk 6 ay sadece anne sütü verin</li>
                <li>• Emzik kullanımı riski azaltabilir</li>
                <li>• Aşıları zamanında yaptırın</li>
                <li>• Düzenli doktor kontrollerini aksatmayın</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Karın Üstü Zaman (Tummy Time)</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <p className="text-gray-700">
              Bebeğiniz uyanıkken ve gözetim altındayken günde birkaç kez karın üstü zaman geçirmesi 
              önemlidir. Bu, boyun kaslarını güçlendirir, düz kafa sendromunun önlenmesine yardımcı olur 
              ve motor gelişimi destekler. Ancak bu aktivite mutlaka uyanıkken ve yetişkin gözetiminde 
              yapılmalıdır.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Tehlike İşaretleri</h2>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3 text-red-700">Hemen Doktora Başvurun:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Bebek uyurken nefes almada zorluk yaşıyorsa</li>
              <li>• Ciltte morarma veya soluklaşma varsa</li>
              <li>• Uyandırmakta zorluk çekiyorsanız</li>
              <li>• Anormal sesler çıkarıyorsa</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-primary">Yaş Dönemlerine Göre Öneriler</h2>

          <div className="space-y-4 mb-8">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-primary">0-3 Ay</h3>
              <p className="text-gray-700">
                En riskli dönem. Mutlaka sırtüstü yatırın, oda paylaşımı yapın ancak yatak paylaşmayın. 
                Emzik kullanımı bu dönemde koruyucu olabilir.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-primary">3-6 Ay</h3>
              <p className="text-gray-700">
                Bebek dönmeye başlasa bile yine sırtüstü yatırın. Kendisi dönerse müdahale etmeyin. 
                Beşikte yumuşak cisim bulundurmamaya devam edin.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold mb-2 text-primary">6-12 Ay</h3>
              <p className="text-gray-700">
                Risk azalmaya başlar ancak önlemler devam etmeli. Bebek artık pozisyonunu değiştirebilir. 
                Güvenli uyku ortamını koruyun.
              </p>
            </div>
          </div>

          <div className="bg-primary/10 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Özet ve Hatırlatmalar</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">✓ Yapılması Gerekenler</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Sırtüstü yatırın</li>
                  <li>• Sert yatak kullanın</li>
                  <li>• Aynı odada ayrı yatakta uyuyun</li>
                  <li>• Anne sütü verin</li>
                  <li>• Emzik kullanın</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✗ Kaçınılması Gerekenler</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Yan veya yüzüstü yatırmak</li>
                  <li>• Yumuşak yatak ve cisimler</li>
                  <li>• Aynı yatakta uyumak</li>
                  <li>• Sigara dumanı</li>
                  <li>• Aşırı ısıtma</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 italic">
              Bu öneriler Amerikan Pediatri Akademisi ve Dünya Sağlık Örgütü rehberlerine dayanmaktadır. 
              Bebeğinizin özel durumu için mutlaka doktorunuza danışın.
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
                Sosyal Pediatri Doktoru ve Çocuk Gelişimci. Kanıta dayalı tıp yaklaşımıyla 
                çocukların sağlıklı büyüme ve gelişim sürecini destekliyorum.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">İlgili Makaleler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/makaleler/emzik-ve-emzik-birakma" className="block group">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Emzikler ve Emzik Bırakma
                </h3>
                <p className="text-gray-600 text-sm">
                  Emzik kullanımının faydaları ve zararları hakkında bilmeniz gerekenler.
                </p>
              </div>
            </Link>
            <Link href="/makaleler/dis-cikarma" className="block group">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  Diş Çıkarma Süreci
                </h3>
                <p className="text-gray-600 text-sm">
                  Bebeklerde diş çıkarma belirtileri ve bu dönemde yapılması gerekenler.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}