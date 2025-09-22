# Aile İlişki Yönetim Sistemi - Veritabanı Şeması

## Koleksiyonlar ve İlişkiler

### 1. patients (Hastalar - TC Kimlik No Bazlı)
```javascript
{
  id: "auto_generated_id",
  tcKimlik: "12345678901", // Benzersiz tanımlayıcı
  firstName: "Ada",
  lastName: "Turna",
  dateOfBirth: "2020-05-15",
  gender: "female",
  bloodType: "A+",
  
  // Bakımveren ilişkileri
  caregivers: [
    {
      userId: "user_id_1",
      email: "melikertek@gmail.com",
      relationship: "anne",
      firstName: "Melike",
      lastName: "Turna",
      isPrimary: true,
      addedAt: "2024-01-01",
      permissions: ["full"]
    },
    {
      userId: "user_id_2", 
      email: "baba@example.com",
      relationship: "baba",
      firstName: "Ahmet",
      lastName: "Turna",
      isPrimary: false,
      addedAt: "2024-01-02",
      permissions: ["view", "appointments"]
    }
  ],
  
  // Kardeş ilişkileri
  siblings: ["patient_id_2"], // Mira Turna'nın ID'si
  
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
}
```

### 2. users (Kullanıcılar - Email Bazlı)
```javascript
{
  id: "user_id_1",
  email: "melikertek@gmail.com",
  
  // Kişisel bilgiler (ilk girişte doldurulacak)
  personalInfo: {
    firstName: "Melike",
    lastName: "Turna",
    phone: "0555-555-5555",
    tcKimlik: "98765432101", // Kendi TC'si
    photoURL: "https://...",
    address: "...",
  },
  
  // İlişkili hastalar (çocuklar)
  linkedPatients: [
    {
      patientId: "patient_id_1",
      tcKimlik: "12345678901",
      name: "Ada Turna",
      relationship: "anne",
      isPrimary: true,
      permissions: ["full"]
    },
    {
      patientId: "patient_id_2",
      tcKimlik: "12345678902",
      name: "Mira Turna", 
      relationship: "anne",
      isPrimary: true,
      permissions: ["full"]
    }
  ],
  
  // Hesap kurulum durumu
  accountSetup: {
    isCompleted: false,
    personalInfoCompleted: false,
    childrenLinked: false,
    caregiversAdded: false,
    completedAt: null
  },
  
  // İzinler ve roller
  roles: ["parent", "primary_caregiver"],
  
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  lastLoginAt: "2024-01-01"
}
```

### 3. caregiver_invitations (Bakımveren Davetleri)
```javascript
{
  id: "invitation_id",
  invitedBy: "user_id_1",
  inviterName: "Melike Turna",
  invitedEmail: "baba@example.com",
  patientId: "patient_id_1",
  patientName: "Ada Turna",
  patientTcKimlik: "12345678901",
  relationship: "baba",
  permissions: ["view", "appointments"],
  status: "pending", // pending, accepted, rejected, expired
  invitationCode: "ABC123",
  expiresAt: "2024-02-01",
  createdAt: "2024-01-01",
  acceptedAt: null
}
```

### 4. family_groups (Aile Grupları)
```javascript
{
  id: "family_group_id",
  name: "Turna Ailesi",
  primaryCaregiver: "user_id_1",
  
  members: [
    {
      userId: "user_id_1",
      role: "parent",
      name: "Melike Turna"
    },
    {
      userId: "user_id_2",
      role: "parent", 
      name: "Ahmet Turna"
    }
  ],
  
  patients: [
    "patient_id_1", // Ada
    "patient_id_2"  // Mira
  ],
  
  settings: {
    dataSharing: true,
    appointmentNotifications: "all_members"
  },
  
  createdAt: "2024-01-01"
}
```

## İlk Giriş Akışı

1. **Email ile giriş**
2. **TC Kimlik doğrulama** - BulutKlinik'ten gelen hasta TC'si ile eşleştirme
3. **Kişisel bilgi formu** - Kullanıcının kendi bilgileri
4. **İlişki tanımlama** - Hasta ile ilişki (anne/baba/vasi vb.)
5. **Diğer bakımverenleri davet** - Email ile davet gönderme
6. **Kardeş hesap bağlama** - Aynı email'e bağlı diğer TC'ler

## Güvenlik ve İzinler

### İzin Seviyeleri:
- **full**: Tüm veriye erişim ve düzenleme
- **view**: Sadece görüntüleme
- **appointments**: Randevu oluşturma ve yönetme
- **medical**: Tıbbi kayıtları görüntüleme
- **growth**: Büyüme verilerini girme

### Güvenlik Kuralları:
- TC kimlik no doğrulaması zorunlu
- Primary caregiver diğer bakımverenleri yönetebilir
- Her işlem için audit log tutulacak
- Hassas veriler şifrelenecek