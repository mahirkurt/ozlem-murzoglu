const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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

async function fixVaccinationDatesFromProtocols() {
  try {
    console.log('=== VACCINATIONS TARİHLERİNİ PROTOCOLS\'DAN DÜZELTME ===\n');
    
    // 1. Protocols koleksiyonunu al ve tarih map'i oluştur
    console.log('📋 Protocols koleksiyonu analiz ediliyor...\n');
    
    const protocolsSnapshot = await db.collection('protocols').get();
    const protocolDateMap = new Map();
    let protocolsWithDate = 0;
    let protocolsWithoutDate = 0;
    
    protocolsSnapshot.forEach(doc => {
      const protocolNo = doc.id.replace('protocol_', '');
      const data = doc.data();
      
      // Farklı tarih alanlarını kontrol et
      let protocolDate = null;
      
      // Öncelik sırasına göre tarihleri kontrol et
      if (data.date) {
        protocolDate = parseDate(data.date);
      } else if (data.visitDate) {
        protocolDate = parseDate(data.visitDate);
      } else if (data.createdAt) {
        protocolDate = parseDate(data.createdAt);
      } else if (data.timestamp) {
        protocolDate = parseDate(data.timestamp);
      }
      
      if (protocolDate) {
        protocolDateMap.set(protocolNo, protocolDate);
        protocolsWithDate++;
      } else {
        protocolsWithoutDate++;
      }
    });
    
    console.log(`✅ ${protocolsSnapshot.size} protocol analiz edildi:`);
    console.log(`  - ${protocolsWithDate} protocol'de tarih bulundu`);
    console.log(`  - ${protocolsWithoutDate} protocol'de tarih bulunamadı\n`);
    
    // Örnek protocol tarihleri göster
    console.log('📅 Örnek protocol tarihleri:');
    let exampleCount = 0;
    for (const [protocolNo, date] of protocolDateMap.entries()) {
      if (exampleCount >= 5) break;
      console.log(`  Protocol ${protocolNo}: ${date.toLocaleDateString('tr-TR')}`);
      exampleCount++;
    }
    console.log();
    
    // 2. Services koleksiyonundan tarih bilgisi al
    console.log('📋 Services koleksiyonundan tarih bilgileri alınıyor...\n');
    
    const servicesSnapshot = await db.collection('services').get();
    const serviceProtocolDateMap = new Map();
    
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const protocolNo = data.Protokol_No || data.protocolNo;
      
      if (protocolNo) {
        // Services'tan da tarihi al
        let serviceDate = parseDate(data.Islem_Tarihi) || 
                         parseDate(data.islem_tarihi) || 
                         parseDate(data.date) ||
                         parseDate(data.createdAt);
        
        if (serviceDate) {
          // Her protocol için en eski tarihi sakla
          if (!serviceProtocolDateMap.has(protocolNo)) {
            serviceProtocolDateMap.set(protocolNo, serviceDate);
          } else {
            const existingDate = serviceProtocolDateMap.get(protocolNo);
            if (serviceDate < existingDate) {
              serviceProtocolDateMap.set(protocolNo, serviceDate);
            }
          }
        }
      }
    });
    
    console.log(`✅ ${serviceProtocolDateMap.size} protocol için services'tan tarih bulundu\n`);
    
    // Protocol ve services tarihlerini birleştir (services öncelikli)
    const combinedDateMap = new Map();
    
    // Önce protocol tarihlerini ekle
    for (const [protocolNo, date] of protocolDateMap.entries()) {
      combinedDateMap.set(protocolNo, {
        date: date,
        source: 'protocols'
      });
    }
    
    // Services tarihlerini ekle veya güncelle
    for (const [protocolNo, date] of serviceProtocolDateMap.entries()) {
      if (!combinedDateMap.has(protocolNo) || combinedDateMap.get(protocolNo).source === 'protocols') {
        combinedDateMap.set(protocolNo, {
          date: date,
          source: 'services'
        });
      }
    }
    
    console.log(`📊 Toplam ${combinedDateMap.size} protocol için tarih hazır\n`);
    
    // 3. Vaccinations koleksiyonunu güncelle
    console.log('📝 Vaccinations kayıtları güncelleniyor...\n');
    
    const vaccinationsSnapshot = await db.collection('vaccinations').get();
    
    let updateBatch = db.batch();
    let updateCount = 0;
    let totalUpdated = 0;
    let noProtocolCount = 0;
    let noDateFoundCount = 0;
    let alreadyHasDateCount = 0;
    
    for (const doc of vaccinationsSnapshot.docs) {
      const data = doc.data();
      const protocolNo = data.protocolNo || data.Protokol_No || '';
      
      if (!protocolNo) {
        noProtocolCount++;
        continue;
      }
      
      // Zaten tarihi varsa ve mantıklıysa atla
      const existingDate = parseDate(data.date);
      if (existingDate && existingDate.getFullYear() > 2000) {
        alreadyHasDateCount++;
        continue;
      }
      
      // Protocol veya services'tan tarih bul
      const dateInfo = combinedDateMap.get(protocolNo);
      
      if (!dateInfo) {
        noDateFoundCount++;
        continue;
      }
      
      // Tarihi güncelle
      updateBatch.update(doc.ref, {
        date: admin.firestore.Timestamp.fromDate(dateInfo.date),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        dateSource: dateInfo.source,
        dateFixed: true
      });
      
      updateCount++;
      totalUpdated++;
      
      if (updateCount >= 400) {
        await updateBatch.commit();
        console.log(`${totalUpdated} kayıt güncellendi...`);
        updateBatch = db.batch();
        updateCount = 0;
      }
    }
    
    if (updateCount > 0) {
      await updateBatch.commit();
    }
    
    console.log('\n✅ GÜNCELLEME TAMAMLANDI!\n');
    console.log('📊 SONUÇLAR:');
    console.log(`Toplam vaccination kaydı: ${vaccinationsSnapshot.size}`);
    console.log(`Güncellenen: ${totalUpdated}`);
    console.log(`Zaten tarihi olan: ${alreadyHasDateCount}`);
    console.log(`Protocol numarası yok: ${noProtocolCount}`);
    console.log(`Tarih bulunamadı: ${noDateFoundCount}\n`);
    
    // 4. Güncellenmiş vaccinations'ları kontrol et
    console.log('📋 Güncellenmiş vaccinations kontrolü...\n');
    
    const updatedVaccinations = await db.collection('vaccinations').get();
    
    const stats = {
      withDate: 0,
      withoutDate: 0,
      datesBySource: {},
      datesByYear: {}
    };
    
    updatedVaccinations.forEach(doc => {
      const data = doc.data();
      const date = parseDate(data.date);
      
      if (date) {
        stats.withDate++;
        
        // Kaynak istatistiği
        const source = data.dateSource || 'unknown';
        stats.datesBySource[source] = (stats.datesBySource[source] || 0) + 1;
        
        // Yıl istatistiği
        const year = date.getFullYear();
        if (year > 2000 && year < 2030) {
          stats.datesByYear[year] = (stats.datesByYear[year] || 0) + 1;
        }
      } else {
        stats.withoutDate++;
      }
    });
    
    console.log('📊 TARİH İSTATİSTİKLERİ:');
    console.log(`Tarihi olan: ${stats.withDate} (${(stats.withDate / updatedVaccinations.size * 100).toFixed(1)}%)`);
    console.log(`Tarihi olmayan: ${stats.withoutDate} (${(stats.withoutDate / updatedVaccinations.size * 100).toFixed(1)}%)`);
    
    console.log('\n📋 TARİH KAYNAKLARI:');
    Object.entries(stats.datesBySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} kayıt`);
    });
    
    console.log('\n📅 YILLARA GÖRE DAĞILIM:');
    Object.entries(stats.datesByYear)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .forEach(([year, count]) => {
        console.log(`  ${year}: ${count} aşı`);
      });
    
    // 5. Örnek güncellenmiş kayıtlar
    console.log('\n📊 Örnek güncellenmiş kayıtlar:\n');
    
    const exampleVaccinations = await db.collection('vaccinations')
      .where('dateFixed', '==', true)
      .limit(5)
      .get();
    
    exampleVaccinations.forEach((doc, index) => {
      const data = doc.data();
      const date = parseDate(data.date);
      console.log(`${index + 1}. Aşı:`);
      console.log(`   Hasta: ${data.patientName || data.patientId}`);
      console.log(`   Aşı: ${data.vaccineName || data.vaccineType}`);
      console.log(`   Protocol: ${data.protocolNo}`);
      console.log(`   Tarih: ${date ? date.toLocaleDateString('tr-TR') : 'YOK'}`);
      console.log(`   Kaynak: ${data.dateSource || 'unknown'}\n`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

fixVaccinationDatesFromProtocols();