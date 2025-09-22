const admin = require('firebase-admin');
const serviceAccount = require('../../../../service-account.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Türkiye Sağlık Bakanlığı Genişletilmiş Bağışıklama Programı (EPI) Aşı Takvimi 2024
const turkishVaccineSchedule = {
  vaccines: [
    {
      id: 'hepatitis_b',
      name: 'Hepatit B',
      nameEn: 'Hepatitis B',
      description: 'Hepatit B virüsüne karşı koruyucu aşı',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 0, ageLabel: 'Doğumda' },
        { number: 2, name: '2. Doz', ageMonths: 1, ageLabel: '1. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Hafif ateş'],
      contraindications: ['Aşının içeriğine karşı alerji']
    },
    {
      id: 'bcg',
      name: 'BCG',
      nameEn: 'BCG (Tuberculosis)',
      description: 'Tüberküloza karşı koruyucu aşı',
      category: 'mandatory',
      doses: [
        { number: 1, name: 'Tek Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' }
      ],
      sideEffects: ['Enjeksiyon yerinde yara', 'Lenf bezi şişmesi'],
      contraindications: ['İmmün yetmezlik', 'HIV pozitif']
    },
    {
      id: 'dpt_ipa_hib',
      name: 'DaBT-İPA-Hib',
      nameEn: 'DTaP-IPV-Hib',
      description: 'Difteri, Boğmaca, Tetanos, Polio ve Hib aşısı (5\'li karma)',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' },
        { number: 4, name: 'Rapel', ageMonths: 18, ageLabel: '18. ayın sonunda' }
      ],
      sideEffects: ['Ateş', 'Huzursuzluk', 'Enjeksiyon yerinde şişlik'],
      contraindications: ['Ağır alerjik reaksiyon öyküsü', 'Ensefalopati']
    },
    {
      id: 'pneumococcal',
      name: 'KPA',
      nameEn: 'PCV (Pneumococcal)',
      description: 'Konjuge Pnömokok aşısı',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' },
        { number: 4, name: 'Rapel', ageMonths: 12, ageLabel: '12. ayın sonunda' }
      ],
      sideEffects: ['Ateş', 'İştahsızlık', 'Enjeksiyon yerinde kızarıklık'],
      contraindications: ['Önceki dozda şiddetli alerjik reaksiyon']
    },
    {
      id: 'rotavirus',
      name: 'Rotavirüs',
      nameEn: 'Rotavirus',
      description: 'Rotavirüs gastroenteritine karşı oral aşı',
      category: 'recommended',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 2, ageLabel: '2. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 4, ageLabel: '4. ayın sonunda' },
        { number: 3, name: '3. Doz', ageMonths: 6, ageLabel: '6. ayın sonunda' }
      ],
      sideEffects: ['Hafif ishal', 'Kusma', 'Huzursuzluk'],
      contraindications: ['İmmün yetmezlik', 'Bağırsak tıkanıklığı öyküsü']
    },
    {
      id: 'mmr',
      name: 'KKK',
      nameEn: 'MMR',
      description: 'Kızamık, Kızamıkçık, Kabakulak aşısı',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 12, ageLabel: '12. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ],
      sideEffects: ['Ateş', 'Döküntü', 'Eklem ağrısı'],
      contraindications: ['Gebelik', 'İmmün yetmezlik', 'Jelatin alerjisi']
    },
    {
      id: 'varicella',
      name: 'Suçiçeği',
      nameEn: 'Varicella',
      description: 'Suçiçeğine karşı koruyucu aşı',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 12, ageLabel: '12. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Hafif döküntü'],
      contraindications: ['Gebelik', 'İmmün yetmezlik']
    },
    {
      id: 'hepatitis_a',
      name: 'Hepatit A',
      nameEn: 'Hepatitis A',
      description: 'Hepatit A virüsüne karşı koruyucu aşı',
      category: 'mandatory',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 18, ageLabel: '18. ayın sonunda' },
        { number: 2, name: '2. Doz', ageMonths: 24, ageLabel: '24. ayın sonunda' }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Yorgunluk', 'Baş ağrısı'],
      contraindications: ['Aşı bileşenlerine alerji']
    },
    {
      id: 'dpt_ipa',
      name: 'DaBT-İPA',
      nameEn: 'DTaP-IPV',
      description: 'Difteri, Boğmaca, Tetanos, Polio aşısı (4\'lü karma)',
      category: 'mandatory',
      doses: [
        { number: 1, name: 'Rapel', ageMonths: 48, ageLabel: '48. ayda (İlkokul 1. sınıf)' }
      ],
      sideEffects: ['Ateş', 'Enjeksiyon yerinde ağrı'],
      contraindications: ['Önceki dozda ciddi reaksiyon']
    },
    {
      id: 'td',
      name: 'Td',
      nameEn: 'Td',
      description: 'Erişkin tipi Difteri-Tetanos aşısı',
      category: 'mandatory',
      doses: [
        { number: 1, name: 'Rapel', ageMonths: 156, ageLabel: '13 yaş (8. sınıf)' }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Kas ağrısı'],
      contraindications: ['Önceki dozda ciddi reaksiyon']
    },
    {
      id: 'meningococcal',
      name: 'Meningokok',
      nameEn: 'Meningococcal',
      description: 'Meningokok enfeksiyonuna karşı koruyucu aşı',
      category: 'recommended',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 12, ageLabel: '12. ay' },
        { number: 2, name: 'Rapel', ageMonths: 132, ageLabel: '11 yaş' }
      ],
      sideEffects: ['Ateş', 'Baş ağrısı', 'Yorgunluk'],
      contraindications: ['Aşı bileşenlerine alerji']
    },
    {
      id: 'influenza',
      name: 'İnfluenza (Grip)',
      nameEn: 'Influenza',
      description: 'Mevsimsel grip aşısı',
      category: 'recommended',
      doses: [
        { number: 1, name: 'Yıllık', ageMonths: 6, ageLabel: '6. aydan itibaren her yıl', isRecurring: true }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Hafif ateş', 'Kas ağrısı'],
      contraindications: ['Yumurta alerjisi (bazı aşı tipleri için)']
    },
    {
      id: 'hpv',
      name: 'HPV',
      nameEn: 'HPV',
      description: 'İnsan Papilloma Virüsü aşısı',
      category: 'recommended',
      doses: [
        { number: 1, name: '1. Doz', ageMonths: 144, ageLabel: '12 yaş' },
        { number: 2, name: '2. Doz', ageMonths: 150, ageLabel: '12.5 yaş (1. dozdan 6 ay sonra)' }
      ],
      sideEffects: ['Enjeksiyon yerinde ağrı', 'Baş ağrısı', 'Baş dönmesi'],
      contraindications: ['Gebelik', 'Aşı bileşenlerine alerji']
    }
  ]
};

// WHO Büyüme Standartları (0-5 yaş)
const whoGrowthStandards = {
  // Kilo persentil değerleri (kg) - Erkek
  weightForAge_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [2.5, 3.4, 4.3, 5.1, 5.7, 6.2, 6.7, 7.8, 8.6, 9.2, 9.8, 10.8, 12.3, 13.7, 15.3],
    p15: [2.9, 3.9, 4.9, 5.7, 6.4, 7.0, 7.5, 8.6, 9.6, 10.3, 10.9, 12.0, 13.6, 15.1, 16.8],
    p50: [3.5, 4.5, 5.6, 6.4, 7.0, 7.7, 8.2, 9.3, 10.3, 11.0, 11.8, 13.0, 14.7, 16.3, 18.3],
    p85: [3.9, 5.1, 6.3, 7.2, 8.0, 8.7, 9.2, 10.5, 11.8, 12.7, 13.5, 14.8, 16.9, 18.8, 21.0],
    p97: [4.4, 5.8, 7.1, 8.0, 8.9, 9.7, 10.3, 11.6, 13.0, 14.0, 14.9, 16.4, 18.7, 20.9, 23.4]
  },
  // Kilo persentil değerleri (kg) - Kız
  weightForAge_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [2.4, 3.2, 3.9, 4.5, 5.0, 5.5, 5.9, 7.0, 7.9, 8.5, 9.1, 10.0, 11.6, 13.0, 14.7],
    p15: [2.8, 3.6, 4.5, 5.2, 5.8, 6.3, 6.8, 7.8, 8.8, 9.5, 10.2, 11.3, 13.0, 14.6, 16.5],
    p50: [3.3, 4.2, 5.1, 5.9, 6.4, 7.0, 7.5, 8.6, 9.5, 10.3, 11.0, 12.2, 14.1, 15.9, 18.0],
    p85: [3.7, 4.8, 5.8, 6.6, 7.3, 7.9, 8.5, 9.7, 10.9, 11.8, 12.6, 14.0, 16.3, 18.5, 21.1],
    p97: [4.2, 5.5, 6.6, 7.5, 8.2, 8.9, 9.5, 10.9, 12.1, 13.1, 14.0, 15.6, 18.3, 20.7, 23.7]
  },
  // Boy persentil değerleri (cm) - Erkek
  lengthForAge_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [46.1, 50.8, 54.4, 57.3, 59.8, 61.8, 63.6, 67.5, 71.0, 74.1, 76.9, 81.7, 88.7, 94.9, 100.7],
    p15: [47.5, 52.3, 55.9, 58.9, 61.4, 63.5, 65.3, 69.3, 72.9, 76.0, 78.9, 83.8, 91.1, 97.5, 103.5],
    p50: [49.9, 54.7, 58.4, 61.4, 64.0, 66.0, 67.8, 71.8, 75.7, 79.0, 82.0, 87.1, 94.9, 101.6, 108.0],
    p85: [51.8, 56.7, 60.6, 63.6, 66.3, 68.4, 70.3, 74.4, 78.5, 82.0, 85.2, 90.6, 98.9, 106.0, 112.8],
    p97: [53.7, 58.6, 62.7, 65.7, 68.5, 70.6, 72.5, 76.8, 81.0, 84.6, 88.0, 93.6, 102.3, 109.9, 117.0]
  },
  // Boy persentil değerleri (cm) - Kız
  lengthForAge_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [45.4, 49.8, 53.0, 55.6, 58.0, 59.9, 61.5, 65.3, 68.9, 72.0, 74.9, 79.9, 87.4, 94.1, 100.1],
    p15: [46.8, 51.3, 54.5, 57.2, 59.6, 61.5, 63.2, 67.0, 70.7, 73.9, 76.8, 82.0, 89.8, 96.7, 102.9],
    p50: [49.2, 53.7, 57.1, 59.8, 62.2, 64.1, 65.9, 69.7, 73.6, 76.9, 80.0, 85.4, 93.6, 100.9, 107.4],
    p85: [51.1, 55.7, 59.2, 62.0, 64.5, 66.5, 68.3, 72.3, 76.4, 79.9, 83.1, 88.8, 97.5, 105.1, 112.1],
    p97: [52.9, 57.6, 61.2, 64.1, 66.6, 68.7, 70.6, 74.7, 79.0, 82.6, 86.0, 92.0, 101.1, 109.2, 116.5]
  },
  // Baş çevresi persentil değerleri (cm) - Erkek
  headCircumference_boys: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [32.1, 34.9, 36.8, 38.1, 39.2, 40.1, 40.9, 42.5, 43.8, 44.7, 45.4, 46.5, 47.9, 48.8, 49.4],
    p15: [33.1, 35.9, 37.9, 39.2, 40.3, 41.2, 42.0, 43.6, 44.9, 45.8, 46.5, 47.6, 49.0, 49.9, 50.5],
    p50: [34.5, 37.3, 39.3, 40.7, 41.8, 42.7, 43.5, 45.2, 46.4, 47.3, 48.0, 49.1, 50.5, 51.3, 51.9],
    p85: [35.8, 38.6, 40.7, 42.0, 43.2, 44.1, 44.9, 46.6, 47.9, 48.8, 49.5, 50.6, 52.0, 52.8, 53.4],
    p97: [36.9, 39.8, 41.9, 43.3, 44.4, 45.4, 46.2, 47.9, 49.2, 50.1, 50.8, 51.9, 53.3, 54.1, 54.7]
  },
  // Baş çevresi persentil değerleri (cm) - Kız
  headCircumference_girls: {
    months: [0, 1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 24, 36, 48, 60],
    p3: [31.5, 34.2, 35.8, 37.0, 38.1, 38.9, 39.6, 41.2, 42.4, 43.3, 44.1, 45.2, 46.6, 47.6, 48.3],
    p15: [32.4, 35.1, 36.7, 38.0, 39.0, 39.9, 40.6, 42.2, 43.4, 44.3, 45.1, 46.2, 47.6, 48.6, 49.3],
    p50: [33.9, 36.6, 38.3, 39.5, 40.6, 41.5, 42.2, 43.8, 45.0, 45.9, 46.7, 47.8, 49.2, 50.2, 50.9],
    p85: [35.2, 37.9, 39.6, 40.9, 42.0, 42.9, 43.6, 45.3, 46.5, 47.4, 48.2, 49.3, 50.7, 51.7, 52.4],
    p97: [36.3, 39.0, 40.8, 42.1, 43.2, 44.1, 44.9, 46.5, 47.7, 48.6, 49.4, 50.5, 52.0, 53.0, 53.6]
  }
};

// Sample growth measurements for demo
function generateGrowthMeasurements(patientId, birthDate, gender) {
  const measurements = [];
  const now = new Date();
  const ageInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
  
  // Generate measurements for key ages
  const measurementAges = [0, 1, 2, 4, 6, 9, 12, 15, 18, 24, 36].filter(age => age <= ageInMonths);
  
  const weightData = gender === 'male' ? whoGrowthStandards.weightForAge_boys : whoGrowthStandards.weightForAge_girls;
  const heightData = gender === 'male' ? whoGrowthStandards.lengthForAge_boys : whoGrowthStandards.lengthForAge_girls;
  const headData = gender === 'male' ? whoGrowthStandards.headCircumference_boys : whoGrowthStandards.headCircumference_girls;
  
  measurementAges.forEach(age => {
    const measurementDate = new Date(birthDate);
    measurementDate.setMonth(measurementDate.getMonth() + age);
    
    const ageIndex = weightData.months.indexOf(age);
    if (ageIndex !== -1) {
      // Generate realistic values around 50th percentile with some variation
      const weightVariation = (Math.random() - 0.5) * 2; // ±1 kg
      const heightVariation = (Math.random() - 0.5) * 4; // ±2 cm
      const headVariation = (Math.random() - 0.5) * 2; // ±1 cm
      
      measurements.push({
        patientId,
        measurementDate: admin.firestore.Timestamp.fromDate(measurementDate),
        weight: Math.max(0.5, weightData.p50[ageIndex] + weightVariation),
        height: Math.max(30, heightData.p50[ageIndex] + heightVariation),
        headCircumference: age <= 24 ? Math.max(25, headData.p50[ageIndex] + headVariation) : null,
        notes: `${age} aylık rutin kontrol`,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
  
  return measurements;
}

// Generate vaccination records based on schedule
function generateVaccinationRecords(patientId, birthDate) {
  const records = [];
  const now = new Date();
  const ageInMonths = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
  
  turkishVaccineSchedule.vaccines.forEach(vaccine => {
    vaccine.doses.forEach(dose => {
      if (dose.ageMonths <= ageInMonths && !dose.isRecurring) {
        const vaccinationDate = new Date(birthDate);
        vaccinationDate.setMonth(vaccinationDate.getMonth() + dose.ageMonths);
        
        // Add some randomness to make it realistic (vaccines may be given a few days early/late)
        vaccinationDate.setDate(vaccinationDate.getDate() + Math.floor(Math.random() * 7) - 3);
        
        // Only add if vaccination date is in the past
        if (vaccinationDate < now) {
          records.push({
            patientId,
            vaccineId: vaccine.id,
            vaccineName: vaccine.name,
            doseNumber: dose.number,
            doseName: dose.name,
            vaccinationDate: admin.firestore.Timestamp.fromDate(vaccinationDate),
            lotNumber: `LOT${Math.floor(Math.random() * 100000)}`,
            administeredBy: 'Dr. ' + ['Ayşe Yılmaz', 'Mehmet Demir', 'Fatma Kaya', 'Ali Öztürk'][Math.floor(Math.random() * 4)],
            clinic: ['Merkez Aile Sağlığı Merkezi', 'Çocuk Hastanesi', 'Özel Çocuk Kliniği'][Math.floor(Math.random() * 3)],
            notes: dose.ageLabel,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    });
  });
  
  return records;
}

async function initializeVaccineAndGrowthData() {
  try {
    console.log('Starting vaccine and growth data initialization...');
    const batch = db.batch();
    let operationCount = 0;
    
    // 1. Add vaccine schedule to protocols collection
    console.log('Adding vaccine schedule to protocols...');
    const vaccineProtocolRef = db.collection('protocols').doc('vaccine_schedule');
    batch.set(vaccineProtocolRef, {
      name: 'Türkiye Genişletilmiş Bağışıklama Programı',
      version: '2024',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      vaccines: turkishVaccineSchedule.vaccines
    });
    operationCount++;
    
    // 2. Add individual vaccines to vaccines collection
    console.log('Adding individual vaccines...');
    turkishVaccineSchedule.vaccines.forEach(vaccine => {
      const vaccineRef = db.collection('vaccines').doc(vaccine.id);
      batch.set(vaccineRef, vaccine);
      operationCount++;
    });
    
    // 3. Add WHO growth standards to protocols
    console.log('Adding WHO growth standards...');
    const growthStandardsRef = db.collection('protocols').doc('who_growth_standards');
    batch.set(growthStandardsRef, {
      name: 'WHO Growth Standards',
      version: '2006',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      standards: whoGrowthStandards
    });
    operationCount++;
    
    // Commit first batch
    await batch.commit();
    console.log(`Committed ${operationCount} protocol operations`);
    
    // 4. Add sample data for existing patients
    console.log('Fetching patients...');
    const patientsSnapshot = await db.collection('patients').limit(10).get();
    console.log(`Found ${patientsSnapshot.size} patients to update`);
    
    // Process patients in smaller batches
    for (const patientDoc of patientsSnapshot.docs) {
      const patientData = patientDoc.data();
      const patientId = patientDoc.id;
      
      console.log(`Processing patient ${patientId}...`);
      
      // Parse birth date
      let birthDate;
      if (patientData.birthDate) {
        if (patientData.birthDate._seconds) {
          birthDate = new Date(patientData.birthDate._seconds * 1000);
        } else if (typeof patientData.birthDate === 'string') {
          birthDate = new Date(patientData.birthDate);
        } else {
          birthDate = new Date(2020, 0, 1); // Default for demo
        }
      } else {
        birthDate = new Date(2020, 0, 1); // Default for demo
      }
      
      const gender = patientData.gender || 'male';
      
      // Generate growth measurements
      const growthMeasurements = generateGrowthMeasurements(patientId, birthDate, gender);
      
      // Add growth measurements
      const growthBatch = db.batch();
      let growthCount = 0;
      for (const measurement of growthMeasurements) {
        const measurementRef = db.collection('growthMeasurements').doc();
        growthBatch.set(measurementRef, measurement);
        growthCount++;
        
        // Commit every 100 operations
        if (growthCount >= 100) {
          await growthBatch.commit();
          console.log(`  Added ${growthCount} growth measurements for patient ${patientId}`);
          growthCount = 0;
        }
      }
      if (growthCount > 0) {
        await growthBatch.commit();
        console.log(`  Added ${growthCount} growth measurements for patient ${patientId}`);
      }
      
      // Generate vaccination records
      const vaccinationRecords = generateVaccinationRecords(patientId, birthDate);
      
      // Add vaccination records
      const vaccineBatch = db.batch();
      let vaccineCount = 0;
      for (const record of vaccinationRecords) {
        const recordRef = db.collection('vaccination_records').doc();
        vaccineBatch.set(recordRef, record);
        vaccineCount++;
        
        // Commit every 100 operations
        if (vaccineCount >= 100) {
          await vaccineBatch.commit();
          console.log(`  Added ${vaccineCount} vaccination records for patient ${patientId}`);
          vaccineCount = 0;
        }
      }
      if (vaccineCount > 0) {
        await vaccineBatch.commit();
        console.log(`  Added ${vaccineCount} vaccination records for patient ${patientId}`);
      }
      
      // Add vaccine reminders for upcoming doses
      const reminderBatch = db.batch();
      let reminderCount = 0;
      const ageInMonths = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
      
      turkishVaccineSchedule.vaccines.forEach(vaccine => {
        vaccine.doses.forEach(dose => {
          // Add reminders for doses due in next 3 months
          if (dose.ageMonths > ageInMonths && dose.ageMonths <= ageInMonths + 3 && !dose.isRecurring) {
            const reminderDate = new Date(birthDate);
            reminderDate.setMonth(reminderDate.getMonth() + dose.ageMonths);
            
            const reminderRef = db.collection('vaccine_reminders').doc();
            reminderBatch.set(reminderRef, {
              patientId,
              vaccineId: vaccine.id,
              vaccineName: vaccine.name,
              doseNumber: dose.number,
              doseName: dose.name,
              dueDate: admin.firestore.Timestamp.fromDate(reminderDate),
              reminderDate: admin.firestore.Timestamp.fromDate(new Date(reminderDate.getTime() - 7 * 24 * 60 * 60 * 1000)), // 1 week before
              isActive: true,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            reminderCount++;
          }
        });
      });
      
      if (reminderCount > 0) {
        await reminderBatch.commit();
        console.log(`  Added ${reminderCount} vaccine reminders for patient ${patientId}`);
      }
    }
    
    console.log('\n✅ Successfully initialized vaccine and growth data!');
    console.log('Data added:');
    console.log(`- ${turkishVaccineSchedule.vaccines.length} vaccines in schedule`);
    console.log(`- Growth standards for boys and girls`);
    console.log(`- Sample growth measurements for ${patientsSnapshot.size} patients`);
    console.log(`- Sample vaccination records for ${patientsSnapshot.size} patients`);
    
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
}

// Run initialization
initializeVaccineAndGrowthData().then(() => {
  console.log('Initialization complete!');
  process.exit(0);
});