'use client'

export default function KlinigimizPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Kliniğimiz</h1>
      <p className="md-sys-typescale-body-large">
        Modern ve hijyenik ortamımızda, çocuklarınızın sağlığı için en iyi hizmeti sunuyoruz.
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