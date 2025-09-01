import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: number;
  image: string;
  author: string;
  featured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private translate: TranslateService) {}
  
  private getArticles(): BlogArticle[] {
    return [
    {
      id: '1',
      slug: 'dis-cikarma-sureci',
      title: this.translate.instant('BLOG.ARTICLES.TEETHING.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.TEETHING.EXCERPT'),
      content: `
        <h2>Diş Çıkarma Süreci</h2>
        <p>Diş çıkarma süreci genellikle 6 ay civarında başlar ve yaklaşık 2 yaşına kadar devam eder. İlk dişler genellikle 6 ay civarında çıkmaya başlar ve çoğunlukla alt ön dişlerdir. Çoğu çocukta 3 yaşına kadar tüm süt dişleri çıkmış olacaktır.</p>
        
        <h3>Diş Çıkarma Belirtileri</h3>
        <ul>
          <li>Hafif rahatsızlık</li>
          <li>Ağlama</li>
          <li>Aşırı salya akıtma</li>
          <li>Sert nesneleri çiğneme isteği</li>
          <li>Diş etlerinde hafif şişlik ve hassasiyet</li>
        </ul>
        
        <h3>Önerilen Stratejiler</h3>
        <h4>✅ Önerilen:</h4>
        <ul>
          <li>Diş kaşıyıcı oyuncaklar (silikon veya lateks)</li>
          <li>Soğuk bezler</li>
          <li>Nazik diş eti masajı</li>
          <li>Rahatlık ve dikkat dağıtma sağlama</li>
          <li>Düzenli uyku rutinlerini sürdürme</li>
        </ul>
        
        <h4>❌ Önerilmeyen:</h4>
        <ul>
          <li>Diş çıkarma bisküvileri</li>
          <li>Bitkisel ürünler</li>
          <li>Kehribar kolye</li>
          <li>Lokal anestezik içeren uyuşturucu jeller</li>
        </ul>
        
        <div class="important-note">
          <strong>Önemli Not:</strong> "Bebeğinizin ateşi 38,3 santigrat derecenin üzerinde ise diş çıkarmayla ilişkili değildir"
        </div>
        
        <p>Diş çıkarma sürecinde bireysel rehberlik için pediatristle görüşmeniz önemlidir.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['diş çıkarma', 'bebek', 'diş eti', 'teething'],
      date: '15 Mart 2024',
      readTime: 5,
      image: '/assets/images/blog/teething.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: true
    },
    {
      id: '2',
      slug: 'cocuklar-arasi-zorbalik',
      title: this.translate.instant('BLOG.ARTICLES.BULLYING.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.BULLYING.EXCERPT'),
      content: `
        <h2>Çocuklar Arası Zorbalık</h2>
        <p>Zorbalık, "bir çocuğun başka bir çocuğa tekrar tekrar saldırması" olarak tanımlanır ve güç dengesizliği olduğunda gerçekleşir.</p>
        
        <h3>Zorbalık Türleri</h3>
        <ol>
          <li><strong>Fiziksel</strong> (vurma, itme)</li>
          <li><strong>Sözel</strong> (tehdit, alay etme)</li>
          <li><strong>Sosyal</strong> (dışlama, dedikodu yayma)</li>
        </ol>
        
        <h3>Zorbalığın Özellikleri</h3>
        <ul>
          <li>Okulda, oyun alanlarında veya çevrimiçi ortamlarda gerçekleşebilir</li>
          <li>Genellikle şu özellikteki çocukları hedef alır:
            <ul>
              <li>Fiziksel olarak farklı olan</li>
              <li>Utangaç veya kendine güveni az olan</li>
              <li>Az arkadaşı olan</li>
              <li>"Zayıf" olarak algılanan</li>
            </ul>
          </li>
        </ul>
        
        <h3>Ebeveynler İçin Öneriler</h3>
        <ul>
          <li>Çocuklarla zorbalık hakkında açık konuşmalar yapın</li>
          <li>Çocuklara nasıl tepki vereceklerini öğretin:
            <ul>
              <li>Zorbanın gözlerine bakın</li>
              <li>Sakin kalın</li>
              <li>Uzaklaşın</li>
              <li>Olayları güvenilir yetişkinlere bildirin</li>
            </ul>
          </li>
          <li>Zorbalığa uğrayan çocukları destekleyin</li>
          <li>Zorbalık yapan çocuklara davranışlarının etkisini anlayın</li>
        </ul>
        
        <h3>Potansiyel Sonuçlar</h3>
        <ul>
          <li>Madde bağımlılığı riski artışı</li>
          <li>Akademik zorluklar</li>
          <li>Ruh sağlığı sorunları</li>
          <li>Depresyon olasılığının artması</li>
        </ul>
        
        <p>İletişim, destek ve çocuklar için güvenli bir ortam yaratmanın önemi vurgulanmaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.CHILD_PSYCHOLOGY'),
      tags: ['zorbalık', 'okul', 'çocuk psikolojisi', 'güvenlik'],
      date: '10 Mart 2024',
      readTime: 6,
      image: '/assets/images/blog/bullying.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: true
    },
    {
      id: '3',
      slug: 'emzik-ve-emzik-birakma',
      title: this.translate.instant('BLOG.ARTICLES.PACIFIER.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.PACIFIER.EXCERPT'),
      content: `
        <h2>Emzikler ve Emzik Bırakma</h2>
        <p>Emzikler bebeğin doğal emme içgüdüsünü karşılar ve onları sakinleştirmeye yardımcı olabilir. 6 aydan önce kullanıldığında Ani Bebek Ölümü Sendromu (SIDS) riskini azaltabilir.</p>
        
        <h3>Potansiyel Olumsuz Etkiler</h3>
        <ul>
          <li>6 aydan sonra kulak enfeksiyonu riskinin artması</li>
          <li>Konuşma gelişiminde potansiyel gecikmeler</li>
          <li>2 yaşından sonra kullanılırsa diş hizalamasında olası sorunlar</li>
        </ul>
        
        <h3>Önerilen Emzik Kullanımı</h3>
        <ul>
          <li>1 yaşına kadar uyku sırasında güvenle kullanılabilir</li>
          <li>6-12 ay arası bırakmaya başlamak en iyisi</li>
          <li>Gündüz kullanımını sınırlayın, özellikle çocuğun dil becerilerini geliştirmesi gereken zamanlarda</li>
        </ul>
        
        <h3>Bırakma Stratejileri</h3>
        <ol>
          <li>Emzik kullanımını kademeli olarak kısıtlayın</li>
          <li>Alternatif rahatlık nesneleri sağlayın</li>
          <li>Rahatsızlığa ilk tepki olarak emzik kullanmaktan kaçının</li>
          <li>Çocuğu emzik kullanmadığı için övün</li>
          <li>Bırakmayı özel hale getirmek için bir "veda" töreni veya ritüeli düşünün</li>
        </ol>
        
        <h3>Önemli Öneriler</h3>
        <ul>
          <li>2 yaşından sonra devam edilirse ortodontik emzikler kullanın</li>
          <li>Bırakma sürecinde çocuğu asla cezalandırmayın veya utandırmayın</li>
          <li>Uygun zamanlamayı seçin (büyük yaşam değişikliklerinden kaçının)</li>
        </ul>
        
        <p>Makale, çocukların emzik kullanımından uzaklaşmalarına yardımcı olurken nazik ve destekleyici bir yaklaşım vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['emzik', 'bebek', 'bırakma', 'gelişim'],
      date: '5 Mart 2024',
      readTime: 7,
      image: '/assets/images/blog/pacifier.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '4',
      slug: 'tuvalet-egitimi',
      title: this.translate.instant('BLOG.ARTICLES.POTTY_TRAINING.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.POTTY_TRAINING.EXCERPT'),
      content: `
        <h2>Tuvalet Eğitimi</h2>
        <p>Tuvalet eğitimi genellikle 18 ay ile 4 yaş arasında gerçekleşir. Her çocuk farklı gelişir, bu nedenle karşılaştırmalardan kaçının.</p>
        
        <h3>Önemli İlkeler</h3>
        <ul>
          <li>Büyük yaşam değişiklikleri sırasında başlamaktan kaçının</li>
          <li>Tutma davranışlarını engelleyin</li>
          <li>Sakin, tehdit edici olmayan bir ortam yaratın</li>
          <li>Otururken çocuğun ayaklarının desteklendiğinden emin olun</li>
          <li>Lifli beslenme ve uygun su tüketimi sağlayın</li>
        </ul>
        
        <h3>Tuvalet Eğitimi Aşamaları</h3>
        
        <h4>18 Ay:</h4>
        <ul>
          <li>Uygun tuvalet kelimelerini kullanmaya başlayın</li>
          <li>Bez değiştirmeyi eğlenceli hale getirin</li>
          <li>Çocuğu bezin ıslak/kirli olduğunu söylemeye teşvik edin</li>
        </ul>
        
        <h4>21 Ay:</h4>
        <ul>
          <li>Uygun bir lazımlık alın</li>
          <li>Birlikte oturma pratiği yapın</li>
          <li>Talimat takip etme gibi ön beceriler geliştirin</li>
        </ul>
        
        <h4>2.5-3 Yaş:</h4>
        <ul>
          <li>Eğitim için kitaplar ve videolar kullanın</li>
          <li>Oyuncak bebeklerle pratik yapın</li>
          <li>Lazımlıkta yaklaşık 1 dakika oturmaya teşvik edin</li>
          <li>Olumlu pekiştirme kullanın</li>
          <li>Kazaları bekleyin ve yargılamadan ele alın</li>
        </ul>
        
        <p>Makale sabır, bireyselleştirilmiş yaklaşım ve tuvalet eğitimi için olumlu bir öğrenme ortamı yaratmayı vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.CHILD_DEVELOPMENT'),
      tags: ['tuvalet eğitimi', 'çocuk gelişimi', 'ebeveynlik'],
      date: '28 Şubat 2024',
      readTime: 8,
      image: '/assets/images/blog/potty-training.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '5',
      slug: 'bir-ergenle-iletisim-kurmak',
      title: this.translate.instant('BLOG.ARTICLES.TEEN_COMMUNICATION.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.TEEN_COMMUNICATION.EXCERPT'),
      content: `
        <h2>Bir Ergenle İletişim Kurmak</h2>
        <p>Ergenler bağımsız düşünceler, duygular ve değerler geliştirmektedir. Artık çocuk değiller ancak henüz yetişkin de değiller. Ebeveynler bu geçiş sırasında çocuklarının güvenliği konusunda endişe duyarlar.</p>
        
        <h3>Ana Öneriler</h3>
        
        <h4>1. Katılımcı Ebeveyn Olun</h4>
        <ul>
          <li>Çocuğun faaliyetlerine ve arkadaşlarına ilgi gösterin</li>
          <li>Açık, dürüst ve saygılı iletişim kurun</li>
          <li>Net sınırlar ve beklentiler koyun</li>
          <li>Okulda ve okul sonrası neler olduğunu bilin</li>
          <li>Şiddeti güvenli bir şekilde nasıl önleyeceğini öğretin</li>
        </ul>
        
        <h4>2. Olumlu İletişim</h4>
        <ul>
          <li>Yargılamadan aktif dinleme yapın</li>
          <li>İlgi alanları hakkında sorular sorun</li>
          <li>"Seni anlıyorum, ama farklı görüyorum..." gibi cümleler deneyin</li>
          <li>"Bu aptalca" veya "Yanılıyorsun" gibi ifadelerden kaçının</li>
        </ul>
        
        <h4>3. Ergen Özelliklerini Anlayın</h4>
        <ul>
          <li>Yeni yapma yollarıyla ilgilidirler</li>
          <li>Şimdiki ana odaklanırlar</li>
          <li>Rol model isterler</li>
          <li>Yetkin görülmek isterler</li>
        </ul>
        
        <h4>4. Güvenlik ve Sınırlar</h4>
        <ul>
          <li>Okul sonrası nerede olduklarını bilin</li>
          <li>Kavga etmeden çatışma çözümünü öğretin</li>
          <li>Şunlar hakkında beklentileri tartışın:
            <ul>
              <li>Ödev ve okul başarısı</li>
              <li>Dışarıda kalma saatleri</li>
              <li>Okul sonrası etkinlikler</li>
              <li>Para harcama</li>
              <li>Araç güvenliği</li>
            </ul>
          </li>
        </ul>
        
        <p>Makale ergenlik yıllarında gezinmek için anlayış, saygı ve açık iletişimin anahtar olduğunu vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.ADOLESCENCE'),
      tags: ['ergenlik', 'iletişim', 'ebeveynlik', 'çocuk psikolojisi'],
      date: '20 Şubat 2024',
      readTime: 9,
      image: '/assets/images/blog/teen-communication.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: true
    },
    {
      id: '6',
      slug: 'araba-guvenlik-koltuklari',
      title: this.translate.instant('BLOG.ARTICLES.CAR_SAFETY.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.CAR_SAFETY.EXCERPT'),
      content: `
        <h2>Araba Güvenlik Koltukları</h2>
        <p>13 yaşın altındaki çocuklar her zaman arka koltukta seyahat etmelidir. Bebekler ve küçük çocuklar en az 2 yaşına, tercihen 4 yaşına kadar arkaya dönük araç koltukları kullanmalıdır.</p>
        
        <h3>Önemli Güvenlik Önerileri</h3>
        <ul>
          <li>Araç koltuğunu asla aktif hava yastığı bulunan ön koltuğa yerleştirmeyin</li>
          <li>Çocuğun ağırlığı, boyu ve yaşına göre doğru araç koltuğunu kullanın</li>
          <li>Emniyet kemerlerinin çocuğun vücuduna düzgün oturduğundan emin olun</li>
          <li>Araç koltuğu kurulumunu dikkatli kontrol edin, ISOFIX sistemi veya emniyet kemerleri kullanın</li>
          <li>Çocuk düzenli emniyet kemeri için yeterli boya (yaklaşık 145 cm) gelene kadar yükseltici koltuk kullanın</li>
        </ul>
        
        <h3>Önemli Güvenlik Tavsiyeleri</h3>
        <ol>
          <li>Geçmişi bilinmeyen ikinci el araç koltukları kullanmaktan kaçının</li>
          <li>Son kullanma tarihlerini kontrol edin (genellikle üretimden 6 yıl sonra)</li>
          <li>Emniyet kemerlerinin doğru konumlandırıldığından emin olun:
            <ul>
              <li>Üst kemer göğüs ve omuzdan geçmeli</li>
              <li>Alt kemer karnın değil kalçaların üzerinde durmalı</li>
            </ul>
          </li>
          <li>Çocuk sırtını koltuğa yaslamış ve dizleri koltuk kenarında bükülmüş şekilde oturabilmeli</li>
        </ol>
        
        <p>Makale, ulaşım sırasında çocuk güvenliği için uygun araç koltuğu kullanımının kritik önemde olduğunu, farklı yaş ve boylar için uygun araç koltukları seçme ve kurma konusunda detaylı rehberlik sağlayarak vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.SAFETY'),
      tags: ['araç güvenliği', 'çocuk koltuğu', 'güvenlik', 'seyahat'],
      date: '15 Şubat 2024',
      readTime: 6,
      image: '/assets/images/blog/car-safety.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '7',
      slug: 'guvenli-uyku',
      title: this.translate.instant('BLOG.ARTICLES.SAFE_SLEEP.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.SAFE_SLEEP.EXCERPT'),
      content: `
        <h2>Güvenli Uyku ve Ani Bebek Ölümünden Korunma</h2>
        
        <h3>Ana Öneriler</h3>
        
        <h4>1. Bebekleri Her Zaman Sırt Üstü Yatırın</h4>
        <p><strong>"Sadece bu önlemin uygulanması dahi SIDS olasılığını yarı yarıya azaltır."</strong></p>
        
        <h4>2. Asla Birlikte Uyumayın</h4>
        <ul>
          <li>Bebekler kendi yatağında, ebeveynlerden ayrı uyumalıdır</li>
          <li>Aynı odada (ama ayrı yataklarda) uyumak önerilir, özellikle ilk 6 ayda</li>
        </ul>
        
        <h4>3. Güvenli Uyku Ortamı Yaratın</h4>
        <ul>
          <li>Beşikte yastık, battaniye veya yumuşak eşyalar bulunmamalı</li>
          <li>Oda sıcaklığını 20-24°C arasında tutun</li>
          <li>Sıkı oturan çarşaflı sert bir yatak kullanın</li>
          <li>Beşiği ısıtıcı veya pencerelerin yakınına yerleştirmeyin</li>
        </ul>
        
        <h4>4. Ek Koruyucu Önlemler</h4>
        <ul>
          <li>En az ilk 6 ay emzirin</li>
          <li>Bebeği uyuttuğunuzda emzik kullanın</li>
          <li>Aşıların zamanında yapıldığından emin olun</li>
          <li>Hamilelik sırasında ve sonrasında sigara ve alkol kullanmaktan kaçının</li>
        </ul>
        
        <p>Makale, Ani Bebek Ölümü Sendromu'nun (SIDS) 5.000 bebekten 1'ini etkilediğini ve bu kılavuzların riski önemli ölçüde azaltabileceğini vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['güvenli uyku', 'SIDS', 'bebek güvenliği', 'uyku'],
      date: '10 Şubat 2024',
      readTime: 5,
      image: '/assets/images/blog/safe-sleep.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: true
    },
    {
      id: '8',
      slug: 'saglikli-disler',
      title: this.translate.instant('BLOG.ARTICLES.HEALTHY_TEETH.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.HEALTHY_TEETH.EXCERPT'),
      content: `
        <h2>Sağlıklı Dişler</h2>
        <p>Diş çürükleri en yaygın kronik çocukluk hastalığıdır. 12-18 yaş arası çocukların %60'ında en az bir çürük bulunur. Çürükler, asit üreten bakterilerin diş minesini aşındırmasıyla oluşur.</p>
        
        <h3>Diş Sağlığı Önerileri</h3>
        
        <h4>1. Florürlü Diş Macunu</h4>
        <ul>
          <li>İlk dişler çıktığında florürlü diş macunu kullanmaya başlayın</li>
          <li>Bebekler için pirinç tanesi büyüklüğünde miktar</li>
          <li>3 yaşındaki çocuklar için bezelye büyüklüğünde miktar</li>
        </ul>
        
        <h4>2. Sistemik Florür Desteği</h4>
        <ul>
          <li>6 aylık ve daha büyük bebekler için önerilir</li>
          <li>6 ayda günlük 0.25mg florür takviyesi, 3 yaşında 0.50mg'a çıkar</li>
          <li>Türkiye'de florür spesifik ürün eksikliği nedeniyle zorlayıcı</li>
        </ul>
        
        <h4>3. Florür Vernik</h4>
        <ul>
          <li>Diş hekimleri tarafından uygulanır</li>
          <li>İlk diş kontrolü 1 yaşında önerilir</li>
          <li>Her 6 ayda bir yeniden uygulanır</li>
        </ul>
        
        <h3>Önemli Notlar</h3>
        <ul>
          <li>Aşırı florür "florosis" (kalıcı diş renk değişimi) nedeni olabilir</li>
          <li>Yaşam boyu diş sağlığı için erken diş bakımı çok önemlidir</li>
          <li>Şekerli yiyecekleri azaltın ve iyi ağız hijyenini sürdürün</li>
        </ul>
        
        <p>Makale, diş çürüklerinden korunmak için bebeklikten itibaren başlayan önleyici diş bakımını vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.DENTAL_HEALTH'),
      tags: ['diş sağlığı', 'çürük önleme', 'florür', 'ağız bakımı'],
      date: '5 Şubat 2024',
      readTime: 6,
      image: '/assets/images/blog/dental-health.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '9',
      slug: 'emzik-parmak-emme',
      title: this.translate.instant('BLOG.ARTICLES.THUMB_SUCKING.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.THUMB_SUCKING.EXCERPT'),
      content: `
        <h2>Emzik & Parmak Emme</h2>
        <p>Emme bebekler için doğal bir reflekstir, doğum öncesi ultrason görüntülerinde bile görülür. Emme rahatlık sağlar ve bebeklerin kendilerini güvende hissetmelerine yardımcı olur.</p>
        
        <h3>Emzik Kullanım Önerileri</h3>
        <ul>
          <li><strong>En erken 2 ayda</strong> tanıştırın</li>
          <li>1 yaşına kadar "ani bebek ölümü sendromu" riskini azaltmaya yardımcı olur</li>
          <li>Kulak enfeksiyonları ve diş sorunlarını önlemek için 1 yaştan sonra bırakılmalıdır</li>
        </ul>
        
        <h3>Parmak Emme Rehberi</h3>
        <ul>
          <li>Çocuklar için doğal davranıştır</li>
          <li>4 yaşına kadar genellikle zararsızdır</li>
          <li>Çoğu çocuk 2-3 yaş arasında bırakır</li>
          <li>4 yaştan sonra diş ve damak deformitelerine neden olabilir</li>
        </ul>
        
        <h3>Ebeveynler İçin Öneriler</h3>
        <ul>
          <li>Parmak emme için çocukları azarlamayın</li>
          <li>Parmak emmediğinde çocukları övün</li>
          <li>Sevgi dolu, güvenli bir ortam yaratın</li>
          <li>4 yaştan sonra davranış devam ederse profesyonel yardım alın</li>
        </ul>
        
        <h3>Önemli Uyarılar</h3>
        <ul>
          <li>Emzikleri asla bebeğin boynuna bağlamayın</li>
          <li>Emzikleri şekerli maddelere batırmayın</li>
          <li>Davranışlar önerilen yaşların ötesinde devam ederse profesyonel müdahale önerilir</li>
        </ul>
        
        <p>Makale, hem emzik kullanımının hem de parmak emmenin çocuklara rahatlık sağlayan doğal davranışlar olduğunu, ancak belirli gelişim aşamalarının ötesinde devam ederlerse izlenmesi ve potansiyel olarak ele alınması gerektiğini vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['emzik', 'parmak emme', 'çocuk gelişimi', 'alışkanlık'],
      date: '30 Ocak 2024',
      readTime: 7,
      image: '/assets/images/blog/thumb-sucking.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '10',
      slug: 'kolik',
      title: this.translate.instant('BLOG.ARTICLES.COLIC.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.COLIC.EXCERPT'),
      content: `
        <h2>Kolik</h2>
        <p>Kolik, bebeklerde uzun süreli, yoğun ağlama ile karakterize bir durumdur. Genellikle bebekler 2-3 haftalıkken başlar ve 3-4 aylığa kadar sürer.</p>
        
        <h3>Tanım</h3>
        <p>Kolik "periyodik olarak tekrar eden ve saatler boyunca süren ağlama krizlerini tarif eder". Bebeklerin yaklaşık 5'te 1'ini etkiler ve ilk doğan çocuklarda ve erkek bebeklerde daha yaygındır.</p>
        
        <h3>Özellikler</h3>
        <ul>
          <li>Bebekler genellikle günde 3-5 saat ağlar</li>
          <li>Ağlama genellikle tutarlı zamanlarda gerçekleşir</li>
          <li>Bebekler önemli miktarda gaz üretebilir</li>
          <li>Ağlama aniden başlayıp durabiliyor</li>
        </ul>
        
        <h3>Önerilen Başa Çıkma Stratejileri</h3>
        <ul>
          <li>Bebeği kundaklayın (bacakları serbest bırakarak)</li>
          <li>Bebek taşıyıcısı kullanın</li>
          <li>Bebeği nazikçe sallayın</li>
          <li>Emzik verin (bir ay sonra)</li>
          <li>Bebeğin sırtını masaj yapın</li>
          <li>Ritmik sesler çalın</li>
          <li>Emziriyorsanız maternal diyeti değiştirin</li>
          <li>Mama değişikliklerini düşünün</li>
          <li>Molalar verin ve destek alın</li>
        </ul>
        
        <p>Makale, sakin kalmayı ve bu ağlama nöbetlerinin bebeğin rahim dışındaki dünyaya uyum sağlama sürecinin doğal bir parçası olduğunu anlamayı vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['kolik', 'bebek ağlaması', 'sakinleştirme', 'bebek bakımı'],
      date: '25 Ocak 2024',
      readTime: 6,
      image: '/assets/images/blog/colic.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '11',
      slug: 'ayrilik-kaygisi',
      title: this.translate.instant('BLOG.ARTICLES.SEPARATION_ANXIETY.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.SEPARATION_ANXIETY.EXCERPT'),
      content: `
        <h2>Ayrılık Kaygısı</h2>
        <p>Ayrılık kaygısı genellikle 6-8 aylık yaşta başlar, 1 yaş civarında zirveye çıkar ve 15-18 ay civarında azalmaya başlar. Bebekler 8 ay civarında nesne kalıcılığı geliştirirler ve şeylerin gözden kaybolduğunda hala var olduğunu anlarlar.</p>
        
        <h3>Özellikler</h3>
        <ul>
          <li>Çocuklar bir ebeveyne (genellikle anneye) yoğun bağlılık geliştirir</li>
          <li>Ebeveyn görüş alanından çıktığında ağlarlar</li>
          <li>Sürekli ebeveynin yakınında kalmak isterler</li>
        </ul>
        
        <h3>Ebeveynler İçin Öneriler</h3>
        <ol>
          <li>Fiziksel temas ile kaliteli zaman geçirin</li>
          <li>Nesnelerin geri döndüğünü öğretmek için cilve oyunları oynayın</li>
          <li>Evde küçük ayrılık senaryları yaratın</li>
          <li>Ayrılmalardan önce çocuğun rahat olduğundan emin olun</li>
          <li>Hızlı, tutarlı bir veda ritüeli oluşturun</li>
          <li>Uzun, dramatik vedalardan kaçının</li>
          <li>Söz verdiğinizde dönme konusunda tutarlı olun</li>
        </ol>
        
        <h3>Önemli Görüş</h3>
        <p><strong>"Ayrılık kaygısı doğal bir gelişim aşamasıdır ve varlığı sağlıklı bir çocuk gelişiminin göstergesidir."</strong></p>
        
        <p>Makale, bu fazın normal olduğunu ve çocuğun hafızası ve anlayışı geliştikçe doğal olarak çözüleceğini vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.CHILD_PSYCHOLOGY'),
      tags: ['ayrılık kaygısı', 'çocuk psikolojisi', 'bağlanma', 'gelişim'],
      date: '20 Ocak 2024',
      readTime: 5,
      image: '/assets/images/blog/separation-anxiety.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    },
    {
      id: '12',
      slug: 'pisikler',
      title: this.translate.instant('BLOG.ARTICLES.DIAPER_RASH.TITLE'),
      excerpt: this.translate.instant('BLOG.ARTICLES.DIAPER_RASH.EXCERPT'),
      content: `
        <h2>Pişikler Neden Oluşur ve Nasıl Önlenir</h2>
        <p>Pişik, tüm bebeklerin en az yarısını bir noktada etkiler. Önleme stratejileri şunları içerir:</p>
        
        <h3>Önleme Stratejileri</h3>
        <ol>
          <li>Bezleri sık değiştirin (her 3-4 saatte bir)</li>
          <li>Cildi nazikçe temizleyin</li>
          <li>Çinko oksit içeren bariyer krem kullanın</li>
          <li>Yüksek emici bezler seçin</li>
          <li>Cildin nefes almasına izin verin</li>
        </ol>
        
        <h3>Pişik Oluşumunun Yaygın Nedenleri</h3>
        <ul>
          <li>İdrar ve dışkıya uzun süreli maruz kalma</li>
          <li>Katı gıda tanıştırılması</li>
          <li>Bez veya mendillere alerjik reaksiyonlar</li>
          <li>Sıkı oturan bezler</li>
          <li>Antibiyotikler</li>
          <li>Bakteriyel veya mantar enfeksiyonları</li>
        </ul>
        
        <h3>Doktora Ne Zaman Başvurulmalı</h3>
        <ul>
          <li>Pişik 2-3 gün sonra düzelmezse</li>
          <li>Pişik su toplaması, cilt dökülmesi veya açık yaralar içeriyorsa</li>
          <li>Pişik özellikle ağrılıysa</li>
          <li>Ateş eşlik ediyorsa</li>
        </ul>
        
        <p>Makale, pişiği önlemek ve tedavi etmek için nazik bakım, bez bölgesini temiz ve kuru tutma ve koruyucu bariyer kremler kullanmayı vurgulamaktadır.</p>
      `,
      category: this.translate.instant('BLOG.CATEGORIES.BABY_CARE'),
      tags: ['pişik', 'bez dermatiti', 'cilt bakımı', 'bebek bakımı'],
      date: '15 Ocak 2024',
      readTime: 4,
      image: '/assets/images/blog/diaper-rash.svg',
      author: 'Dr. Özlem Murzoğlu',
      featured: false
    }
    ];
  }

  private articlesSubject = new BehaviorSubject<BlogArticle[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  constructor() {
    // Initialize articles when service is created
    this.articlesSubject.next(this.getArticles());
    
    // Update articles when language changes
    this.translate.onLangChange.subscribe(() => {
      this.articlesSubject.next(this.getArticles());
    });
  }

  getAllArticles(): Observable<BlogArticle[]> {
    return this.articles$;
  }

  getArticleBySlug(slug: string): Observable<BlogArticle | undefined> {
    return new Observable(observer => {
      const articles = this.getArticles();
      const article = articles.find(a => a.slug === slug);
      observer.next(article);
      observer.complete();
    });
  }

  getFeaturedArticles(): Observable<BlogArticle[]> {
    return new Observable(observer => {
      const articles = this.getArticles();
      const featured = articles.filter(a => a.featured);
      observer.next(featured);
      observer.complete();
    });
  }

  getArticlesByCategory(category: string): Observable<BlogArticle[]> {
    return new Observable(observer => {
      const allCategoryKey = this.translate.instant('COMMON.ALL');
      const articles = this.getArticles();
      if (category === allCategoryKey || !category) {
        observer.next(articles);
      } else {
        const filtered = articles.filter(a => a.category === category);
        observer.next(filtered);
      }
      observer.complete();
    });
  }

  getCategories(): string[] {
    const allCategoryKey = this.translate.instant('COMMON.ALL');
    const articles = this.getArticles();
    const categories = [allCategoryKey, ...new Set(articles.map(a => a.category))];
    return categories;
  }

  searchArticles(query: string): Observable<BlogArticle[]> {
    return new Observable(observer => {
      const searchQuery = query.toLowerCase();
      const articles = this.getArticles();
      const filtered = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery) ||
        article.content.toLowerCase().includes(searchQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
      observer.next(filtered);
      observer.complete();
    });
  }
}