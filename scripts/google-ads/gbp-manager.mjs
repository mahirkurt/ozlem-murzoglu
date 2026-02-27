#!/usr/bin/env node
/**
 * Google Business Profile CLI Manager - Uzm.Dr. Özlem Murzoğlu Kliniği
 * Google Places API (New) kullanır.
 *
 * Kullanım:
 *   node scripts/google-ads/gbp-manager.mjs <komut> [seçenekler]
 *
 * Komutlar:
 *   info               İşletme bilgileri
 *   reviews            Yorumları listele
 *   hours              Çalışma saatleri
 *   photos             Fotoğrafları listele
 *   post               GBP gönderi oluştur
 *   post-template      Şablondan gönderi oluştur
 *   schedule           Haftalık içerik takvimi
 *   help               Yardım
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../..');

const PLACE_ID = 'ChIJ83R9VUTJyhQRM2o-M-eoZyQ';
const GCP_PROJECT = 'dr-murzoglu';

// --- Auth ---
function getAccessToken() {
  try {
    return execSync('gcloud auth print-access-token 2>/dev/null', { encoding: 'utf-8' }).trim();
  } catch {
    console.error('gcloud auth basarisiz. "gcloud auth login" yapin.');
    process.exit(1);
  }
}

async function api(url, fieldMask) {
  const token = getAccessToken();
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Goog-User-Project': GCP_PROJECT,
      'X-Goog-FieldMask': fieldMask,
      'Accept-Language': 'tr',
    },
  });

  const data = await res.json();
  if (data.error) {
    console.error(`API Hatasi (${data.error.code}): ${data.error.message}`);
    process.exit(1);
  }
  return data;
}

async function apiPost(url, body) {
  const token = getAccessToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Goog-User-Project': GCP_PROJECT,
      'Content-Type': 'application/json',
      'Accept-Language': 'tr',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) {
    console.error(`API Hatasi (${data.error.code}): ${data.error.message}`);
    process.exit(1);
  }
  return data;
}

// --- Commands ---

async function cmdInfo() {
  const data = await api(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    'id,displayName,formattedAddress,rating,userRatingCount,websiteUri,nationalPhoneNumber,internationalPhoneNumber,businessStatus,types,primaryType,regularOpeningHours,editorialSummary,googleMapsUri'
  );

  console.log('\n=== Isletme Bilgileri ===\n');
  console.log(`  Ad:          ${data.displayName?.text}`);
  console.log(`  Puan:        ${data.rating}/5 (${data.userRatingCount} yorum)`);
  console.log(`  Adres:       ${data.formattedAddress}`);
  console.log(`  Telefon:     ${data.nationalPhoneNumber}`);
  console.log(`  Uluslararasi:${data.internationalPhoneNumber}`);
  console.log(`  Web:         ${data.websiteUri}`);
  console.log(`  Durum:       ${data.businessStatus}`);
  console.log(`  Tip:         ${data.primaryType} (${data.types?.join(', ')})`);
  console.log(`  Maps:        ${data.googleMapsUri}`);

  if (data.editorialSummary?.text) {
    console.log(`  Ozet:        ${data.editorialSummary.text}`);
  }

  if (data.regularOpeningHours?.weekdayDescriptions) {
    console.log('\n  Calisma Saatleri:');
    for (const desc of data.regularOpeningHours.weekdayDescriptions) {
      console.log(`    ${desc}`);
    }
    console.log(`\n  Su an: ${data.regularOpeningHours.openNow ? 'ACIK' : 'KAPALI'}`);
  }
}

async function cmdReviews() {
  const data = await api(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    'reviews,rating,userRatingCount'
  );

  console.log(`\n=== Yorumlar === (${data.rating}/5 - ${data.userRatingCount} toplam)\n`);

  if (!data.reviews?.length) {
    console.log('  Yorum bulunamadi.');
    return;
  }

  for (const review of data.reviews) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = review.publishTime?.split('T')[0] || '';
    const author = review.authorAttribution?.displayName || 'Anonim';
    const text = review.originalText?.text || review.text?.text || '(metin yok)';
    const relative = review.relativePublishTimeDescription || '';

    console.log(`  ${stars} (${review.rating}/5) - ${author}`);
    console.log(`  Tarih: ${date} (${relative})`);
    console.log(`  ${text}`);
    console.log('');
  }

  console.log(`  Not: Places API en fazla 5 en guncel/onemli yorumu dondurur.`);
  console.log(`  Tum yorumlar icin: https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`);
}

async function cmdHours() {
  const data = await api(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    'regularOpeningHours,currentOpeningHours'
  );

  console.log('\n=== Calisma Saatleri ===\n');

  if (data.regularOpeningHours?.weekdayDescriptions) {
    console.log('  Standart Saatler:');
    for (const desc of data.regularOpeningHours.weekdayDescriptions) {
      console.log(`    ${desc}`);
    }
    console.log(`\n  Su an: ${data.regularOpeningHours.openNow ? 'ACIK' : 'KAPALI'}`);
  }

  if (data.currentOpeningHours?.nextOpenTime) {
    const next = new Date(data.currentOpeningHours.nextOpenTime);
    console.log(`  Sonraki acilis: ${next.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`);
  }
}

async function cmdPhotos() {
  const data = await api(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    'photos'
  );

  console.log('\n=== Fotograflar ===\n');

  if (!data.photos?.length) {
    console.log('  Fotograf bulunamadi.');
    return;
  }

  for (const photo of data.photos) {
    const authors = photo.authorAttributions?.map(a => a.displayName).join(', ') || 'Bilinmiyor';
    console.log(`  [${photo.name}]`);
    console.log(`    Boyut: ${photo.widthPx}x${photo.heightPx}`);
    console.log(`    Yuklyen: ${authors}`);
    // Photo media URL
    const photoRef = photo.name;
    console.log(`    URL: https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=400&key=YOUR_API_KEY`);
    console.log('');
  }

  console.log(`  Toplam: ${data.photos.length} fotograf`);
}

// --- Summary dashboard ---
async function cmdDashboard() {
  const data = await api(
    `https://places.googleapis.com/v1/places/${PLACE_ID}`,
    'displayName,rating,userRatingCount,businessStatus,regularOpeningHours,reviews,websiteUri,nationalPhoneNumber,formattedAddress,googleMapsUri'
  );

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   Uzm.Dr. Özlem Murzoğlu - Business Dashboard   ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  console.log(`  Puan:     ${data.rating}/5 ${'★'.repeat(Math.round(data.rating))}${'☆'.repeat(5 - Math.round(data.rating))}`);
  console.log(`  Yorum:    ${data.userRatingCount} adet`);
  console.log(`  Durum:    ${data.businessStatus === 'OPERATIONAL' ? 'AKTIF' : data.businessStatus}`);
  console.log(`  Su an:    ${data.regularOpeningHours?.openNow ? 'ACIK' : 'KAPALI'}`);
  console.log(`  Telefon:  ${data.nationalPhoneNumber}`);
  console.log(`  Web:      ${data.websiteUri}`);
  console.log(`  Adres:    ${data.formattedAddress}`);

  if (data.reviews?.length) {
    console.log('\n  --- Son Yorumlar ---');
    for (const review of data.reviews.slice(0, 3)) {
      const stars = '★'.repeat(review.rating);
      const author = review.authorAttribution?.displayName || 'Anonim';
      const text = (review.originalText?.text || '').substring(0, 100);
      const relative = review.relativePublishTimeDescription || '';
      console.log(`\n  ${stars} ${author} (${relative})`);
      console.log(`  ${text}${text.length >= 100 ? '...' : ''}`);
    }
  }

  console.log(`\n  Maps: ${data.googleMapsUri}`);
  console.log('');
}

// --- GBP Post Creation & Weekly Content Calendar ---

// GBP API account/location IDs (required for My Business API)
// These must be set after obtaining GBP API access.
// See: https://developers.google.com/my-business/content/prereqs
const GBP_ACCOUNT_ID = process.env.GBP_ACCOUNT_ID || 'YOUR_ACCOUNT_ID';
const GBP_LOCATION_ID = process.env.GBP_LOCATION_ID || 'YOUR_LOCATION_ID';
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

const WEEKLY_TEMPLATES = {
  monday: {
    type: 'SERVICE',
    topic: 'hizmet tanitimi',
    examples: [
      'Bright Futures\u00AE ile cocugunuzun gelisimini AAP standartlarinda takip edin. Randevu icin bizi arayin.',
      'SOS Feeding programi ile cocugunuzun beslenme sorunlarina bilimsel cozumler sunuyoruz.',
      'Saglikli Uykular\u2122 programi ile bebeginize duzenli uyku aliskanligi kazandirin.'
    ]
  },
  wednesday: {
    type: 'TIP',
    topic: 'saglik ipucu',
    examples: [
      'Kis aylarinda cocuklarda ates yonetimi \u2014 38.5\u00B0C uzerinde doktora basvurun.',
      'Cocugunuzun asi takvimini duzenli takip etmek hastaliklardan korunmanin en etkili yoludur.',
      'Bebeginizin gelisim kontrollerini aksatmayin \u2014 erken tespit, erken mudahale demektir.'
    ]
  },
  friday: {
    type: 'OFFER',
    topic: 'teklif/etkinlik',
    examples: [
      'Bu ay yenidogan ilk muayenesi icin randevu alin, gelisim takip dosyanizi hediye edelim.',
      'Online randevu sistemimiz aktif! Web sitemizden veya WhatsApp ile kolayca randevu alabilirsiniz.'
    ]
  }
};

async function createPost(type, content, callToAction = null) {
  const post = {
    languageCode: 'tr',
    summary: content,
    topicType: type === 'OFFER' ? 'OFFER' : 'STANDARD',
  };

  if (callToAction) {
    post.callToAction = callToAction;
  }

  if (type === 'OFFER') {
    // Offers require an event with a time range
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    post.event = {
      title: content.substring(0, 58),
      schedule: {
        startDate: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
        endDate: { year: weekLater.getFullYear(), month: weekLater.getMonth() + 1, day: weekLater.getDate() },
      },
    };
  }

  const url = `${GBP_API_BASE}/accounts/${GBP_ACCOUNT_ID}/locations/${GBP_LOCATION_ID}/localPosts`;
  const data = await apiPost(url, post);

  console.log('\n=== Gonderi Olusturuldu ===\n');
  console.log(`  Tip:     ${type}`);
  console.log(`  Icerik:  ${content.substring(0, 120)}${content.length > 120 ? '...' : ''}`);
  if (callToAction) {
    console.log(`  CTA:     ${callToAction.actionType} -> ${callToAction.url || ''}`);
  }
  if (data.name) {
    console.log(`  ID:      ${data.name}`);
  }
  console.log(`  Durum:   Basarili`);
  console.log('');

  return data;
}

async function cmdPost() {
  const type = (process.argv[3] || '').toUpperCase();
  const content = process.argv[4];

  if (!type || !content) {
    console.error('Kullanim: node scripts/google-ads/gbp-manager.mjs post <SERVICE|TIP|OFFER> "Gonderi metni"');
    process.exit(1);
  }

  const validTypes = ['SERVICE', 'TIP', 'OFFER'];
  if (!validTypes.includes(type)) {
    console.error(`Gecersiz tip: ${type}. Gecerli tipler: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  // Default CTA: CALL action for SERVICE and TIP types
  let callToAction = null;
  if (type === 'SERVICE' || type === 'TIP') {
    callToAction = { actionType: 'CALL', url: 'tel:+902166884483' };
  }

  await createPost(type, content, callToAction);
}

async function cmdPostTemplate() {
  const day = (process.argv[3] || '').toLowerCase();

  if (!day || !WEEKLY_TEMPLATES[day]) {
    const validDays = Object.keys(WEEKLY_TEMPLATES).join(', ');
    console.error(`Kullanim: node scripts/google-ads/gbp-manager.mjs post-template <${validDays}>`);
    process.exit(1);
  }

  const template = WEEKLY_TEMPLATES[day];
  const randomIndex = Math.floor(Math.random() * template.examples.length);
  const content = template.examples[randomIndex];

  console.log(`\n  Sablon: ${day} (${template.topic})`);
  console.log(`  Secilen ornek: #${randomIndex + 1}\n`);

  let callToAction = null;
  if (template.type === 'SERVICE' || template.type === 'TIP') {
    callToAction = { actionType: 'CALL', url: 'tel:+902166884483' };
  }

  await createPost(template.type, content, callToAction);
}

async function cmdSchedule() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║        Haftalik GBP Icerik Takvimi               ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const dayNames = {
    monday: 'Pazartesi',
    wednesday: 'Carsamba',
    friday: 'Cuma',
  };

  for (const [day, template] of Object.entries(WEEKLY_TEMPLATES)) {
    const turkishDay = dayNames[day] || day;
    console.log(`  ┌─ ${turkishDay.toUpperCase()} — ${template.topic} (${template.type})`);
    for (let i = 0; i < template.examples.length; i++) {
      const prefix = i === template.examples.length - 1 ? '└' : '├';
      console.log(`  ${prefix}  ${i + 1}. ${template.examples[i]}`);
    }
    console.log('');
  }

  console.log('  Kullanim:');
  console.log('    node scripts/google-ads/gbp-manager.mjs post SERVICE "Kendi metniniz"');
  console.log('    node scripts/google-ads/gbp-manager.mjs post-template monday');
  console.log('');
  console.log('  Not: GBP API erisimi gereklidir.');
  console.log('  Basvuru: https://developers.google.com/my-business/content/prereqs');
  console.log('');
}

// --- Help ---
function showHelp() {
  console.log(`
=== Google Business Profile CLI Manager ===
Uzm.Dr. Ozlem Murzoglu Klinigi
(Google Places API New kullanir)

Kullanim:
  node scripts/google-ads/gbp-manager.mjs <komut>

Komutlar:
  dashboard              Ozet pano (puan, durum, son yorumlar)
  info                   Detayli isletme bilgileri
  reviews                Son yorumlar
  hours                  Calisma saatleri
  photos                 Fotograflar
  post <TIP> "metin"     GBP gonderisi olustur (SERVICE|TIP|OFFER)
  post-template <gun>    Sablondan gonderi olustur (monday|wednesday|friday)
  schedule               Haftalik icerik takvimini goster
  help                   Bu yardim mesaji

Not: Places API (New) salt okunur erisim saglar.
Post komutlari icin GBP API erisimi gereklidir (GBP_ACCOUNT_ID ve GBP_LOCATION_ID).
Basvuru: https://developers.google.com/my-business/content/prereqs
`);
}

// --- Main ---
const command = process.argv[2];

if (!command || command === 'help') {
  showHelp();
} else {
  const commands = {
    dashboard: cmdDashboard,
    info: cmdInfo,
    reviews: cmdReviews,
    hours: cmdHours,
    photos: cmdPhotos,
    post: cmdPost,
    'post-template': cmdPostTemplate,
    schedule: cmdSchedule,
  };

  const fn = commands[command];
  if (!fn) {
    console.error(`Bilinmeyen komut: ${command}`);
    showHelp();
    process.exit(1);
  }

  fn().catch(err => {
    console.error('\nHata:', err.message);
    process.exit(1);
  });
}
