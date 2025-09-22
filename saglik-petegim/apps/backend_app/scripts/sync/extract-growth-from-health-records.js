const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Büyüme verisi regex pattern'leri
const growthPatterns = {
  weight: {
    // 4.5 kg, 4,5 kg, 4500 gr, 4.500 gr
    kg: /(\d+[,.]?\d*)\s*kg/gi,
    gr: /(\d+[,.]?\d*)\s*gr(?:am)?/gi,
    kilo: /kilo[:\s]*(\d+[,.]?\d*)/gi,
    agirlik: /ağırlık[:\s]*(\d+[,.]?\d*)/gi
  },
  height: {
    // 75 cm, 75.5 cm, 1.20 m
    cm: /(\d+[,.]?\d*)\s*cm/gi,
    m: /(\d+[,.]?\d*)\s*m(?:etre)?(?!\w)/gi,
    boy: /boy[:\s]*(\d+[,.]?\d*)/gi,
    uzunluk: /uzunluk[:\s]*(\d+[,.]?\d*)/gi
  },
  headCircumference: {
    // Baş çevresi: 42 cm
    bas: /baş\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    kafa: /kafa\s*çevresi[:\s]*(\d+[,.]?\d*)/gi,
    bc: /b\.?ç\.?[:\s]*(\d+[,.]?\d*)/gi
  }
};

// Tarih pattern'leri
const datePatterns = {
  full: /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g,  // 01/01/2024
  monthYear: /(\w+)\s+(\d{4})/g,  // Ocak 2024
  relative: /(\d+)\s*(ay|hafta|gün)\s*(önce|evvel)/gi  // 2 ay önce
};

// Türkçe ay isimleri
const monthNames = {
  'ocak': 0, 'şubat': 1, 'mart': 2, 'nisan': 3,
  'mayıs': 4, 'haziran': 5, 'temmuz': 6, 'ağustos': 7,
  'eylül': 8, 'ekim': 9, 'kasım': 10, 'aralık': 11
};

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
  
  return weights.length > 0 ? weights[weights.length - 1] : null; // En son değeri al
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
  
  return heights.length > 0 ? heights[heights.length - 1] : null;
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
  
  return values.length > 0 ? values[values.length - 1] : null;
}

function parseDate(text, recordDate) {
  // Tam tarih formatı
  let match = datePatterns.full.exec(text);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const year = parseInt(match[3]);
    return new Date(year, month, day);
  }
  
  // Ay-Yıl formatı
  match = datePatterns.monthYear.exec(text);
  if (match) {
    const monthName = match[1].toLowerCase();
    const year = parseInt(match[2]);
    const month = monthNames[monthName];
    if (month !== undefined) {
      return new Date(year, month, 15); // Ayın ortası
    }
  }
  
  // Göreceli tarih
  match = datePatterns.relative.exec(text);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const date = new Date(recordDate);
    
    if (unit.includes('ay')) {
      date.setMonth(date.getMonth() - value);
    } else if (unit.includes('hafta')) {
      date.setDate(date.getDate() - (value * 7));
    } else if (unit.includes('gün')) {
      date.setDate(date.getDate() - value);
    }
    
    return date;
  }
  
  // Tarih bulunamazsa kayıt tarihini kullan
  return recordDate;
}

async function extractGrowthFromHealthRecords() {
  try {
    console.log('=== HEALTH RECORDS\'TAN BÜYÜME VERİSİ ÇIKARMA ===\n');
    
    // 1. Health_records koleksiyonunu al
    console.log('📋 Health_records koleksiyonu analiz ediliyor...\n');
    
    const healthRecordsSnapshot = await db.collection('health_records').get();
    console.log(`Toplam ${healthRecordsSnapshot.size} health_record bulundu\n`);
    
    // PersonalHistory alanı olanları filtrele
    const recordsWithHistory = [];
    healthRecordsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.personalHistory && data.personalHistory.trim()) {
        // PatientId alanını kontrol et - farklı varyasyonları dene
        const patientId = data.patientId || data.patient_id || data.PatientId || null;
        
        if (patientId) {
          recordsWithHistory.push({
            id: doc.id,
            patientId: patientId,
            personalHistory: data.personalHistory,
            createdAt: data.createdAt,
            date: data.visitDate || data.createdAt
          });
        }
      }
    });
    
    console.log(`PersonalHistory alanı olan ${recordsWithHistory.length} kayıt bulundu\n`);
    
    // Örnek personalHistory göster
    if (recordsWithHistory.length > 0) {
      console.log('Örnek personalHistory metni:');
      console.log(recordsWithHistory[0].personalHistory.substring(0, 300) + '...\n');
    }
    
    // 2. Her kayıttan büyüme verisi çıkar
    console.log('🔍 Büyüme verileri çıkarılıyor...\n');
    
    const growthMeasurements = [];
    let extractedCount = 0;
    
    for (const record of recordsWithHistory) {
      const text = record.personalHistory.toLowerCase();
      
      // Büyüme verilerini parse et
      const weight = parseWeight(text);
      const height = parseHeight(text);
      const headCircumference = parseHeadCircumference(text);
      
      // En az bir veri varsa kaydet
      if (weight || height || headCircumference) {
        const recordDate = record.date ? 
          (record.date._seconds ? new Date(record.date._seconds * 1000) : new Date(record.date)) :
          new Date();
        
        const measurementDate = parseDate(text, recordDate);
        
        growthMeasurements.push({
          patientId: record.patientId,
          measurementDate: admin.firestore.Timestamp.fromDate(measurementDate),
          weight: weight,
          height: height,
          headCircumference: headCircumference,
          notes: `Health record'dan çıkarıldı (${record.id})`,
          source: 'health_records',
          healthRecordId: record.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        extractedCount++;
        
        if (extractedCount <= 5) {
          console.log(`Kayıt ${extractedCount}:`);
          console.log(`  PatientId: ${record.patientId}`);
          console.log(`  Kilo: ${weight || 'YOK'} kg`);
          console.log(`  Boy: ${height || 'YOK'} cm`);
          console.log(`  Baş çevresi: ${headCircumference || 'YOK'} cm\n`);
        }
      }
    }
    
    console.log(`✅ ${extractedCount} kayıttan büyüme verisi çıkarıldı\n`);
    
    // 3. Mevcut growthMeasurements'ı kontrol et
    console.log('📊 Mevcut growthMeasurements kontrol ediliyor...\n');
    
    const existingMeasurements = await db.collection('growthMeasurements').get();
    console.log(`Mevcut ${existingMeasurements.size} büyüme ölçümü var\n`);
    
    // Health_records'tan gelen kayıtları kontrol et
    const existingFromHealth = new Set();
    existingMeasurements.forEach(doc => {
      const data = doc.data();
      if (data.source === 'health_records' && data.healthRecordId) {
        existingFromHealth.add(data.healthRecordId);
      }
    });
    
    console.log(`${existingFromHealth.size} kayıt zaten health_records'tan eklenmiş\n`);
    
    // 4. Yeni kayıtları ekle
    console.log('📝 Yeni büyüme ölçümleri ekleniyor...\n');
    
    let addedCount = 0;
    let skippedCount = 0;
    const batch = db.batch();
    let batchCount = 0;
    
    for (const measurement of growthMeasurements) {
      // Zaten eklenmişse atla
      if (measurement.healthRecordId && existingFromHealth.has(measurement.healthRecordId)) {
        skippedCount++;
        continue;
      }
      
      const docRef = db.collection('growthMeasurements').doc();
      batch.set(docRef, measurement);
      batchCount++;
      addedCount++;
      
      if (batchCount >= 400) {
        await batch.commit();
        console.log(`${addedCount} kayıt eklendi...`);
        batchCount = 0;
      }
    }
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    console.log(`\n✅ ${addedCount} yeni büyüme ölçümü eklendi`);
    console.log(`⏭️ ${skippedCount} kayıt zaten mevcut olduğu için atlandı\n`);
    
    // 5. Final rapor
    console.log('=== ÖZET RAPOR ===\n');
    
    const finalMeasurements = await db.collection('growthMeasurements').get();
    
    // İstatistikler
    const stats = {
      totalMeasurements: finalMeasurements.size,
      patientsWithMeasurements: new Set(),
      sources: {},
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
    console.log(`Kilo kaydı olan: ${stats.withWeight} (${(stats.withWeight / stats.totalMeasurements * 100).toFixed(1)}%)`);
    console.log(`Boy kaydı olan: ${stats.withHeight} (${(stats.withHeight / stats.totalMeasurements * 100).toFixed(1)}%)`);
    console.log(`Baş çevresi olan: ${stats.withHead} (${(stats.withHead / stats.totalMeasurements * 100).toFixed(1)}%)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

extractGrowthFromHealthRecords();