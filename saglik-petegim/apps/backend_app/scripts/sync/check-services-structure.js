const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkServicesStructure() {
  try {
    console.log('=== SERVICES KOLEKSİYONU DETAYLI ANALİZ ===\n');
    
    // Grup_Adi Aşılama olanları kontrol et
    const vaccineGroupSnapshot = await db.collection('services')
      .where('Grup_Adi', '==', 'Aşılama')
      .limit(10)
      .get();
    
    console.log('Grup_Adi "Aşılama" olan örnek kayıtlar:\n');
    
    vaccineGroupSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`Kayıt ${index + 1}:`);
      console.log('  ID:', doc.id);
      console.log('  patientId:', data.patientId || 'YOK');
      console.log('  patientName:', data.patientName || 'YOK');
      console.log('  serviceName:', data.serviceName || 'YOK');
      console.log('  originalServiceName:', data.originalServiceName || 'YOK');
      console.log('  name:', data.name || 'YOK');
      console.log('  protocolNo:', data.protocolNo || 'YOK');
      console.log('  date:', data.date || 'YOK');
      console.log('  Grup_Adi:', data.Grup_Adi);
      console.log('');
    });
    
    // Toplam sayılar
    const allVaccineServices = await db.collection('services')
      .where('Grup_Adi', '==', 'Aşılama')
      .get();
    
    let withPatientId = 0;
    let withoutPatientId = 0;
    const patientIds = new Set();
    
    allVaccineServices.forEach(doc => {
      const data = doc.data();
      if (data.patientId && data.patientId !== '') {
        withPatientId++;
        patientIds.add(data.patientId);
      } else {
        withoutPatientId++;
      }
    });
    
    console.log('📊 ÖZET:');
    console.log('Toplam Aşılama servisi:', allVaccineServices.size);
    console.log('PatientId olan:', withPatientId);
    console.log('PatientId olmayan:', withoutPatientId);
    console.log('Unique hasta sayısı:', patientIds.size);
    
    // PatientId örnekleri
    if (patientIds.size > 0) {
      console.log('\nÖrnek patientId\'ler:');
      Array.from(patientIds).slice(0, 5).forEach(id => {
        console.log('  -', id);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

checkServicesStructure();