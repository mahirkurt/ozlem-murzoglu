// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

// Sitemap'ten URL'leri oku
async function getUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, 'src', 'sitemap.xml');
  try {
    const content = await fs.readFile(sitemapPath, 'utf-8');
    const urls = content.match(/<loc>([^<]+)<\/loc>/g) || [];
    return urls.map(url => {
      const match = url.match(/<loc>https?:\/\/[^\/]+(.+)<\/loc>/);
      return match ? match[1] : '/';
    });
  } catch (error) {
    console.warn('Sitemap okunamad1, varsay1lan URL listesi kullan1l1yor');
    return [
      '/',
      '/hakkimizda',
      '/hakkimizda/dr-ozlem-murzoglu',
      '/hakkimizda/klinigimiz',
      '/hizmetlerimiz',
      '/hizmetlerimiz/triple-p',
      '/hizmetlerimiz/bright-futures-program',
      '/hizmetlerimiz/sos-feeding',
      '/hizmetlerimiz/saglikli-uykular',
      '/hizmetlerimiz/laboratuvar-goruntuleme',
      '/kaynaklar',
      '/sss',
      '/iletisim',
      '/blog',
      '/saygiyla'
    ];
  }
}

// Hardcoded T�rk�e metinleri kontrol et
const hardcodedTextPatterns = [
  /\b(ve|veya|i�in|ile|da|de|mi|m1|mu|m�)\b/gi, // T�rk�e bala�lar
  /\b(Hakk1m1zda|Hizmetlerimiz|0leti_im|Randevu|Kaynaklar)\b/g, // Men� �eleri
  /\b(Doktor|Uzman|Klinik|Tedavi|Hasta|�ocuk|Bebek|Anne|Baba)\b/gi, // T1bbi terimler
  /\b(L�tfen|Te_ekk�r|Merhaba|Ho_geldiniz)\b/gi, // Genel ifadeler
  /\b(Ocak|^ubat|Mart|Nisan|May1s|Haziran|Temmuz|Austos|Eyl�l|Ekim|Kas1m|Aral1k)\b/g, // Aylar
  /\b(Pazartesi|Sal1|�ar_amba|Per_embe|Cuma|Cumartesi|Pazar)\b/g, // G�nler
];

// �eviri anahtar1 pattern'i
const translationKeyPattern = /[A-Z_]+\.[A-Z_]+(\.[A-Z_]+)*/g;

test.describe('i18n �eviri Testleri', () => {
  let urls = [];

  test.beforeAll(async () => {
    urls = await getUrlsFromSitemap();
  });

  test('T�m sayfalarda �evrilmemi_ anahtarlar kontrol�', async ({ page }) => {
    const untranslatedKeys = [];
    
    for (const url of urls) {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500); // Dinamik i�erik i�in bekle
      
      // Sayfadaki t�m metni al
      const content = await page.evaluate(() => document.body.innerText);
      
      // �evrilmemi_ anahtarlar1 bul
      const matches = content.match(translationKeyPattern) || [];
      if (matches.length > 0) {
        untranslatedKeys.push({
          url,
          keys: [...new Set(matches)]
        });
      }
    }

    // Eer �evrilmemi_ anahtar varsa, detayl1 rapor ver
    if (untranslatedKeys.length > 0) {
      console.log('\nL �evrilmemi_ anahtarlar bulundu:');
      untranslatedKeys.forEach(({ url, keys }) => {
        console.log(`\n=� ${url}:`);
        keys.forEach(key => console.log(`   - ${key}`));
      });
    }

    expect(untranslatedKeys).toHaveLength(0);
  });

  test('Hardcoded T�rk�e metinler kontrol�', async ({ page }) => {
    const hardcodedTexts = [];
    
    // Sadece 0ngilizce i�erik beklenilen sayfalar1 kontrol et
    const englishPages = urls.filter(url => url.includes('/en/') || url.endsWith('/en'));
    
    for (const url of englishPages) {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      
      // HTML i�eriini al (script ve style taglar1 hari�)
      const content = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());
        return document.body.innerText;
      });
      
      // Hardcoded T�rk�e metinleri bul
      const foundPatterns = [];
      hardcodedTextPatterns.forEach(pattern => {
        const matches = content.match(pattern) || [];
        if (matches.length > 0) {
          foundPatterns.push(...matches);
        }
      });
      
      if (foundPatterns.length > 0) {
        hardcodedTexts.push({
          url,
          texts: [...new Set(foundPatterns)]
        });
      }
    }

    // Eer hardcoded metin varsa, detayl1 rapor ver
    if (hardcodedTexts.length > 0) {
      console.log('\n� Hardcoded T�rk�e metinler bulundu:');
      hardcodedTexts.forEach(({ url, texts }) => {
        console.log(`\n=� ${url}:`);
        texts.forEach(text => console.log(`   - "${text}"`));
      });
    }

    expect(hardcodedTexts).toHaveLength(0);
  });

  test('�eviri dosyalar1n1n varl11 ve ge�erlilii', async () => {
    const translationFiles = [
      'src/assets/i18n/tr.json',
      'src/assets/i18n/en.json'
    ];

    for (const file of translationFiles) {
      const filePath = path.join(__dirname, file);
      
      // Dosya var m1?
      await expect(async () => {
        await fs.access(filePath);
      }).not.toThrow();
      
      // JSON ge�erli mi?
      const content = await fs.readFile(filePath, 'utf-8');
      let json;
      try {
        json = JSON.parse(content);
      } catch (error) {
        throw new Error(`${file} ge�erli bir JSON dosyas1 deil: ${error.message}`);
      }
      
      // Bo_ deerler var m1?
      const emptyValues = [];
      function checkEmpty(obj, path = '') {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === 'object' && value !== null) {
            checkEmpty(value, currentPath);
          } else if (value === '' || value === null || value === undefined) {
            emptyValues.push(currentPath);
          }
        }
      }
      
      checkEmpty(json);
      
      if (emptyValues.length > 0) {
        console.log(`\n� ${file} i�inde bo_ deerler:`);
        emptyValues.forEach(key => console.log(`   - ${key}`));
      }
      
      expect(emptyValues).toHaveLength(0);
    }
  });

  test('�eviri anahtarlar1 tutarl1l11', async () => {
    const trPath = path.join(__dirname, 'src/assets/i18n/tr.json');
    const enPath = path.join(__dirname, 'src/assets/i18n/en.json');
    
    const trContent = await fs.readFile(trPath, 'utf-8');
    const enContent = await fs.readFile(enPath, 'utf-8');
    
    const trJson = JSON.parse(trContent);
    const enJson = JSON.parse(enContent);
    
    // T�m anahtarlar1 topla
    function getKeys(obj, prefix = '') {
      let keys = [];
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          keys = keys.concat(getKeys(value, fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys;
    }
    
    const trKeys = new Set(getKeys(trJson));
    const enKeys = new Set(getKeys(enJson));
    
    // TR'de olup EN'de olmayan anahtarlar
    const missingInEn = [...trKeys].filter(key => !enKeys.has(key));
    
    // EN'de olup TR'de olmayan anahtarlar
    const missingInTr = [...enKeys].filter(key => !trKeys.has(key));
    
    if (missingInEn.length > 0) {
      console.log('\nL en.json dosyas1nda eksik anahtarlar:');
      missingInEn.forEach(key => console.log(`   - ${key}`));
    }
    
    if (missingInTr.length > 0) {
      console.log('\nL tr.json dosyas1nda eksik anahtarlar:');
      missingInTr.forEach(key => console.log(`   - ${key}`));
    }
    
    expect(missingInEn).toHaveLength(0);
    expect(missingInTr).toHaveLength(0);
  });
});