const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Aşı markası-tip eşleştirme tablosu (güncel TİTCK markaları)
const vaccineMapping = {
  // Hepatit B
  'engerix': { type: 'hepatitis_b', standardName: 'Hepatit B', brand: 'Engerix-B' },
  'hbvaxpro': { type: 'hepatitis_b', standardName: 'Hepatit B', brand: 'HBVaxPro' },
  
  // BCG
  'bcg': { type: 'bcg', standardName: 'BCG', brand: 'BCG' },
  
  // 5'li Karma
  'pentaxim': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)', brand: 'Pentaxim' },
  'infanrix quinta': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)', brand: 'Infanrix Quinta' },
  
  // 6'lı Karma
  'hexaxim': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)', brand: 'Hexaxim' },
  'infanrix hexa': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)', brand: 'Infanrix Hexa' },
  
  // Pnömokok
  'prevenar': { type: 'pcv', standardName: 'KPA (Pnömokok)', brand: 'Prevenar 13' },
  'synflorix': { type: 'pcv', standardName: 'KPA (Pnömokok)', brand: 'Synflorix' },
  'apexxnar': { type: 'pcv', standardName: 'KPA (Pnömokok)', brand: 'Apexxnar' },
  
  // Rotavirüs
  'rotarix': { type: 'rotavirus', standardName: 'Rotavirüs', brand: 'Rotarix' },
  'rotateq': { type: 'rotavirus', standardName: 'Rotavirüs', brand: 'RotaTeq' },
  
  // KKK
  'priorix': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)', brand: 'Priorix' },
  'm-m-r': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)', brand: 'M-M-R II' },
  
  // Suçiçeği
  'varivax': { type: 'varicella', standardName: 'Suçiçeği', brand: 'Varivax' },
  'varilrix': { type: 'varicella', standardName: 'Suçiçeği', brand: 'Varilrix' },
  
  // KKKS
  'priorix tetra': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)', brand: 'Priorix Tetra' },
  'proquad': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)', brand: 'ProQuad' },
  
  // Hepatit A
  'havrix': { type: 'hepatitis_a', standardName: 'Hepatit A', brand: 'Havrix' },
  'vaqta': { type: 'hepatitis_a', standardName: 'Hepatit A', brand: 'Vaqta' },
  'avaxim': { type: 'hepatitis_a', standardName: 'Hepatit A', brand: 'Avaxim' },
  
  // Meningokok
  'nimenrix': { type: 'meningococcal', standardName: 'Meningokok ACWY', brand: 'Nimenrix' },
  'menveo': { type: 'meningococcal', standardName: 'Meningokok ACWY', brand: 'Menveo' },
  'menactra': { type: 'meningococcal', standardName: 'Meningokok ACWY', brand: 'Menactra' },
  'bexsero': { type: 'meningococcal_b', standardName: 'Meningokok B', brand: 'Bexsero' },
  'trumenba': { type: 'meningococcal_b', standardName: 'Meningokok B', brand: 'Trumenba' },
  
  // Grip
  'fluarix': { type: 'influenza', standardName: 'İnfluenza (Grip)', brand: 'Fluarix' },
  'vaxigrip': { type: 'influenza', standardName: 'İnfluenza (Grip)', brand: 'Vaxigrip' },
  'influvac': { type: 'influenza', standardName: 'İnfluenza (Grip)', brand: 'Influvac' },
  
  // HPV
  'gardasil': { type: 'hpv', standardName: 'HPV', brand: 'Gardasil 9' },
  'cervarix': { type: 'hpv', standardName: 'HPV', brand: 'Cervarix' },
  
  // Tdap
  'boostrix': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)', brand: 'Boostrix' },
  'adacel': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)', brand: 'Adacel' }
};

function identifyVaccineInfo(serviceName) {
  if (!serviceName) return null;
  
  const nameLower = serviceName.toLowerCase();
  
  // Önce direkt marka eşleştirmesi yap
  for (const [key, value] of Object.entries(vaccineMapping)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  
  // Genel aşı türlerini kontrol et
  if (nameLower.includes('hepatit b')) return { type: 'hepatitis_b', standardName: 'Hepatit B', brand: null };
  if (nameLower.includes('bcg')) return { type: 'bcg', standardName: 'BCG', brand: null };
  if (nameLower.includes('pnömokok') || nameLower.includes('kpa')) return { type: 'pcv', standardName: 'KPA (Pnömokok)', brand: null };
  if (nameLower.includes('rotavirus') || nameLower.includes('rotavirüs')) return { type: 'rotavirus', standardName: 'Rotavirüs', brand: null };
  if (nameLower.includes('kkk') || nameLower.includes('kızamık')) return { type: 'mmr', standardName: 'KKK', brand: null };
  if (nameLower.includes('suçiçeği')) return { type: 'varicella', standardName: 'Suçiçeği', brand: null };
  if (nameLower.includes('hepatit a')) return { type: 'hepatitis_a', standardName: 'Hepatit A', brand: null };
  if (nameLower.includes('meningokok')) return { type: 'meningococcal', standardName: 'Meningokok', brand: null };
  if (nameLower.includes('influenza') || nameLower.includes('grip')) return { type: 'influenza', standardName: 'İnfluenza (Grip)', brand: null };
  if (nameLower.includes('hpv')) return { type: 'hpv', standardName: 'HPV', brand: null };
  
  if (nameLower.includes('aşı') || nameLower.includes('vaccine')) {
    return { type: 'unknown', standardName: serviceName, brand: null };
  }
  
  return null;
}

function parseDate(dateValue) {
  if (!dateValue) return null;
  
  // Firestore Timestamp
  if (dateValue._seconds) {
    return new Date(dateValue._seconds * 1000);
  }
  if (dateValue.seconds) {
    return new Date(dateValue.seconds * 1000);
  }
  
  // String date
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Already a Date
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  return null;
}

async function updateVaccinationsWithDates() {
  try {
    console.log('=== VACCINATIONS KOLEKSIYONUNU İSLEM_TARİHİ İLE GÜNCELLEME ===\n');
    
    // 1. Mevcut vaccinations koleksiyonunu temizle
    console.log('🗑️ Mevcut vaccinations koleksiyonu temizleniyor...\n');
    
    const existingVaccinations = await db.collection('vaccinations').get();
    
    if (!existingVaccinations.empty) {
      let deleteBatch = db.batch();
      let deleteCount = 0;
      
      for (const doc of existingVaccinations.docs) {
        deleteBatch.delete(doc.ref);
        deleteCount++;
        
        if (deleteCount >= 400) {
          await deleteBatch.commit();
          deleteBatch = db.batch();
          deleteCount = 0;
        }
      }
      
      if (deleteCount > 0) {
        await deleteBatch.commit();
      }
      
      console.log(`✅ ${existingVaccinations.size} eski kayıt silindi\n`);
    }
    
    // 2. Services koleksiyonundan aşılama kayıtlarını al
    console.log('📋 Services koleksiyonundan aşılama kayıtları alınıyor...\n');
    
    const vaccineServices = [];
    
    // Grup_Adi "Aşılama" olanları al
    const vaccinationGroupSnapshot = await db.collection('services')
      .where('Grup_Adi', '==', 'Aşılama')
      .get();
    
    console.log(`Grup_Adi "Aşılama": ${vaccinationGroupSnapshot.size} kayıt`);
    
    vaccinationGroupSnapshot.forEach(doc => {
      const data = doc.data();
      vaccineServices.push({
        id: doc.id,
        ...data
      });
    });
    
    // serviceName'de aşı adı geçenleri de al
    const allServicesSnapshot = await db.collection('services').get();
    let additionalCount = 0;
    
    allServicesSnapshot.forEach(doc => {
      const data = doc.data();
      const serviceName = data.serviceName || data.name || data.originalServiceName || '';
      
      if (data.Grup_Adi !== 'Aşılama') {
        const vaccineInfo = identifyVaccineInfo(serviceName);
        if (vaccineInfo) {
          // Duplicate kontrolü
          if (!vaccineServices.find(s => s.id === doc.id)) {
            vaccineServices.push({
              id: doc.id,
              ...data
            });
            additionalCount++;
          }
        }
      }
    });
    
    console.log(`serviceName'de aşı adı geçen: ${additionalCount} ek kayıt`);
    console.log(`Toplam aşı servisi: ${vaccineServices.length}\n`);
    
    // 3. Hasta bazında grupla ve tarihe göre sırala
    console.log('📊 Hasta bazında gruplama ve doz hesaplama...\n');
    
    const patientVaccineMap = new Map();
    
    for (const service of vaccineServices) {
      const patientId = service.patientId;
      if (!patientId) continue;
      
      // İslem_Tarihi'yi al
      const islemTarihi = parseDate(service.Islem_Tarihi || service.islem_tarihi || service.date || service.createdAt);
      if (!islemTarihi) {
        console.log(`Tarih bulunamadı: ${service.id}`);
        continue;
      }
      
      // Aşı bilgilerini tanımla
      const serviceName = service.serviceName || service.name || service.originalServiceName || '';
      const vaccineInfo = identifyVaccineInfo(serviceName);
      
      if (!vaccineInfo) {
        console.log(`Aşı tipi tanımlanamadı: ${serviceName}`);
        continue;
      }
      
      if (!patientVaccineMap.has(patientId)) {
        patientVaccineMap.set(patientId, {});
      }
      
      const patientVaccines = patientVaccineMap.get(patientId);
      
      if (!patientVaccines[vaccineInfo.type]) {
        patientVaccines[vaccineInfo.type] = [];
      }
      
      patientVaccines[vaccineInfo.type].push({
        ...service,
        vaccineInfo,
        applicationDate: islemTarihi
      });
    }
    
    // Her hasta için aşıları tarihe göre sırala ve doz numarası ata
    for (const [patientId, vaccineTypes] of patientVaccineMap.entries()) {
      for (const [vaccineType, vaccines] of Object.entries(vaccineTypes)) {
        // Tarihe göre sırala (eskiden yeniye)
        vaccines.sort((a, b) => a.applicationDate - b.applicationDate);
        
        // Doz numarası ata
        vaccines.forEach((vaccine, index) => {
          vaccine.dose = index + 1;
        });
      }
    }
    
    console.log(`${patientVaccineMap.size} hasta için aşı kayıtları hazırlandı\n`);
    
    // 4. Vaccinations koleksiyonuna kaydet
    console.log('📝 Yeni vaccinations kayıtları oluşturuluyor...\n');
    
    let createBatch = db.batch();
    let createCount = 0;
    let totalCreated = 0;
    
    for (const [patientId, vaccineTypes] of patientVaccineMap.entries()) {
      for (const vaccines of Object.values(vaccineTypes)) {
        for (const vaccine of vaccines) {
          const vaccinationData = {
            patientId: patientId,
            patientName: vaccine.Hasta_Adi || vaccine.patientName || '',
            
            // Aşı bilgileri
            vaccineType: vaccine.vaccineInfo.type,
            vaccineName: vaccine.vaccineInfo.standardName,
            vaccineBrand: vaccine.vaccineInfo.brand || null,
            originalServiceName: vaccine.serviceName || vaccine.name || '',
            
            // Tarih ve doz
            date: admin.firestore.Timestamp.fromDate(vaccine.applicationDate),
            dose: vaccine.dose,
            
            // Protokol ve lokasyon
            protocolNo: vaccine.Protokol_No || vaccine.protocolNo || '',
            provider: vaccine.doctorName || vaccine.provider || 'Dr. Özlem Mürzoğlu',
            location: vaccine.clinicName || 'Sağlık Peteğim Kliniği',
            
            // Ek bilgiler
            notes: vaccine.notes || '',
            sideEffects: [],
            
            // Metadata
            metadata: {
              source: 'services',
              serviceId: vaccine.id,
              grupAdi: vaccine.Grup_Adi || null,
              islemTarihi: vaccine.Islem_Tarihi ? true : false,
              importedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          const docRef = db.collection('vaccinations').doc();
          createBatch.set(docRef, vaccinationData);
          createCount++;
          totalCreated++;
          
          if (createCount >= 400) {
            await createBatch.commit();
            console.log(`${totalCreated} kayıt oluşturuldu...`);
            createBatch = db.batch();
            createCount = 0;
          }
        }
      }
    }
    
    if (createCount > 0) {
      await createBatch.commit();
    }
    
    console.log(`\n✅ Toplam ${totalCreated} vaccination kaydı oluşturuldu\n`);
    
    // 5. Final rapor
    console.log('=== ÖZET RAPOR ===\n');
    
    const finalVaccinations = await db.collection('vaccinations').get();
    
    const stats = {
      vaccineTypes: {},
      vaccineBrands: {},
      doseDistribution: {},
      patientsWithVaccines: new Set()
    };
    
    finalVaccinations.forEach(doc => {
      const data = doc.data();
      
      // Aşı türü
      const type = data.vaccineType || 'unknown';
      stats.vaccineTypes[type] = (stats.vaccineTypes[type] || 0) + 1;
      
      // Marka
      if (data.vaccineBrand) {
        stats.vaccineBrands[data.vaccineBrand] = (stats.vaccineBrands[data.vaccineBrand] || 0) + 1;
      }
      
      // Doz dağılımı
      const doseKey = `${type}_dose_${data.dose || 1}`;
      stats.doseDistribution[doseKey] = (stats.doseDistribution[doseKey] || 0) + 1;
      
      // Hasta sayısı
      if (data.patientId) {
        stats.patientsWithVaccines.add(data.patientId);
      }
    });
    
    console.log('📊 AŞI TÜRLERİ:');
    Object.entries(stats.vaccineTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} kayıt`);
      });
    
    console.log('\n💉 AŞI MARKALARI:');
    Object.entries(stats.vaccineBrands)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([brand, count]) => {
        console.log(`  ${brand}: ${count} kayıt`);
      });
    
    console.log('\n📈 GENEL İSTATİSTİKLER:');
    console.log(`  Toplam vaccination kaydı: ${finalVaccinations.size}`);
    console.log(`  Aşısı olan hasta sayısı: ${stats.patientsWithVaccines.size}`);
    console.log(`  Hasta başı ortalama: ${(finalVaccinations.size / stats.patientsWithVaccines.size).toFixed(1)} aşı`);
    
    // Örnek doz dağılımı (ilk 5 aşı türü için)
    console.log('\n📊 DOZ DAĞILIMI (İlk 5 aşı türü):');
    const typesDoseSummary = {};
    Object.entries(stats.doseDistribution).forEach(([key, count]) => {
      const [type, , dose] = key.split('_');
      if (!typesDoseSummary[type]) typesDoseSummary[type] = {};
      typesDoseSummary[type][`Doz ${dose}`] = count;
    });
    
    Object.entries(typesDoseSummary)
      .slice(0, 5)
      .forEach(([type, doses]) => {
        console.log(`  ${type}:`);
        Object.entries(doses)
          .sort((a, b) => parseInt(a[0].split(' ')[1]) - parseInt(b[0].split(' ')[1]))
          .forEach(([dose, count]) => {
            console.log(`    ${dose}: ${count}`);
          });
      });
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

updateVaccinationsWithDates();