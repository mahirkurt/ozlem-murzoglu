const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Turkish vaccine schedule
const turkishVaccineSchedule = {
  vaccines: [
    {
      id: 'hepatitis_b',
      name: 'Hepatit B',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 0, ageLabel: 'Doğumda' },
        { number: 2, name: '2. Doz', ageMonths: 1, ageLabel: '1. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' }
      ]
    },
    {
      id: 'bcg',
      name: 'BCG',
      doses: [
        { number: 1, name: 'Tek Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' }
      ]
    },
    {
      id: 'dpt_ipa_hib',
      name: 'DaBT-İPA-Hib',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' },
        { number: 4, name: 'Rapel', ageMonths: 18, ageLabel: '18. ayın sonunda' }
      ]
    },
    {
      id: 'pneumococcal',
      name: 'KPA',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' },
        { number: 4, name: 'Rapel', ageMonths: 12, ageLabel: '12. ayın sonunda' }
      ]
    },
    {
      id: 'rotavirus',
      name: 'Rotavirüs',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' }
      ]
    },
    {
      id: 'mmr',
      name: 'KKK',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 12, ageLabel: '12. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ]
    },
    {
      id: 'varicella',
      name: 'Suçiçeği',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 12, ageLabel: '12. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ]
    },
    {
      id: 'hepatitis_a',
      name: 'Hepatit A',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 18, ageLabel: '18. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 24, ageLabel: '24. ayın sonunda' }
      ]
    },
    {
      id: 'dpt_ipa',
      name: 'DaBT-İPA',
      doses: [
        { number: 1, name: 'Rapel', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ]
    },
    {
      id: 'td',
      name: 'Td',
      doses: [
        { number: 1, name: 'Rapel', ageMonths: 156, ageLabel: '13 yaş (8. sınıf)' }
      ]
    }
  ]
};

// WHO Growth Standards (simplified)
const whoGrowthStandards = {
  weightForAge_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p50: [3.5, 4.5, 5.6, 6.4, 7.0, 7.7, 8.2, 9.3, 10.3, 11.0, 11.8, 13.0, 14.7, 16.3, 18.3]
  },
  weightForAge_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p50: [3.3, 4.2, 5.1, 5.9, 6.4, 7.0, 7.5, 8.6, 9.5, 10.3, 11.0, 12.2, 14.1, 15.9, 18.0]
  },
  lengthForAge_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p50: [49.9, 54.7, 58.4, 61.4, 64.0, 66.0, 67.8, 71.8, 75.7, 79.0, 82.0, 87.1, 94.9, 101.6, 108.0]
  },
  lengthForAge_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p50: [49.2, 53.7, 57.1, 59.8, 62.2, 64.1, 65.9, 69.7, 73.6, 76.9, 80.0, 85.4, 93.6, 100.9, 107.4]
  },
  headCircumference_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36],
    p50: [34.5, 37.3, 39.3, 40.7, 41.8, 42.7, 43.5, 45.2, 46.4, 47.3, 48.0, 49.1, 50.5]
  },
  headCircumference_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36],
    p50: [33.9, 36.6, 38.3, 39.5, 40.6, 41.5, 42.2, 43.8, 45.0, 45.9, 46.7, 47.8, 49.2]
  }
};

// Helper functions
function generateGrowthMeasurements(patientId, birthDate, gender) {
  const measurements = [];
  const now = new Date();
  const ageInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
  
  // Limit to reasonable age range
  const maxAge = Math.min(ageInMonths, 60);
  const measurementAges = [0, 1, 2, 4, 6, 9, 12, 15, 18, 24, 36, 48, 60].filter(age => age <= maxAge);
  
  const weightData = gender === 'male' ? whoGrowthStandards.weightForAge_boys : whoGrowthStandards.weightForAge_girls;
  const heightData = gender === 'male' ? whoGrowthStandards.lengthForAge_boys : whoGrowthStandards.lengthForAge_girls;
  const headData = gender === 'male' ? whoGrowthStandards.headCircumference_boys : whoGrowthStandards.headCircumference_girls;
  
  measurementAges.forEach(age => {
    const measurementDate = new Date(birthDate);
    measurementDate.setMonth(measurementDate.getMonth() + age);
    
    // Only add if measurement date is in the past
    if (measurementDate <= now) {
      const ageIndex = weightData.months.indexOf(age);
      if (ageIndex !== -1) {
        const weightVariation = (Math.random() - 0.5) * 1.5;
        const heightVariation = (Math.random() - 0.5) * 3;
        const headVariation = (Math.random() - 0.5) * 1.5;
        
        measurements.push({
          patientId,
          measurementDate: admin.firestore.Timestamp.fromDate(measurementDate),
          weight: Math.round((weightData.p50[ageIndex] + weightVariation) * 10) / 10,
          height: Math.round((heightData.p50[ageIndex] + heightVariation) * 10) / 10,
          headCircumference: age <= 24 && headData.p50[ageIndex] ? 
            Math.round((headData.p50[ageIndex] + headVariation) * 10) / 10 : null,
          notes: `${age} aylık rutin kontrol`,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  });
  
  return measurements;
}

function generateVaccinationRecords(patientId, birthDate) {
  const records = [];
  const now = new Date();
  const ageInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
  
  const doctors = ['Dr. Ayşe Yılmaz', 'Dr. Mehmet Demir', 'Dr. Fatma Kaya', 'Dr. Ali Öztürk', 'Dr. Zeynep Arslan'];
  const clinics = ['Merkez Aile Sağlığı Merkezi', 'Çocuk Hastanesi', 'Özel Çocuk Kliniği', 'Devlet Hastanesi Çocuk Polikliniği'];
  
  turkishVaccineSchedule.vaccines.forEach(vaccine => {
    vaccine.doses.forEach(dose => {
      if (dose.ageMonths <= ageInMonths) {
        const vaccinationDate = new Date(birthDate);
        vaccinationDate.setMonth(vaccinationDate.getMonth() + dose.ageMonths);
        
        // Add some randomness (±7 days)
        vaccinationDate.setDate(vaccinationDate.getDate() + Math.floor(Math.random() * 14) - 7);
        
        // Only add if vaccination date is in the past
        if (vaccinationDate < now) {
          records.push({
            patientId,
            vaccineId: vaccine.id,
            vaccineName: vaccine.name,
            doseNumber: dose.number,
            doseName: dose.name,
            vaccinationDate: admin.firestore.Timestamp.fromDate(vaccinationDate),
            lotNumber: `LOT${Math.floor(100000 + Math.random() * 900000)}`,
            administeredBy: doctors[Math.floor(Math.random() * doctors.length)],
            clinic: clinics[Math.floor(Math.random() * clinics.length)],
            notes: dose.ageLabel,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    });
  });
  
  return records;
}

async function addDataForAllPatients() {
  try {
    console.log('🚀 TÜM HASTALAR İÇİN VERİ EKLEME BAŞLIYOR...\n');
    
    // Get all patients
    const patientsSnapshot = await db.collection('patients').get();
    console.log(`📊 Toplam ${patientsSnapshot.size} hasta bulundu\n`);
    
    // Get existing records to avoid duplicates
    console.log('Mevcut kayıtlar kontrol ediliyor...');
    const existingVaccinations = await db.collection('vaccination_records').get();
    const existingGrowth = await db.collection('growthMeasurements').get();
    
    const patientsWithVaccines = new Set();
    const patientsWithGrowth = new Set();
    
    existingVaccinations.forEach(doc => {
      patientsWithVaccines.add(doc.data().patientId);
    });
    
    existingGrowth.forEach(doc => {
      patientsWithGrowth.add(doc.data().patientId);
    });
    
    console.log(`✅ ${patientsWithVaccines.size} hastada aşı kaydı mevcut`);
    console.log(`✅ ${patientsWithGrowth.size} hastada büyüme kaydı mevcut\n`);
    
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let totalVaccineRecords = 0;
    let totalGrowthMeasurements = 0;
    
    // Process each patient
    for (const patientDoc of patientsSnapshot.docs) {
      const patientData = patientDoc.data();
      const patientId = patientDoc.id;
      
      // Skip if both data exist
      if (patientsWithVaccines.has(patientId) && patientsWithGrowth.has(patientId)) {
        skippedCount++;
        continue;
      }
      
      try {
        // Parse birth date
        let birthDate;
        if (patientData.birthDate) {
          if (patientData.birthDate._seconds) {
            birthDate = new Date(patientData.birthDate._seconds * 1000);
          } else if (patientData.birthDate.seconds) {
            birthDate = new Date(patientData.birthDate.seconds * 1000);
          } else if (typeof patientData.birthDate === 'string') {
            birthDate = new Date(patientData.birthDate);
          } else {
            // Generate random birth date between 2018-2023
            const year = 2018 + Math.floor(Math.random() * 6);
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            birthDate = new Date(year, month, day);
          }
        } else {
          // Generate random birth date between 2018-2023
          const year = 2018 + Math.floor(Math.random() * 6);
          const month = Math.floor(Math.random() * 12);
          const day = Math.floor(Math.random() * 28) + 1;
          birthDate = new Date(year, month, day);
        }
        
        const gender = patientData.gender || (Math.random() > 0.5 ? 'male' : 'female');
        
        // Add vaccination records if not exist
        if (!patientsWithVaccines.has(patientId)) {
          const vaccinationRecords = generateVaccinationRecords(patientId, birthDate);
          
          if (vaccinationRecords.length > 0) {
            const batch = db.batch();
            let batchCount = 0;
            
            for (const record of vaccinationRecords) {
              const recordRef = db.collection('vaccination_records').doc();
              batch.set(recordRef, record);
              batchCount++;
              
              if (batchCount >= 400) {
                await batch.commit();
                batchCount = 0;
              }
            }
            
            if (batchCount > 0) {
              await batch.commit();
            }
            
            totalVaccineRecords += vaccinationRecords.length;
          }
        }
        
        // Add growth measurements if not exist
        if (!patientsWithGrowth.has(patientId)) {
          const growthMeasurements = generateGrowthMeasurements(patientId, birthDate, gender);
          
          if (growthMeasurements.length > 0) {
            const batch = db.batch();
            let batchCount = 0;
            
            for (const measurement of growthMeasurements) {
              const measurementRef = db.collection('growthMeasurements').doc();
              batch.set(measurementRef, measurement);
              batchCount++;
              
              if (batchCount >= 400) {
                await batch.commit();
                batchCount = 0;
              }
            }
            
            if (batchCount > 0) {
              await batch.commit();
            }
            
            totalGrowthMeasurements += growthMeasurements.length;
          }
        }
        
        processedCount++;
        
        // Progress update
        if (processedCount % 10 === 0) {
          console.log(`İşlenen: ${processedCount + skippedCount}/${patientsSnapshot.size} hasta`);
        }
        
      } catch (error) {
        console.error(`Hata - Hasta ${patientId}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n✅ VERİ EKLEME TAMAMLANDI!\n');
    console.log('📊 ÖZET:');
    console.log(`- İşlenen hasta: ${processedCount}`);
    console.log(`- Atlanan hasta (veri zaten var): ${skippedCount}`);
    console.log(`- Hatalı hasta: ${errorCount}`);
    console.log(`- Eklenen aşı kaydı: ${totalVaccineRecords}`);
    console.log(`- Eklenen büyüme ölçümü: ${totalGrowthMeasurements}`);
    
    // Final verification
    console.log('\n🔍 SON DURUM KONTROLÜ:');
    const finalVaccinations = await db.collection('vaccination_records').get();
    const finalGrowth = await db.collection('growthMeasurements').get();
    
    const finalPatientsWithVaccines = new Set();
    const finalPatientsWithGrowth = new Set();
    
    finalVaccinations.forEach(doc => {
      finalPatientsWithVaccines.add(doc.data().patientId);
    });
    
    finalGrowth.forEach(doc => {
      finalPatientsWithGrowth.add(doc.data().patientId);
    });
    
    console.log(`✅ Toplam aşı kaydı: ${finalVaccinations.size}`);
    console.log(`✅ Aşı kaydı olan hasta: ${finalPatientsWithVaccines.size}/${patientsSnapshot.size} (%${((finalPatientsWithVaccines.size / patientsSnapshot.size) * 100).toFixed(1)})`);
    console.log(`✅ Toplam büyüme ölçümü: ${finalGrowth.size}`);
    console.log(`✅ Büyüme kaydı olan hasta: ${finalPatientsWithGrowth.size}/${patientsSnapshot.size} (%${((finalPatientsWithGrowth.size / patientsSnapshot.size) * 100).toFixed(1)})`);
    
    process.exit(0);
  } catch (error) {
    console.error('Kritik hata:', error);
    process.exit(1);
  }
}

// Run the script
addDataForAllPatients();