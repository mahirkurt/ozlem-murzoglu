'use client'

import Link from 'next/link'

const blogPosts = [
  {
    id: '1',
    title: 'Çocuklarda Beslenme Alışkanlıkları',
    excerpt: 'Sağlıklı beslenme alışkanlıklarını erken yaşta kazandırmak için ipuçları...',
    date: '2024-01-15',
    category: 'Beslenme'
  },
  {
    id: '2',
    title: 'Mevsimsel Hastalıklardan Korunma',
    excerpt: 'Kış aylarında çocuklarınızı hastalıklardan korumak için alınması gereken önlemler...',
    date: '2024-01-10',
    category: 'Sağlık'
  },
  {
    id: '3',
    title: 'Çocuklarda Uyku Düzeni',
    excerpt: 'Kaliteli uyku için dikkat edilmesi gerekenler ve uyku problemlerinin çözümü...',
    date: '2024-01-05',
    category: 'Uyku'
  }
]

export default function BlogPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Blog</h1>
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="blog-card">
            <div className="blog-category">{post.category}</div>
            <h2 className="blog-title">{post.title}</h2>
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="blog-date">{new Date(post.date).toLocaleDateString('tr-TR')}</div>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 24px 48px;
          min-height: 100vh;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }
        .blog-card {
          display: block;
          padding: 24px;
          background: var(--md-sys-color-surface-container);
          border-radius: var(--md-sys-shape-corner-large);
          text-decoration: none;
          color: var(--md-sys-color-on-surface);
          transition: all var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
        }
        .blog-card:hover {
          background: var(--md-sys-color-surface-container-high);
          box-shadow: var(--md-sys-elevation-level2);
        }
        .blog-category {
          display: inline-block;
          padding: 4px 12px;
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          border-radius: var(--md-sys-shape-corner-full);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .blog-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .blog-excerpt {
          color: var(--md-sys-color-on-surface-variant);
          margin-bottom: 12px;
        }
        .blog-date {
          font-size: 12px;
          color: var(--md-sys-color-on-surface-variant);
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