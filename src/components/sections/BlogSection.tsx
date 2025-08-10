'use client'

import React from 'react'
import Link from 'next/link'

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Çocuklarda Uyku Düzeni Nasıl Sağlanır?',
      excerpt: 'Sağlıklı uyku, çocuğunuzun fiziksel ve zihinsel gelişimi için kritik öneme sahiptir. Yaşa uygun uyku rutinleri...',
      category: 'Uyku Danışmanlığı',
      date: '15 Aralık 2024',
      readTime: '5 dk okuma',
      image: '/images/blog/sleep-routine.jpg'
    },
    {
      id: 2,
      title: 'Triple P: Pozitif Ebeveynlik Programı',
      excerpt: 'Çocuğunuzla olan ilişkinizi güçlendirirken, davranış sorunlarıyla başa çıkmanın kanıtlanmış yöntemleri...',
      category: 'Ebeveynlik',
      date: '12 Aralık 2024',
      readTime: '7 dk okuma',
      image: '/images/blog/triple-p.jpg'
    },
    {
      id: 3,
      title: 'Aşı Takvimi 2024: Bilmeniz Gerekenler',
      excerpt: 'Sağlık Bakanlığı\'nın güncel aşı takvimi ve çocuğunuzun hangi yaşta hangi aşıları olması gerektiği...',
      category: 'Aşılama',
      date: '10 Aralık 2024',
      readTime: '4 dk okuma',
      image: '/images/blog/vaccination.jpg'
    }
  ]

  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ebeveyn Kaynak Merkezi</h2>
          <p className="section-subtitle">
            Çocuk sağlığı ve gelişimi hakkında güncel bilgiler ve pratik öneriler
          </p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <Link href={`/blog/${post.id}`}>
                <div className="blog-image">
                  <div className="image-placeholder">
                    <span className="category-badge">{post.category}</span>
                  </div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-divider">•</span>
                    <span className="blog-readtime">{post.readTime}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-link">
                    <span>Devamını Oku</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="section-footer">
          <Link href="/blog" className="view-all-link">
            <span>Tüm Yazıları Görüntüle</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .blog-section {
          padding: 5rem 0;
          background: var(--md-sys-color-surface-container-low);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 0 auto;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .blog-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }

        .blog-card a {
          text-decoration: none;
          color: inherit;
        }

        .blog-image {
          position: relative;
          height: 200px;
          background: linear-gradient(135deg, #005F73 0%, #94BBE9 100%);
          overflow: hidden;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .category-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: white;
          color: #005F73;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .blog-content {
          padding: 1.5rem;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.875rem;
        }

        .blog-divider {
          opacity: 0.5;
        }

        .blog-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .blog-excerpt {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .blog-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--md-sys-color-secondary);
          font-weight: 500;
          font-size: 0.9375rem;
        }

        .blog-card:hover .blog-link {
          gap: 0.75rem;
        }

        .section-footer {
          text-align: center;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: var(--md-sys-color-secondary);
          color: white;
          border-radius: 24px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .view-all-link:hover {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}

export { BlogSection }