const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function matchProtocol21Patients() {
  try {
    console.log('=== PROTOKOL_NO 21 HASTA EŞLEŞTİRME ===\n');
    
    // 1. Services koleksiyonunda Protokol_No = "21" olanları bul
    console.log('📋 Services koleksiyonunda Protokol_No "21" kayıtları aranıyor...\n');
    
    const protocol21Services = await db.collection('services')
      .where('Protokol_No', '==', '21')
      .get();
    
    console.log(`✅ Protokol_No "21" olan ${protocol21Services.size} kayıt bulundu\n`);
    
    if (protocol21Services.empty) {
      console.log('Protokol_No "21" olan kayıt bulunamadı.');
      process.exit(0);
    }
    
    // İlk birkaç kaydı incele
    console.log('Örnek kayıtlar:');
    protocol21Services.docs.slice(0, 5).forEach((doc, index) => {
      const data = doc.data();
      console.log(`\nKayıt ${index + 1}:`);
      console.log('  ID:', doc.id);
      console.log('  Protokol_No:', data.Protokol_No);
      console.log('  patientId:', data.patientId || 'YOK');
      console.log('  patientName:', data.patientName || 'YOK');
      console.log('  Hasta_Adi:', data.Hasta_Adi || 'YOK');
      console.log('  serviceName:', data.serviceName || 'YOK');
      console.log('  Grup_Adi:', data.Grup_Adi || 'YOK');
    });
    
    // 2. Protocols koleksiyonunu kontrol et
    console.log('\n\n📋 Protocols koleksiyonu kontrol ediliyor...\n');
    
    const protocolsSnapshot = await db.collection('protocols').limit(10).get();
    
    console.log(`Protocols koleksiyonunda ${protocolsSnapshot.size} doküman örneği:`);
    protocolsSnapshot.docs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.id}`);
      const data = doc.data();
      if (data.patients) {
        console.log(`     - patients alanı var (${Object.keys(data.patients || {}).length} kayıt)`);
      }
    });
    
    // 3. Patients koleksiyonunu kontrol et
    console.log('\n\n📋 Patients koleksiyonu kontrol ediliyor...\n');
    
    const patientsSnapshot = await db.collection('patients').get();
    console.log(`Patients koleksiyonunda toplam ${patientsSnapshot.size} hasta kaydı var\n`);
    
    // 4. Services'daki Hasta_Adi ile patients'taki name eşleştir
    console.log('🔄 Hasta isimleri üzerinden eşleştirme yapılıyor...\n');
    
    // Hasta adı -> patientId map oluştur
    const patientNameMap = new Map();
    patientsSnapshot.forEach(doc => {
      const data = doc.data();
      const name = data.name || '';
      const firstName = data.firstName || '';
      const lastName = data.lastName || '';
      
      // Farklı kombinasyonları dene
      if (name) {
        patientNameMap.set(name.toUpperCase(), doc.id);
      }
      if (firstName && lastName) {
        const fullName = `${firstName} ${lastName}`.toUpperCase();
        patientNameMap.set(fullName, doc.id);
      }
    });
    
    console.log(`${patientNameMap.size} benzersiz hasta adı haritalandı\n`);
    
    // 5. Services kayıtlarını güncelle
    console.log('📝 Services kayıtları güncelleniyor...\n');
    
    let matchedCount = 0;
    let unmatchedCount = 0;
    const unmatchedNames = new Set();
    
    const batch = db.batch();
    let batchCount = 0;
    
    for (const serviceDoc of protocol21Services.docs) {
      const data = serviceDoc.data();
      
      // Zaten patientId varsa atla
      if (data.patientId) {
        console.log(`Zaten patientId var: ${serviceDoc.id}`);
        continue;
      }
      
      // Hasta adını bul
      const hastaAdi = data.Hasta_Adi || data.patientName || '';
      
      if (!hastaAdi) {
        unmatchedCount++;
        continue;
      }
      
      // Eşleştirme yap
      const normalizedName = hastaAdi.toUpperCase();
      const patientId = patientNameMap.get(normalizedName);
      
      if (patientId) {
        // PatientId'yi güncelle
        batch.update(serviceDoc.ref, {
          patientId: patientId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          matchedBy: 'protocol_21_matching'
        });
        
        batchCount++;
        matchedCount++;
        
        // Her 400 işlemde batch'i commit et
        if (batchCount >= 400) {
          await batch.commit();
          console.log(`${matchedCount} kayıt güncellendi...`);
          batchCount = 0;
        }
      } else {
        unmatchedCount++;
        unmatchedNames.add(hastaAdi);
      }
    }
    
    // Kalan güncellemeleri commit et
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log('\n✅ EŞLEŞTİRME TAMAMLANDI!\n');
    console.log('📊 SONUÇLAR:');
    console.log(`Toplam Protokol_No "21" kaydı: ${protocol21Services.size}`);
    console.log(`Eşleştirilen: ${matchedCount}`);
    console.log(`Eşleştirilemeyen: ${unmatchedCount}`);
    
    if (unmatchedNames.size > 0 && unmatchedNames.size <= 20) {
      console.log('\n❌ Eşleştirilemeyen hasta isimleri:');
      Array.from(unmatchedNames).slice(0, 20).forEach(name => {
        console.log(`  - ${name}`);
      });
    }
    
    // 6. Aşılama grubundaki kayıtları da kontrol et
    if (matchedCount > 0) {
      console.log('\n\n🔄 Aşılama grubundaki kayıtlar güncelleniyor...\n');
      
      const vaccinationServices = await db.collection('services')
        .where('Grup_Adi', '==', 'Aşılama')
        .get();
      
      let vaccineMatchedCount = 0;
      const vaccineBatch = db.batch();
      let vaccineBatchCount = 0;
      
      for (const serviceDoc of vaccinationServices.docs) {
        const data = serviceDoc.data();
        
        if (data.patientId) {
          continue;
        }
        
        const hastaAdi = data.Hasta_Adi || data.patientName || '';
        const normalizedName = hastaAdi.toUpperCase();
        const patientId = patientNameMap.get(normalizedName);
        
        if (patientId) {
          vaccineBatch.update(serviceDoc.ref, {
            patientId: patientId,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            matchedBy: 'protocol_21_matching'
          });
          
          vaccineBatchCount++;
          vaccineMatchedCount++;
          
          if (vaccineBatchCount >= 400) {
            await vaccineBatch.commit();
            console.log(`${vaccineMatchedCount} aşı kaydı güncellendi...`);
            vaccineBatchCount = 0;
          }
        }
      }
      
      if (vaccineBatchCount > 0) {
        await vaccineBatch.commit();
      }
      
      console.log(`\n✅ ${vaccineMatchedCount} aşı kaydına patientId eklendi`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

matchProtocol21Patients();