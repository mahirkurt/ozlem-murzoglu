const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function analyzeVaccineBrands() {
  try {
    console.log('=== AŞI MARKALARI ANALİZİ ===\n');
    
    // Services koleksiyonundaki tüm aşı kayıtlarını çek
    const servicesSnapshot = await db.collection('services').get();
    
    const vaccineNames = new Map(); // Map<name, count>
    const vaccineBrands = new Map(); // Map<brand, {count, examples}>
    
    // Aşı ile ilgili anahtar kelimeler
    const vaccineKeywords = [
      'aşı', 'vaccine', 'immunization', 'bağışıklama',
      'hepatit', 'bcg', 'kkk', 'mmr', 'dbt', 'dabt', 'dpt', 
      'hib', 'ipa', 'opv', 'ipv', 'kpa', 'pnömokok', 
      'rotavirus', 'rotavirüs', 'suçiçeği', 'varicella',
      'kızamık', 'kızamıkçık', 'kabakulak', 'menenjit', 
      'meningokok', 'influenza', 'grip', 'hpv', 'td', 
      'tetanos', 'difteri', 'boğmaca', 'pentavalent',
      'hexavalent', 'priorix', 'infanrix', 'rotarix', 
      'rotateq', 'pentaxim', 'hexaxim', 'tetravac',
      'engerix', 'hbvaxpro', 'havrix', 'vaqta', 'twinrix',
      'prevenar', 'synflorix', 'nimenrix', 'menveo',
      'gardasil', 'cervarix', 'zostavax', 'varivax',
      'proquad', 'fluarix', 'vaxigrip', 'influvac'
    ];
    
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const name = (data.name || '').toLowerCase();
      const originalName = (data.originalServiceName || '').toLowerCase();
      const serviceName = (data.serviceName || '').toLowerCase();
      
      // En geniş arama yap
      const allNames = [name, originalName, serviceName].filter(n => n);
      
      allNames.forEach(checkName => {
        const isVaccine = vaccineKeywords.some(keyword => checkName.includes(keyword));
        
        if (isVaccine) {
          // Tam ismi kaydet
          const fullName = data.originalServiceName || data.name || data.serviceName;
          vaccineNames.set(fullName, (vaccineNames.get(fullName) || 0) + 1);
          
          // Marka tespiti (parantez içi veya © işaretli)
          const brandMatch = fullName.match(/[-(]([^-)]+)[)©]/);
          if (brandMatch) {
            const brand = brandMatch[1].trim();
            if (!vaccineBrands.has(brand)) {
              vaccineBrands.set(brand, { count: 0, examples: new Set() });
            }
            const brandData = vaccineBrands.get(brand);
            brandData.count++;
            brandData.examples.add(fullName);
          }
        }
      });
    });
    
    // Sonuçları yazdır
    console.log('📊 TOPLAM AŞI KAYITLARI:', vaccineNames.size, 'farklı isim\n');
    
    // En çok kullanılan aşı isimleri
    const sortedVaccines = Array.from(vaccineNames.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);
    
    console.log('📋 EN ÇOK KULLANILAN AŞI İSİMLERİ:');
    sortedVaccines.forEach(([name, count]) => {
      console.log(`  ${count}x - ${name}`);
    });
    
    console.log('\n📦 TESPİT EDİLEN MARKALAR:');
    vaccineBrands.forEach((data, brand) => {
      console.log(`\n  ${brand} (${data.count} kayıt):`);
      Array.from(data.examples).slice(0, 3).forEach(example => {
        console.log(`    - ${example}`);
      });
    });
    
    // TİTCK ruhsatlı aşı eşleştirmeleri için hazırla
    console.log('\n\n=== TİTCK RUHSATLI AŞI EŞLEŞTİRMELERİ ===\n');
    
    const titckMapping = {
      // Hepatit B Aşıları
      'ENGERIX': { type: 'hepatitis_b', titck: 'Engerix-B', manufacturer: 'GSK' },
      'HBVAXPRO': { type: 'hepatitis_b', titck: 'HBVaxPro', manufacturer: 'MSD' },
      'EUVAX': { type: 'hepatitis_b', titck: 'Euvax B', manufacturer: 'LG Chem' },
      
      // BCG Aşısı
      'BCG': { type: 'bcg', titck: 'BCG Aşısı', manufacturer: 'AJ Vaccines' },
      
      // DaBT-İPA-Hib (5'li karma)
      'PENTAXIM': { type: 'dtap_ipv_hib', titck: 'Pentaxim', manufacturer: 'Sanofi' },
      'INFANRIX': { type: 'dtap_ipv_hib', titck: 'Infanrix IPV+Hib', manufacturer: 'GSK' },
      
      // DaBT-İPA-Hib-HepB (6'lı karma)
      'HEXAXIM': { type: 'dtap_ipv_hib_hepb', titck: 'Hexaxim', manufacturer: 'Sanofi' },
      'INFANRIX HEXA': { type: 'dtap_ipv_hib_hepb', titck: 'Infanrix Hexa', manufacturer: 'GSK' },
      
      // Pnömokok Aşıları
      'PREVENAR': { type: 'pcv', titck: 'Prevenar 13', manufacturer: 'Pfizer' },
      'SYNFLORIX': { type: 'pcv', titck: 'Synflorix', manufacturer: 'GSK' },
      
      // Rotavirüs Aşıları
      'ROTARIX': { type: 'rotavirus', titck: 'Rotarix', manufacturer: 'GSK' },
      'ROTATEQ': { type: 'rotavirus', titck: 'RotaTeq', manufacturer: 'MSD' },
      
      // KKK Aşısı
      'PRIORIX': { type: 'mmr', titck: 'Priorix', manufacturer: 'GSK' },
      'M-M-R': { type: 'mmr', titck: 'M-M-R II', manufacturer: 'MSD' },
      
      // Suçiçeği Aşısı
      'VARIVAX': { type: 'varicella', titck: 'Varivax', manufacturer: 'MSD' },
      'VARILRIX': { type: 'varicella', titck: 'Varilrix', manufacturer: 'GSK' },
      
      // KKKS (4'lü karma)
      'PRIORIX TETRA': { type: 'mmrv', titck: 'Priorix Tetra', manufacturer: 'GSK' },
      'PROQUAD': { type: 'mmrv', titck: 'ProQuad', manufacturer: 'MSD' },
      
      // Hepatit A Aşıları
      'HAVRIX': { type: 'hepatitis_a', titck: 'Havrix', manufacturer: 'GSK' },
      'VAQTA': { type: 'hepatitis_a', titck: 'Vaqta', manufacturer: 'MSD' },
      'AVAXIM': { type: 'hepatitis_a', titck: 'Avaxim', manufacturer: 'Sanofi' },
      
      // Meningokok Aşıları
      'NIMENRIX': { type: 'meningococcal', titck: 'Nimenrix', manufacturer: 'Pfizer' },
      'MENVEO': { type: 'meningococcal', titck: 'Menveo', manufacturer: 'GSK' },
      'MENACTRA': { type: 'meningococcal', titck: 'Menactra', manufacturer: 'Sanofi' },
      
      // HPV Aşıları
      'GARDASIL': { type: 'hpv', titck: 'Gardasil 9', manufacturer: 'MSD' },
      'CERVARIX': { type: 'hpv', titck: 'Cervarix', manufacturer: 'GSK' },
      
      // Grip Aşıları
      'FLUARIX': { type: 'influenza', titck: 'Fluarix Tetra', manufacturer: 'GSK' },
      'VAXIGRIP': { type: 'influenza', titck: 'Vaxigrip Tetra', manufacturer: 'Sanofi' },
      'INFLUVAC': { type: 'influenza', titck: 'Influvac Tetra', manufacturer: 'Abbott' }
    };
    
    // Eşleştirme sonuçları
    const mappedBrands = new Map();
    
    vaccineBrands.forEach((data, brand) => {
      const upperBrand = brand.toUpperCase();
      
      // TİTCK listesinde ara
      for (const [key, mapping] of Object.entries(titckMapping)) {
        if (upperBrand.includes(key) || key.includes(upperBrand)) {
          mappedBrands.set(brand, mapping);
          break;
        }
      }
    });
    
    console.log('✅ EŞLEŞTİRİLEN MARKALAR:');
    mappedBrands.forEach((mapping, brand) => {
      console.log(`  ${brand} -> ${mapping.titck} (${mapping.type})`);
    });
    
    // Eşleştirilemeyen markalar
    console.log('\n❌ EŞLEŞTİRİLEMEYEN MARKALAR:');
    vaccineBrands.forEach((data, brand) => {
      if (!mappedBrands.has(brand)) {
        console.log(`  ${brand} (${data.count} kayıt)`);
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

analyzeVaccineBrands();