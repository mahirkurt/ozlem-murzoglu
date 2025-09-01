import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Document {
  id: string;
  title: string;
  fileName: string;
  filePath: string;
  category: string;
  description?: string;
  fileType: 'pdf' | 'docx';
  size?: string;
  lastModified?: Date;
}

export interface DocumentCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  documentCount: number;
  documents: Document[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private translate: TranslateService) {}

  getCategories(): DocumentCategory[] {
    return this.categories.map(cat => ({
      ...cat,
      title: this.translate.instant(`DOCUMENTS.CATEGORIES.${cat.id.toUpperCase().replace(/-/g, '_')}.TITLE`),
      description: this.translate.instant(`DOCUMENTS.CATEGORIES.${cat.id.toUpperCase().replace(/-/g, '_')}.DESCRIPTION`),
      documents: cat.documents.map(doc => ({
        ...doc,
        title: this.translate.instant(`DOCUMENTS.${cat.id.toUpperCase().replace(/-/g, '_')}.${doc.id.toUpperCase().replace(/-/g, '_')}.TITLE`),
        description: this.translate.instant(`DOCUMENTS.${cat.id.toUpperCase().replace(/-/g, '_')}.${doc.id.toUpperCase().replace(/-/g, '_')}.DESCRIPTION`)
      }))
    }));
  }

  private categories: DocumentCategory[] = [
    {
      id: 'aile-medya-plani',
      title: 'Aile Medya Planı',
      description: 'Dijital medya kullanımı için aile rehberleri ve planları',
      icon: 'devices',
      color: '#4285F4',
      documentCount: 10,
      documents: [
        {
          id: 'medya-dengesi',
          title: 'Medya Dengesi',
          fileName: 'Aile Medya Planı [1] - Medya Dengesi.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [1] - Medya Dengesi.docx',
          category: 'aile-medya-plani',
          description: 'Medya kullanımında denge kurma rehberi',
          fileType: 'docx'
        },
        {
          id: 'medya-hakkinda-konusmak',
          title: 'Medya Hakkında Konuşmak',
          fileName: 'Aile Medya Planı [2] - Medya Hakkında Konuşmak.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [2] - Medya Hakkında Konuşmak.docx',
          category: 'aile-medya-plani',
          description: 'Çocuklarla medya kullanımı hakkında konuşma rehberi',
          fileType: 'docx'
        },
        {
          id: 'nezaket-empati',
          title: 'Nezaket ve Empati',
          fileName: 'Aile Medya Planı [3] - Nezaket ve Empati.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [3] - Nezaket ve Empati.docx',
          category: 'aile-medya-plani',
          description: 'Dijital ortamda nezaket ve empati geliştirme',
          fileType: 'docx'
        },
        {
          id: 'dijital-gizlilik-guvenlik',
          title: 'Dijital Gizlilik ve Güvenlik',
          fileName: 'Aile Medya Planı [4] - Dijital Gizlilik ve Güvenlik.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [4] - Dijital Gizlilik ve Güvenlik.docx',
          category: 'aile-medya-plani',
          description: 'Online güvenlik ve gizlilik korunma yöntemleri',
          fileType: 'docx'
        },
        {
          id: 'ekransiz-bolgeler',
          title: 'Ekransız Bölgeler',
          fileName: 'Aile Medya Planı [5] - Ekransız Bölgeler.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [5] - Ekransız Bölgeler.docx',
          category: 'aile-medya-plani',
          description: 'Evde ekransız alanlar oluşturma rehberi',
          fileType: 'docx'
        },
        {
          id: 'ekransiz-zamanlar',
          title: 'Ekransız Zamanlar',
          fileName: 'Aile Medya Planı [6] - Ekransız Zamanlar.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [6] - Ekransız Zamanlar.docx',
          category: 'aile-medya-plani',
          description: 'Ekransız zaman dilimi planlama kılavuzu',
          fileType: 'docx'
        },
        {
          id: 'iyi-icerik-secme',
          title: 'İyi İçerik Seçme',
          fileName: 'Aile Medya Planı [7] - İyi İçerik Seçme.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [7] - İyi İçerik Seçme.docx',
          category: 'aile-medya-plani',
          description: 'Kaliteli medya içeriği seçme kriterleri',
          fileType: 'docx'
        },
        {
          id: 'medyayi-birlikte-kullanma',
          title: 'Medyayı Birlikte Kullanma',
          fileName: 'Aile Medya Planı [8] - Medyayı Birlikte Kullanma.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı [8] - Medyayı Birlikte Kullanma.docx',
          category: 'aile-medya-plani',
          description: 'Aile bireylerinin medyayı birlikte kullanımı',
          fileType: 'docx'
        },
        {
          id: 'medya-plani-sablon',
          title: 'Aile Medya Planı Şablon',
          fileName: 'Aile Medya Planı Şablon.docx',
          filePath: '/documents/Aile Medya Planı/Aile Medya Planı Şablon.docx',
          category: 'aile-medya-plani',
          description: 'Kendi medya planınızı oluşturabileceğiniz şablon',
          fileType: 'docx'
        },
        {
          id: 'aile-rehberi',
          title: 'Medya Kullanımına Yönelik Aile Rehberi',
          fileName: 'Medya Kullanımına Yönelik Aile Rehberi.docx',
          filePath: '/documents/Aile Medya Planı/Medya Kullanımına Yönelik Aile Rehberi.docx',
          category: 'aile-medya-plani',
          description: 'Kapsamlı aile medya kullanım rehberi',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'asilar',
      title: 'Aşılar',
      description: 'Çocukluk çağı aşıları hakkında bilgi föyleri',
      icon: 'medical_services',
      color: '#34A853',
      documentCount: 7,
      documents: [
        {
          id: 'hpv-asisi',
          title: 'HPV Aşısı',
          fileName: 'HPV Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/HPV Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Human Papillomavirus aşısı bilgi föyü',
          fileType: 'docx'
        },
        {
          id: 'kkk-asisi',
          title: 'KKK Aşısı',
          fileName: 'KKK Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/KKK Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Kızamık-Kabakulak-Kızamıkçık aşısı bilgisi',
          fileType: 'docx'
        },
        {
          id: 'kkks-asisi',
          title: 'KKKS Aşısı',
          fileName: 'KKKS Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/KKKS Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Kızamık-Kabakulak-Kızamıkçık-Su Çiçeği aşısı',
          fileType: 'docx'
        },
        {
          id: 'meningokok-acwy',
          title: 'Meningokok ACWY Aşısı',
          fileName: 'Meningokok ACWY Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/Meningokok ACWY Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Meningokok ACWY serotipleri aşısı bilgisi',
          fileType: 'docx'
        },
        {
          id: 'meningokok-b',
          title: 'Meningokok B Aşısı',
          fileName: 'Meningokok B Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/Meningokok B Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Meningokok B serotipi aşısı bilgisi',
          fileType: 'docx'
        },
        {
          id: 'rotavirus-asisi',
          title: 'Rotavirüs Aşısı',
          fileName: 'Rotavirüs Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/Rotavirüs Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Rotavirüs gastroenteriti aşısı bilgisi',
          fileType: 'docx'
        },
        {
          id: 'influenza-asisi',
          title: 'İnfluenza Aşısı',
          fileName: 'İnfluenza Aşısı Bilgi Föyü.docx',
          filePath: '/documents/Aşılar/İnfluenza Aşısı Bilgi Föyü.docx',
          category: 'asilar',
          description: 'Grip aşısı bilgi föyü',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'bright-futures-aile',
      title: 'Bright Futures - Aile Rehberi',
      description: 'Yaş gruplarına göre aile rehberleri (1 ay - 15 yaş)',
      icon: 'family_restroom',
      color: '#FF9800',
      documentCount: 23,
      documents: [
        {
          id: 'bf-aile-1ay',
          title: '1. Ay - Aile İçin Bilgiler',
          fileName: '1. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/1. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '1 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-2ay',
          title: '2. Ay - Aile İçin Bilgiler',
          fileName: '2. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/2. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '2 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-4ay',
          title: '4. Ay - Aile İçin Bilgiler',
          fileName: '4. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/4. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '4 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-6ay',
          title: '6. Ay - Aile İçin Bilgiler',
          fileName: '6. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/6. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '6 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-7ay',
          title: '7. Ay - Aile İçin Bilgiler',
          fileName: '7. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/7. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '7 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-9ay',
          title: '9. Ay - Aile İçin Bilgiler',
          fileName: '9. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/9. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '9 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-12ay',
          title: '12. Ay - Aile İçin Bilgiler',
          fileName: '12. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/12. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '12 aylık bebek gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-15ay',
          title: '15. Ay - Aile İçin Bilgiler',
          fileName: '15. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/15. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '15 aylık çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-18ay',
          title: '18. Ay - Aile İçin Bilgiler',
          fileName: '18. Ay - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/18. Ay - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '18 aylık çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-2yas',
          title: '2. Yaş - Aile İçin Bilgiler',
          fileName: '2. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/2. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '2 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-2-5yas',
          title: '2½ Yaş - Aile İçin Bilgiler',
          fileName: '2½ Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/2½ Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '2.5 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-3yas',
          title: '3. Yaş - Aile İçin Bilgiler',
          fileName: '3. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/3. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '3 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-4yas',
          title: '4. Yaş - Aile İçin Bilgiler',
          fileName: '4. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/4. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '4 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-5yas',
          title: '5. Yaş - Aile İçin Bilgiler',
          fileName: '5. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/5. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '5 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-6yas',
          title: '6. Yaş - Aile İçin Bilgiler',
          fileName: '6. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/6. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '6 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-7yas',
          title: '7. Yaş - Aile İçin Bilgiler',
          fileName: '7. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/7. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '7 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-8yas',
          title: '8. Yaş - Aile İçin Bilgiler',
          fileName: '8. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/8. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '8 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-9yas',
          title: '9. Yaş - Aile İçin Bilgiler',
          fileName: '9. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/9. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '9 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-10yas',
          title: '10. Yaş - Aile İçin Bilgiler',
          fileName: '10. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/10. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '10 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-11yas',
          title: '11. Yaş - Aile İçin Bilgiler',
          fileName: '11. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/11. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '11 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-12yas',
          title: '12. Yaş - Aile İçin Bilgiler',
          fileName: '12. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/12. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '12 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-14yas',
          title: '14. Yaş - Aile İçin Bilgiler',
          fileName: '14. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/14. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '14 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-aile-15yas',
          title: '15. Yaş - Aile İçin Bilgiler',
          fileName: '15. Yaş - Aile İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Aile)/15. Yaş - Aile İçin Bilgiler.docx',
          category: 'bright-futures-aile',
          description: '15 yaş çocuk gelişimi ve bakımı rehberi',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'bright-futures-cocuk',
      title: 'Bright Futures - Çocuk Rehberi',
      description: 'Yaş gruplarına göre çocuk rehberleri (7-17 yaş)',
      icon: 'child_care',
      color: '#E91E63',
      documentCount: 13,
      documents: [
        {
          id: 'bf-cocuk-7yas',
          title: '7. Yaş - Çocuk İçin Bilgiler',
          fileName: '7. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/7. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '7 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-8yas',
          title: '8. Yaş - Çocuk İçin Bilgiler',
          fileName: '8. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/8. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '8 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-9yas',
          title: '9. Yaş - Çocuk İçin Bilgiler',
          fileName: '9. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/9. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '9 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-10yas',
          title: '10. Yaş - Çocuk İçin Bilgiler',
          fileName: '10. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/10. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '10 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-11yas',
          title: '11. Yaş - Çocuk İçin Bilgiler',
          fileName: '11. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/11. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '11 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-12yas',
          title: '12. Yaş - Çocuk İçin Bilgiler',
          fileName: '12. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/12. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '12 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-13yas',
          title: '13. Yaş - Çocuk İçin Bilgiler',
          fileName: '13. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/13. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '13 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-14yas',
          title: '14. Yaş - Çocuk İçin Bilgiler',
          fileName: '14. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/14. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '14 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-15yas',
          title: '15. Yaş - Çocuk İçin Bilgiler',
          fileName: '15. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/15. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '15 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bf-cocuk-17yas',
          title: '17. Yaş - Çocuk İçin Bilgiler',
          fileName: '17. Yaş - Çocuk İçin Bilgiler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/17. Yaş - Çocuk İçin Bilgiler.docx',
          category: 'bright-futures-cocuk',
          description: '17 yaş çocuklar için gelişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'akne-bilgiler',
          title: 'Akne Hakkında Bilmen Gerekenler',
          fileName: 'Akne Hakkında Bilmen Gerekenler.docx',
          filePath: '/documents/Bright Futures (Çocuk)/Akne Hakkında Bilmen Gerekenler.docx',
          category: 'bright-futures-cocuk',
          description: 'Ergenlik döneminde akne ile başa çıkma rehberi',
          fileType: 'docx'
        },
        {
          id: 'ergenlik-donemi',
          title: 'Ergenlik Dönemi - Büyük Değişimlere Hazır Ol',
          fileName: 'Ergenlik Dönemi - Büyük Değişimlere Hazır Ol.docx',
          filePath: '/documents/Bright Futures (Çocuk)/Ergenlik Dönemi - Büyük Değişimlere Hazır Ol.docx',
          category: 'bright-futures-cocuk',
          description: 'Ergenlik dönemi değişimleri rehberi',
          fileType: 'docx'
        },
        {
          id: 'doktor-mektup',
          title: 'Genç Ergene Doktorundan Mektup',
          fileName: 'Genç Ergene Doktorundan Mektup.docx',
          filePath: '/documents/Bright Futures (Çocuk)/Genç Ergene Doktorundan Mektup.docx',
          category: 'bright-futures-cocuk',
          description: 'Ergenlere yönelik doktor mektubu',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'cdc-buyume-egrileri',
      title: 'CDC Büyüme Eğrileri',
      description: 'CDC standartlarına göre büyüme grafikleri',
      icon: 'trending_up',
      color: '#9C27B0',
      documentCount: 5,
      documents: [
        {
          id: 'cdc-erkek-0-3',
          title: 'Büyüme Eğrileri - Erkekler (0-3 Yaş)',
          fileName: 'Büyüme Eğrileri - Erkekler (0-3 Yaş).pdf',
          filePath: '/documents/CDC Büyüme Eğrileri/Büyüme Eğrileri - Erkekler (0-3 Yaş).pdf',
          category: 'cdc-buyume-egrileri',
          description: '0-3 yaş erkek çocuklar için büyüme eğrileri',
          fileType: 'pdf'
        },
        {
          id: 'cdc-erkek-2-20',
          title: 'Büyüme Eğrileri - Erkekler (2-20 Yaş)',
          fileName: 'Büyüme Eğrileri - Erkekler (2-20 Yaş).pdf',
          filePath: '/documents/CDC Büyüme Eğrileri/Büyüme Eğrileri - Erkekler (2-20 Yaş).pdf',
          category: 'cdc-buyume-egrileri',
          description: '2-20 yaş erkek çocuklar için büyüme eğrileri',
          fileType: 'pdf'
        },
        {
          id: 'cdc-kiz-0-3',
          title: 'Büyüme Eğrileri - Kızlar (0-3 Yaş)',
          fileName: 'Büyüme Eğrileri - Kızlar (0-3 Yaş).pdf',
          filePath: '/documents/CDC Büyüme Eğrileri/Büyüme Eğrileri - Kızlar (0-3 Yaş).pdf',
          category: 'cdc-buyume-egrileri',
          description: '0-3 yaş kız çocuklar için büyüme eğrileri',
          fileType: 'pdf'
        },
        {
          id: 'cdc-kiz-2-20',
          title: 'Büyüme Eğrileri - Kızlar (2-20 Yaş)',
          fileName: 'Büyüme Eğrileri - Kızlar (2-20 Yaş).pdf',
          filePath: '/documents/CDC Büyüme Eğrileri/Büyüme Eğrileri - Kızlar (2-20 Yaş).pdf',
          category: 'cdc-buyume-egrileri',
          description: '2-20 yaş kız çocuklar için büyüme eğrileri',
          fileType: 'pdf'
        },
        {
          id: 'cdc-growth-charts',
          title: 'CDC Growth Charts',
          fileName: 'CDC Growth Charts.pdf',
          filePath: '/documents/CDC Büyüme Eğrileri/CDC Growth Charts.pdf',
          category: 'cdc-buyume-egrileri',
          description: 'Tam CDC büyüme eğrileri koleksiyonu',
          fileType: 'pdf'
        }
      ]
    },
    {
      id: 'gebelik-donemi',
      title: 'Gebelik Dönemi',
      description: 'Hamilelik ve doğum öncesi hazırlık rehberleri',
      icon: 'pregnant_woman',
      color: '#607D8B',
      documentCount: 5,
      documents: [
        {
          id: 'besik-guvenligi',
          title: 'Bebek Beşiği Güvenliği',
          fileName: 'Bebek Beşiği Güvenliği.docx',
          filePath: '/documents/Gebelik Dönemi/Bebek Beşiği Güvenliği.docx',
          category: 'gebelik-donemi',
          description: 'Güvenli bebek beşiği seçimi ve kullanımı',
          fileType: 'docx'
        },
        {
          id: 'bebek-odasi-guvenligi',
          title: 'Bebek Odası Güvenliği',
          fileName: 'Bebek Odası Güvenliği.docx',
          filePath: '/documents/Gebelik Dönemi/Bebek Odası Güvenliği.docx',
          category: 'gebelik-donemi',
          description: 'Güvenli bebek odası hazırlama rehberi',
          fileType: 'docx'
        },
        {
          id: 'emzirme-hazirlik',
          title: 'Doğum Öncesi Emzirmeye Hazırlık',
          fileName: 'Doğum Öncesi Emzirmeye Hazırlık.docx',
          filePath: '/documents/Gebelik Dönemi/Doğum Öncesi Emzirmeye Hazırlık.docx',
          category: 'gebelik-donemi',
          description: 'Emzirme öncesi hazırlık rehberi',
          fileType: 'docx'
        },
        {
          id: 'gebelikte-beslenme',
          title: 'Gebelikte Sağlıklı Beslenme Kılavuzu',
          fileName: 'Gebelikte Sağlıklı Beslenme Kılavuzu.docx',
          filePath: '/documents/Gebelik Dönemi/Gebelikte Sağlıklı Beslenme Kılavuzu.docx',
          category: 'gebelik-donemi',
          description: 'Hamilelik döneminde beslenme rehberi',
          fileType: 'docx'
        },
        {
          id: 'mama-taburesi',
          title: 'Mama Taburesi Kılavuzu',
          fileName: 'Mama Taburesi Kılavuzu.docx',
          filePath: '/documents/Gebelik Dönemi/Mama Taburesi Kılavuzu.docx',
          category: 'gebelik-donemi',
          description: 'Mama taburesi seçimi ve kullanım kılavuzu',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'gelisim-rehberleri',
      title: 'Gelişim Rehberleri',
      description: 'Çocuk gelişimi takibi ve destekleme kılavuzları',
      icon: 'psychology',
      color: '#795548',
      documentCount: 14,
      documents: [
        {
          id: 'gelisim-1yas-oneriler',
          title: '1 Yaş Gelişimsel Öneriler',
          fileName: '1 yaş Gelişimsel öneriler.docx',
          filePath: '/documents/Gelişim Rehberleri/1 yaş Gelişimsel öneriler.docx',
          category: 'gelisim-rehberleri',
          description: '1 yaş çocuk gelişimi için öneriler',
          fileType: 'docx'
        },
        {
          id: 'gelisim-4yas-oneriler',
          title: '4 Yaş Gelişimsel Öneriler',
          fileName: '4 Yaş Gelişimsel Öneriler.docx',
          filePath: '/documents/Gelişim Rehberleri/4 Yaş Gelişimsel Öneriler.docx',
          category: 'gelisim-rehberleri',
          description: '4 yaş çocuk gelişimi için öneriler',
          fileType: 'docx'
        },
        {
          id: 'gelisim-5yas-oneriler',
          title: '5 Yaş Gelişimsel Öneriler',
          fileName: '5 Yaş Gelişimsel Öneriler.docx',
          filePath: '/documents/Gelişim Rehberleri/5 Yaş Gelişimsel Öneriler.docx',
          category: 'gelisim-rehberleri',
          description: '5 yaş çocuk gelişimi için öneriler',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-2ay',
          title: 'Gelişim Basamakları - 2. Ay',
          fileName: 'Gelişim Basamakları - 2. Ay.docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 2. Ay.docx',
          category: 'gelisim-rehberleri',
          description: '2 aylık bebek gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-2ay-yeni',
          title: 'Gelişim Basamakları - 2. Ay (Yeni)',
          fileName: 'Gelişim Basamakları - 2. Ay (Yeni).docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 2. Ay (Yeni).docx',
          category: 'gelisim-rehberleri',
          description: '2 aylık bebek gelişim basamakları (güncellenmiş)',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-4ay',
          title: 'Gelişim Basamakları - 4. Ay',
          fileName: 'Gelişim Basamakları - 4. Ay.docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 4. Ay.docx',
          category: 'gelisim-rehberleri',
          description: '4 aylık bebek gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-4ay-yeni',
          title: 'Gelişim Basamakları - 4. Ay (Yeni)',
          fileName: 'Gelişim Basamakları - 4. Ay (Yeni).docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 4. Ay (Yeni).docx',
          category: 'gelisim-rehberleri',
          description: '4 aylık bebek gelişim basamakları (güncellenmiş)',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-6ay',
          title: 'Gelişim Basamakları - 6. Ay',
          fileName: 'Gelişim Basamakları - 6. Ay.docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 6. Ay.docx',
          category: 'gelisim-rehberleri',
          description: '6 aylık bebek gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-6ay-yeni',
          title: 'Gelişim Basamakları - 6. Ay (Yeni)',
          fileName: 'Gelişim Basamakları - 6. Ay (Yeni).docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 6. Ay (Yeni).docx',
          category: 'gelisim-rehberleri',
          description: '6 aylık bebek gelişim basamakları (güncellenmiş)',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-9ay',
          title: 'Gelişim Basamakları - 9. Ay',
          fileName: 'Gelişim Basamakları - 9. Ay .docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 9. Ay .docx',
          category: 'gelisim-rehberleri',
          description: '9 aylık bebek gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-12ay',
          title: 'Gelişim Basamakları - 12. Ay',
          fileName: 'Gelişim Basamakları - 12. Ay .docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 12. Ay .docx',
          category: 'gelisim-rehberleri',
          description: '12 aylık bebek gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-basamaklari-4yas',
          title: 'Gelişim Basamakları - 4. Yaş',
          fileName: 'Gelişim Basamakları - 4. Yaş .docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim Basamakları - 4. Yaş .docx',
          category: 'gelisim-rehberleri',
          description: '4 yaş çocuk gelişim basamakları',
          fileType: 'docx'
        },
        {
          id: 'gelisim-ipuclari-4yas',
          title: 'Gelişim İpuçları ve Etkinlikleri - 4. Yaş',
          fileName: 'Gelişim İpuçları ve Etkinlikleri - 4. Yaş .docx',
          filePath: '/documents/Gelişim Rehberleri/Gelişim İpuçları ve Etkinlikleri - 4. Yaş .docx',
          category: 'gelisim-rehberleri',
          description: '4 yaş gelişim destekleyici etkinlikler',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'genel-bilgiler',
      title: 'Genel Bilgiler',
      description: 'Çocuk bakımı, güvenlik ve sağlık konularında genel rehberler',
      icon: 'info',
      color: '#3F51B5',
      documentCount: 28,
      documents: [
        {
          id: 'uyku-onerileri-6-8ay',
          title: '6-8 Ay için Uyku Önerileri',
          fileName: '6-8 Ay için Uyku Önerileri.docx',
          filePath: '/documents/Genel Bilgiler/6-8 Ay için Uyku Önerileri.docx',
          category: 'genel-bilgiler',
          description: '6-8 aylık bebekler için uyku rehberi',
          fileType: 'docx'
        },
        {
          id: 'alkol-emzirme',
          title: 'Alkol Kullanımı ve Emzirme',
          fileName: 'Alkol Kullanımı ve Emzirme.docx',
          filePath: '/documents/Genel Bilgiler/Alkol Kullanımı ve Emzirme.docx',
          category: 'genel-bilgiler',
          description: 'Emzirme döneminde alkol kullanımı hakkında bilgiler',
          fileType: 'docx'
        },
        {
          id: 'araba-guvenlik-koltugu',
          title: 'Araba Güvenlik Koltukları',
          fileName: 'Araba Güvenlik Koltukları.docx',
          filePath: '/documents/Genel Bilgiler/Araba Güvenlik Koltukları.docx',
          category: 'genel-bilgiler',
          description: 'Çocuk araba koltuğu seçimi ve kullanımı',
          fileType: 'docx'
        },
        {
          id: 'aglayan-bebek-kolik',
          title: 'Ağlayan Bebek ve Kolik',
          fileName: 'Ağlayan Bebek ve Kolik.docx',
          filePath: '/documents/Genel Bilgiler/Ağlayan Bebek ve Kolik.docx',
          category: 'genel-bilgiler',
          description: 'Bebek ağlaması ve kolik ile başa çıkma',
          fileType: 'docx'
        },
        {
          id: 'saglikli-beslenme',
          title: 'Bebekler ve Küçük Çocuklarda Sağlıklı Beslenme',
          fileName: 'Bebekler ve Küçük Çocuklarda Sağlıklı Beslenme.docx',
          filePath: '/documents/Genel Bilgiler/Bebekler ve Küçük Çocuklarda Sağlıklı Beslenme.docx',
          category: 'genel-bilgiler',
          description: 'Bebek ve çocuk beslenme rehberi',
          fileType: 'docx'
        },
        {
          id: 'dusmeleri-onleme',
          title: 'Bebeklerde Düşmeleri Önleme',
          fileName: 'Bebeklerde Düşmeleri Önleme.docx',
          filePath: '/documents/Genel Bilgiler/Bebeklerde Düşmeleri Önleme.docx',
          category: 'genel-bilgiler',
          description: 'Bebek düşme kazalarını önleme rehberi',
          fileType: 'docx'
        },
        {
          id: 'bogulma-onleme',
          title: 'Bebeklerde ve Çocuklarda Boğulmaları Önleme ve İlk Yardım',
          fileName: 'Bebeklerde ve Çocuklarda Boğulmaları Önleme ve İlk Yardım.docx',
          filePath: '/documents/Genel Bilgiler/Bebeklerde ve Çocuklarda Boğulmaları Önleme ve İlk Yardım.docx',
          category: 'genel-bilgiler',
          description: 'Boğulma kazalarını önleme ve ilk yardım',
          fileType: 'docx'
        },
        {
          id: 'bebeginizi-emzirmek',
          title: 'Bebeğinizi Emzirmek',
          fileName: 'Bebeğinizi Emzirmek.docx',
          filePath: '/documents/Genel Bilgiler/Bebeğinizi Emzirmek.docx',
          category: 'genel-bilgiler',
          description: 'Temel emzirme rehberi',
          fileType: 'docx'
        },
        {
          id: 'beslenme-guvenligi',
          title: 'Beslenme Güvenliği',
          fileName: 'Beslenme Güvenliği.docx',
          filePath: '/documents/Genel Bilgiler/Beslenme Güvenliği.docx',
          category: 'genel-bilgiler',
          description: 'Gıda güvenliği ve hijyen rehberi',
          fileType: 'docx'
        },
        {
          id: 'ergen-iletisim',
          title: 'Bir Ergenle İletişim Kurmanın Yolları',
          fileName: 'Bir Ergenle İletişim Kurmanın Yolları.docx',
          filePath: '/documents/Genel Bilgiler/Bir Ergenle İletişim Kurmanın Yolları.docx',
          category: 'genel-bilgiler',
          description: 'Ergenlerle etkili iletişim rehberi',
          fileType: 'docx'
        },
        {
          id: 'bocek-kovucular',
          title: 'Böcek Kovucular',
          fileName: 'Böcek Kovucular.docx',
          filePath: '/documents/Genel Bilgiler/Böcek Kovucular.docx',
          category: 'genel-bilgiler',
          description: 'Güvenli böcek kovucu kullanımı',
          fileType: 'docx'
        },
        {
          id: 'dis-cikarma',
          title: 'Diş Çıkarma Süreci',
          fileName: 'Diş Çıkarma Süreci.docx',
          filePath: '/documents/Genel Bilgiler/Diş Çıkarma Süreci.docx',
          category: 'genel-bilgiler',
          description: 'Bebeklerde diş çıkarma döneminde yapılacaklar',
          fileType: 'docx'
        },
        {
          id: 'emzik-birakma-ipuclari',
          title: 'Emzik Bırakma İpuçları',
          fileName: 'Emzik Bırakma İpuçları.docx',
          filePath: '/documents/Genel Bilgiler/Emzik Bırakma İpuçları.docx',
          category: 'genel-bilgiler',
          description: 'Emzik bırakma süreci için ipuçları',
          fileType: 'docx'
        },
        {
          id: 'emzik-birakma',
          title: 'Emzik Bırakma',
          fileName: 'Emzik Bırakma.docx',
          filePath: '/documents/Genel Bilgiler/Emzik Bırakma.docx',
          category: 'genel-bilgiler',
          description: 'Emzik bırakma rehberi',
          fileType: 'docx'
        },
        {
          id: 'emzirme-sut-saklama',
          title: 'Emzirme İpuçları - Süt Saklama',
          fileName: 'Emzirme İpuçları - Süt Saklama.docx',
          filePath: '/documents/Genel Bilgiler/Emzirme İpuçları - Süt Saklama.docx',
          category: 'genel-bilgiler',
          description: 'Anne sütü saklama ve muhafaza yöntemleri',
          fileType: 'docx'
        },
        {
          id: 'emzirme-yerlesme-kavrama',
          title: 'Emzirme İpuçları - Yerleşme ve Kavrama',
          fileName: 'Emzirme İpuçları - Yerleşme ve Kavrama.docx',
          filePath: '/documents/Genel Bilgiler/Emzirme İpuçları - Yerleşme ve Kavrama.docx',
          category: 'genel-bilgiler',
          description: 'Doğru emzirme pozisyonu ve tekniği',
          fileType: 'docx'
        },
        {
          id: 'ergenlik-aile-tavsiyeleri',
          title: 'Ergenlik Dönemi için Ailelere Tavsiyeler',
          fileName: 'Ergenlik Dönemi için Ailelere Tavsiyeler.docx',
          filePath: '/documents/Genel Bilgiler/Ergenlik Dönemi için Ailelere Tavsiyeler.docx',
          category: 'genel-bilgiler',
          description: 'Ergenlik döneminde aile rehberi',
          fileType: 'docx'
        },
        {
          id: 'guvenli-uyku',
          title: 'Güvenli Uyku ve Bebeğiniz - Ani Bebek Ölümü Sendromu',
          fileName: 'Güvenli Uyku ve Bebeğiniz - Ani Bebek Ölümü Sendromu.docx',
          filePath: '/documents/Genel Bilgiler/Güvenli Uyku ve Bebeğiniz - Ani Bebek Ölümü Sendromu.docx',
          category: 'genel-bilgiler',
          description: 'Güvenli bebek uyku koşulları',
          fileType: 'docx'
        },
        {
          id: 'siber-zorbalik',
          title: 'Siber Zorbalık',
          fileName: 'Siber Zorbalık.docx',
          filePath: '/documents/Genel Bilgiler/Siber Zorbalık.docx',
          category: 'genel-bilgiler',
          description: 'Dijital zorbalık ile mücadele rehberi',
          fileType: 'docx'
        },
        {
          id: 'tuvalet-egitimi',
          title: 'Tuvalet Eğitimi',
          fileName: 'Tuvalet Eğitimi.docx',
          filePath: '/documents/Genel Bilgiler/Tuvalet Eğitimi.docx',
          category: 'genel-bilgiler',
          description: 'Çocuk tuvalet eğitimi rehberi',
          fileType: 'docx'
        },
        {
          id: 'yangin-guvenligi',
          title: 'Yangın Güvenliği ve Yanıklardan Korunma',
          fileName: 'Yangın Güvenliği ve Yanıklardan Korunma.docx',
          filePath: '/documents/Genel Bilgiler/Yangın Güvenliği ve Yanıklardan Korunma.docx',
          category: 'genel-bilgiler',
          description: 'Yangın güvenliği ve yanık önleme',
          fileType: 'docx'
        },
        {
          id: 'yenidogan-sunneti',
          title: 'Yenidoğan Sünneti',
          fileName: 'Yenidoğan Sünneti.docx',
          filePath: '/documents/Genel Bilgiler/Yenidoğan Sünneti.docx',
          category: 'genel-bilgiler',
          description: 'Yenidoğan sünnet işlemi hakkında bilgiler',
          fileType: 'docx'
        },
        {
          id: 'cocuklar-arasi-zorbalik',
          title: 'Çocuklar Arası Zorbalık',
          fileName: 'Çocuklar Arası Zorbalık.docx',
          filePath: '/documents/Genel Bilgiler/Çocuklar Arası Zorbalık.docx',
          category: 'genel-bilgiler',
          description: 'Okul çağı zorbalık ile başa çıkma',
          fileType: 'docx'
        },
        {
          id: 'ev-guvenligi',
          title: 'Çocuklar için Ev Güvenliği',
          fileName: 'Çocuklar için Ev Güvenliği.docx',
          filePath: '/documents/Genel Bilgiler/Çocuklar için Ev Güvenliği.docx',
          category: 'genel-bilgiler',
          description: 'Evde çocuk güvenlik önlemleri',
          fileType: 'docx'
        },
        {
          id: 'giysi-guvenligi',
          title: 'Çocuklar için Giysi Güvenliği',
          fileName: 'Çocuklar için Giysi Güvenliği.docx',
          filePath: '/documents/Genel Bilgiler/Çocuklar için Giysi Güvenliği.docx',
          category: 'genel-bilgiler',
          description: 'Güvenli çocuk giyim seçimi',
          fileType: 'docx'
        },
        {
          id: 'agiz-dis-sagligi',
          title: 'Çocuğunuzun Ağız ve Diş Sağlığı Hakkında Bilmeniz Gerekenler',
          fileName: 'Çocuğunuzun Ağız ve Diş Sağlığı Hakkında Bilmeniz Gerekenler.docx',
          filePath: '/documents/Genel Bilgiler/Çocuğunuzun Ağız ve Diş Sağlığı Hakkında Bilmeniz Gerekenler.docx',
          category: 'genel-bilgiler',
          description: 'Çocuk diş bakımı ve ağız sağlığı',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'hastaliklar',
      title: 'Hastalıklar',
      description: 'Çocukluk çağı hastalıkları ve tedavi rehberleri',
      icon: 'local_hospital',
      color: '#F44336',
      documentCount: 9,
      documents: [
        {
          id: 'antibiyotikler',
          title: 'Antibiyotikler',
          fileName: 'Antibiyotikler.docx',
          filePath: '/documents/Hastalıklar/Antibiyotikler.docx',
          category: 'hastaliklar',
          description: 'Antibiyotik kullanımı hakkında bilgiler',
          fileType: 'docx'
        },
        {
          id: 'astim-ataklari',
          title: 'Astım Ataklarından Korunma',
          fileName: 'Astım Ataklarından Korunma.docx',
          filePath: '/documents/Hastalıklar/Astım Ataklarından Korunma.docx',
          category: 'hastaliklar',
          description: 'Astım atak önleme stratejileri',
          fileType: 'docx'
        },
        {
          id: 'bademcik-iltihabu',
          title: 'Bademcik İltihabı',
          fileName: 'Bademcik İltihabı.docx',
          filePath: '/documents/Hastalıklar/Bademcik İltihabı.docx',
          category: 'hastaliklar',
          description: 'Tonsillit belirtileri ve tedavisi',
          fileType: 'docx'
        },
        {
          id: 'orta-kulak-iltihabu',
          title: 'Orta Kulak İltihabı',
          fileName: 'Orta Kulak İltihabı.docx',
          filePath: '/documents/Hastalıklar/Orta Kulak İltihabı.docx',
          category: 'hastaliklar',
          description: 'Otitis media belirtileri ve tedavisi',
          fileType: 'docx'
        },
        {
          id: 'pisikler',
          title: 'Pişikler',
          fileName: 'Pişikler.docx',
          filePath: '/documents/Hastalıklar/Pişikler.docx',
          category: 'hastaliklar',
          description: 'Bebek pişik önleme ve tedavisi',
          fileType: 'docx'
        },
        {
          id: 'sinuzit',
          title: 'Sinüzit',
          fileName: 'Sinüzit.docx',
          filePath: '/documents/Hastalıklar/Sinüzit.docx',
          category: 'hastaliklar',
          description: 'Çocuklarda sinüzit belirtileri ve tedavisi',
          fileType: 'docx'
        },
        {
          id: 'yenidogan-sariligi',
          title: 'Yenidoğan Sarılığı',
          fileName: 'Yenidoğan Sarılığı.docx',
          filePath: '/documents/Hastalıklar/Yenidoğan Sarılığı.docx',
          category: 'hastaliklar',
          description: 'Neonatal jaundice bilgileri',
          fileType: 'docx'
        },
        {
          id: 'cocuklarda-ates',
          title: 'Çocuklarda Ateş',
          fileName: 'Çocuklarda Ateş.docx',
          filePath: '/documents/Hastalıklar/Çocuklarda Ateş.docx',
          category: 'hastaliklar',
          description: 'Çocuk ateşi yönetimi ve tedavisi',
          fileType: 'docx'
        },
        {
          id: 'cocuklarda-egzama',
          title: 'Çocuklarda Egzama',
          fileName: 'Çocuklarda Egzama.docx',
          filePath: '/documents/Hastalıklar/Çocuklarda Egzama.docx',
          category: 'hastaliklar',
          description: 'Atopik dermatit belirtileri ve tedavisi',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'oyuncaklar',
      title: 'Oyuncaklar',
      description: 'Yaş gruplarına göre oyuncak seçimi rehberleri',
      icon: 'toys',
      color: '#FFC107',
      documentCount: 4,
      documents: [
        {
          id: 'oyuncak-0-6ay',
          title: '0-6 Ay Oyuncak Kılavuzu',
          fileName: '0 - 6 Ay Oyuncak Kılavuzu.docx',
          filePath: '/documents/Oyuncaklar/0 - 6 Ay Oyuncak Kılavuzu.docx',
          category: 'oyuncaklar',
          description: '0-6 aylık bebekler için oyuncak seçimi',
          fileType: 'docx'
        },
        {
          id: 'oyuncak-6-12ay',
          title: '6-12 Ay Oyuncak Kılavuzu',
          fileName: '6 - 12 Ay Oyuncak Kılavuzu.docx',
          filePath: '/documents/Oyuncaklar/6 - 12 Ay Oyuncak Kılavuzu.docx',
          category: 'oyuncaklar',
          description: '6-12 aylık bebekler için oyuncak seçimi',
          fileType: 'docx'
        },
        {
          id: 'oyuncak-1yas',
          title: '1 Yaş Oyuncak Kılavuzu',
          fileName: '1 Yaş - Oyuncak Kılavuzu.docx',
          filePath: '/documents/Oyuncaklar/1 Yaş - Oyuncak Kılavuzu.docx',
          category: 'oyuncaklar',
          description: '1 yaş çocuklar için oyuncak seçimi',
          fileType: 'docx'
        },
        {
          id: 'oyuncak-guvenligi',
          title: 'Oyuncak Güvenliği Kılavuzu',
          fileName: 'Oyuncak Güvenliği Kılavuzu.docx',
          filePath: '/documents/Oyuncaklar/Oyuncak Güvenliği Kılavuzu.docx',
          category: 'oyuncaklar',
          description: 'Güvenli oyuncak seçimi ve kullanımı',
          fileType: 'docx'
        }
      ]
    },
    {
      id: 'who-buyume-egrileri',
      title: 'WHO Büyüme Eğrileri',
      description: 'Dünya Sağlık Örgütü büyüme standartları',
      icon: 'show_chart',
      color: '#009688',
      documentCount: 8,
      documents: [
        {
          id: 'who-agirlik-0-2-erkek',
          title: 'Yaşa Göre Ağırlık (0-2) Erkekler',
          fileName: 'Yaşa Göre Ağırlık (0-2) Erkekler.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Ağırlık (0-2) Erkekler.pdf',
          category: 'who-buyume-egrileri',
          description: '0-2 yaş erkek çocuklar ağırlık eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-agirlik-0-2-kiz',
          title: 'Yaşa Göre Ağırlık (0-2) Kızlar',
          fileName: 'Yaşa Göre Ağırlık (0-2) Kızlar.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Ağırlık (0-2) Kızlar.pdf',
          category: 'who-buyume-egrileri',
          description: '0-2 yaş kız çocuklar ağırlık eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-agirlik-2-5-erkek',
          title: 'Yaşa Göre Ağırlık (2-5) Erkekler',
          fileName: 'Yaşa Göre Ağırlık (2-5) Erkekler.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Ağırlık (2-5) Erkekler.pdf',
          category: 'who-buyume-egrileri',
          description: '2-5 yaş erkek çocuklar ağırlık eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-agirlik-2-5-kiz',
          title: 'Yaşa Göre Ağırlık (2-5) Kızlar',
          fileName: 'Yaşa Göre Ağırlık (2-5) Kızlar.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Ağırlık (2-5) Kızlar.pdf',
          category: 'who-buyume-egrileri',
          description: '2-5 yaş kız çocuklar ağırlık eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-boy-0-2-erkek',
          title: 'Yaşa Göre Boy (0-2) Erkekler',
          fileName: 'Yaşa Göre Boy (0-2) Erkekler.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Boy (0-2) Erkekler.pdf',
          category: 'who-buyume-egrileri',
          description: '0-2 yaş erkek çocuklar boy eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-boy-0-2-kiz',
          title: 'Yaşa Göre Boy (0-2) Kızlar',
          fileName: 'Yaşa Göre Boy (0-2) Kızlar.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Boy (0-2) Kızlar.pdf',
          category: 'who-buyume-egrileri',
          description: '0-2 yaş kız çocuklar boy eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-boy-2-5-erkek',
          title: 'Yaşa Göre Boy (2-5) Erkekler',
          fileName: 'Yaşa Göre Boy (2-5) Erkekler.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Boy (2-5) Erkekler.pdf',
          category: 'who-buyume-egrileri',
          description: '2-5 yaş erkek çocuklar boy eğrisi',
          fileType: 'pdf'
        },
        {
          id: 'who-boy-2-5-kiz',
          title: 'Yaşa Göre Boy (2-5) Kızlar',
          fileName: 'Yaşa Göre Boy (2-5) Kızlar.pdf',
          filePath: '/documents/WHO Büyüme Eğrileri/Yaşa Göre Boy (2-5) Kızlar.pdf',
          category: 'who-buyume-egrileri',
          description: '2-5 yaş kız çocuklar boy eğrisi',
          fileType: 'pdf'
        }
      ]
    }
  ];

  getCategoryById(id: string): DocumentCategory | undefined {
    const categories = this.getCategories();
    return categories.find(category => category.id === id);
  }

  getDocumentById(documentId: string): Document | undefined {
    const categories = this.getCategories();
    for (const category of categories) {
      const document = category.documents.find(doc => doc.id === documentId);
      if (document) {
        return document;
      }
    }
    return undefined;
  }

  searchDocuments(query: string): Document[] {
    const lowerQuery = query.toLowerCase();
    const results: Document[] = [];
    const categories = this.getCategories();
    
    for (const category of categories) {
      for (const document of category.documents) {
        if (
          document.title.toLowerCase().includes(lowerQuery) ||
          document.description?.toLowerCase().includes(lowerQuery) ||
          category.title.toLowerCase().includes(lowerQuery)
        ) {
          results.push(document);
        }
      }
    }
    
    return results;
  }

  getDocumentsByCategory(categoryId: string): Document[] {
    const category = this.getCategoryById(categoryId);
    return category ? category.documents : [];
  }

  getTotalDocumentCount(): number {
    return this.categories.reduce((total, category) => total + category.documentCount, 0);
  }

  getDownloadUrl(document: Document): string {
    return document.filePath;
  }
}