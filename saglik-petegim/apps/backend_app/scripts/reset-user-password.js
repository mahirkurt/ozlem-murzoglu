const admin = require('firebase-admin');
const serviceAccount = require('../../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function resetUserPassword() {
  try {
    const email = 'melikertek@gmail.com';
    const newPassword = 'SaglikPetegim2024!';
    
    console.log(`Kullanıcı şifresi güncelleniyor: ${email}`);
    
    // Kullanıcıyı e-posta ile bul
    const user = await admin.auth().getUserByEmail(email);
    
    // Şifreyi güncelle
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });
    
    console.log('\n✅ Şifre başarıyla güncellendi!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 E-posta: ${email}`);
    console.log(`🔑 Yeni Şifre: ${newPassword}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Güvenlik Uyarısı: Bu şifreyi güvenli bir yerde saklayın ve kullanıcıya iletin.');
    console.log('💡 Kullanıcı ilk girişten sonra şifresini değiştirmelidir.');
    
    // Kullanıcı bilgilerini göster
    console.log('\n📋 Kullanıcı Bilgileri:');
    console.log(`  UID: ${user.uid}`);
    console.log(`  Ad: ${user.displayName || 'Belirtilmemiş'}`);
    console.log(`  E-posta Doğrulanmış: ${user.emailVerified ? 'Evet' : 'Hayır'}`);
    console.log(`  Hesap Oluşturma: ${new Date(user.metadata.creationTime).toLocaleDateString('tr-TR')}`);
    console.log(`  Son Giriş: ${user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('tr-TR') : 'Hiç giriş yapmamış'}`);
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Hata: ${email} e-posta adresine sahip kullanıcı bulunamadı.`);
    } else {
      console.error('❌ Hata:', error.message);
    }
    process.exit(1);
  }
}

resetUserPassword();