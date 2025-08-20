export default function AsilamaPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Aşılama Hizmetleri</h1>
      <p className="md-sys-typescale-body-large">
        Sağlık Bakanlığı aşı takvimine uygun olarak, çocuklarınızın tüm aşılarını 
        güvenli bir ortamda uyguluyoruz. Aşı takibi ve hatırlatma hizmeti de sunuyoruz.
      </p>
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 24px 48px;
          min-height: 100vh;
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