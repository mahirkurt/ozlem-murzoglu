const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// TİTCK Ruhsatlı Aşılar ve CDC Takvimi Entegrasyonu
const vaccineDatabase = {
  // ZORUNLU AŞILAR (Türkiye Genişletilmiş Bağışıklama Programı)
  hepatitis_b: {
    id: 'hepatitis_b',
    name: 'Hepatit B',
    nameEn: 'Hepatitis B',
    abbreviation: 'HepB',
    description: 'Hepatit B virüsüne karşı koruyucu aşı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Engerix-B', manufacturer: 'GSK' },
      { brand: 'HBVaxPro', manufacturer: 'MSD' },
      { brand: 'Euvax B', manufacturer: 'LG Chem' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 0, minAgeMonths: 0, notes: 'Doğumda' },
      { doseNumber: 2, recommendedAgeMonths: 1, minAgeMonths: 1, notes: '1. ayın sonunda' },
      { doseNumber: 3, recommendedAgeMonths: 6, minAgeMonths: 6, notes: '6. ayın sonunda' }
    ],
    contraindications: 'Aşı bileşenlerine karşı alerji',
    sideEffects: 'Enjeksiyon yerinde ağrı, hafif ateş',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/hep-b.html'
  },
  
  bcg: {
    id: 'bcg',
    name: 'BCG',
    nameEn: 'BCG (Tuberculosis)',
    abbreviation: 'BCG',
    description: 'Tüberküloza karşı koruyucu aşı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'BCG Vaccine', manufacturer: 'AJ Vaccines' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 2, minAgeMonths: 0, notes: '2. ayın sonunda (tek doz)' }
    ],
    contraindications: 'İmmün yetmezlik, HIV pozitif',
    sideEffects: 'Enjeksiyon yerinde yara, lenf bezi şişmesi'
  },
  
  dtap_ipv_hib: {
    id: 'dtap_ipv_hib',
    name: 'DaBT-İPA-Hib',
    nameEn: 'DTaP-IPV-Hib',
    abbreviation: 'DTaP-IPV-Hib',
    description: 'Difteri, Boğmaca, Tetanos, Polio ve Hib aşısı (5\'li karma)',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Pentaxim', manufacturer: 'Sanofi' },
      { brand: 'Infanrix IPV+Hib', manufacturer: 'GSK' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 2, minAgeMonths: 2, notes: '2. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 4, minAgeMonths: 4, minIntervalDays: 28, notes: '4. ayın sonunda' },
      { doseNumber: 3, recommendedAgeMonths: 6, minAgeMonths: 6, minIntervalDays: 28, notes: '6. ayın sonunda' },
      { doseNumber: 4, recommendedAgeMonths: 18, minAgeMonths: 12, notes: '18. ayın sonunda (Rapel)' }
    ],
    contraindications: 'Önceki dozda ciddi reaksiyon, ensefalopati',
    sideEffects: 'Ateş, huzursuzluk, enjeksiyon yerinde şişlik',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/dtap.html'
  },
  
  dtap_ipv_hib_hepb: {
    id: 'dtap_ipv_hib_hepb',
    name: 'DaBT-İPA-Hib-HepB',
    nameEn: 'DTaP-IPV-Hib-HepB',
    abbreviation: 'Hexavalent',
    description: 'Difteri, Boğmaca, Tetanos, Polio, Hib ve Hepatit B aşısı (6\'lı karma)',
    category: 'alternative',
    isRequired: false,
    titckBrands: [
      { brand: 'Hexaxim', manufacturer: 'Sanofi' },
      { brand: 'Infanrix Hexa', manufacturer: 'GSK' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 2, minAgeMonths: 2, notes: '2. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 4, minAgeMonths: 4, minIntervalDays: 28, notes: '4. ayın sonunda' },
      { doseNumber: 3, recommendedAgeMonths: 6, minAgeMonths: 6, minIntervalDays: 28, notes: '6. ayın sonunda' }
    ],
    specialNotes: '5\'li karma aşı yerine kullanılabilir',
    contraindications: 'Önceki dozda ciddi reaksiyon',
    sideEffects: 'Ateş, huzursuzluk, enjeksiyon yerinde şişlik'
  },
  
  pcv: {
    id: 'pcv',
    name: 'KPA',
    nameEn: 'PCV (Pneumococcal)',
    abbreviation: 'PCV13/PCV15/PCV20',
    description: 'Konjuge Pnömokok aşısı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Prevenar 13', manufacturer: 'Pfizer' },
      { brand: 'Prevenar 20', manufacturer: 'Pfizer' },
      { brand: 'Synflorix', manufacturer: 'GSK' },
      { brand: 'Vaxneuvance', manufacturer: 'MSD' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 2, minAgeMonths: 2, notes: '2. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 4, minAgeMonths: 4, minIntervalDays: 28, notes: '4. ayın sonunda' },
      { doseNumber: 3, recommendedAgeMonths: 6, minAgeMonths: 6, minIntervalDays: 28, notes: '6. ayın sonunda' },
      { doseNumber: 4, recommendedAgeMonths: 12, minAgeMonths: 12, notes: '12. ayın sonunda (Rapel)' }
    ],
    contraindications: 'Önceki dozda şiddetli alerjik reaksiyon',
    sideEffects: 'Ateş, iştahsızlık, enjeksiyon yerinde kızarıklık',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/pcv.html'
  },
  
  rotavirus: {
    id: 'rotavirus',
    name: 'Rotavirüs',
    nameEn: 'Rotavirus',
    abbreviation: 'RV',
    description: 'Rotavirüs gastroenteritine karşı oral aşı',
    category: 'recommended',
    isRequired: false,
    titckBrands: [
      { brand: 'Rotarix', manufacturer: 'GSK', doses: 2 },
      { brand: 'RotaTeq', manufacturer: 'MSD', doses: 3 }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 2, minAgeMonths: 2, maxAgeMonths: 4, notes: '2. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 4, minAgeMonths: 4, maxAgeMonths: 6, minIntervalDays: 28, notes: '4. ayın sonunda' },
      { doseNumber: 3, recommendedAgeMonths: 6, minAgeMonths: 6, maxAgeMonths: 8, minIntervalDays: 28, notes: '6. ayın sonunda (sadece RotaTeq)' }
    ],
    specialNotes: 'Oral aşıdır, ilk doz 14 hafta 6 güne kadar başlanmalı',
    contraindications: 'İmmün yetmezlik, bağırsak tıkanıklığı öyküsü',
    sideEffects: 'Hafif ishal, kusma, huzursuzluk',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/rotavirus.html'
  },
  
  mmr: {
    id: 'mmr',
    name: 'KKK',
    nameEn: 'MMR',
    abbreviation: 'MMR',
    description: 'Kızamık, Kızamıkçık, Kabakulak aşısı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Priorix', manufacturer: 'GSK' },
      { brand: 'M-M-R II', manufacturer: 'MSD' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 12, minAgeMonths: 12, notes: '12. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 48, minAgeMonths: 48, minIntervalDays: 28, notes: '48. ayda (İlkokul 1. sınıf)' }
    ],
    contraindications: 'Gebelik, immün yetmezlik, jelatin alerjisi',
    sideEffects: 'Ateş, döküntü, eklem ağrısı',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/mmr.html'
  },
  
  varicella: {
    id: 'varicella',
    name: 'Suçiçeği',
    nameEn: 'Varicella',
    abbreviation: 'VAR',
    description: 'Suçiçeğine karşı koruyucu aşı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Varivax', manufacturer: 'MSD' },
      { brand: 'Varilrix', manufacturer: 'GSK' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 12, minAgeMonths: 12, notes: '12. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 48, minAgeMonths: 48, minIntervalDays: 90, notes: '48. ayda (İlkokul 1. sınıf)' }
    ],
    contraindications: 'Gebelik, immün yetmezlik',
    sideEffects: 'Enjeksiyon yerinde ağrı, hafif döküntü',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/varicella.html'
  },
  
  mmrv: {
    id: 'mmrv',
    name: 'KKKS',
    nameEn: 'MMRV',
    abbreviation: 'MMRV',
    description: 'Kızamık, Kızamıkçık, Kabakulak, Suçiçeği aşısı (4\'lü karma)',
    category: 'alternative',
    isRequired: false,
    titckBrands: [
      { brand: 'Priorix Tetra', manufacturer: 'GSK' },
      { brand: 'ProQuad', manufacturer: 'MSD' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 12, minAgeMonths: 12, notes: '12. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 48, minAgeMonths: 48, minIntervalDays: 90, notes: '48. ayda' }
    ],
    specialNotes: 'KKK ve Suçiçeği aşıları yerine kullanılabilir',
    contraindications: 'Gebelik, immün yetmezlik',
    sideEffects: 'Ateş, döküntü',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/mmrv.html'
  },
  
  hepatitis_a: {
    id: 'hepatitis_a',
    name: 'Hepatit A',
    nameEn: 'Hepatitis A',
    abbreviation: 'HepA',
    description: 'Hepatit A virüsüne karşı koruyucu aşı',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Havrix', manufacturer: 'GSK' },
      { brand: 'Vaqta', manufacturer: 'MSD' },
      { brand: 'Avaxim', manufacturer: 'Sanofi' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 18, minAgeMonths: 12, notes: '18. ayın sonunda' },
      { doseNumber: 2, recommendedAgeMonths: 24, minAgeMonths: 24, minIntervalDays: 180, notes: '24. ayın sonunda' }
    ],
    contraindications: 'Aşı bileşenlerine alerji',
    sideEffects: 'Enjeksiyon yerinde ağrı, yorgunluk, baş ağrısı',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/hep-a.html'
  },
  
  dtap_ipv: {
    id: 'dtap_ipv',
    name: 'DaBT-İPA',
    nameEn: 'DTaP-IPV',
    abbreviation: 'DTaP-IPV',
    description: 'Difteri, Boğmaca, Tetanos, Polio aşısı (4\'lü karma)',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Tetravac', manufacturer: 'Sanofi' },
      { brand: 'Infanrix IPV', manufacturer: 'GSK' },
      { brand: 'Boostrix Polio', manufacturer: 'GSK' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 48, minAgeMonths: 48, notes: '48. ayda (İlkokul 1. sınıf rapeli)' }
    ],
    contraindications: 'Önceki dozda ciddi reaksiyon',
    sideEffects: 'Ateş, enjeksiyon yerinde ağrı'
  },
  
  tdap: {
    id: 'tdap',
    name: 'Tdap',
    nameEn: 'Tdap',
    abbreviation: 'Tdap',
    description: 'Tetanos, Difteri, Boğmaca aşısı (erişkin tipi)',
    category: 'mandatory',
    isRequired: true,
    titckBrands: [
      { brand: 'Boostrix', manufacturer: 'GSK' },
      { brand: 'Adacel', manufacturer: 'Sanofi' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 156, minAgeMonths: 132, notes: '13 yaş (8. sınıf)' }
    ],
    contraindications: 'Önceki dozda ciddi reaksiyon',
    sideEffects: 'Enjeksiyon yerinde ağrı, kas ağrısı',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/tdap.html'
  },
  
  // TAVSİYE EDİLEN AŞILAR
  meningococcal: {
    id: 'meningococcal',
    name: 'Meningokok',
    nameEn: 'Meningococcal',
    abbreviation: 'MenACWY / MenB',
    description: 'Meningokok enfeksiyonuna karşı koruyucu aşı',
    category: 'recommended',
    isRequired: false,
    titckBrands: [
      { brand: 'Nimenrix', manufacturer: 'Pfizer', serotypes: 'ACWY' },
      { brand: 'Menveo', manufacturer: 'GSK', serotypes: 'ACWY' },
      { brand: 'Menactra', manufacturer: 'Sanofi', serotypes: 'ACWY' },
      { brand: 'Bexsero', manufacturer: 'GSK', serotypes: 'B' },
      { brand: 'Trumenba', manufacturer: 'Pfizer', serotypes: 'B' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 12, minAgeMonths: 9, notes: '12. ay (ACWY veya B)' },
      { doseNumber: 2, recommendedAgeMonths: 132, minAgeMonths: 132, notes: '11 yaş (ACWY rapeli)' }
    ],
    specialNotes: 'Risk gruplarında daha erken başlanabilir',
    contraindications: 'Aşı bileşenlerine alerji',
    sideEffects: 'Ateş, baş ağrısı, yorgunluk',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/mening.html'
  },
  
  influenza: {
    id: 'influenza',
    name: 'İnfluenza (Grip)',
    nameEn: 'Influenza',
    abbreviation: 'IIV',
    description: 'Mevsimsel grip aşısı',
    category: 'recommended',
    isRequired: false,
    titckBrands: [
      { brand: 'Fluarix Tetra', manufacturer: 'GSK' },
      { brand: 'Vaxigrip Tetra', manufacturer: 'Sanofi' },
      { brand: 'Influvac Tetra', manufacturer: 'Abbott' },
      { brand: 'Flublok', manufacturer: 'Sanofi' }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 6, minAgeMonths: 6, notes: '6. aydan itibaren yıllık', isRecurring: true }
    ],
    specialNotes: 'Her yıl eylül-kasım aylarında yapılmalı',
    contraindications: 'Ciddi yumurta alerjisi (bazı aşı tipleri için)',
    sideEffects: 'Enjeksiyon yerinde ağrı, hafif ateş, kas ağrısı',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/flu.html'
  },
  
  hpv: {
    id: 'hpv',
    name: 'HPV',
    nameEn: 'HPV',
    abbreviation: 'HPV',
    description: 'İnsan Papilloma Virüsü aşısı',
    category: 'recommended',
    isRequired: false,
    titckBrands: [
      { brand: 'Gardasil 9', manufacturer: 'MSD', valent: 9 },
      { brand: 'Cervarix', manufacturer: 'GSK', valent: 2 }
    ],
    doses: [
      { doseNumber: 1, recommendedAgeMonths: 144, minAgeMonths: 108, notes: '12 yaş' },
      { doseNumber: 2, recommendedAgeMonths: 150, minAgeMonths: 114, minIntervalDays: 180, notes: '12.5 yaş (1. dozdan 6 ay sonra)' }
    ],
    specialNotes: '15 yaş öncesi 2 doz, sonrası 3 doz',
    contraindications: 'Gebelik, aşı bileşenlerine alerji',
    sideEffects: 'Enjeksiyon yerinde ağrı, baş ağrısı, baş dönmesi',
    cdcVis: 'https://www.cdc.gov/vaccines/hcp/vis/vis-statements/hpv.html'
  }
};

async function updateVaccinesCollection() {
  try {
    console.log('=== VACCINES KOLEKSİYONU GÜNCELLENİYOR ===\n');
    
    const batch = db.batch();
    let count = 0;
    
    // Her aşıyı vaccines koleksiyonuna ekle
    for (const [key, vaccine] of Object.entries(vaccineDatabase)) {
      const docRef = db.collection('vaccines').doc(vaccine.id);
      batch.set(docRef, {
        ...vaccine,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    }
    
    await batch.commit();
    console.log(`✅ ${count} aşı türü başarıyla güncellendi\n`);
    
    // Özet bilgi
    console.log('📊 GÜNCELLENEN AŞILAR:');
    console.log('Zorunlu aşılar:');
    Object.values(vaccineDatabase)
      .filter(v => v.category === 'mandatory')
      .forEach(v => console.log(`  - ${v.name} (${v.nameEn})`));
    
    console.log('\nTavsiye edilen aşılar:');
    Object.values(vaccineDatabase)
      .filter(v => v.category === 'recommended')
      .forEach(v => console.log(`  - ${v.name} (${v.nameEn})`));
    
    console.log('\nAlternatif aşılar:');
    Object.values(vaccineDatabase)
      .filter(v => v.category === 'alternative')
      .forEach(v => console.log(`  - ${v.name} (${v.nameEn})`));
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

updateVaccinesCollection();