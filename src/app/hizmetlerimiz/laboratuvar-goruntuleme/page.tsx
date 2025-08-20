export default function LaboratuvarGoruntelemePage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Laboratuvar ve Görüntüleme</h1>
      <p className="md-sys-typescale-body-large">
        Kliniğimizde temel laboratuvar testleri ve görüntüleme hizmetleri için 
        güvenilir merkezlerle işbirliği içinde çalışıyoruz.
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