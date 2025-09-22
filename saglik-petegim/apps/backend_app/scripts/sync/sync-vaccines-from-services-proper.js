const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Aşı markası-tip eşleştirme tablosu
const vaccineMapping = {
  // Hepatit B
  'engerix': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'hbvaxpro': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'euvax': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'hepatit b': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  
  // BCG
  'bcg': { type: 'bcg', standardName: 'BCG' },
  
  // 5'li Karma (DaBT-İPA-Hib)
  'pentaxim': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  'infanrix': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  '5li karma': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  '5\'li karma': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  
  // 6'lı Karma
  'hexaxim': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)' },
  'infanrix hexa': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)' },
  '6li karma': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)' },
  '6\'lı karma': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)' },
  
  // Pnömokok
  'prevenar': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'synflorix': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'vaxneuvance': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'pnömokok': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'kpa': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  
  // Rotavirüs
  'rotarix': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotateq': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotavirus': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotavirüs': { type: 'rotavirus', standardName: 'Rotavirüs' },
  
  // KKK
  'priorix': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'm-m-r': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'mmr': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'kkk': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'kızamık kızamıkçık kabakulak': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  
  // Suçiçeği
  'varivax': { type: 'varicella', standardName: 'Suçiçeği' },
  'varilrix': { type: 'varicella', standardName: 'Suçiçeği' },
  'suçiçeği': { type: 'varicella', standardName: 'Suçiçeği' },
  'varicella': { type: 'varicella', standardName: 'Suçiçeği' },
  
  // KKKS (4'lü)
  'priorix tetra': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)' },
  'proquad': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)' },
  'kkks': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)' },
  
  // Hepatit A
  'havrix': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'vaqta': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'avaxim': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'hepatit a': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  
  // DaBT-İPA (4'lü)
  'tetravac': { type: 'dtap_ipv', standardName: 'DaBT-İPA (4\'lü Karma)' },
  'boostrix polio': { type: 'dtap_ipv', standardName: 'DaBT-İPA (4\'lü Karma)' },
  
  // Tdap
  'boostrix': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)' },
  'adacel': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)' },
  'tdap': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)' },
  
  // Meningokok
  'nimenrix': { type: 'meningococcal', standardName: 'Meningokok ACWY' },
  'menveo': { type: 'meningococcal', standardName: 'Meningokok ACWY' },
  'menactra': { type: 'meningococcal', standardName: 'Meningokok ACWY' },
  'bexsero': { type: 'meningococcal_b', standardName: 'Meningokok B' },
  'trumenba': { type: 'meningococcal_b', standardName: 'Meningokok B' },
  'meningokok': { type: 'meningococcal', standardName: 'Meningokok' },
  
  // Grip
  'fluarix': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'vaxigrip': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'influvac': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'flublok': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'influenza': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'grip': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  
  // HPV
  'gardasil': { type: 'hpv', standardName: 'HPV' },
  'cervarix': { type: 'hpv', standardName: 'HPV' },
  'hpv': { type: 'hpv', standardName: 'HPV' }
};

function identifyVaccineType(serviceName) {
  if (!serviceName) return null;
  
  const nameLower = serviceName.toLowerCase();
  
  // Tüm eşleştirmeleri kontrol et
  for (const [key, value] of Object.entries(vaccineMapping)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  
  // Genel aşı kontrolü
  if (nameLower.includes('aşı') || nameLower.includes('vaccine')) {
    return { type: 'unknown', standardName: serviceName };
  }
  
  return null;
}

async function syncVaccinesFromServices() {
  try {
    console.log('=== SERVICES\'TAN VACCINATIONS SENKRONIZASYONU ===\n');
    
    // 1. Services koleksiyonundan aşı kayıtlarını çek
    console.log('📋 Services koleksiyonu taranıyor...\n');
    
    // Grup_Adi "Aşılama" olanları çek
    const vaccineGroupSnapshot = await db.collection('services')
      .where('Grup_Adi', '==', 'Aşılama')
      .get();
    
    console.log(`✅ Grup_Adi "Aşılama" olan ${vaccineGroupSnapshot.size} kayıt bulundu`);
    
    // Tüm servisleri çek ve aşı ismi içerenleri filtrele
    const allServicesSnapshot = await db.collection('services').get();
    
    const vaccineServices = [];
    const patientVaccineMap = new Map(); // patientId -> vaccines[]
    
    // Grup_Adi "Aşılama" olanları ekle
    vaccineGroupSnapshot.forEach(doc => {
      const data = doc.data();
      // patientId kontrolü - hem undefined hem null hem de boş string kontrolü
      if (data.patientId && data.patientId !== '') {
        vaccineServices.push({ id: doc.id, ...data, source: 'grup_adi' });
      }
    });
    
    // serviceName'de aşı adı geçenleri ekle
    allServicesSnapshot.forEach(doc => {
      const data = doc.data();
      const serviceName = data.serviceName || data.name || data.originalServiceName || '';
      const vaccineInfo = identifyVaccineType(serviceName);
      
      if (vaccineInfo && data.patientId && data.Grup_Adi !== 'Aşılama') {
        vaccineServices.push({ 
          id: doc.id, 
          ...data, 
          vaccineInfo, 
          source: 'service_name' 
        });
      }
    });
    
    console.log(`✅ Toplam ${vaccineServices.length} aşı servisi tespit edildi\n`);
    
    // 2. Hasta bazlı grupla
    vaccineServices.forEach(service => {
      const patientId = service.patientId;
      if (!patientVaccineMap.has(patientId)) {
        patientVaccineMap.set(patientId, []);
      }
      patientVaccineMap.get(patientId).push(service);
    });
    
    console.log(`📊 ${patientVaccineMap.size} hastada aşı kaydı var\n`);
    
    // 3. Mevcut vaccinations kayıtlarını temizle
    console.log('🗑️ Eski vaccinations kayıtları temizleniyor...');
    const existingVaccinations = await db.collection('vaccinations').get();
    
    let deleteBatch = db.batch();
    let deleteCount = 0;
    let totalDeleted = 0;
    
    for (const doc of existingVaccinations.docs) {
      deleteBatch.delete(doc.ref);
      deleteCount++;
      totalDeleted++;
      
      if (deleteCount >= 400) {
        await deleteBatch.commit();
        deleteBatch = db.batch(); // Yeni batch oluştur
        deleteCount = 0;
      }
    }
    
    if (deleteCount > 0) {
      await deleteBatch.commit();
    }
    
    console.log(`✅ ${existingVaccinations.size} eski kayıt silindi\n`);
    
    // 4. Yeni vaccinations kayıtlarını oluştur
    console.log('📝 Yeni vaccination kayıtları oluşturuluyor...\n');
    
    let totalAdded = 0;
    let patientCount = 0;
    
    for (const [patientId, vaccines] of patientVaccineMap.entries()) {
      patientCount++;
      console.log(`İşleniyor: Hasta ${patientCount}/${patientVaccineMap.size} - ${vaccines.length} aşı`);
      
      const batch = db.batch();
      let batchCount = 0;
      
      // Her aşıyı ekle
      for (const vaccine of vaccines) {
        const vaccineInfo = vaccine.vaccineInfo || identifyVaccineType(
          vaccine.serviceName || vaccine.name || vaccine.originalServiceName
        );
        
        // Tarih kontrolü
        let vaccineDate;
        if (vaccine.date) {
          if (vaccine.date._seconds) {
            vaccineDate = new Date(vaccine.date._seconds * 1000);
          } else if (vaccine.date.seconds) {
            vaccineDate = new Date(vaccine.date.seconds * 1000);
          } else if (vaccine.date instanceof Date) {
            vaccineDate = vaccine.date;
          } else {
            vaccineDate = new Date(vaccine.date);
          }
        } else {
          vaccineDate = new Date();
        }
        
        const vaccinationData = {
          patientId: vaccine.patientId,
          patientName: vaccine.patientName || '',
          vaccineType: vaccineInfo?.type || 'unknown',
          vaccineName: vaccineInfo?.standardName || vaccine.serviceName || vaccine.name,
          originalServiceName: vaccine.originalServiceName || vaccine.serviceName || vaccine.name,
          protocolNo: vaccine.protocolNo || '',
          date: admin.firestore.Timestamp.fromDate(vaccineDate),
          provider: vaccine.doctorName || vaccine.provider || null,
          location: vaccine.clinicName || null,
          dose: vaccine.dose || 1,
          notes: vaccine.notes || '',
          sideEffects: [],
          metadata: {
            source: 'services',
            serviceId: vaccine.id,
            grupAdi: vaccine.Grup_Adi,
            importedAt: admin.firestore.FieldValue.serverTimestamp()
          },
          createdAt: vaccine.createdAt || admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = db.collection('vaccinations').doc();
        batch.set(docRef, vaccinationData);
        batchCount++;
        totalAdded++;
        
        if (batchCount >= 400) {
          await batch.commit();
          batchCount = 0;
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
    }
    
    console.log(`\n✅ Toplam ${totalAdded} vaccination kaydı oluşturuldu`);
    
    // 5. Özet rapor
    console.log('\n=== ÖZET RAPOR ===\n');
    
    const finalVaccinations = await db.collection('vaccinations').get();
    
    // Aşı türü dağılımı
    const vaccineTypes = {};
    finalVaccinations.forEach(doc => {
      const type = doc.data().vaccineType || 'unknown';
      vaccineTypes[type] = (vaccineTypes[type] || 0) + 1;
    });
    
    console.log('📊 AŞI TÜRÜ DAĞILIMI:');
    Object.entries(vaccineTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} kayıt`);
      });
    
    // Hasta başı ortalama
    console.log(`\n📈 İSTATİSTİKLER:`);
    console.log(`Toplam hasta: ${patientVaccineMap.size}`);
    console.log(`Toplam aşı kaydı: ${totalAdded}`);
    console.log(`Hasta başı ortalama: ${(totalAdded / patientVaccineMap.size).toFixed(1)} aşı`);
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

syncVaccinesFromServices();