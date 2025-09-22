const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Büyüme verisi regex pattern'leri
const growthPatterns = {
  weight: {
    kg: /(\d+[,.]?\d*)\s*kg/gi,
    gr: /(\d+[,.]?\d*)\s*gr(?:am)?/gi,
    kilo: /kilo[:\s]*(\d+[,.]?\d*)/gi,
    agirlik: /ağırlık[:\s]*(\d+[,.]?\d*)/gi
  },
  height: {
    cm: /(\d+[,.]?\d*)\s*cm/gi,
    m: /(\d+[,.]?\d*)\s*m(?:etre)?(?!\w)/gi,
    boy: /boy[:\s]*(\d+[,.]?\d*)/gi,
    uzunluk: /uzunluk[:\s]*(\d+[,.]?\d*)/gi
  },
  headCircumference: {
    bas: /baş\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    kafa: /kafa\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    bc: /b\.?ç\.?[:\s]*(\d+[,.]?\d*)/gi
  }
};

// Doğum belirteci pattern'leri
const birthIndicators = [
  /doğum\s*(kilosu|ağırlığı|boyu)/i,
  /doğumda/i,
  /\d+\.\s*gün/i,
  /\d+\.\s*hafta/i,
  /GH\s*da/i,  // Gestasyonel hafta
  /c\/s/i,     // Sezaryen doğum
  /nsd/i,      // Normal spontan doğum
  /normal\s*doğum/i,
  /sezaryen/i
];

function parseWeight(text) {
  const weights = [];
  
  // kg olarak ara
  let matches = text.matchAll(growthPatterns.weight.kg);
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 0 && value < 100) { // Mantıklı kg aralığı
      weights.push(value);
    }
  }
  
  // gram olarak ara
  matches = text.matchAll(growthPatterns.weight.gr);
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 100 && value < 100000) { // Mantıklı gram aralığı
      weights.push(value / 1000); // kg'a çevir
    }
  }
  
  return weights.length > 0 ? weights[0] : null; // İlk değeri al
}

function parseHeight(text) {
  const heights = [];
  
  // cm olarak ara
  let matches = text.matchAll(growthPatterns.height.cm);
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 20 && value < 250) { // Mantıklı cm aralığı
      heights.push(value);
    }
  }
  
  // metre olarak ara
  matches = text.matchAll(growthPatterns.height.m);
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 0.2 && value < 2.5) { // Mantıklı metre aralığı
      heights.push(value * 100); // cm'e çevir
    }
  }
  
  return heights.length > 0 ? heights[0] : null;
}

function parseHeadCircumference(text) {
  const values = [];
  
  for (const pattern of Object.values(growthPatterns.headCircumference)) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (value > 20 && value < 70) { // Mantıklı baş çevresi aralığı
        values.push(value);
      }
    }
  }
  
  return values.length > 0 ? values[0] : null;
}

function isBirthMeasurement(text) {
  const lowerText = text.toLowerCase();
  return birthIndicators.some(pattern => pattern.test(lowerText));
}

async function getPatientBirthDate(patientId) {
  try {
    const patientDoc = await db.collection('patients').doc(patientId).get();
    if (patientDoc.exists) {
      const data = patientDoc.data();
      if (data.birthDate) {
        if (data.birthDate._seconds) {
          return new Date(data.birthDate._seconds * 1000);
        } else if (data.birthDate.seconds) {
          return new Date(data.birthDate.seconds * 1000);
        } else if (typeof data.birthDate === 'string') {
          return new Date(data.birthDate);
        } else if (data.birthDate instanceof Date) {
          return data.birthDate;
        }
      }
    }
  } catch (error) {
    console.log(`Hasta ${patientId} için doğum tarihi alınamadı:`, error.message);
  }
  return null;
}

async function completeGrowthMeasurementsUpdate() {
  try {
    console.log('=== GROWTH MEASUREMENTS KOMPLE GÜNCELLEME ===\n');
    
    // 1. Mevcut health_records kaynaklı verileri temizle
    console.log('🗑️ Eski health_records kaynaklı veriler temizleniyor...\n');
    
    const oldHealthRecords = await db.collection('growthMeasurements')
      .where('source', '==', 'health_records')
      .get();
    
    if (!oldHealthRecords.empty) {
      let deleteBatch = db.batch();
      let deleteCount = 0;
      
      for (const doc of oldHealthRecords.docs) {
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
      
      console.log(`✅ ${oldHealthRecords.size} eski kayıt temizlendi\n`);
    }
    
    // 2. Health_records koleksiyonunu al
    console.log('📋 Health_records koleksiyonu analiz ediliyor...\n');
    
    const healthRecordsSnapshot = await db.collection('health_records').get();
    console.log(`Toplam ${healthRecordsSnapshot.size} health_record bulundu\n`);
    
    // 3. Her kayıttan büyüme verisi çıkar
    console.log('🔍 Büyüme verileri çıkarılıyor...\n');
    
    const growthMeasurements = [];
    let birthMeasurementCount = 0;
    let visitMeasurementCount = 0;
    let skippedNoPatientId = 0;
    
    // Hasta doğum tarihlerini cache'le
    const patientBirthDates = new Map();
    
    for (const doc of healthRecordsSnapshot.docs) {
      const data = doc.data();
      const patientId = data.patientId || data.patient_id || data.PatientId || null;
      
      if (!patientId) {
        skippedNoPatientId++;
        continue;
      }
      
      // Hasta doğum tarihini al (cache'te yoksa)
      if (!patientBirthDates.has(patientId)) {
        const birthDate = await getPatientBirthDate(patientId);
        patientBirthDates.set(patientId, birthDate);
      }
      
      const patientBirthDate = patientBirthDates.get(patientId);
      
      // Kayıt tarihini al
      let recordDate = new Date();
      if (data.visitDate || data.date || data.createdAt) {
        const dateField = data.visitDate || data.date || data.createdAt;
        if (dateField._seconds) {
          recordDate = new Date(dateField._seconds * 1000);
        } else if (dateField.seconds) {
          recordDate = new Date(dateField.seconds * 1000);
        } else if (typeof dateField === 'string') {
          recordDate = new Date(dateField);
        } else if (dateField instanceof Date) {
          recordDate = dateField;
        }
      }
      
      // PersonalHistory'den doğum ölçümlerini al
      if (data.personalHistory && data.personalHistory.trim()) {
        const text = data.personalHistory.toLowerCase();
        
        // Doğum belirteci kontrolü
        if (isBirthMeasurement(text)) {
          const weight = parseWeight(text);
          const height = parseHeight(text);
          const headCircumference = parseHeadCircumference(text);
          
          if (weight || height || headCircumference) {
            // Doğum tarihi varsa kullan, yoksa kayıt tarihinden tahmin et
            const measurementDate = patientBirthDate || recordDate;
            
            growthMeasurements.push({
              patientId: patientId,
              measurementDate: admin.firestore.Timestamp.fromDate(measurementDate),
              weight: weight,
              height: height,
              headCircumference: headCircumference,
              notes: `Health record'dan çıkarıldı - PersonalHistory (${doc.id})`,
              source: 'health_records',
              sourceField: 'personalHistory',
              measurementType: 'birth',
              healthRecordId: doc.id,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            birthMeasurementCount++;
          }
        }
      }
      
      // Findings'ten güncel ölçümleri al
      if (data.findings && data.findings.trim()) {
        const text = data.findings.toLowerCase();
        
        const weight = parseWeight(text);
        const height = parseHeight(text);
        const headCircumference = parseHeadCircumference(text);
        
        if (weight || height || headCircumference) {
          growthMeasurements.push({
            patientId: patientId,
            measurementDate: admin.firestore.Timestamp.fromDate(recordDate),
            weight: weight,
            height: height,
            headCircumference: headCircumference,
            notes: `Health record'dan çıkarıldı - Findings (${doc.id})`,
            source: 'health_records',
            sourceField: 'findings',
            measurementType: 'visit',
            healthRecordId: doc.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          visitMeasurementCount++;
        }
      }
    }
    
    console.log(`✅ Toplam ${growthMeasurements.length} büyüme verisi çıkarıldı:`);
    console.log(`  - ${birthMeasurementCount} doğum ölçümü (personalHistory)`);
    console.log(`  - ${visitMeasurementCount} muayene ölçümü (findings)`);
    console.log(`  - ${skippedNoPatientId} kayıt atlandı (patientId yok)\n`);
    
    // 4. Yeni kayıtları ekle
    console.log('📝 Yeni büyüme ölçümleri ekleniyor...\n');
    
    let addedCount = 0;
    let batch = db.batch();
    let batchCount = 0;
    
    for (const measurement of growthMeasurements) {
      const docRef = db.collection('growthMeasurements').doc();
      batch.set(docRef, measurement);
      batchCount++;
      addedCount++;
      
      if (batchCount >= 400) {
        await batch.commit();
        console.log(`${addedCount} kayıt eklendi...`);
        batch = db.batch();
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`\n✅ Toplam ${addedCount} yeni büyüme ölçümü eklendi\n`);
    
    // 5. Örnek kayıtları göster
    if (growthMeasurements.length > 0) {
      console.log('📊 Örnek veriler:\n');
      
      // Doğum ölçümü örneği
      const birthExample = growthMeasurements.find(m => m.measurementType === 'birth');
      if (birthExample) {
        console.log('Doğum ölçümü örneği:');
        console.log(`  PatientId: ${birthExample.patientId}`);
        console.log(`  Kaynak: ${birthExample.sourceField}`);
        console.log(`  Tarih: Doğum günü`);
        console.log(`  Kilo: ${birthExample.weight || 'YOK'} kg`);
        console.log(`  Boy: ${birthExample.height || 'YOK'} cm`);
        console.log(`  Baş çevresi: ${birthExample.headCircumference || 'YOK'} cm\n`);
      }
      
      // Muayene ölçümü örneği
      const visitExample = growthMeasurements.find(m => m.measurementType === 'visit');
      if (visitExample) {
        console.log('Muayene ölçümü örneği:');
        console.log(`  PatientId: ${visitExample.patientId}`);
        console.log(`  Kaynak: ${visitExample.sourceField}`);
        console.log(`  Tarih: Muayene günü`);
        console.log(`  Kilo: ${visitExample.weight || 'YOK'} kg`);
        console.log(`  Boy: ${visitExample.height || 'YOK'} cm`);
        console.log(`  Baş çevresi: ${visitExample.headCircumference || 'YOK'} cm\n`);
      }
    }
    
    // 6. Final rapor
    console.log('=== ÖZET RAPOR ===\n');
    
    const finalMeasurements = await db.collection('growthMeasurements').get();
    
    // İstatistikler
    const stats = {
      totalMeasurements: finalMeasurements.size,
      patientsWithMeasurements: new Set(),
      sources: {},
      measurementTypes: {},
      sourceFields: {},
      withWeight: 0,
      withHeight: 0,
      withHead: 0
    };
    
    finalMeasurements.forEach(doc => {
      const data = doc.data();
      
      if (data.patientId) {
        stats.patientsWithMeasurements.add(data.patientId);
      }
      
      const source = data.source || 'unknown';
      stats.sources[source] = (stats.sources[source] || 0) + 1;
      
      const measurementType = data.measurementType || 'unknown';
      stats.measurementTypes[measurementType] = (stats.measurementTypes[measurementType] || 0) + 1;
      
      const sourceField = data.sourceField || 'unknown';
      stats.sourceFields[sourceField] = (stats.sourceFields[sourceField] || 0) + 1;
      
      if (data.weight) stats.withWeight++;
      if (data.height) stats.withHeight++;
      if (data.headCircumference) stats.withHead++;
    });
    
    console.log('📊 BÜYÜME ÖLÇÜMLERİ:');
    console.log(`Toplam ölçüm: ${stats.totalMeasurements}`);
    console.log(`Ölçümü olan hasta sayısı: ${stats.patientsWithMeasurements.size}`);
    console.log(`Hasta başı ortalama: ${(stats.totalMeasurements / stats.patientsWithMeasurements.size).toFixed(1)} ölçüm`);
    
    console.log('\n📋 VERİ KAYNAKLARI:');
    Object.entries(stats.sources).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} kayıt`);
    });
    
    console.log('\n📏 ÖLÇÜM TÜRLERİ:');
    Object.entries(stats.measurementTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} kayıt`);
    });
    
    console.log('\n📄 KAYNAK ALANLAR:');
    Object.entries(stats.sourceFields).forEach(([field, count]) => {
      console.log(`  ${field}: ${count} kayıt`);
    });
    
    console.log('\n📐 ÖLÇÜM İÇERİĞİ:');
    console.log(`Kilo kaydı olan: ${stats.withWeight} (${(stats.withWeight / stats.totalMeasurements * 100).toFixed(1)}%)`);
    console.log(`Boy kaydı olan: ${stats.withHeight} (${(stats.withHeight / stats.totalMeasurements * 100).toFixed(1)}%)`);
    console.log(`Baş çevresi olan: ${stats.withHead} (${(stats.withHead / stats.totalMeasurements * 100).toFixed(1)}%)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

completeGrowthMeasurementsUpdate();