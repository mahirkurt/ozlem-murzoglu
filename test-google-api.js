const https = require('https');

const API_KEY = 'AIzaSyDZNlErCHqvQYj0gh_zTwyyzj_Lwoo7V94';
const PLACE_ID = 'ChIJ83R9VUTJyhQRM2o-M-eoZyQ';

// Place Details API endpoint
const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,formatted_address,rating,reviews,user_ratings_total&key=${API_KEY}&language=tr`;

console.log('Testing Google Places API...');
console.log('Place ID:', PLACE_ID);
console.log('');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.status === 'OK') {
        console.log('✅ API Başarılı!');
        console.log('');
        console.log('Klinik Bilgileri:');
        console.log('- İsim:', result.result.name);
        console.log('- Adres:', result.result.formatted_address);
        console.log('- Rating:', result.result.rating);
        console.log('- Toplam Yorum:', result.result.user_ratings_total);
        
        if (result.result.reviews && result.result.reviews.length > 0) {
          console.log('');
          console.log('Son Yorumlar:');
          result.result.reviews.slice(0, 3).forEach((review, i) => {
            console.log(`\n${i + 1}. ${review.author_name} (${review.rating} ⭐)`);
            console.log(`   ${review.text.substring(0, 100)}...`);
            console.log(`   ${review.relative_time_description}`);
          });
        }
      } else {
        console.log('❌ API Hatası:', result.status);
        console.log('Error message:', result.error_message || 'No error message');
        
        if (result.status === 'INVALID_REQUEST') {
          console.log('\nPlace ID yanlış olabilir veya API key\'de yetki sorunu var.');
        } else if (result.status === 'REQUEST_DENIED') {
          console.log('\nAPI key geçersiz veya Places API aktif değil.');
        } else if (result.status === 'NOT_FOUND') {
          console.log('\nBu Place ID\'ye sahip bir yer bulunamadı.');
        }
      }
    } catch (error) {
      console.log('❌ Parse hatası:', error.message);
      console.log('Response:', data);
    }
  });
}).on('error', (err) => {
  console.log('❌ Request hatası:', err.message);
});