const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Büyüme verisi regex pattern'leri
const growthPatterns = {
  weight: {
    // 4.5 kg, 4,5 kg, 4500 gr, 4.500 gr, 3050g
    kg: /(\d+[,.]?\d*)\s*kg/gi,
    gr: /(\d+[,.]?\d*)\s*gr?(?:am)?/gi,
    kilo: /kilo[:\s]*(\d+[,.]?\d*)/gi,
    agirlik: /ağırlık[:\s]*(\d+[,.]?\d*)/gi,
    vücut: /vücut\s*ağırlığı[:\s]*(\d+[,.]?\d*)/gi,
    va: /VA[:\s]*(\d+[,.]?\d*)/gi,
    tartı: /tartı[:\s]*(\d+[,.]?\d*)/gi
  },
  height: {
    // 75 cm, 75.5 cm, 1.20 m
    cm: /(\d+[,.]?\d*)\s*cm/gi,
    boy: /boy[:\s]*(\d+[,.]?\d*)/gi,
    uzunluk: /uzunluk[:\s]*(\d+[,.]?\d*)/gi,
  },
  headCircumference: {
    // Baş çevresi: 42 cm
    bas: /baş\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    kafa: /kafa\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    bc: /b\.?ç\.?[:\s]*(\d+[,.]?\d*)/gi,
    bç: /BÇ[:\s]*(\d+[,.]?\d*)/gi
  }
};

// Doğum pattern'leri - personalHistory'de doğum bilgisi tespiti için
const birthPatterns = [
  /doğum/i,
  /doğmuş/i,
  /doğdu/i,
  /GH\s*da/i,  // Gebelik haftası
  /gestasyon/i,
  /c\/s/i,     // Sezaryen
  /normal\s*doğum/i,
  /vajinal/i
];

function isBirthRelated(text) {
  return birthPatterns.some(pattern => pattern.test(text));
}

function parseWeight(text) {
  const weights = [];
  
  // kg olarak ara
  let matches = [...text.matchAll(growthPatterns.weight.kg)];
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 0.5 && value < 200) { // Mantıklı kg aralığı
      weights.push({ value, unit: 'kg', match: match[0] });
    }
  }
  
  // gram olarak ara (genelde doğum ağırlığı için)
  matches = [...text.matchAll(growthPatterns.weight.gr)];
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 500 && value < 200000) { // Mantıklı gram aralığı
      weights.push({ value: value / 1000, unit: 'gr', match: match[0] }); // kg'a çevir
    }
  }
  
  // Diğer pattern'ler
  for (const pattern of [growthPatterns.weight.kilo, growthPatterns.weight.agirlik, 
                         growthPatterns.weight.vücut, growthPatterns.weight.va, 
                         growthPatterns.weight.tartı]) {
    matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (value > 0.5 && value < 200) {
        // Değer 100'den büyükse muhtemelen gram
        if (value > 100) {
          weights.push({ value: value / 1000, unit: 'gr', match: match[0] });
        } else {
          weights.push({ value, unit: 'kg', match: match[0] });
        }
      }
    }
  }
  
  // En güvenilir değeri seç (genelde ilk değer)
  return weights.length > 0 ? weights[0].value : null;
}

function parseHeight(text) {
  const heights = [];
  
  // cm olarak ara
  let matches = [...text.matchAll(growthPatterns.height.cm)];
  for (const match of matches) {
    const value = parseFloat(match[1].replace(',', '.'));
    if (value > 20 && value < 250) { // Mantıklı cm aralığı
      heights.push({ value, match: match[0] });
    }
  }
  
  // Boy pattern'leri
  for (const pattern of [growthPatterns.height.boy, growthPatterns.height.uzunluk]) {
    matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (value > 20 && value < 250) {
        heights.push({ value, match: match[0] });
      }
    }
  }
  
  return heights.length > 0 ? heights[0].value : null;
}

function parseHeadCircumference(text) {
  const values = [];
  
  for (const pattern of Object.values(growthPatterns.headCircumference)) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const value = parseFloat(match[1].replace(',', '.'));
      if (value > 20 && value < 70) { // Mantıklı baş çevresi aralığı
        values.push({ value, match: match[0] });
      }
    }
  }
  
  return values.length > 0 ? values[0].value : null;
}

async function extractGrowthProperly() {
  try {
    console.log('=== HEALTH RECORDS\'TAN DOĞRU BÜYÜME VERİSİ ÇIKARMA ===\n');
    
    // 1. Önce mevcut health_records kaynaklı verileri temizle
    console.log('🗑️ Eski health_records kaynaklı veriler temizleniyor...\n');
    
    const existingFromHealth = await db.collection('growthMeasurements')
      .where('source', '==', 'health_records')
      .get();
    
    if (!existingFromHealth.empty) {
      let deleteBatch = db.batch();
      let deleteCount = 0;
      
      for (const doc of existingFromHealth.docs) {
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
      
      console.log(`✅ ${existingFromHealth.size} eski kayıt temizlendi\n`);
    }
    
    // 2. Health_records koleksiyonunu al
    console.log('📋 Health_records koleksiyonu analiz ediliyor...\n');
    
    const healthRecordsSnapshot = await db.collection('health_records').get();
    console.log(`Toplam ${healthRecordsSnapshot.size} health_record bulundu\n`);
    
    // Patients koleksiyonundan doğum tarihleri al
    const patientsSnapshot = await db.collection('patients').get();
    const patientBirthDates = new Map();
    
    patientsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.birthDate) {
        let birthDate;
        if (data.birthDate._seconds) {
          birthDate = new Date(data.birthDate._seconds * 1000);
        } else if (data.birthDate.seconds) {
          birthDate = new Date(data.birthDate.seconds * 1000);
        } else if (typeof data.birthDate === 'string') {
          birthDate = new Date(data.birthDate);
        } else {
          birthDate = data.birthDate;
        }
        patientBirthDates.set(doc.id, birthDate);
      }
    });
    
    console.log(`${patientBirthDates.size} hasta için doğum tarihi bulundu\n`);
    
    // 3. Her health_record'u işle
    console.log('🔍 Büyüme verileri çıkarılıyor...\n');
    
    const growthMeasurements = [];
    let birthMeasurementCount = 0;
    let currentMeasurementCount = 0;
    let skippedCount = 0;
    
    healthRecordsSnapshot.forEach(doc => {
      const data = doc.data();
      const patientId = data.patientId || data.patient_id || data.PatientId;
      
      if (!patientId) {
        skippedCount++;
        return;
      }
      
      // Kayıt tarihi
      let recordDate;
      if (data.visitDate) {
        if (data.visitDate._seconds) {
          recordDate = new Date(data.visitDate._seconds * 1000);
        } else if (data.visitDate.seconds) {
          recordDate = new Date(data.visitDate.seconds * 1000);
        } else {
          recordDate = new Date(data.visitDate);
        }
      } else if (data.createdAt) {
        if (data.createdAt._seconds) {
          recordDate = new Date(data.createdAt._seconds * 1000);
        } else if (data.createdAt.seconds) {
          recordDate = new Date(data.createdAt.seconds * 1000);
        } else {
          recordDate = new Date(data.createdAt);
        }
      } else {
        recordDate = new Date();
      }
      
      // PersonalHistory'den DOĞUM ölçümlerini al
      if (data.personalHistory) {
        const personalHistoryLower = data.personalHistory.toLowerCase();
        
        // Doğumla ilgili bilgi var mı kontrol et
        if (isBirthRelated(personalHistoryLower)) {
          const birthWeight = parseWeight(personalHistoryLower);
          const birthHeight = parseHeight(personalHistoryLower);
          const birthHead = parseHeadCircumference(personalHistoryLower);
          
          if (birthWeight || birthHeight || birthHead) {
            // Doğum tarihini bul
            const birthDate = patientBirthDates.get(patientId);
            
            if (birthDate) {
              growthMeasurements.push({
                patientId: patientId,
                measurementDate: admin.firestore.Timestamp.fromDate(birthDate),
                weight: birthWeight,
                height: birthHeight,
                headCircumference: birthHead,
                notes: 'Doğum ölçümleri (personalHistory)',
                measurementType: 'birth',
                source: 'health_records',
                healthRecordId: doc.id,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
              birthMeasurementCount++;
            }
          }
        }
      }
      
      // Findings'ten GÜNCEL ölçümleri al
      if (data.findings) {
        const findingsLower = data.findings.toLowerCase();
        
        const currentWeight = parseWeight(findingsLower);
        const currentHeight = parseHeight(findingsLower);
        const currentHead = parseHeadCircumference(findingsLower);
        
        if (currentWeight || currentHeight || currentHead) {
          growthMeasurements.push({
            patientId: patientId,
            measurementDate: admin.firestore.Timestamp.fromDate(recordDate),
            weight: currentWeight,
            height: currentHeight,
            headCircumference: currentHead,
            notes: 'Muayene ölçümleri (findings)',
            measurementType: 'visit',
            source: 'health_records',
            healthRecordId: doc.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          currentMeasurementCount++;
        }
      }
    });
    
    console.log(`✅ Toplam ${growthMeasurements.length} büyüme verisi çıkarıldı:`);
    console.log(`  - ${birthMeasurementCount} doğum ölçümü (personalHistory)`);
    console.log(`  - ${currentMeasurementCount} güncel ölçüm (findings)`);
    console.log(`  - ${skippedCount} kayıt atlandı (patientId yok)\n`);
    
    // Örnek verileri göster
    if (growthMeasurements.length > 0) {
      console.log('📊 Örnek veriler:\n');
      
      // Doğum ölçümü örneği
      const birthExample = growthMeasurements.find(m => m.measurementType === 'birth');
      if (birthExample) {
        console.log('Doğum ölçümü örneği:');
        console.log(`  PatientId: ${birthExample.patientId}`);
        console.log(`  Tarih: Doğum günü`);
        console.log(`  Kilo: ${birthExample.weight || 'YOK'} kg`);
        console.log(`  Boy: ${birthExample.height || 'YOK'} cm`);
        console.log(`  Baş çevresi: ${birthExample.headCircumference || 'YOK'} cm\n`);
      }
      
      // Güncel ölçüm örneği
      const visitExample = growthMeasurements.find(m => m.measurementType === 'visit');
      if (visitExample) {
        console.log('Muayene ölçümü örneği:');
        console.log(`  PatientId: ${visitExample.patientId}`);
        console.log(`  Tarih: Muayene günü`);
        console.log(`  Kilo: ${visitExample.weight || 'YOK'} kg`);
        console.log(`  Boy: ${visitExample.height || 'YOK'} cm`);
        console.log(`  Baş çevresi: ${visitExample.headCircumference || 'YOK'} cm\n`);
      }
    }
    
    // 4. Verileri Firestore'a ekle
    console.log('📝 Yeni büyüme ölçümleri ekleniyor...\n');
    
    let addBatch = db.batch();
    let batchCount = 0;
    let totalAdded = 0;
    
    for (const measurement of growthMeasurements) {
      const docRef = db.collection('growthMeasurements').doc();
      addBatch.set(docRef, measurement);
      batchCount++;
      totalAdded++;
      
      if (batchCount >= 400) {
        await addBatch.commit();
        console.log(`${totalAdded} kayıt eklendi...`);
        addBatch = db.batch();
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      await addBatch.commit();
    }
    
    console.log(`\n✅ Toplam ${totalAdded} yeni büyüme ölçümü eklendi\n`);
    
    // 5. Final rapor
    console.log('=== ÖZET RAPOR ===\n');
    
    const finalMeasurements = await db.collection('growthMeasurements').get();
    
    // İstatistikler
    const stats = {
      totalMeasurements: finalMeasurements.size,
      patientsWithMeasurements: new Set(),
      sources: {},
      measurementTypes: {},
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
      
      const type = data.measurementType || 'unknown';
      stats.measurementTypes[type] = (stats.measurementTypes[type] || 0) + 1;
      
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

extractGrowthProperly();