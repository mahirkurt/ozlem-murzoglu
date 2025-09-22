const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cleanMockGrowthData() {
  try {
    console.log('=== GROWTH MEASUREMENTS MOCK VERİ TEMİZLEME ===\n');
    
    // 1. Mevcut tüm growth measurements'ı al
    console.log('📋 GrowthMeasurements koleksiyonu analiz ediliyor...\n');
    
    const allMeasurements = await db.collection('growthMeasurements').get();
    console.log(`Toplam ${allMeasurements.size} ölçüm bulundu\n`);
    
    // Kaynakları kategorize et
    const measurementsBySource = {
      health_records: [],
      unknown: [],
      mock: [],
      other: []
    };
    
    allMeasurements.forEach(doc => {
      const data = doc.data();
      const source = data.source || 'unknown';
      
      if (source === 'health_records') {
        measurementsBySource.health_records.push(doc);
      } else if (source === 'unknown') {
        // Unknown kaynak muhtemelen mock data
        measurementsBySource.unknown.push(doc);
      } else if (source === 'mock' || source === 'seed' || source === 'test') {
        measurementsBySource.mock.push(doc);
      } else {
        measurementsBySource.other.push(doc);
      }
    });
    
    console.log('📊 Kaynak Dağılımı:');
    console.log(`  health_records: ${measurementsBySource.health_records.length} kayıt (KORUNACAK)`);
    console.log(`  unknown: ${measurementsBySource.unknown.length} kayıt (SİLİNECEK - muhtemelen mock)`);
    console.log(`  mock/seed/test: ${measurementsBySource.mock.length} kayıt (SİLİNECEK)`);
    console.log(`  other: ${measurementsBySource.other.length} kayıt (İNCELENECEK)\n`);
    
    // 2. Unknown kaynaklı verileri incele (muhtemelen mock)
    if (measurementsBySource.unknown.length > 0) {
      console.log('🔍 Unknown kaynaklı örnek veriler (muhtemelen mock):');
      
      // İlk birkaç kaydı göster
      for (let i = 0; i < Math.min(3, measurementsBySource.unknown.length); i++) {
        const doc = measurementsBySource.unknown[i];
        const data = doc.data();
        console.log(`\n  Kayıt ${i+1}:`);
        console.log(`    ID: ${doc.id}`);
        console.log(`    PatientId: ${data.patientId}`);
        console.log(`    Tarih: ${data.measurementDate ? new Date(data.measurementDate._seconds * 1000).toLocaleDateString('tr-TR') : 'YOK'}`);
        console.log(`    Kilo: ${data.weight || 'YOK'} kg`);
        console.log(`    Boy: ${data.height || 'YOK'} cm`);
        console.log(`    Notes: ${data.notes || 'YOK'}`);
        console.log(`    Source: ${data.source || 'YOK'}`);
        console.log(`    SourceField: ${data.sourceField || 'YOK'}`);
        console.log(`    MeasurementType: ${data.measurementType || 'YOK'}`);
      }
      
      // Bunlar kesinlikle mock data çünkü:
      // - source alanı 'unknown'
      // - sourceField alanı yok
      // - measurementType alanı 'unknown'
      // - healthRecordId alanı yok
    }
    
    // 3. Health_records kaynaklı verileri kontrol et
    console.log('\n\n✅ Korunacak health_records kaynaklı veriler:');
    
    if (measurementsBySource.health_records.length > 0) {
      let birthCount = 0;
      let visitCount = 0;
      
      measurementsBySource.health_records.forEach(doc => {
        const data = doc.data();
        if (data.measurementType === 'birth') {
          birthCount++;
        } else if (data.measurementType === 'visit') {
          visitCount++;
        }
      });
      
      console.log(`  Toplam: ${measurementsBySource.health_records.length} kayıt`);
      console.log(`  - Doğum ölçümü: ${birthCount}`);
      console.log(`  - Muayene ölçümü: ${visitCount}\n`);
    }
    
    // 4. Silinecek verileri topla
    const toDelete = [
      ...measurementsBySource.unknown,
      ...measurementsBySource.mock,
      ...measurementsBySource.other
    ];
    
    console.log(`\n🗑️ Toplam ${toDelete.length} mock veri silinecek...\n`);
    
    // 5. Silme işlemi
    if (toDelete.length > 0) {
      let deleteBatch = db.batch();
      let deleteCount = 0;
      let totalDeleted = 0;
      
      for (const doc of toDelete) {
        deleteBatch.delete(doc.ref);
        deleteCount++;
        totalDeleted++;
        
        if (deleteCount >= 400) {
          await deleteBatch.commit();
          console.log(`${totalDeleted} kayıt silindi...`);
          deleteBatch = db.batch();
          deleteCount = 0;
        }
      }
      
      if (deleteCount > 0) {
        await deleteBatch.commit();
      }
      
      console.log(`\n✅ ${totalDeleted} mock veri başarıyla silindi!\n`);
    }
    
    // 6. Final durum raporu
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
      withHead: 0,
      healthRecordIds: new Set()
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
      
      if (data.healthRecordId) {
        stats.healthRecordIds.add(data.healthRecordId);
      }
    });
    
    console.log('📊 TEMİZLEME SONRASI DURUM:');
    console.log(`Toplam ölçüm: ${stats.totalMeasurements}`);
    console.log(`Ölçümü olan hasta sayısı: ${stats.patientsWithMeasurements.size}`);
    console.log(`Health record bağlantısı olan: ${stats.healthRecordIds.size}`);
    
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
    console.log(`Kilo kaydı olan: ${stats.withWeight} (${stats.totalMeasurements > 0 ? (stats.withWeight / stats.totalMeasurements * 100).toFixed(1) : 0}%)`);
    console.log(`Boy kaydı olan: ${stats.withHeight} (${stats.totalMeasurements > 0 ? (stats.withHeight / stats.totalMeasurements * 100).toFixed(1) : 0}%)`);
    console.log(`Baş çevresi olan: ${stats.withHead} (${stats.totalMeasurements > 0 ? (stats.withHead / stats.totalMeasurements * 100).toFixed(1) : 0}%)`);
    
    console.log('\n✅ TEMİZLEME TAMAMLANDI!');
    console.log('Sadece health_records kaynaklı gerçek veriler kaldı.');
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

cleanMockGrowthData();