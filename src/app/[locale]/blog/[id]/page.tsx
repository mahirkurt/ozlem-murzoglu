'use client'

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  category: string
}

const blogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'Çocuklarda Beslenme Alışkanlıkları',
    content: `
      Çocukların sağlıklı büyüme ve gelişimi için dengeli beslenme kritik öneme sahiptir. 
      Erken yaşta kazandırılan sağlıklı beslenme alışkanlıkları, yaşam boyu devam eder.
      
      ## Temel İlkeler
      - Düzenli öğün saatleri
      - Çeşitli besin gruplarından yararlanma
      - Yeterli su tüketimi
      - Şeker ve işlenmiş gıdalardan kaçınma
      
      ## Öneriler
      Çocuğunuzu yemek hazırlama sürecine dahil edin. Bu hem eğlenceli vakit geçirmenizi 
      sağlar hem de yeni tatları denemesi için teşvik eder.
    `,
    date: '2024-01-15',
    category: 'Beslenme'
  },
  '2': {
    id: '2',
    title: 'Mevsimsel Hastalıklardan Korunma',
    content: `
      Kış aylarında grip, soğuk algınlığı gibi hastalıklar sıkça görülür. 
      Basit önlemlerle çocuklarınızı bu hastalıklardan koruyabilirsiniz.
      
      ## Korunma Yöntemleri
      - Düzenli el yıkama
      - Aşıların tam ve zamanında yapılması
      - Dengeli beslenme ve vitamin desteği
      - Yeterli uyku ve dinlenme
      
      ## Ne Zaman Doktora Başvurmalı?
      Ateş 3 günden uzun sürerse, nefes almada güçlük varsa veya 
      çocuğunuz aşırı halsizse mutlaka doktorunuza başvurun.
    `,
    date: '2024-01-10',
    category: 'Sağlık'
  },
  '3': {
    id: '3',
    title: 'Çocuklarda Uyku Düzeni',
    content: `
      Kaliteli uyku, çocukların fiziksel ve zihinsel gelişimi için vazgeçilmezdir. 
      Düzenli uyku saatleri, öğrenme ve davranış üzerinde olumlu etki yapar.
      
      ## Yaşa Göre Uyku Süreleri
      - 0-3 ay: 14-17 saat
      - 4-12 ay: 12-16 saat
      - 1-2 yaş: 11-14 saat
      - 3-5 yaş: 10-13 saat
      - 6-12 yaş: 9-12 saat
      
      ## Uyku Rutini Önerileri
      Yatmadan 1 saat önce ekran kullanımını sonlandırın. 
      Sakin aktiviteler ve kitap okuma uyku öncesi rutininizin parçası olsun.
    `,
    date: '2024-01-05',
    category: 'Uyku'
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts[params.id]

  if (!post) {
    return (
      <div className="page-container">
        <h1>Yazı bulunamadı</h1>
      </div>
    )
  }

  return (
    <div className="page-container">
      <article>
        <div className="post-header">
          <span className="post-category">{post.category}</span>
          <h1 className="md-sys-typescale-display-medium">{post.title}</h1>
          <time className="post-date">{new Date(post.date).toLocaleDateString('tr-TR')}</time>
        </div>
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
              return <h2 key={index} className="md-sys-typescale-headline-medium">{paragraph.replace('## ', '')}</h2>
            }
            if (paragraph.startsWith('-')) {
              return <li key={index}>{paragraph.replace('- ', '')}</li>
            }
            if (paragraph.trim()) {
              return <p key={index} className="md-sys-typescale-body-large">{paragraph}</p>
            }
            return null
          })}
        </div>
      </article>
      <style jsx>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 140px 24px 48px;
          min-height: 100vh;
        }
        .post-header {
          margin-bottom: 32px;
        }
        .post-category {
          display: inline-block;
          padding: 4px 12px;
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: var(--md-sys-shape-corner-full);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .post-date {
          display: block;
          margin-top: 16px;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 14px;
        }
        .post-content {
          line-height: 1.8;
        }
        .post-content h2 {
          margin: 32px 0 16px;
        }
        .post-content p {
          margin-bottom: 16px;
        }
        .post-content li {
          margin-left: 24px;
          margin-bottom: 8px;
        }
        @media (max-width: 768px) {
          .page-container {
            padding-top: 120px;
          }
        }
      `}</style>
    </div>
  )
}