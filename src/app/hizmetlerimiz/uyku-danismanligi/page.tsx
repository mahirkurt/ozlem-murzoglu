export default function UykuDanismanligiPage() {
  return (
    <div className="page-container">
      <h1 className="md-sys-typescale-display-medium">Uyku Danışmanlığı</h1>
      <p className="md-sys-typescale-body-large">
        Bebeğinizin ve çocuğunuzun sağlıklı uyku alışkanlıkları edinmesi için 
        profesyonel destek ve rehberlik hizmeti sunuyoruz.
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