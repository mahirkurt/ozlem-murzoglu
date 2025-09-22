const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Aşı markası-tip eşleştirme tablosu
const vaccineMapping = {
  'engerix': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'hbvaxpro': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'hepatit b': { type: 'hepatitis_b', standardName: 'Hepatit B' },
  'bcg': { type: 'bcg', standardName: 'BCG' },
  'pentaxim': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  'infanrix': { type: 'dtap_ipv_hib', standardName: 'DaBT-İPA-Hib (5\'li Karma)' },
  'hexaxim': { type: 'dtap_ipv_hib_hepb', standardName: 'DaBT-İPA-Hib-HepB (6\'lı Karma)' },
  'prevenar': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'synflorix': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'pnömokok': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'kpa': { type: 'pcv', standardName: 'KPA (Pnömokok)' },
  'rotarix': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotateq': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotavirus': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'rotavirüs': { type: 'rotavirus', standardName: 'Rotavirüs' },
  'priorix': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'mmr': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'kkk': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'kızamık': { type: 'mmr', standardName: 'KKK (Kızamık-Kızamıkçık-Kabakulak)' },
  'varivax': { type: 'varicella', standardName: 'Suçiçeği' },
  'varilrix': { type: 'varicella', standardName: 'Suçiçeği' },
  'suçiçeği': { type: 'varicella', standardName: 'Suçiçeği' },
  'priorix tetra': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)' },
  'proquad': { type: 'mmrv', standardName: 'KKKS (4\'lü Karma)' },
  'havrix': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'vaqta': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'hepatit a': { type: 'hepatitis_a', standardName: 'Hepatit A' },
  'boostrix': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)' },
  'tdap': { type: 'tdap', standardName: 'Tdap (Erişkin Tipi)' },
  'nimenrix': { type: 'meningococcal', standardName: 'Meningokok ACWY' },
  'menveo': { type: 'meningococcal', standardName: 'Meningokok ACWY' },
  'bexsero': { type: 'meningococcal_b', standardName: 'Meningokok B' },
  'meningokok': { type: 'meningococcal', standardName: 'Meningokok' },
  'fluarix': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'vaxigrip': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'influvac': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'influenza': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'grip': { type: 'influenza', standardName: 'İnfluenza (Grip)' },
  'gardasil': { type: 'hpv', standardName: 'HPV' },
  'cervarix': { type: 'hpv', standardName: 'HPV' },
  'hpv': { type: 'hpv', standardName: 'HPV' }
};

function identifyVaccineType(serviceName) {
  if (!serviceName) return null;
  
  const nameLower = serviceName.toLowerCase();
  
  for (const [key, value] of Object.entries(vaccineMapping)) {
    if (nameLower.includes(key)) {
      return value;
    }
  }
  
  if (nameLower.includes('aşı') || nameLower.includes('vaccine')) {
    return { type: 'unknown', standardName: serviceName };
  }
  
  return null;
}

async function createVaccinationsFromProtocols() {
  try {
    console.log('=== PROTOCOLS İLE SERVICES EŞLEŞTİRME VE VACCINATIONS OLUŞTURMA ===\n');
    
    // 1. Protocols koleksiyonunu analiz et
    console.log('📋 Protocols koleksiyonu analiz ediliyor...\n');
    
    const protocolsSnapshot = await db.collection('protocols').get();
    
    // Protocol numarası -> hasta bilgisi map'i oluştur
    const protocolPatientMap = new Map();
    
    protocolsSnapshot.forEach(doc => {
      const protocolNo = doc.id.replace('protocol_', '');
      const data = doc.data();
      
      // Patient bilgisini bul
      if (data.patientId) {
        protocolPatientMap.set(protocolNo, {
          patientId: data.patientId,
          patientName: data.patientName || data.name || ''
        });
      } else if (data.patient) {
        protocolPatientMap.set(protocolNo, {
          patientId: data.patient.id || data.patient.patientId,
          patientName: data.patient.name || ''
        });
      }
    });
    
    console.log(`✅ ${protocolPatientMap.size} protocol-hasta eşleştirmesi bulundu\n`);
    
    // 2. Services koleksiyonundan aşılama kayıtlarını al
    console.log('📋 Services koleksiyonundan aşılama kayıtları alınıyor...\n');
    
    // Aşılama grubundaki tüm kayıtları al
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
        ...data,
        source: 'Grup_Adi_Asilama'
      });
    });
    
    // serviceName'de aşı adı geçenleri al
    const allServicesSnapshot = await db.collection('services').get();
    let vaccineNameCount = 0;
    
    allServicesSnapshot.forEach(doc => {
      const data = doc.data();
      const serviceName = data.serviceName || data.name || data.originalServiceName || '';
      
      if (data.Grup_Adi !== 'Aşılama') {
        const vaccineInfo = identifyVaccineType(serviceName);
        if (vaccineInfo) {
          vaccineServices.push({
            id: doc.id,
            ...data,
            vaccineInfo,
            source: 'serviceName'
          });
          vaccineNameCount++;
        }
      }
    });
    
    console.log(`serviceName'de aşı adı geçen: ${vaccineNameCount} kayıt`);
    console.log(`Toplam aşı servisi: ${vaccineServices.length}\n`);
    
    // 3. Protocol numarası ile eşleştirme yap
    console.log('🔄 Protocol numarası ile hasta eşleştirmesi yapılıyor...\n');
    
    let matchedByProtocol = 0;
    let alreadyHasPatientId = 0;
    let noProtocolNo = 0;
    let protocolNotFound = 0;
    
    const vaccineRecords = [];
    
    for (const service of vaccineServices) {
      // Zaten patientId varsa kullan
      if (service.patientId) {
        alreadyHasPatientId++;
        vaccineRecords.push({
          ...service,
          matchMethod: 'existing_patientId'
        });
        continue;
      }
      
      // Protokol_No ile eşleştir
      const protocolNo = service.Protokol_No || service.protocolNo;
      
      if (!protocolNo) {
        noProtocolNo++;
        continue;
      }
      
      const patientInfo = protocolPatientMap.get(protocolNo);
      
      if (patientInfo) {
        matchedByProtocol++;
        vaccineRecords.push({
          ...service,
          patientId: patientInfo.patientId,
          patientName: service.Hasta_Adi || service.patientName || patientInfo.patientName,
          matchMethod: 'protocol_matching'
        });
      } else {
        protocolNotFound++;
      }
    }
    
    console.log('📊 Eşleştirme sonuçları:');
    console.log(`  ✅ Mevcut patientId: ${alreadyHasPatientId}`);
    console.log(`  ✅ Protocol ile eşleşen: ${matchedByProtocol}`);
    console.log(`  ❌ Protocol_No yok: ${noProtocolNo}`);
    console.log(`  ❌ Protocol bulunamadı: ${protocolNotFound}`);
    console.log(`  📋 Toplam vaccination kaydı oluşturulacak: ${vaccineRecords.length}\n`);
    
    // 4. Mevcut vaccinations koleksiyonunu temizle
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
    
    // 5. Yeni vaccinations kayıtlarını oluştur
    console.log('📝 Yeni vaccinations kayıtları oluşturuluyor...\n');
    
    let createBatch = db.batch();
    let createCount = 0;
    let totalCreated = 0;
    
    // Hasta bazında grupla
    const patientVaccineMap = new Map();
    
    for (const record of vaccineRecords) {
      if (!record.patientId) continue;
      
      if (!patientVaccineMap.has(record.patientId)) {
        patientVaccineMap.set(record.patientId, []);
      }
      patientVaccineMap.get(record.patientId).push(record);
    }
    
    console.log(`${patientVaccineMap.size} hasta için aşı kayıtları oluşturuluyor...\n`);
    
    for (const [patientId, vaccines] of patientVaccineMap.entries()) {
      for (const vaccine of vaccines) {
        const vaccineInfo = vaccine.vaccineInfo || 
          identifyVaccineType(vaccine.serviceName || vaccine.name || vaccine.originalServiceName);
        
        // Tarih kontrolü
        let vaccineDate = new Date();
        if (vaccine.date) {
          if (vaccine.date._seconds) {
            vaccineDate = new Date(vaccine.date._seconds * 1000);
          } else if (vaccine.date.seconds) {
            vaccineDate = new Date(vaccine.date.seconds * 1000);
          } else if (typeof vaccine.date === 'string') {
            vaccineDate = new Date(vaccine.date);
          } else if (vaccine.date instanceof Date) {
            vaccineDate = vaccine.date;
          }
        }
        
        const vaccinationData = {
          patientId: vaccine.patientId,
          patientName: vaccine.Hasta_Adi || vaccine.patientName || '',
          vaccineType: vaccineInfo?.type || 'unknown',
          vaccineName: vaccineInfo?.standardName || vaccine.serviceName || vaccine.name || '',
          originalServiceName: vaccine.originalServiceName || vaccine.serviceName || vaccine.name || '',
          protocolNo: vaccine.Protokol_No || vaccine.protocolNo || '',
          date: admin.firestore.Timestamp.fromDate(vaccineDate),
          provider: vaccine.doctorName || vaccine.provider || 'Dr. Özlem Mürzoğlu',
          location: vaccine.clinicName || 'Sağlık Peteğim Kliniği',
          dose: vaccine.dose || 1,
          notes: vaccine.notes || '',
          sideEffects: [],
          metadata: {
            source: 'services',
            serviceId: vaccine.id,
            grupAdi: vaccine.Grup_Adi || null,
            matchMethod: vaccine.matchMethod,
            importedAt: admin.firestore.FieldValue.serverTimestamp()
          },
          createdAt: vaccine.createdAt || admin.firestore.FieldValue.serverTimestamp(),
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
    
    if (createCount > 0) {
      await createBatch.commit();
    }
    
    console.log(`\n✅ Toplam ${totalCreated} vaccination kaydı oluşturuldu\n`);
    
    // 6. Final rapor
    console.log('=== ÖZET RAPOR ===\n');
    
    const finalVaccinations = await db.collection('vaccinations').get();
    
    // İstatistikler
    const stats = {
      vaccineTypes: {},
      matchMethods: {},
      patientsWithVaccines: new Set()
    };
    
    finalVaccinations.forEach(doc => {
      const data = doc.data();
      
      // Aşı türü
      const type = data.vaccineType || 'unknown';
      stats.vaccineTypes[type] = (stats.vaccineTypes[type] || 0) + 1;
      
      // Eşleştirme metodu
      const method = data.metadata?.matchMethod || 'unknown';
      stats.matchMethods[method] = (stats.matchMethods[method] || 0) + 1;
      
      // Hasta sayısı
      if (data.patientId) {
        stats.patientsWithVaccines.add(data.patientId);
      }
    });
    
    console.log('📊 AŞI TÜRLERİ:');
    Object.entries(stats.vaccineTypes)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} kayıt`);
      });
    
    console.log('\n📊 EŞLEŞTİRME YÖNTEMLERİ:');
    Object.entries(stats.matchMethods)
      .forEach(([method, count]) => {
        console.log(`  ${method}: ${count} kayıt`);
      });
    
    console.log('\n📈 GENEL İSTATİSTİKLER:');
    console.log(`  Toplam vaccination kaydı: ${finalVaccinations.size}`);
    console.log(`  Aşısı olan hasta sayısı: ${stats.patientsWithVaccines.size}`);
    console.log(`  Hasta başı ortalama: ${(finalVaccinations.size / stats.patientsWithVaccines.size).toFixed(1)} aşı`);
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

createVaccinationsFromProtocols();