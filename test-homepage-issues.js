const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Checking homepage for translation issues...\n');

  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Look for hardcoded texts and translation tags
  const issues = await page.evaluate(() => {
    const results = [];
    const allTexts = document.querySelectorAll('*');

    allTexts.forEach(element => {
      // Only check elements with direct text content
      if (element.childNodes.length > 0) {
        element.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            const text = child.textContent.trim();

            // Check for translation tags
            if (text.includes('APPOINTMENT_SECTION.') ||
                text.includes('GALLERY.') ||
                text.includes('CLINIC.') ||
                text.includes('HOME.') ||
                text.includes('APPROACH.')) {
              results.push({
                type: 'TRANSLATION_TAG',
                text: text,
                element: element.className || element.tagName
              });
            }

            // Check for specific hardcoded texts
            if (text === 'Çocuğunuzun sağlığı için bütüncül bakım' ||
                text === 'Dr. Özlem Murzoğlu' ||
                text === 'Kliniğimiz') {
              results.push({
                type: 'HARDCODED',
                text: text,
                element: element.className || element.tagName
              });
            }
          }
        });
      }
    });

    return results;
  });

  console.log('📝 ISSUES FOUND:');
  console.log('================\n');

  const translationTags = issues.filter(i => i.type === 'TRANSLATION_TAG');
  const hardcodedTexts = issues.filter(i => i.type === 'HARDCODED');

  if (translationTags.length > 0) {
    console.log('❌ Translation Tags Visible:');
    translationTags.forEach(tag => {
      console.log(`  - "${tag.text}" in ${tag.element}`);
    });
    console.log('');
  }

  if (hardcodedTexts.length > 0) {
    console.log('⚠️  Hardcoded Texts:');
    hardcodedTexts.forEach(text => {
      console.log(`  - "${text.text}" in ${text.element}`);
    });
    console.log('');
  }

  // Check specific sections
  console.log('📍 CHECKING SPECIFIC SECTIONS:\n');

  // Approach section title
  const approachTitle = await page.textContent('.approach-section h2');
  console.log('Approach Section Title:', approachTitle || 'Not found');

  // Doctor bio
  const doctorBio = await page.textContent('.doctor-bio h2');
  console.log('Doctor Bio Title:', doctorBio || 'Not found');

  // Appointment section
  const appointmentTitle = await page.textContent('.appointment-section h2');
  console.log('Appointment Section Title:', appointmentTitle || 'Not found');

  // Gallery section
  const galleryTitle = await page.textContent('.clinic-gallery h2');
  console.log('Gallery Section Title:', galleryTitle || 'Not found');

  await browser.close();
  console.log('\n✅ Check complete!');
})();