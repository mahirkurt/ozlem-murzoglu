export default function TriplePPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Triple P - Pozitif Ebeveynlik Programı</h1>
      <p className="md-sys-typescale-body-large">
        Triple P, dünya çapında kabul görmüş, kanıta dayalı bir ebeveynlik programıdır. 
        Çocuklarınızla daha sağlıklı ilişkiler kurmanıza yardımcı oluyoruz.
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