const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkVaccineServices() {
  try {
    console.log('=== SERVICES VE VACCINATIONS ANALİZİ ===\n');
    
    // 1. Services koleksiyonu analizi
    console.log('📋 SERVICES KOLEKSİYONU:');
    const servicesSnapshot = await db.collection('services').get();
    console.log('Toplam servis sayısı:', servicesSnapshot.size);
    
    // Kategori analizi
    const categories = {};
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const category = data.categoryName || 'KATEGORI_YOK';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('\nKategori dağılımı:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log('  -', cat, ':', count, 'kayıt');
    });
    
    // Aşı servisleri ara
    let vaccineCount = 0;
    const vaccineServices = [];
    
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      const name = (data.name || '').toLowerCase();
      const originalName = (data.originalServiceName || '').toLowerCase();
      
      if (name.includes('aşı') || name.includes('vaccine') || 
          originalName.includes('aşı') || originalName.includes('vaccine') ||
          name.includes('mmr') || name.includes('kkk') || 
          name.includes('hepatit') || name.includes('bcg') ||
          name.includes('dpt') || name.includes('hib') ||
          name.includes('rotavirus') || name.includes('suçiçeği')) {
        vaccineCount++;
        if (vaccineServices.length < 10) {
          vaccineServices.push({
            id: doc.id,
            name: data.name,
            originalName: data.originalServiceName,
            category: data.categoryName,
            protocolNo: data.protocolNo,
            patientId: data.patientId,
            date: data.date
          });
        }
      }
    });
    
    console.log('\n📉 Aşı ile ilgili servisler:');
    console.log('Toplam aşı servisi:', vaccineCount);
    
    if (vaccineServices.length > 0) {
      console.log('\nÖrnek aşı servisleri:');
      vaccineServices.forEach(s => {
        console.log('  - Name:', s.name);
        console.log('    Original:', s.originalName);
        console.log('    Category:', s.category);
        console.log('    PatientId:', s.patientId);
        console.log('');
      });
    }
    
    // 2. Vaccinations koleksiyonu kontrolü
    console.log('\n📋 VACCINATIONS KOLEKSİYONU:');
    const vaccinationsSnapshot = await db.collection('vaccinations').get();
    console.log('Toplam vaccination kaydı:', vaccinationsSnapshot.size);
    
    // Sahte location verileri kontrolü
    let fakeLocationCount = 0;
    const locationsToClean = [];
    
    vaccinationsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.location === 'Sağlık Peteğim Kliniği') {
        fakeLocationCount++;
        locationsToClean.push(doc.id);
      }
    });
    
    console.log('\nTemizlenecek kayıtlar:');
    console.log('Sahte location kaydı:', fakeLocationCount);
    
    // 3. Vaccinations'ta patientId olmayan kayıtları services ile eşleştir
    const vaccinationsWithoutPatient = [];
    vaccinationsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.patientId) {
        vaccinationsWithoutPatient.push({
          id: doc.id,
          protocolNo: data.protocolNo,
          vaccineName: data.vaccineName,
          patientName: data.patientName
        });
      }
    });
    
    console.log('\nPatientId olmayan vaccination kayıtları:', vaccinationsWithoutPatient.length);
    if (vaccinationsWithoutPatient.length > 0 && vaccinationsWithoutPatient.length < 10) {
      console.log('Örnekler:');
      vaccinationsWithoutPatient.slice(0, 5).forEach(v => {
        console.log('  -', v.vaccineName, '- Patient:', v.patientName);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

checkVaccineServices();