const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function syncVaccinationsFromServices() {
  try {
    console.log('=== VACCINATIONS KOLEKSİYONU SENKRONIZASYONU ===\n');
    
    // 1. Mevcut sahte location verilerini temizle
    console.log('🗑️ Sahte location verileri temizleniyor...');
    const vaccinationsSnapshot = await db.collection('vaccinations').get();
    
    let updateCount = 0;
    const batch = db.batch();
    let batchCount = 0;
    
    for (const doc of vaccinationsSnapshot.docs) {
      const data = doc.data();
      
      // Location "Sağlık Peteğim Kliniği" ise null yap
      if (data.location === 'Sağlık Peteğim Kliniği') {
        batch.update(doc.ref, {
          location: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        updateCount++;
        batchCount++;
        
        // Her 400 işlemde batch'i commit et
        if (batchCount >= 400) {
          await batch.commit();
          console.log(`  ${updateCount} kayıt güncellendi...`);
          batchCount = 0;
        }
      }
    }
    
    // Kalan batch işlemlerini commit et
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`✅ Toplam ${updateCount} kayıtta sahte location temizlendi\n`);
    
    // 2. Services koleksiyonundaki aşı verilerini kontrol et
    console.log('📋 Services koleksiyonu taranıyor...');
    const servicesSnapshot = await db.collection('services').get();
    
    // Aşı ile ilgili servisleri filtrele (name veya originalServiceName'de aşı kelimesi geçenler)
    const vaccineServices = [];
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const name = (data.name || '').toLowerCase();
      const originalName = (data.originalServiceName || '').toLowerCase();
      
      // Türkçe aşı isimleri ve kısaltmaları
      const vaccineKeywords = [
        'aşı', 'vaccine', 'immunization', 'bağışıklama',
        'hepatit', 'bcg', 'kkk', 'mmr', 'dbt', 'dabt', 'dpt', 
        'hib', 'ipa', 'opv', 'ipv', 'kpa', 'pnömokok', 
        'rotavirus', 'rotavirüs', 'suçiçeği', 'varicella',
        'kızamık', 'kızamıkçık', 'kabakulak', 'menenjit', 
        'meningokok', 'influenza', 'grip', 'hpv', 'td', 
        'tetanos', 'difteri', 'boğmaca'
      ];
      
      const isVaccine = vaccineKeywords.some(keyword => 
        name.includes(keyword) || originalName.includes(keyword)
      );
      
      if (isVaccine && data.patientId) {
        vaccineServices.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    console.log(`✅ ${vaccineServices.length} aşı servisi bulundu\n`);
    
    if (vaccineServices.length > 0) {
      console.log('📝 Vaccinations koleksiyonuna ekleniyor...');
      
      // Mevcut vaccination kayıtlarını kontrol et
      const existingVaccinations = new Set();
      vaccinationsSnapshot.forEach(doc => {
        const data = doc.data();
        // Unique key: protocolNo + patientId + date
        if (data.protocolNo && data.patientId && data.date) {
          const key = `${data.protocolNo}_${data.patientId}_${data.date._seconds || data.date.seconds}`;
          existingVaccinations.add(key);
        }
      });
      
      let addedCount = 0;
      const addBatch = db.batch();
      let addBatchCount = 0;
      
      for (const service of vaccineServices) {
        // Unique key kontrolü
        const dateSeconds = service.date?._seconds || service.date?.seconds || 0;
        const uniqueKey = `${service.protocolNo}_${service.patientId}_${dateSeconds}`;
        
        if (!existingVaccinations.has(uniqueKey)) {
          const vaccineData = {
            patientId: service.patientId,
            patientName: service.patientName || '',
            vaccineName: service.name || service.originalServiceName,
            originalServiceName: service.originalServiceName,
            protocolNo: service.protocolNo,
            date: service.date,
            provider: service.doctorName || null,
            location: null, // Services'tan gelen location kullanma
            dose: 1, // Default doz
            notes: service.notes || '',
            sideEffects: [],
            metadata: {
              source: 'services',
              serviceId: service.id,
              importedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            createdAt: service.createdAt || admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          const docRef = db.collection('vaccinations').doc();
          addBatch.set(docRef, vaccineData);
          addedCount++;
          addBatchCount++;
          
          if (addBatchCount >= 400) {
            await addBatch.commit();
            console.log(`  ${addedCount} kayıt eklendi...`);
            addBatchCount = 0;
          }
        }
      }
      
      if (addBatchCount > 0) {
        await addBatch.commit();
      }
      
      console.log(`✅ Toplam ${addedCount} yeni aşı kaydı eklendi\n`);
    }
    
    // 3. Final durum raporu
    console.log('📊 FINAL DURUM:');
    const finalVaccinations = await db.collection('vaccinations').get();
    const finalWithPatient = finalVaccinations.docs.filter(doc => doc.data().patientId).length;
    const finalWithoutPatient = finalVaccinations.docs.filter(doc => !doc.data().patientId).length;
    
    console.log('Toplam vaccination kaydı:', finalVaccinations.size);
    console.log('PatientId olan:', finalWithPatient);
    console.log('PatientId olmayan:', finalWithoutPatient);
    
    // Location durumu
    const locationStats = {};
    finalVaccinations.forEach(doc => {
      const location = doc.data().location || 'null';
      locationStats[location] = (locationStats[location] || 0) + 1;
    });
    
    console.log('\nLocation dağılımı:');
    Object.entries(locationStats).forEach(([loc, count]) => {
      console.log('  -', loc, ':', count);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

syncVaccinationsFromServices();