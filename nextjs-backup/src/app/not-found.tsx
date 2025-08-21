'use client'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sayfa Bulunamadı</h2>
      <p style={{ marginBottom: '2rem' }}>Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <a href="/" style={{ 
        padding: '0.75rem 1.5rem', 
        backgroundColor: '#005F73', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '0.5rem' 
      }}>
        Ana Sayfaya Dön
      </a>
    </div>
  )
}