import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_PATH = path.join(__dirname, '../public/documents');
const OUTPUT_PATH = path.join(__dirname, '../src/app/pages/resources');

// Test için sadece 3 dosya
const testFiles = [
  { category: 'bright-futures-aile', folder: 'Bright Futures (Aile)', file: '1. Ay - Aile İçin Bilgiler.docx' },
  { category: 'asilar', folder: 'Aşılar', file: 'HPV Aşısı Bilgi Föyü.docx' },
  { category: 'gebelik-donemi', folder: 'Gebelik Dönemi', file: 'Gebelikte Beslenme.docx' }
];

function cleanClassName(fileName) {
  let cleaned = fileName
    .replace(/\.docx$/i, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  if (/^\d/.test(cleaned)) {
    cleaned = 'Doc' + cleaned;
  }
  
  return cleaned + 'Component';
}

function cleanComponentName(fileName) {
  return fileName
    .replace(/\.docx$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function processTestFiles() {
  console.log('Testing document processing...\n');
  
  for (const test of testFiles) {
    const filePath = path.join(DOCUMENTS_PATH, test.folder, test.file);
    
    try {
      // Process with text only
      const result = await mammoth.convertToHtml({ 
        path: filePath,
        convertImage: function() {
          return { src: '' };
        }
      });
      
      // Clean HTML
      let cleanHtml = result.value
        .replace(/<img[^>]*>/g, '')
        .replace(/<img[^>]*\/>/g, '')
        .substring(0, 2000); // Take first 2000 chars for testing
      
      const componentName = cleanComponentName(test.file);
      const className = cleanClassName(test.file);
      
      console.log(`\n📄 ${test.file}`);
      console.log(`   Component: ${componentName}`);
      console.log(`   Class: ${className}`);
      console.log(`   Content preview: ${cleanHtml.substring(0, 100)}...`);
      
      // Create the component
      const categoryPath = path.join(OUTPUT_PATH, test.category);
      await fs.mkdir(categoryPath, { recursive: true });
      
      const componentPath = path.join(categoryPath, componentName);
      await fs.mkdir(componentPath, { recursive: true });
      
      // Simple component files
      const tsContent = `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  template: \`
    <div class="test-page">
      <h1>${test.file.replace('.docx', '')}</h1>
      <div class="content">
        ${cleanHtml}
      </div>
    </div>
  \`,
  styles: [\`
    .test-page {
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .content {
      margin-top: 2rem;
      line-height: 1.6;
    }
  \`]
})
export class ${className} {}`;
      
      await fs.writeFile(path.join(componentPath, `${componentName}.component.ts`), tsContent);
      
      console.log(`   ✅ Created successfully`);
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✨ Test complete!');
}

processTestFiles().catch(console.error);