import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Dr. Özlem Murzoğlu',
  description: 'Çocuk Sağlığı ve Hastalıkları Uzmanı, Sosyal Pediatri Doktoru, Çocuk Gelişimci',
}

export default function DrOzlemMurzogluPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                Dr. Özlem Murzoğlu
              </h1>
              <p className="text-xl mb-4 text-gray-700">
                Çocuk Sağlığı ve Hastalıkları Uzmanı
              </p>
              <p className="text-lg mb-4 text-gray-600">
                Sosyal Pediatri Doktoru | Çocuk Gelişimci
              </p>
              <p className="text-base leading-relaxed text-gray-600">
                Çocuklarınızın sağlıklı büyüme ve gelişim sürecinde, kanıta dayalı tıp yaklaşımıyla yanınızdayım.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              {/* Placeholder for doctor's photo */}
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <span className="text-primary/50 text-lg">Dr. Özlem Murzoğlu</span>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Eğitim</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">İstanbul Tıp Fakültesi</h3>
              <p className="text-gray-600">Tıp Doktoru • 2001 - 2007</p>
              <p className="mt-2 text-gray-700">
                İstanbul Tıp Fakültesi'nden 2007 yılında mezun oldum.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">Marmara Üniversitesi</h3>
              <p className="text-gray-600">Çocuk Sağlığı ve Hastalıkları Uzmanlığı • 2007 - 2011</p>
              <p className="mt-2 text-gray-700">
                Marmara Üniversitesi'nde Çocuk Sağlığı ve Hastalıkları ihtisasımı tamamladım.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">Marmara Üniversitesi</h3>
              <p className="text-gray-600">Sosyal Pediatri Doktorası • Devam Ediyor</p>
              <p className="mt-2 text-gray-700">
                Marmara Üniversitesi'nde Sosyal Pediatri alanında doktora eğitimime devam ediyorum.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-semibold mb-2">İstanbul Üniversitesi</h3>
              <p className="text-gray-600">Çocuk Gelişimi Lisans • 2019 - 2023</p>
              <p className="mt-2 text-gray-700">
                İstanbul Üniversitesi Çocuk Gelişimi programından 2023 yılında mezun oldum.
              </p>
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Mesleki Deneyim</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Özel Kliniğim</h3>
              <p className="text-gray-600 mb-3">Temmuz 2022 - Günümüz</p>
              <p className="text-gray-700">
                Temmuz 2022'de hastane çalışma hayatımı sonlandırarak, çocukların sağlıklı büyüme ve 
                gelişim sürecine odaklanan özel kliniğimi açtım. Kanıta dayalı tıp yaklaşımıyla, 
                her çocuğun benzersiz gelişim sürecini destekliyorum.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Marmara Üniversitesi Pendik Eğitim ve Araştırma Hastanesi</h3>
              <p className="text-gray-600 mb-3">2011 - 2022 • 11 Yıl</p>
              <p className="text-gray-700">
                11 yıl boyunca Marmara Üniversitesi Pendik Eğitim ve Araştırma Hastanesi'nde 
                Çocuk Sağlığı ve Hastalıkları Uzmanı olarak görev yaptım. Bu süre zarfında 
                binlerce çocuğun tedavi ve takip sürecinde yer aldım.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Philosophy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Yaklaşımım</h2>
          <div className="bg-primary/5 rounded-2xl p-8">
            <p className="text-lg leading-relaxed text-gray-700 mb-4">
              Çocuk sağlığı sadece hastalıkların tedavisi değil, aynı zamanda sağlıklı büyüme ve 
              gelişimin desteklenmesidir. Her çocuğun benzersiz olduğuna inanıyor ve tedavi 
              yaklaşımımı bu anlayışla şekillendiriyorum.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-4">
              Kliniğimizde Amerikan Pediatri Akademisi'nin Bright Futures Sağlıklı Çocuk İzlemi 
              Programı'nı uyguluyoruz. Bu program, çocukların fiziksel, duygusal ve sosyal 
              gelişimlerini kapsamlı bir şekilde değerlendirmemizi sağlıyor.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Ebeveynlerle işbirliği içinde çalışarak, çocukların potansiyellerini en üst düzeye 
              çıkarmalarına yardımcı olmayı hedefliyorum. Uyku danışmanlığı, olumlu ebeveynlik 
              programları ve gelişimsel değerlendirmeler ile ailelere kapsamlı destek sunuyorum.
            </p>
          </div>
        </section>

        {/* Personal Life */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Kişisel</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Karadeniz'in küçük ve otantik bir şehrinde, dört çocuklu bir ailenin en küçüğü olarak 
              büyüdüm. Çocukluğumda annem ve dedemle doğaya olan tutkumu paylaştım. Ablam ve abimin 
              desteğiyle eğitim hayatıma başladım.
            </p>
            <p className="text-lg leading-relaxed">
              2008 yılında Mahir ile evlendim ve 2014 yılında kızımız dünyaya geldi. Bir anne olarak 
              yaşadığım deneyimler, mesleki pratiğime değerli katkılar sağlıyor ve ebeveynlerin 
              yaşadığı zorlukları daha iyi anlamamı sağlıyor.
            </p>
          </div>
        </section>

        {/* Certifications & Memberships */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Sertifikalar ve Üyelikler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Sertifikalar</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Bright Futures Sağlıklı Çocuk İzlemi Sertifikası</li>
                <li>• Uyku Danışmanlığı Sertifikası</li>
                <li>• Triple P Olumlu Ebeveynlik Programı Uygulayıcı Sertifikası</li>
                <li>• Emzirme Danışmanlığı Sertifikası</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Üyelikler</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Türk Pediatri Kurumu</li>
                <li>• Sosyal Pediatri Derneği</li>
                <li>• Türk Tabipler Birliği</li>
                <li>• İstanbul Tabip Odası</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}