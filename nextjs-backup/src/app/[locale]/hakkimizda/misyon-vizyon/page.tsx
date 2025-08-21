'use client'

export default function MisyonVizyonPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Misyon & Vizyon</h1>
      <div className="content">
        <section>
          <h2 className="md-sys-typescale-headline-large">Misyonumuz</h2>
          <p className="md-sys-typescale-body-large">
            Çocuklarınızın sağlıklı büyümesi ve gelişimi için en güncel tıbbi bilgi ve 
            teknolojileri kullanarak, sevgi dolu ve güvenilir bir ortamda hizmet vermek.
          </p>
        </section>
        <section>
          <h2 className="md-sys-typescale-headline-large">Vizyonumuz</h2>
          <p className="md-sys-typescale-body-large">
            Bölgemizde çocuk sağlığı alanında öncü ve güvenilir bir merkez olmak.
          </p>
        </section>
      </div>
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 24px 48px;
          min-height: 100vh;
        }
        .content {
          display: flex;
          flex-direction: column;
          gap: 48px;
          margin-top: 32px;
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