'use client'

import React from 'react'
import Link from 'next/link'
import { BlogIllustration } from '@/components/ui/BlogIllustrations'

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Çocuklarda Uyku Düzeni Nasıl Sağlanır?',
      excerpt: 'Sağlıklı uyku, çocuğunuzun fiziksel ve zihinsel gelişimi için kritik öneme sahiptir. Yaşa uygun uyku rutinleri...',
      category: 'Uyku Danışmanlığı',
      date: '15 Aralık 2024',
      readTime: '5 dk okuma',
      illustrationType: 'sleep' as const,
      color: 'primary'
    },
    {
      id: 2,
      title: 'Triple P: Pozitif Ebeveynlik Programı',
      excerpt: 'Çocuğunuzla olan ilişkinizi güçlendirirken, davranış sorunlarıyla başa çıkmanın kanıtlanmış yöntemleri...',
      category: 'Ebeveynlik',
      date: '12 Aralık 2024',
      readTime: '7 dk okuma',
      illustrationType: 'parenting' as const,
      color: 'secondary'
    },
    {
      id: 3,
      title: 'Aşı Takvimi 2024: Bilmeniz Gerekenler',
      excerpt: 'Sağlık Bakanlığı\'nın güncel aşı takvimi ve çocuğunuzun hangi yaşta hangi aşıları olması gerektiği...',
      category: 'Aşılama',
      date: '10 Aralık 2024',
      readTime: '4 dk okuma',
      illustrationType: 'vaccination' as const,
      color: 'tertiary'
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
            <article key={post.id} className={`blog-card blog-card--${post.color}`}>
              <Link href={`/blog/${post.id}`}>
                <div className="blog-image">
                  <div className="image-placeholder">
                    <BlogIllustration type={post.illustrationType} className="blog-illustration" />
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
          padding: 80px 0;
          background: linear-gradient(180deg, 
            var(--md-sys-color-surface) 0%, 
            rgba(148, 187, 233, 0.03) 100%
          );
          position: relative;
          overflow: hidden;
        }

        .blog-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 183, 77, 0.05) 0%, transparent 70%);
          border-radius: 50%;
        }

        .blog-section::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 95, 115, 0.03) 0%, transparent 70%);
          border-radius: 50%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 16px;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #FFB74D 0%, #FFA726 100%);
          border-radius: 2px;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--md-sys-color-on-surface-variant);
          max-width: 600px;
          margin: 20px auto 0;
          line-height: 1.6;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (min-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .blog-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 95, 115, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 95, 115, 0.06);
          position: relative;
        }

        .blog-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #005F73 0%, #0A8FA3 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .blog-card--secondary::before {
          background: linear-gradient(90deg, #FFB74D 0%, #FFA726 100%);
        }

        .blog-card--tertiary::before {
          background: linear-gradient(90deg, #94BBE9 0%, #7BA7E7 100%);
        }

        .blog-card:hover::before {
          opacity: 1;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 95, 115, 0.12);
          border-color: transparent;
        }

        .blog-card a {
          text-decoration: none;
          color: inherit;
        }

        .blog-image {
          position: relative;
          height: 220px;
          background: linear-gradient(135deg, 
            rgba(0, 95, 115, 0.03) 0%, 
            rgba(148, 187, 233, 0.06) 100%
          );
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blog-card--secondary .blog-image {
          background: linear-gradient(135deg, 
            rgba(255, 183, 77, 0.05) 0%, 
            rgba(255, 167, 38, 0.08) 100%
          );
        }

        .blog-card--tertiary .blog-image {
          background: linear-gradient(135deg, 
            rgba(148, 187, 233, 0.05) 0%, 
            rgba(123, 167, 231, 0.08) 100%
          );
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 20px;
        }

        .blog-illustration {
          width: 100%;
          height: 100%;
          max-width: 300px;
          opacity: 0.9;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card:hover .blog-illustration {
          transform: scale(1.05);
        }

        .category-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: white;
          color: #005F73;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 2;
        }

        .blog-card--secondary .category-badge {
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          color: white;
        }

        .blog-card--tertiary .category-badge {
          background: linear-gradient(135deg, #94BBE9 0%, #7BA7E7 100%);
          color: white;
        }

        .blog-content {
          padding: 28px;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          color: var(--md-sys-color-on-surface-variant);
          font-size: 0.875rem;
        }

        .blog-divider {
          opacity: 0.4;
        }

        .blog-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
          margin-bottom: 12px;
          line-height: 1.4;
          transition: color 0.3s;
        }

        .blog-card:hover .blog-title {
          color: #005F73;
        }

        .blog-excerpt {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 0.9375rem;
        }

        .blog-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #005F73;
          font-weight: 600;
          font-size: 0.9375rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
        }

        .blog-card--secondary .blog-link {
          color: #F57C00;
        }

        .blog-card--tertiary .blog-link {
          color: #5E92F3;
        }

        .blog-card:hover .blog-link {
          gap: 12px;
        }

        .section-footer {
          text-align: center;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
          color: white;
          border-radius: 28px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }

        .view-all-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 167, 38, 0.4);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .blog-section {
            padding: 60px 0;
          }

          .section-header {
            margin-bottom: 48px;
          }

          .section-title {
            font-size: 1.875rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .blog-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .blog-image {
            height: 180px;
          }

          .blog-content {
            padding: 20px;
          }

          .blog-title {
            font-size: 1.125rem;
          }

          .blog-excerpt {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </section>
  )
}

export { BlogSection }