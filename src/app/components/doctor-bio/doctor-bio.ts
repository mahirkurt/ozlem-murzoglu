import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-bio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="doctor-bio-section">
      <div class="container">
        <div class="bio-content">
          <div class="doctor-image-wrapper">
            <img 
              src="/images/20221028_110409_3.jpg" 
              alt="Uzm. Dr. Özlem Murzoğlu" 
              class="doctor-image"
            />
            <div class="image-decoration"></div>
          </div>
          
          <div class="doctor-info">
            <h2 class="section-title">Uzm. Dr. Özlem Murzoğlu</h2>
            <p class="doctor-subtitle">Çocuk Sağlığı ve Hastalıkları Uzmanı</p>
            
            <div class="bio-text">
              <p>
                İstanbul Üniversitesi İstanbul Tıp Fakültesi'nden mezun olan Dr. Özlem Murzoğlu, 
                pediatri uzmanlık eğitimini Marmara Üniversitesi Tıp Fakültesi Çocuk Sağlığı ve 
                Hastalıkları Anabilim Dalı'nda tamamlamıştır.
              </p>
              
              <p>
                Aynı kurumda Sosyal Pediatri alanında doktora derecesini alan Dr. Murzoğlu, 
                eş zamanlı olarak Çocuk Gelişimi lisans eğitimini de tamamlayarak, çocuk sağlığına 
                bütüncül bir yaklaşım geliştirmiştir.
              </p>
              
              <p>
                Bright Futures® Sağlıklı Çocuk İzlemi, uyku danışmanlığı ve Triple P® Pozitif 
                Ebeveynlik Programı konularında uzmanlaşan Dr. Murzoğlu, Ataşehir'deki kliniğinde 
                ailelere kapsamlı pediatri hizmetleri sunmaktadır.
              </p>
            </div>
            
            <div class="qualifications">
              <div class="qualification-item">
                <span class="material-icons">school</span>
                <div>
                  <strong>Tıp Eğitimi</strong>
                  <span>İstanbul Üniversitesi İstanbul Tıp Fakültesi</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">medical_services</span>
                <div>
                  <strong>Uzmanlık</strong>
                  <span>Marmara Üniversitesi Çocuk Sağlığı ve Hastalıkları</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">psychology</span>
                <div>
                  <strong>Doktora</strong>
                  <span>Sosyal Pediatri</span>
                </div>
              </div>
              
              <div class="qualification-item">
                <span class="material-icons">child_care</span>
                <div>
                  <strong>Lisans</strong>
                  <span>Çocuk Gelişimi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .doctor-bio-section {
      padding: 80px 0;
      background: linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%);
      position: relative;
    }
    
    .bio-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 60px;
      align-items: center;
    }
    
    .doctor-image-wrapper {
      position: relative;
    }
    
    .doctor-image {
      width: 100%;
      max-width: 400px;
      height: auto;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 95, 115, 0.15);
      position: relative;
      z-index: 2;
    }
    
    .image-decoration {
      position: absolute;
      top: -20px;
      left: -20px;
      right: 20px;
      bottom: 20px;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
      border-radius: 20px;
      opacity: 0.1;
      z-index: 1;
    }
    
    .section-title {
      font-size: var(--font-size-3xl);
      color: var(--color-primary);
      margin-bottom: 8px;
      font-weight: 700;
    }
    
    .doctor-subtitle {
      font-size: var(--font-size-lg);
      color: var(--color-primary-light);
      margin-bottom: 30px;
      font-weight: 500;
    }
    
    .bio-text {
      margin-bottom: 40px;
    }
    
    .bio-text p {
      font-size: var(--font-size-base);
      color: var(--color-neutral-600);
      line-height: 1.8;
      margin-bottom: 20px;
    }
    
    .qualifications {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .qualification-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 95, 115, 0.08);
      transition: all 0.3s ease;
    }
    
    .qualification-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 95, 115, 0.12);
    }
    
    .qualification-item .material-icons {
      color: var(--color-primary);
      font-size: 24px;
      background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .qualification-item div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .qualification-item strong {
      font-size: 14px;
      color: var(--color-primary);
      font-weight: 600;
    }
    
    .qualification-item span {
      font-size: 13px;
      color: var(--color-neutral-600);
      line-height: 1.4;
    }
    
    @media (max-width: 768px) {
      .bio-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      
      .doctor-image-wrapper {
        max-width: 300px;
        margin: 0 auto;
      }
      
      .qualifications {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorBioComponent {}