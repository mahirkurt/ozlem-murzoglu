// Google Maps URL'den Place ID bulma
// URL formatı: https://www.google.com/maps/place/.../@lat,lng,zoom/data=...

// Verilen koordinatlar: 40.9644528,29.1067903
// Klinik adı: Dr. Özlem Mürzoğlu Çocuk Sağlığı ve Hastalıkları Kliniği

console.log(`
=== GOOGLE PLACE ID BULMA ===

Mevcut Place ID: ChIJ83R9VUTJyhQRM2o-M-eoZyQ

Bu Place ID'yi doğrulamak için:
1. https://developers.google.com/maps/documentation/places/web-service/place-id adresine gidin
2. Place ID Finder'ı kullanın
3. Koordinatları girin: 40.9644528,29.1067903
4. Veya klinik adını arayın: Dr. Özlem Mürzoğlu

Alternatif yöntem:
1. Google Maps'te kliniği arayın
2. Share butonuna tıklayın
3. URL'deki data parametresini kontrol edin
4. Place ID genellikle !1s0x... formatında başlar ve ChIJ'ye dönüştürülür

Not: Place ID şu formatta olmalı:
- ChIJ ile başlar (encoded)
- Veya place_id parametresi olarak gelir
`);